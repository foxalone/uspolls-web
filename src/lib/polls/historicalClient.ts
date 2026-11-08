import { useCallback, useEffect, useRef, useState } from "react";
import type { HistoricalPollRow, HistoricalPollsterCount } from "./historical";

export type HistoricalCycle = "2012" | "2016" | "2020" | "2024";

type Page = { rows: HistoricalPollRow[]; nextCursor: string | null; pollsterCounts: HistoricalPollsterCount[] };
type Entry = { rows: HistoricalPollRow[]; cursor: string | null; hasMore: boolean; pollsterCounts: HistoricalPollsterCount[] };

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

function loadPage(cycle: HistoricalCycle, cursor: string | null, pollster?: string) {
  const key = `${cycle}:${cursor ?? ""}:${pollster ?? ""}`;
  const saved = pages.get(key);
  if (saved) return Promise.resolve(saved);
  const existing = inflight.get(key);
  if (existing) return existing;
  const params = new URLSearchParams({ cycle, v: "2" });
  if (cursor) params.set("cursor", cursor);
  if (pollster) params.set("pollster", pollster);
  const pending = fetch(`/api/historical-polls?${params.toString()}`).then(async (response) => {
    if (!response.ok) throw new Error("historical polls unavailable");
    const body = await response.json() as { polls?: HistoricalPollRow[]; nextCursor?: string | null; pollsterCounts?: HistoricalPollsterCount[] };
    const page = {
      rows: Array.isArray(body.polls) ? body.polls : [],
      nextCursor: typeof body.nextCursor === "string" ? body.nextCursor : null,
      pollsterCounts: Array.isArray(body.pollsterCounts) ? body.pollsterCounts : [],
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
  const [pollsterCounts, setPollsterCounts] = useState<HistoricalPollsterCount[]>(cached?.pollsterCounts ?? []);
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
    setPollsterCounts(entry.pollsterCounts);
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
    setPollsterCounts([]);
    setError(false);
    setHasMore(true);
    setLoading(true);
    loadingRef.current = true;
    hasMoreRef.current = true;
    cursorRef.current = null;
    loadPage(cycle, null).then((page) => {
      if (cancelled) return;
      write({ rows: page.rows, cursor: page.nextCursor, hasMore: page.nextCursor !== null, pollsterCounts: page.pollsterCounts });
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
      finish(() => write({ rows: merge(page.rows, rowsRef.current), cursor: page.nextCursor, hasMore: page.nextCursor !== null, pollsterCounts: page.pollsterCounts }));
    }).catch(() => {
      finish(() => undefined);
    });
    return true;
  }, [cycle, write]);

  return { rows, pollsterCounts, error, loading, hasMore, loadMore };
}

type PollsterState = { key: string; rows: HistoricalPollRow[]; loading: boolean; error: boolean };

export function useHistoricalPollster(cycle: HistoricalCycle, pollster: string) {
  const key = `${cycle}:${pollster}`;
  const active = pollster !== "all" && pollster !== "result";
  const [state, setState] = useState<PollsterState>({ key: "", rows: [], loading: false, error: false });

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    setState({ key, rows: [], loading: true, error: false });
    loadPage(cycle, null, pollster).then((page) => {
      if (!cancelled) setState({ key, rows: page.rows, loading: false, error: false });
    }).catch(() => {
      if (!cancelled) setState({ key, rows: [], loading: false, error: true });
    });
    return () => { cancelled = true; };
  }, [active, cycle, key, pollster]);

  if (!active) return { rows: [], loading: false, error: false };
  return state.key === key ? state : { rows: [], loading: true, error: false };
}
