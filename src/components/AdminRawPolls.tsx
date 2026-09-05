import { Fragment, useMemo, useState } from "react";
import { signOut } from "firebase/auth";
import { raceTypeLabel, type PublicPollRow } from "../lib/polls/summarize";
import type { VoteHubSyncDoc } from "../lib/votehub/types";
import { getFirebaseClientAuth } from "../lib/firebase/client";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "generic_ballot", label: "Generic" },
  { id: "senate", label: "Senate" },
  { id: "house", label: "House" },
  { id: "governor", label: "Governor" },
  { id: "presidential_approval", label: "Trump" },
] as const;

type AdminRawPollsProps = {
  polls: PublicPollRow[];
  raw: Record<string, unknown>[];
  sync: VoteHubSyncDoc | null;
  email: string;
};

export function AdminRawPolls({ polls, raw, sync, email }: AdminRawPollsProps) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return polls.filter((poll) => {
      if (filter !== "all" && poll.race_type !== filter) return false;
      if (!needle) return true;
      return [
        poll.id,
        poll.subject,
        poll.pollster,
        poll.race_key,
        poll.answers.map((answer) => answer.choice).join(" "),
      ]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [filter, polls, query]);

  const rawById = useMemo(() => {
    const map = new Map<string, Record<string, unknown>>();
    for (const doc of raw) {
      if (typeof doc.id === "string") map.set(doc.id, doc);
    }
    return map;
  }, [raw]);

  return (
    <section className="panel admin-raw">
      <header className="admin-raw__head">
        <div>
          <p className="eyebrow">Admin</p>
          <h2>Raw VoteHub rows</h2>
          <p className="admin-raw__who">{email}</p>
        </div>
        <button
          className="admin-raw__logout"
          onClick={async () => {
            try {
              await signOut(getFirebaseClientAuth());
            } catch {
              // Cookie clear still logs the server session out.
            }
            await fetch("/api/admin/logout", { method: "POST", redirect: "manual" });
            window.location.assign("/admin");
          }}
          type="button"
        >
          Log out
        </button>
      </header>

      <div className="admin-raw__status">
        <p>
          Sync: <strong>{sync?.status || "unknown"}</strong>
          {sync?.last_successful_sync ? ` · last success ${sync.last_successful_sync}` : ""}
        </p>
        <p>
          Showing {rows.length} of {polls.length} loaded rows. Full objects stay in Firestore
          `polls`.
        </p>
      </div>

      <div className="admin-raw__tools">
        <div className="admin-raw__filters">
          {FILTERS.map((item) => (
            <button
              className={filter === item.id ? "is-active" : ""}
              key={item.id}
              onClick={() => setFilter(item.id)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>
        <input
          className="admin-raw__search"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search id, pollster, subject…"
          value={query}
        />
      </div>

      <div className="poll-table-wrap">
        <table className="poll-table is-raw">
          <thead>
            <tr>
              <th>end_date</th>
              <th>id</th>
              <th>race_key</th>
              <th>pollster</th>
              <th>pop</th>
              <th>n</th>
              <th>answers</th>
              <th>flags</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <Fragment key={row.id}>
                <tr>
                  <td>{row.end_date || "—"}</td>
                  <td>
                    <button
                      className="admin-raw__id"
                      onClick={() => setOpenId(openId === row.id ? null : row.id)}
                      type="button"
                    >
                      {row.id}
                    </button>
                  </td>
                  <td>
                    {row.race_key}
                    <span>
                      {raceTypeLabel(row.race_type)} · {row.subject}
                    </span>
                  </td>
                  <td>{row.pollster || "—"}</td>
                  <td>{row.population || "—"}</td>
                  <td>{row.sample_size ?? "—"}</td>
                  <td>
                    {row.answers
                      .map((answer) => `${answer.choice}:${answer.pct ?? "—"}`)
                      .join(" | ")}
                  </td>
                  <td>
                    {[row.partisan, row.internal ? "internal" : null].filter(Boolean).join(" ") ||
                      "—"}
                  </td>
                </tr>
                {openId === row.id ? (
                  <tr className="admin-raw__json">
                    <td colSpan={8}>
                      <pre>{JSON.stringify(rawById.get(row.id) || row, null, 2)}</pre>
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
