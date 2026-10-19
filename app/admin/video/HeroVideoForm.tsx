"use client";

import { RotateCcw, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/feedback/alert";
import type { HeroSettings } from "@/lib/heroStore";

const MAX_BYTES = 60 * 1024 * 1024;
const ACCEPTED = ["video/mp4", "video/webm"];

type Status = "idle" | "working" | "success" | "error";

export function HeroVideoForm({
  initialSettings,
  cloudStorageConfigured,
}: {
  initialSettings: HeroSettings;
  cloudStorageConfigured: boolean;
}) {
  const [settings, setSettings] = useState(initialSettings);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState<number | null>(null);
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
      setMessage("Usá un video MP4 (H.264) o WebM. Los .MOV de iPhone hay que exportarlos a MP4 primero.");
      return;
    }
    if (selected.size > MAX_BYTES) {
      setFile(null);
      setStatus("error");
      setMessage("El video supera los 60 MB. Comprimilo o acortalo antes de subirlo.");
      return;
    }
    setFile(selected);
  }

  async function uploadFile(blob: Blob, name: string, kind: "video" | "poster", onProgress?: (percent: number) => void) {
    if (cloudStorageConfigured) {
      const result = await upload(`hero/${name}`, blob, {
        access: "public",
        handleUploadUrl: "/api/admin/hero/upload",
        contentType: blob.type,
        onUploadProgress: ({ percentage }) => onProgress?.(percentage),
      });
      return result.url;
    }
    const form = new FormData();
    form.append("file", new File([blob], name, { type: blob.type }));
    form.append("kind", kind);
    const response = await fetch("/api/admin/hero/upload", { method: "POST", body: form });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error ?? "No se pudo subir el archivo.");
    onProgress?.(100);
    return data.url as string;
  }

  async function publish() {
    if (!file) return;
    setStatus("working");
    setMessage("");
    setProgress(0);
    try {
      const id = crypto.randomUUID();
      const extension = file.type === "video/webm" ? "webm" : "mp4";
      const videoUrl = await uploadFile(file, `${id}.${extension}`, "video", setProgress);

      // The poster is the frame shown while the video loads. If the browser can't decode
      // this file to grab a frame, the video still publishes without it.
      let posterUrl: string | null = null;
      const poster = await extractPoster(file);
      if (poster) {
        try {
          posterUrl = await uploadFile(poster, `${id}-poster.jpg`, "poster");
        } catch {
          posterUrl = null;
        }
      }

      const response = await fetch("/api/admin/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl, posterUrl }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "No se pudo publicar el video.");
      setSettings(data);
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
      setStatus("success");
      setMessage("Video publicado. Ya se ve en el inicio del sitio.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "No se pudo publicar el video.");
    } finally {
      setProgress(null);
    }
  }

  async function restore() {
    if (!window.confirm("¿Volver al video original del sitio?")) return;
    setStatus("working");
    setMessage("");
    try {
      const response = await fetch("/api/admin/hero", { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "No se pudo restaurar.");
      setSettings(data);
      setFile(null);
      setStatus("success");
      setMessage("Se restauró el video original.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "No se pudo restaurar.");
    }
  }

  const isDefault = settings.videoUrl === "/hero.mp4";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl text-nm-text sm:text-3xl">Video del inicio</h2>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-nm-muted">
          Subí el video que se muestra a pantalla completa arriba de todo en la home. Reemplaza al actual en cuanto lo publiques.
        </p>
        <p className="mt-1 text-xs text-nm-muted/70">
          {cloudStorageConfigured
            ? "El video se guarda en Vercel y queda disponible en producción."
            : "Modo local: conectá Vercel Blob antes de publicar en producción."}
        </p>
      </div>

      {message && <Alert tone={status === "success" ? "success" : "warning"} title={message} />}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-nm-muted">Video actual</h3>
          <div className="rounded-soft-lg p-3 shadow-soft">
            <video
              key={settings.videoUrl}
              src={settings.videoUrl}
              poster={settings.posterUrl ?? undefined}
              controls
              muted
              playsInline
              className="aspect-video w-full rounded-soft bg-black object-cover shadow-soft-inset"
            />
          </div>
          <p className="text-xs text-nm-muted">
            {isDefault ? "Es el video original del sitio." : "Es un video que subiste desde el administrador."}
          </p>
          {!isDefault && (
            <Button type="button" variant="raised" size="sm" onClick={restore} disabled={busy} leading={<RotateCcw size={15} aria-hidden="true" />}>
              Volver al video original
            </Button>
          )}
        </section>

        <section className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-nm-muted">Video nuevo</h3>
          <label className="nm-transition flex cursor-pointer flex-col items-center justify-center gap-2 rounded-soft-lg p-8 text-center shadow-soft-inset hover:shadow-soft-inset-sm">
            <Upload size={22} className="text-nm-accent" aria-hidden="true" />
            <span className="text-sm font-medium text-nm-text">{file ? file.name : "Elegir un video"}</span>
            <span className="text-xs text-nm-muted">
              {file ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : "MP4 (H.264) o WebM · hasta 60 MB · sin audio, mejor"}
            </span>
            <input
              ref={inputRef}
              type="file"
              accept="video/mp4,video/webm"
              className="sr-only"
              disabled={busy}
              onChange={(event) => pick(event.target.files?.[0])}
            />
          </label>

          {previewUrl && (
            <div className="rounded-soft-lg p-3 shadow-soft">
              <video src={previewUrl} controls muted playsInline className="aspect-video w-full rounded-soft bg-black object-cover" />
            </div>
          )}

          {progress !== null && (
            <div className="h-2 overflow-hidden rounded-full shadow-soft-inset-sm" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
              <div className="h-full bg-nm-accent transition-[width]" style={{ width: `${progress}%` }} />
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

/** Grabs a frame near the start of the video as a JPEG, or null if the browser can't decode it. */
function extractPoster(file: File): Promise<Blob | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    const finish = (blob: Blob | null) => {
      clearTimeout(timer);
      URL.revokeObjectURL(url);
      resolve(blob);
    };
    const timer = setTimeout(() => finish(null), 10_000);
    video.onerror = () => finish(null);
    video.onloadeddata = () => {
      video.currentTime = Math.min(0.5, (video.duration || 1) / 2);
    };
    video.onseeked = () => {
      const width = Math.min(1280, video.videoWidth);
      if (!width) return finish(null);
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = Math.round((video.videoHeight / video.videoWidth) * width);
      canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => finish(blob), "image/jpeg", 0.8);
    };
    video.src = url;
  });
}
