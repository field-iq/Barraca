import { promises as fs } from "node:fs";
import path from "node:path";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextRequest, NextResponse } from "next/server";
import { isCatalogCloudStorageConfigured } from "@/lib/catalogStore";

export const runtime = "nodejs";

const MAX_BYTES = 10 * 1024 * 1024;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

/**
 * Cloud: issues a Blob client token (JSON body) so the browser uploads straight to Blob.
 * Local dev: accepts the file as multipart form data and writes it under public/uploads/local.
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
          if (!pathname.startsWith("local/")) throw new Error("Ruta de subida no permitida.");
          return {
            allowedContentTypes: IMAGE_TYPES,
            maximumSizeInBytes: MAX_BYTES,
            addRandomSuffix: false,
          };
        },
      });
      return NextResponse.json(result);
    }

    if (process.env.VERCEL) {
      return NextResponse.json(
        { error: "Conectá Vercel Blob antes de subir la foto en producción." },
        { status: 503 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Seleccioná una imagen." }, { status: 400 });
    }
    if (!IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Usá una imagen JPG, PNG o WebP." }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "La imagen supera los 10 MB." }, { status: 400 });
    }

    const filename = `${crypto.randomUUID()}.${EXTENSIONS[file.type]}`;
    const targetPath = path.join(process.cwd(), "public", "uploads", "local", filename);
    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    await fs.writeFile(targetPath, Buffer.from(await file.arrayBuffer()));
    return NextResponse.json({ url: `/uploads/local/${filename}` });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "No se pudo subir la imagen." },
      { status: 400 },
    );
  }
}
