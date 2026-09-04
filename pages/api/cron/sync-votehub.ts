import type { NextApiRequest, NextApiResponse } from "next";
import { handleVoteHubSyncRequest } from "../../../src/lib/votehub/http";

export const config = {
  maxDuration: 300,
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return handleVoteHubSyncRequest(req, res, {
    trigger: "cron",
    methods: ["GET", "POST"],
  });
}
