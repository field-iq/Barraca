export const SESSION_COOKIE = "admin_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

const encoder = new TextEncoder();

/** ADMIN_SESSION_SECRET signs sessions when set; otherwise the admin password does. */
function signingSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
}

async function sign(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(`${secret}::admin-session-v2`),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Compares two secrets without leaking where they differ. */
export async function passwordMatches(submitted: unknown, expected: string | undefined): Promise<boolean> {
  if (!expected || typeof submitted !== "string") return false;
  const [a, b] = await Promise.all([sign(submitted, "password"), sign(expected, "password")]);
  return safeEqual(a, b);
}

/** Signed token with an expiry: `<expires-at-ms>.<hmac>`. Null when no secret is configured. */
export async function createSessionToken(): Promise<string | null> {
  const secret = signingSecret();
  if (!secret) return null;
  const expiresAt = String(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);
  return `${expiresAt}.${await sign(expiresAt, secret)}`;
}

/** Fails closed: without ADMIN_PASSWORD (or a secret) no session is ever valid. */
export async function isValidSession(token: string | undefined): Promise<boolean> {
  const secret = signingSecret();
  if (!secret || !process.env.ADMIN_PASSWORD || !token) return false;
  const [expiresAt, signature, ...rest] = token.split(".");
  if (!expiresAt || !signature || rest.length > 0) return false;
  if (!/^\d+$/.test(expiresAt) || Number(expiresAt) < Date.now()) return false;
  return safeEqual(signature, await sign(expiresAt, secret));
}
