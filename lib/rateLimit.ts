// Best-effort in-memory limiter. On serverless each instance keeps its own
// counters, so this only curbs casual abuse; it is not a hard guarantee.
const hits = new Map<string, number[]>();

export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((time) => now - time < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);

  if (hits.size > 5000) {
    hits.forEach((times, k) => {
      if (times.every((time) => now - time >= windowMs)) hits.delete(k);
    });
  }
  return true;
}

export function clientKey(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
}
