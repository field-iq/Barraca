import { promises as fs } from "node:fs";
import path from "node:path";
import { BlobNotFoundError, head, put } from "@vercel/blob";
import { isCatalogCloudStorageConfigured } from "./catalogStore";

// Resend free plan: 100/day and 3,000/month. Stay below both so the account never needs a paid plan.
export const DAILY_EMAIL_LIMIT = 80;
export const MONTHLY_EMAIL_LIMIT = 2500;

interface EmailQuota {
  day: string;
  dayCount: number;
  month: string;
  monthCount: number;
}

const QUOTA_BLOB_PATH = "site/email-quota.json";
const LOCAL_QUOTA_PATH = path.join(process.cwd(), ".data", "email-quota.json");

function emptyQuota(now: Date): EmailQuota {
  const iso = now.toISOString();
  return { day: iso.slice(0, 10), dayCount: 0, month: iso.slice(0, 7), monthCount: 0 };
}

function parseQuota(value: unknown, now: Date): EmailQuota {
  const fresh = emptyQuota(now);
  const data = (value ?? {}) as Record<string, unknown>;
  const count = (n: unknown) => (typeof n === "number" && n >= 0 ? n : 0);
  return {
    day: fresh.day,
    dayCount: data.day === fresh.day ? count(data.dayCount) : 0,
    month: fresh.month,
    monthCount: data.month === fresh.month ? count(data.monthCount) : 0,
  };
}

async function readQuota(now: Date): Promise<EmailQuota> {
  if (isCatalogCloudStorageConfigured()) {
    try {
      const metadata = await head(QUOTA_BLOB_PATH);
      const response = await fetch(`${metadata.url}?version=${encodeURIComponent(metadata.etag)}`, {
        cache: "no-store",
      });
      if (!response.ok) throw new Error(`Lectura del contador falló (${response.status}).`);
      return parseQuota(await response.json(), now);
    } catch (error) {
      // Only a missing blob means "nothing counted yet"; any other failure must not reset the counter.
      if (error instanceof BlobNotFoundError) return emptyQuota(now);
      throw error;
    }
  }

  try {
    return parseQuota(JSON.parse(await fs.readFile(LOCAL_QUOTA_PATH, "utf8")), now);
  } catch {
    return emptyQuota(now);
  }
}

async function writeQuota(quota: EmailQuota): Promise<void> {
  if (isCatalogCloudStorageConfigured()) {
    await put(QUOTA_BLOB_PATH, JSON.stringify(quota), {
      access: "public",
      allowOverwrite: true,
      cacheControlMaxAge: 0,
      contentType: "application/json",
    });
    return;
  }
  await fs.mkdir(path.dirname(LOCAL_QUOTA_PATH), { recursive: true });
  await fs.writeFile(LOCAL_QUOTA_PATH, JSON.stringify(quota, null, 2), "utf8");
}

/**
 * Reserves `count` emails against the daily and monthly caps.
 * Returns false when sending would pass a cap. Counting is best-effort: if storage
 * fails we allow the send, since the free Resend plan itself rejects anything over its limits.
 */
export async function reserveEmails(count: number): Promise<boolean> {
  try {
    const now = new Date();
    const quota = await readQuota(now);
    if (quota.dayCount + count > DAILY_EMAIL_LIMIT) return false;
    if (quota.monthCount + count > MONTHLY_EMAIL_LIMIT) return false;
    quota.dayCount += count;
    quota.monthCount += count;
    await writeQuota(quota);
    return true;
  } catch (error) {
    console.error("[emailQuota] No se pudo registrar el contador:", error);
    return true;
  }
}
