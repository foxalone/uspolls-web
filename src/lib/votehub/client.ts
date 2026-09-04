import {
  DEFAULT_VOTEHUB_API_BASE,
  HTTP_MAX_RETRIES,
  HTTP_TIMEOUT_MS,
} from "./constants";
import { votehubLog } from "./log";
import type { VoteHubPoll, VoteHubSubject } from "./types";

export class VoteHubHttpError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    readonly retryable = false,
  ) {
    super(message);
    this.name = "VoteHubHttpError";
  }
}

function votehubBaseUrl() {
  return (process.env.VOTEHUB_API_BASE_URL || DEFAULT_VOTEHUB_API_BASE).replace(/\/+$/, "");
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function backoffMs(attempt: number) {
  const base = Math.min(8_000, 400 * 2 ** attempt);
  return base + Math.floor(Math.random() * 250);
}

function isRetryableStatus(status: number) {
  return status === 408 || status === 429 || status >= 500;
}

async function votehubFetch<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(path, `${votehubBaseUrl()}/`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value) url.searchParams.set(key, value);
    }
  }

  let lastError: unknown;
  for (let attempt = 0; attempt <= HTTP_MAX_RETRIES; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), HTTP_TIMEOUT_MS);
    try {
      const response = await fetch(url, {
        method: "GET",
        signal: controller.signal,
        headers: {
          accept: "application/json",
          "user-agent": "uspolls-web-votehub-importer/1.0",
        },
      });

      if (isRetryableStatus(response.status) && attempt < HTTP_MAX_RETRIES) {
        votehubLog("warn", "votehub_retry", {
          path,
          status: response.status,
          attempt,
        });
        await sleep(backoffMs(attempt));
        continue;
      }

      if (!response.ok) {
        throw new VoteHubHttpError(
          `VoteHub ${path} failed with HTTP ${response.status}`,
          response.status,
          isRetryableStatus(response.status),
        );
      }

      return (await response.json()) as T;
    } catch (error) {
      lastError = error;
      const retryable =
        error instanceof VoteHubHttpError
          ? error.retryable
          : error instanceof Error && (error.name === "AbortError" || error.name === "TimeoutError");
      const network = error instanceof TypeError;
      if ((retryable || network) && attempt < HTTP_MAX_RETRIES) {
        votehubLog("warn", "votehub_retry", {
          path,
          attempt,
          error: error instanceof Error ? error.message : String(error),
        });
        await sleep(backoffMs(attempt));
        continue;
      }
      if (error instanceof Error && error.name === "AbortError") {
        throw new VoteHubHttpError(`VoteHub ${path} timed out after ${HTTP_TIMEOUT_MS}ms`, 408, true);
      }
      throw error;
    } finally {
      clearTimeout(timer);
    }
  }

  throw lastError instanceof Error ? lastError : new VoteHubHttpError("VoteHub request failed");
}

function asPollArray(value: unknown, context: string): VoteHubPoll[] {
  if (!Array.isArray(value)) {
    throw new VoteHubHttpError(`VoteHub ${context} returned a non-array payload`);
  }
  return value.filter((item): item is VoteHubPoll => Boolean(item) && typeof item === "object");
}

export async function fetchVoteHubPollTypes(): Promise<string[]> {
  const data = await votehubFetch<unknown>("/poll-types");
  if (!Array.isArray(data)) return [];
  return data.map((item) => String(item));
}

export async function fetchVoteHubSubjects(): Promise<VoteHubSubject[]> {
  const data = await votehubFetch<unknown>("/subjects");
  if (!Array.isArray(data)) return [];
  return data.filter((item): item is VoteHubSubject => Boolean(item) && typeof item === "object");
}

export async function fetchVoteHubPollsters(): Promise<string[]> {
  const data = await votehubFetch<unknown>("/pollsters");
  if (!Array.isArray(data)) return [];
  return data.map((item) => String(item));
}

export async function fetchVoteHubPolls(params: Record<string, string>): Promise<VoteHubPoll[]> {
  const data = await votehubFetch<unknown>("/polls", params);
  return asPollArray(data, "/polls");
}

export async function fetchVoteHubPollById(pollId: string): Promise<VoteHubPoll> {
  const data = await votehubFetch<unknown>(`/polls/${encodeURIComponent(pollId)}`);
  if (!data || typeof data !== "object") {
    throw new VoteHubHttpError(`VoteHub /polls/${pollId} returned an invalid payload`);
  }
  return data as VoteHubPoll;
}
