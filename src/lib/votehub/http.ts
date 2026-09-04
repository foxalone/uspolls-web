import type { NextApiRequest, NextApiResponse } from "next";
import { authorizeVoteHubSync } from "../admin/protectSync";
import { runVoteHubSync } from "./sync";
import type { SyncTrigger } from "./types";

function readBooleanFlag(value: unknown) {
  return value === true || value === "1" || value === "true";
}

export async function handleVoteHubSyncRequest(
  req: NextApiRequest,
  res: NextApiResponse,
  options: { trigger: SyncTrigger; methods: string[] },
) {
  if (!options.methods.includes(req.method || "")) {
    res.setHeader("Allow", options.methods.join(", "));
    return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }

  const auth = authorizeVoteHubSync(req);
  if (!auth.ok) return res.status(auth.status).json({ error: auth.error });

  const body = typeof req.body === "object" && req.body ? req.body : {};
  const bootstrap = readBooleanFlag(req.query.bootstrap) || readBooleanFlag(body.bootstrap);
  const fromDate =
    (typeof req.query.from_date === "string" && req.query.from_date) ||
    (typeof body.from_date === "string" && body.from_date) ||
    undefined;

  try {
    const result = await runVoteHubSync({
      bootstrap,
      fromDate,
      trigger: options.trigger,
    });
    return res.status(result.status === "error" ? 502 : 200).json(result);
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : "VOTEHUB_SYNC_FAILED",
    });
  }
}
