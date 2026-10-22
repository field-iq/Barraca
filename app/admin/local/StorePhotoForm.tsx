"use client";

import { RotateCcw, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/feedback/alert";
import type { StorePhotoSettings } from "@/lib/storePhotoStore";

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];
const MAX_SOURCE_BYTES = 30 * 1024 * 1024;
const MAX_SIDE = 1600;

type Status = "idle" | "working" | "success" | "error";

export function StorePhotoForm({
  initialSettings,
  defaultPhotoUrl,
  cloudStorageConfigured,
}: {
  initialSettings: StorePhotoSettings;
  defaultPhotoUrl: string;
  cloudStorageConfigured: boolean;
}) {
  const [settings, setSettings] = useState(initialSettings);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!file) return setPreviewUrl(null);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const busy = status === "working";

  function pick(selected: File | undefined) {
    setStatus("idle");
    setMessage("");
    if (!selected) return setFile(null);
    if (!ACCEPTED.includes(selected.type)) {
      setFile(null);
      setStatus("error");
      setMessage("Usá una foto JPG, PNG o WebP. Las fotos HEIC de iPhone hay que exportarlas a JPG primero.");
      return;
    }
    if (selected.size > MAX_SOURCE_BYTES) {
      setFile(null);
      setStatus("error");
      setMessage("La foto pesa más de 30 MB. Elegí una más liviana.");
      return;
    }
    setFile(selected);
  }

  async function uploadFile(blob: Blob, name: string) {
    if (cloudStorageConfigured) {
      const result = await upload(`local/${name}`, blob, {
        access: "public",
        handleUploadUrl: "/api/admin/local/upload",
        contentType: blob.type,
      });
      return result.url;
    }
    const form = new FormData();
    form.append("file", new File([blob], name, { type: blob.type }));
    const response = await fetch("/api/admin/local/upload", { method: "POST", body: form });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error ?? "No se pudo subir la foto.");
    return data.url as string;
  }

  async function publish() {
    if (!file) return;
    setStatus("working");
    setMessage("");
    try {
      const resized = await resizeToJpeg(file);
      const photoUrl = await uploadFile(resized, `${crypto.randomUUID()}.jpg`);

      const response = await fetch("/api/admin/local", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoUrl }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "No se pudo publicar la foto.");
      setSettings(data);
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
      setStatus("success");
      setMessage("Foto publicada. Ya se ve en la sección del local (puede tardar hasta un minuto).");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "No se pudo publicar la foto.");
    }
  }

  async function restore() {
    if (!window.confirm("¿Volver a la foto original del sitio?")) return;
    setStatus("working");
    setMessage("");
    try {
      const response = await fetch("/api/admin/local", { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "No se pudo restaurar.");
      setSettings(data);
      setFile(null);
      setStatus("success");
      setMessage("Se restauró la foto original.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "No se pudo restaurar.");
    }
  }

  const isDefault = settings.photoUrl === defaultPhotoUrl;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl text-nm-text sm:text-3xl">Foto del local</h2>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-nm-muted">
          Es la foto que aparece al lado de la dirección, en &quot;Encontranos en Tigre&quot;. Reemplaza a la actual en cuanto la publiques.
          La foto se achica sola antes de subirla.
        </p>
        <p className="mt-1 text-xs text-nm-muted/70">
          {cloudStorageConfigured
            ? "La foto se guarda en Vercel y queda disponible en producción."
            : "Modo local: conectá Vercel Blob antes de publicar en producción."}
        </p>
      </div>

      {message && <Alert tone={status === "success" ? "success" : "warning"} title={message} />}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-nm-muted">Foto actual</h3>
          <div className="max-w-sm rounded-soft-lg p-3 shadow-soft">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={settings.photoUrl}
              src={settings.photoUrl}
              alt="Foto actual del local"
              className="aspect-[4/5] w-full rounded-soft object-cover shadow-soft-inset"
            />
          </div>
          <p className="text-xs text-nm-muted">
            {isDefault ? "Es la foto original del sitio." : "Es una foto que subiste desde el administrador."}
          </p>
          {!isDefault && (
            <Button type="button" variant="raised" size="sm" onClick={restore} disabled={busy} leading={<RotateCcw size={15} aria-hidden="true" />}>
              Volver a la foto original
            </Button>
          )}
        </section>

        <section className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-nm-muted">Foto nueva</h3>
          <label className="nm-transition flex cursor-pointer flex-col items-center justify-center gap-2 rounded-soft-lg p-8 text-center shadow-soft-inset hover:shadow-soft-inset-sm">
            <Upload size={22} className="text-nm-accent" aria-hidden="true" />
            <span className="text-sm font-medium text-nm-text">{file ? file.name : "Elegir una foto"}</span>
            <span className="text-xs text-nm-muted">
              {file ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : "JPG, PNG o WebP · mejor vertical (4:5)"}
            </span>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              disabled={busy}
              onChange={(event) => pick(event.target.files?.[0])}
            />
          </label>

          {previewUrl && (
            <div className="max-w-sm rounded-soft-lg p-3 shadow-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="Vista previa de la foto nueva" className="aspect-[4/5] w-full rounded-soft object-cover" />
            </div>
          )}

          <Button
            type="button"
            variant="accent"
            size="lg"
            onClick={publish}
            disabled={!file || busy}
            loading={busy}
            leading={<Upload size={17} aria-hidden="true" />}
          >
            {busy ? "Subiendo..." : "Subir y publicar"}
          </Button>
        </section>
      </div>
    </div>
  );
}

/** Scales the photo down to at most MAX_SIDE px and re-encodes it as JPEG, honouring phone rotation. */
async function resizeToJpeg(file: File): Promise<Blob> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw new Error("No se pudo leer la foto. Probá con otra en formato JPG, PNG o WebP.");
  }
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
  if (!blob) throw new Error("No se pudo preparar la foto para subirla.");
  return blob;
}
