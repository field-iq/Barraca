export async function getSessionToken(): Promise<string> {
  const password = process.env.ADMIN_PASSWORD ?? "";
  const encoder = new TextEncoder();
  const data = encoder.encode(`${password}::admin-session-v1`);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
