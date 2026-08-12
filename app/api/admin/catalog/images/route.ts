import { promises as fs } from "node:fs";
import path from "node:path";
import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { isCatalogCloudStorageConfigured } from "@/lib/catalogStore";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 4 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const productId = sanitizeSegment(String(formData.get("productId") ?? "producto"));

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Seleccioná una imagen." }, { status: 400 });
    }
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: "Usa una imagen JPG, PNG o WebP." }, { status: 400 });
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "La imagen no puede superar los 4 MB." }, { status: 400 });
    }

    const extension = extensionFor(file.type);
    const filename = `${crypto.randomUUID()}.${extension}`;

    if (isCatalogCloudStorageConfigured()) {
      const blob = await put(`catalog/images/${productId}/${filename}`, file, {
        access: "public",
        addRandomSuffix: false,
        contentType: file.type,
      });
      return NextResponse.json({ url: blob.url });
    }

    if (process.env.VERCEL) {
      return NextResponse.json(
        { error: "Conectá Vercel Blob antes de subir fotos en producción." },
        { status: 503 },
      );
    }

    const relativePath = `/uploads/catalog/${productId}/${filename}`;
    const targetPath = path.join(process.cwd(), "public", relativePath);
    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    await fs.writeFile(targetPath, Buffer.from(await file.arrayBuffer()));
    return NextResponse.json({ url: relativePath });
  } catch {
    return NextResponse.json({ error: "No se pudo subir la imagen." }, { status: 500 });
  }
}

function sanitizeSegment(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").slice(0, 80);
}

function extensionFor(contentType: string): string {
  if (contentType === "image/png") return "png";
  if (contentType === "image/webp") return "webp";
  return "jpg";
}
