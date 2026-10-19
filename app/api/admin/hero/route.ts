import { del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { isCatalogCloudStorageConfigured } from "@/lib/catalogStore";
import { DEFAULT_HERO, getHeroSettings, saveHeroSettings } from "@/lib/heroStore";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(await getHeroSettings());
}

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as { videoUrl?: unknown; posterUrl?: unknown };
    const previous = await getHeroSettings();
    const settings = await saveHeroSettings({ videoUrl: body.videoUrl, posterUrl: body.posterUrl });
    await removeReplacedBlobs(previous, settings);
    revalidatePath("/", "layout");
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "No se pudo guardar el video." },
      { status: 400 },
    );
  }
}

/** Goes back to the video that ships with the site. */
export async function DELETE() {
  try {
    const previous = await getHeroSettings();
    const settings = await saveHeroSettings({
      videoUrl: DEFAULT_HERO.videoUrl,
      posterUrl: DEFAULT_HERO.posterUrl,
    });
    await removeReplacedBlobs(previous, settings);
    revalidatePath("/", "layout");
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "No se pudo restaurar el video." },
      { status: 500 },
    );
  }
}

// Best effort: leaving an orphaned file in Blob is harmless, failing the save is not.
async function removeReplacedBlobs(
  previous: { videoUrl: string; posterUrl: string | null },
  next: { videoUrl: string; posterUrl: string | null },
) {
  if (!isCatalogCloudStorageConfigured()) return;
  const stale = [previous.videoUrl, previous.posterUrl].filter(
    (url): url is string =>
      Boolean(url) && url!.startsWith("https://") && url !== next.videoUrl && url !== next.posterUrl,
  );
  if (stale.length === 0) return;
  try {
    await del(stale);
  } catch (error) {
    console.error("[hero] No se pudieron borrar los archivos anteriores:", error);
  }
}
