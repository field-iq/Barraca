import { promises as fs } from "node:fs";
import path from "node:path";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextRequest, NextResponse } from "next/server";
import { isCatalogCloudStorageConfigured } from "@/lib/catalogStore";

export const runtime = "nodejs";

const MAX_VIDEO_BYTES = 60 * 1024 * 1024;
const VIDEO_TYPES = ["video/mp4", "video/webm"];
const POSTER_TYPES = ["image/jpeg"];
const EXTENSIONS: Record<string, string> = {
  "video/mp4": "mp4",
  "video/webm": "webm",
  "image/jpeg": "jpg",
};

/**
 * Cloud: issues a Blob client token (JSON body) so the browser uploads the file straight to
 * Blob. Serverless functions cap request bodies at ~4.5 MB, far below a hero video.
 * Local dev: accepts the file as multipart form data and writes it under public/uploads/hero.
 * Both paths sit behind the admin session check in middleware.ts.
 */
export async function POST(request: NextRequest) {
  try {
    if (request.headers.get("content-type")?.includes("application/json")) {
      if (!isCatalogCloudStorageConfigured()) {
        return NextResponse.json({ error: "Vercel Blob no está configurado." }, { status: 503 });
      }
      const body = (await request.json()) as HandleUploadBody;
      const result = await handleUpload({
        body,
        request,
        onBeforeGenerateToken: async (pathname) => {
          if (!pathname.startsWith("hero/")) throw new Error("Ruta de subida no permitida.");
          return {
            allowedContentTypes: [...VIDEO_TYPES, ...POSTER_TYPES],
            maximumSizeInBytes: MAX_VIDEO_BYTES,
            addRandomSuffix: false,
          };
        },
      });
      return NextResponse.json(result);
    }

    if (process.env.VERCEL) {
      return NextResponse.json(
        { error: "Conectá Vercel Blob antes de subir el video en producción." },
        { status: 503 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Seleccioná un archivo." }, { status: 400 });
    }
    const isPoster = formData.get("kind") === "poster";
    if (!(isPoster ? POSTER_TYPES : VIDEO_TYPES).includes(file.type)) {
      return NextResponse.json(
        { error: isPoster ? "La portada debe ser JPG." : "Usá un video MP4 o WebM." },
        { status: 400 },
      );
    }
    if (file.size > MAX_VIDEO_BYTES) {
      return NextResponse.json({ error: "El archivo supera los 60 MB." }, { status: 400 });
    }

    const filename = `${crypto.randomUUID()}.${EXTENSIONS[file.type]}`;
    const targetPath = path.join(process.cwd(), "public", "uploads", "hero", filename);
    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    await fs.writeFile(targetPath, Buffer.from(await file.arrayBuffer()));
    return NextResponse.json({ url: `/uploads/hero/${filename}` });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "No se pudo subir el archivo." },
      { status: 400 },
    );
  }
}
