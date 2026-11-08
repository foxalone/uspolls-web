import type { RawNewsItem } from "./types";

const PROMPT = `You edit a news board about the 2028 United States presidential race.
The board is shown in English and Spanish. Return one JSON object: {"items":[...]}.
Each input item needs one output row with the same id.

Publish an item when the story is about that race: the field, possible or declared candidates, a reported plan or draft campaign, a public refusal to run, primaries, polls, debates, endorsements, filings, campaign money, the calendar, or how the parties are preparing for 2028.
Do not publish stories about other offices, foreign elections, or politics that do not discuss the 2028 presidential race.

duplicate_of:
- Use the id of a recent headline or of an earlier item in this batch when the new item repeats the same event and adds no new fact.
- A new filing, decision, poll number, date, correction, or response is not a duplicate.
- The same person or the same broad topic is not by itself a duplicate.
- Use null when it is not a duplicate.

For a published item write:
- headline.en and headline.es: at most 12 words, no emoji, no exclamation mark, no outlet name.
- teaser.en and teaser.es: one sentence, at most 28 words, using only facts present in the item.
- people: at most two people who are the subject and are named in the item. nameEn must be the English Wikipedia title of that person. Do not include journalists, outlets, or unnamed groups. Use [] when no specific person is the subject.
- topic: one or two words naming the race subject, such as "Primaries" or "Poll".

For an unpublished item, set publish to false and leave headline, teaser, and people empty.`;

export function newsModel() {
  return process.env.OPENAI_NEWS_MODEL?.trim() || "gpt-5-nano";
}

export function buildPrompt(items: RawNewsItem[], recent: { id: string; headline: string }[]) {
  const history = recent.map((row) => `${row.id} | ${row.headline}`).join("\n") || "(none)";
  const incoming = items.map((item) => [
    item.id,
    item.language,
    item.source,
    item.title,
    item.summary,
  ].join(" | ")).join("\n");
  return `${PROMPT}

Recent published headlines:
${history}

New items:
${incoming}`;
}

export async function completeNewsPrompt(prompt: string) {
  const key = process.env.OPENAI_API_KEY?.trim() || "";
  if (!key) throw new Error("MISSING_ENV:OPENAI_API_KEY");
  const body = {
    model: newsModel(),
    messages: [
      { role: "system", content: "You only return JSON that follows the editor's schema." },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
    max_completion_tokens: 6000,
    reasoning_effort: "low",
  };
  const first = await postCompletion(key, body);
  if (first.ok) return readContent(first);
  if (first.status !== 400) throw new Error(`OpenAI ${first.status}`);
  const withoutEffort = { ...body, reasoning_effort: undefined };
  const second = await postCompletion(key, withoutEffort);
  if (!second.ok) throw new Error(`OpenAI ${second.status}`);
  return readContent(second);
}

async function postCompletion(key: string, body: object) {
  return fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(45000),
  });
}

function messageText(content: unknown) {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";
  return content.map((part) => {
    if (typeof part === "string") return part;
    if (part && typeof part === "object" && "text" in part) return String(part.text || "");
    return "";
  }).join("");
}

async function readContent(response: Response) {
  const payload = await response.json() as {
    choices?: { finish_reason?: string; message?: { content?: unknown } }[];
    usage?: { completion_tokens_details?: { reasoning_tokens?: number } };
  };
  const choice = payload.choices?.[0];
  const content = messageText(choice?.message?.content);
  if (content) return content;
  const reasoning = payload.usage?.completion_tokens_details?.reasoning_tokens ?? 0;
  throw new Error(`OpenAI empty finish=${choice?.finish_reason || "none"} reasoning=${reasoning}`);
}
