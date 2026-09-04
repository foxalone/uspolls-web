type LogLevel = "info" | "warn" | "error";

export function votehubLog(
  level: LogLevel,
  event: string,
  fields: Record<string, unknown> = {},
) {
  const line = JSON.stringify({
    scope: "votehub-sync",
    level,
    event,
    ts: new Date().toISOString(),
    ...fields,
  });
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}
