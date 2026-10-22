import { del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { isCatalogCloudStorageConfigured } from "@/lib/catalogStore";
import {
  DEFAULT_STORE_PHOTO,
  getStorePhotoSettings,
  saveStorePhotoSettings,
} from "@/lib/storePhotoStore";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(await getStorePhotoSettings());
}

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as { photoUrl?: unknown };
    const previous = await getStorePhotoSettings();
    const settings = await saveStorePhotoSettings({ photoUrl: body.photoUrl });
    await removeReplacedBlob(previous.photoUrl, settings.photoUrl);
    revalidatePath("/", "layout");
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "No se pudo guardar la foto." },
      { status: 400 },
    );
  }
}

/** Goes back to the photo that ships with the site. */
export async function DELETE() {
  try {
    const previous = await getStorePhotoSettings();
    const settings = await saveStorePhotoSettings({ photoUrl: DEFAULT_STORE_PHOTO.photoUrl });
    await removeReplacedBlob(previous.photoUrl, settings.photoUrl);
    revalidatePath("/", "layout");
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "No se pudo restaurar la foto." },
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
    console.error("[admin/local] No se pudo borrar la foto anterior:", error);
  }
}
