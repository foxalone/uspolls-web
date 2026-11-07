import { useCallback, useEffect, useRef, useState } from "react";
import type { HistoricalPollRow } from "./historical";

export type HistoricalCycle = "2012" | "2016" | "2020" | "2024";

type Page = { rows: HistoricalPollRow[]; nextCursor: string | null };
type Entry = { rows: HistoricalPollRow[]; cursor: string | null; hasMore: boolean };

const cache = new Map<HistoricalCycle, Entry>();
const pages = new Map<string, Page>();
const inflight = new Map<string, Promise<Page>>();

function merge(older: HistoricalPollRow[], newer: HistoricalPollRow[]) {
  const seen = new Set<string>();
  const rows: HistoricalPollRow[] = [];
  for (const row of [...older, ...newer]) {
    if (seen.has(row.id)) continue;
    seen.add(row.id);
    rows.push(row);
  }
  rows.sort((a, b) => a.recordedOn.localeCompare(b.recordedOn) || a.id.localeCompare(b.id));
  return rows;
}

function loadPage(cycle: HistoricalCycle, cursor: string | null) {
  const key = `${cycle}:${cursor ?? ""}`;
  const saved = pages.get(key);
  if (saved) return Promise.resolve(saved);
  const existing = inflight.get(key);
  if (existing) return existing;
  const params = new URLSearchParams({ cycle });
  if (cursor) params.set("cursor", cursor);
  const pending = fetch(`/api/historical-polls?${params.toString()}`).then(async (response) => {
    if (!response.ok) throw new Error("historical polls unavailable");
    const body = await response.json() as { polls?: HistoricalPollRow[]; nextCursor?: string | null };
    const page = {
      rows: Array.isArray(body.polls) ? body.polls : [],
      nextCursor: typeof body.nextCursor === "string" ? body.nextCursor : null,
    };
    pages.set(key, page);
    return page;
  }).finally(() => {
    if (inflight.get(key) === pending) inflight.delete(key);
  });
  inflight.set(key, pending);
  return pending;
}

export function useHistoricalPages(cycle: HistoricalCycle) {
  const cached = cache.get(cycle);
  const [rows, setRows] = useState<HistoricalPollRow[]>(cached?.rows ?? []);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(!cached);
  const [hasMore, setHasMore] = useState(cached ? cached.hasMore : true);
  const loadingRef = useRef(!cached);
  const cursorRef = useRef<string | null>(cached?.cursor ?? null);
  const hasMoreRef = useRef(cached ? cached.hasMore : true);
  const rowsRef = useRef(rows);
  const mounted = useRef(true);
  rowsRef.current = rows;

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const write = useCallback((entry: Entry) => {
    cache.set(cycle, entry);
    rowsRef.current = entry.rows;
    cursorRef.current = entry.cursor;
    hasMoreRef.current = entry.hasMore;
    setRows(entry.rows);
    setHasMore(entry.hasMore);
  }, [cycle]);

  useEffect(() => {
    const hit = cache.get(cycle);
    if (hit) {
      write(hit);
      setError(false);
      setLoading(false);
      loadingRef.current = false;
      return;
    }
    let cancelled = false;
    setRows([]);
    setError(false);
    setHasMore(true);
    setLoading(true);
    loadingRef.current = true;
    hasMoreRef.current = true;
    cursorRef.current = null;
    loadPage(cycle, null).then((page) => {
      if (cancelled) return;
      write({ rows: page.rows, cursor: page.nextCursor, hasMore: page.nextCursor !== null });
      setLoading(false);
      loadingRef.current = false;
    }).catch(() => {
      if (cancelled) return;
      setError(true);
      hasMoreRef.current = false;
      setHasMore(false);
      setLoading(false);
      loadingRef.current = false;
    });
    return () => {
      cancelled = true;
    };
  }, [cycle, write]);

  const loadMore = useCallback(() => {
    if (loadingRef.current || !hasMoreRef.current || !cursorRef.current) return false;
    const cursor = cursorRef.current;
    const started = Date.now();
    loadingRef.current = true;
    setLoading(true);
    const finish = (apply: () => void) => {
      const wait = Math.max(0, 1100 - (Date.now() - started));
      window.setTimeout(() => {
        if (!mounted.current) return;
        apply();
        setLoading(false);
        loadingRef.current = false;
      }, wait);
    };
    loadPage(cycle, cursor).then((page) => {
      finish(() => write({ rows: merge(page.rows, rowsRef.current), cursor: page.nextCursor, hasMore: page.nextCursor !== null }));
    }).catch(() => {
      finish(() => undefined);
    });
    return true;
  }, [cycle, write]);

  return { rows, error, loading, hasMore, loadMore };
}
