import { del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_ABOUT, getAboutSettings, saveAboutSettings } from "@/lib/aboutStore";
import { isCatalogCloudStorageConfigured } from "@/lib/catalogStore";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(await getAboutSettings());
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const previous = await getAboutSettings();
    const settings = await saveAboutSettings(body);
    await removeReplacedBlob(previous.photoUrl, settings.photoUrl);
    revalidatePath("/", "layout");
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "No se pudo guardar la página." },
      { status: 400 },
    );
  }
}

/** Goes back to the text and photo that ship with the site. */
export async function DELETE() {
  try {
    const previous = await getAboutSettings();
    const settings = await saveAboutSettings({ photoUrl: DEFAULT_ABOUT.photoUrl, es: DEFAULT_ABOUT.es, en: DEFAULT_ABOUT.en });
    await removeReplacedBlob(previous.photoUrl, settings.photoUrl);
    revalidatePath("/", "layout");
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "No se pudo restaurar la página." },
      { status: 500 },
    );
  }
}

// Best effort: leaving an orphaned file in Blob is harmless, failing the save is not.
async function removeReplacedBlob(previousUrl: string, nextUrl: string) {
  if (!isCatalogCloudStorageConfigured()) return;
  if (!previousUrl.startsWith("https://") || previousUrl === nextUrl) return;
  try {
    await del(previousUrl);
  } catch (error) {
    console.error("[admin/about] No se pudo borrar la foto anterior:", error);
  }
}
