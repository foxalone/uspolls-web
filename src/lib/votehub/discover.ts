import { TARGET_POLL_TYPES, TRUMP_APPROVAL_SUBJECT_SLUG } from "./constants";
import { asTrimmedString, slugifySubject } from "./normalize";
import type { TargetPollType } from "./constants";
import type { VoteHubPoll, VoteHubSubject } from "./types";

export type DiscoveredSubject = {
  subject: string;
  poll_types: string[];
};

function asPollTypes(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => asTrimmedString(item)).filter((item): item is string => Boolean(item));
}

export function isRelevantMvpSubject(subject: string, pollTypes: string[]): boolean {
  const types = new Set(pollTypes);
  if (slugifySubject(subject) === TRUMP_APPROVAL_SUBJECT_SLUG && types.has("approval")) {
    return true;
  }
  if (!/^2026\b/.test(subject)) return false;
  return (
    types.has("generic-ballot") ||
    types.has("us-senator") ||
    types.has("us-representative") ||
    types.has("governor")
  );
}

export function discoverMvpSubjects(subjects: VoteHubSubject[]): DiscoveredSubject[] {
  const discovered: DiscoveredSubject[] = [];
  for (const row of subjects) {
    const subject = asTrimmedString(row.subject);
    if (!subject) continue;
    const pollTypes = asPollTypes(row.poll_types);
    if (!isRelevantMvpSubject(subject, pollTypes)) continue;
    discovered.push({
      subject,
      poll_types: pollTypes.filter((type) => (TARGET_POLL_TYPES as readonly string[]).includes(type)),
    });
  }
  return discovered;
}

export function buildAllowedSubjectKeys(discovered: DiscoveredSubject[]): Set<string> {
  const keys = new Set<string>();
  for (const row of discovered) {
    const slug = slugifySubject(row.subject);
    for (const pollType of row.poll_types) {
      keys.add(`${pollType}::${slug}`);
    }
  }
  return keys;
}

export function isAllowedDiscoveredPoll(poll: VoteHubPoll, allowed: Set<string>): boolean {
  const pollType = asTrimmedString(poll.poll_type);
  const subject = asTrimmedString(poll.subject);
  if (!pollType || !subject) return false;
  if (allowed.size === 0) return true;
  return allowed.has(`${pollType}::${slugifySubject(subject)}`);
}

export function voteHubQueryPlan(): Array<{ poll_type: TargetPollType; subject?: string }> {
  return [
    { poll_type: "generic-ballot" },
    { poll_type: "us-senator" },
    { poll_type: "us-representative" },
    { poll_type: "governor" },
    { poll_type: "approval", subject: TRUMP_APPROVAL_SUBJECT_SLUG },
  ];
}
