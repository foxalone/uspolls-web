import {
  formatMargin,
  raceTypeLabel,
  type HomePollSnapshot,
} from "../lib/polls/summarize";

type HomePollsProps = {
  polls: HomePollSnapshot;
};

export function HomePolls({ polls }: HomePollsProps) {
  const ballot = polls.genericBallot;
  const approval = polls.trumpApproval;

  return (
    <section className="panel home-polls" id="polls">
      <header className="home-polls__head">
        <div>
          <p className="eyebrow">VoteHub polling</p>
          <h2>Live 2026 poll board</h2>
        </div>
        <p className="home-polls__meta">
          {polls.raceCounts.senate} Senate · {polls.raceCounts.house} House ·{" "}
          {polls.raceCounts.governor} governor races
        </p>
      </header>

      <div className="home-polls__summary">
        <article className="poll-meter">
          <span>Generic congressional ballot</span>
          {ballot ? (
            <>
              <strong>{formatMargin(ballot.margin)}</strong>
              <div className="poll-meter__bar" aria-hidden="true">
                <i style={{ width: `${ballot.dem}%` }} />
                <b style={{ width: `${ballot.gop}%` }} />
              </div>
              <p>
                Dem {ballot.dem.toFixed(1)} · GOP {ballot.gop.toFixed(1)} · Other{" "}
                {ballot.other.toFixed(1)}
              </p>
              <small>
                Simple average of the last {ballot.pollCount} generic-ballot polls
                {ballot.latestEndDate ? ` · through ${ballot.latestEndDate}` : ""}
              </small>
            </>
          ) : (
            <p>No generic-ballot polls imported yet.</p>
          )}
        </article>

        <article className="poll-meter">
          <span>Donald Trump approval</span>
          {approval ? (
            <>
              <strong>
                {approval.approve.toFixed(1)} / {approval.disapprove.toFixed(1)}
              </strong>
              <div className="poll-meter__bar is-approval" aria-hidden="true">
                <i style={{ width: `${approval.approve}%` }} />
                <b style={{ width: `${approval.disapprove}%` }} />
              </div>
              <p>
                Approve {approval.approve.toFixed(1)} · Disapprove {approval.disapprove.toFixed(1)}
              </p>
              <small>
                Simple average of the last {approval.pollCount} approval polls
                {approval.latestEndDate ? ` · through ${approval.latestEndDate}` : ""}
              </small>
            </>
          ) : (
            <p>No Trump approval polls imported yet.</p>
          )}
        </article>
      </div>

      <div className="poll-table-wrap">
        <table className="poll-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Race</th>
              <th>Pollster</th>
              <th>Sample</th>
              <th>Results</th>
            </tr>
          </thead>
          <tbody>
            {polls.latest.length ? (
              polls.latest.map((row) => (
                <tr key={row.id}>
                  <td>{row.end_date || "—"}</td>
                  <td>
                    <strong>{raceTypeLabel(row.race_type)}</strong>
                    <span>{row.subject}</span>
                  </td>
                  <td>
                    {row.source_url ? (
                      <a href={row.source_url} rel="noreferrer" target="_blank">
                        {row.pollster || "Pollster"}
                      </a>
                    ) : (
                      row.pollster || "—"
                    )}
                  </td>
                  <td>
                    {row.sample_size ?? "—"}
                    {row.population ? ` ${row.population.toUpperCase()}` : ""}
                  </td>
                  <td>
                    {row.answers
                      .filter((answer) => answer.pct != null)
                      .slice(0, 4)
                      .map((answer) => `${answer.choice} ${answer.pct}`)
                      .join(" · ") || "—"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>Polling data is not available yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="home-polls__credit">
        Polling data from{" "}
        <a href="https://votehub.com/polls/api/" rel="noreferrer" target="_blank">
          VoteHub
        </a>{" "}
        (CC BY 4.0). This board is a simple recent average, not a house-adjusted
        polling model.
      </p>
    </section>
  );
}
