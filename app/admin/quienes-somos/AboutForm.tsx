"use client";

import { RotateCcw, Save, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/feedback/alert";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ABOUT_LIMITS, type AboutSettings } from "@/lib/aboutShared";

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];
const MAX_SOURCE_BYTES = 30 * 1024 * 1024;
const MAX_SIDE = 1600;

type Status = "idle" | "working" | "success" | "error";

export function AboutForm({
  initialSettings,
  defaults,
  cloudStorageConfigured,
}: {
  initialSettings: AboutSettings;
  defaults: AboutSettings;
  cloudStorageConfigured: boolean;
}) {
  const [saved, setSaved] = useState(initialSettings);
  const [es, setEs] = useState(initialSettings.es);
  const [en, setEn] = useState(initialSettings.en);
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
  const dirty =
    file !== null ||
    es.title !== saved.es.title ||
    es.body !== saved.es.body ||
    en.title !== saved.en.title ||
    en.body !== saved.en.body;

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
    setStatus("working");
    setMessage("");
    try {
      let photoUrl = saved.photoUrl;
      if (file) photoUrl = await uploadFile(await resizeToJpeg(file), `about-${crypto.randomUUID()}.jpg`);

      const response = await fetch("/api/admin/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoUrl, es, en }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "No se pudo publicar la página.");
      setSaved(data);
      setEs(data.es);
      setEn(data.en);
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
      setStatus("success");
      setMessage("Cambios publicados. Ya se ven en Quiénes somos (puede tardar hasta un minuto).");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "No se pudo publicar la página.");
    }
  }

  async function restore() {
    if (!window.confirm("¿Volver al texto y la foto originales de la página?")) return;
    setStatus("working");
    setMessage("");
    try {
      const response = await fetch("/api/admin/about", { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "No se pudo restaurar.");
      setSaved(data);
      setEs(data.es);
      setEn(data.en);
      setFile(null);
      setStatus("success");
      setMessage("Se restauraron el texto y la foto originales.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "No se pudo restaurar.");
    }
  }

  const isDefault =
    saved.photoUrl === defaults.photoUrl &&
    saved.es.title === defaults.es.title &&
    saved.es.body === defaults.es.body &&
    saved.en.title === defaults.en.title &&
    saved.en.body === defaults.en.body;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl text-nm-text sm:text-3xl">Quiénes somos</h2>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-nm-muted">
          Contá la historia de la mueblería. Editá el título y el texto en español y en inglés, y cambiá la foto.
          Separá los párrafos con una línea en blanco.
        </p>
        <p className="mt-1 text-xs text-nm-muted/70">
          {cloudStorageConfigured
            ? "Los cambios se guardan en Vercel y quedan disponibles en producción."
            : "Modo local: conectá Vercel Blob antes de publicar en producción."}
        </p>
      </div>

      {message && <Alert tone={status === "success" ? "success" : "warning"} title={message} />}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
        <div className="space-y-8">
          <TextBlock label="Español" value={es} onChange={setEs} disabled={busy} idPrefix="es" />
          <TextBlock label="English" value={en} onChange={setEn} disabled={busy} idPrefix="en" />
        </div>

        <section className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-nm-muted">Foto</h3>
          <div className="rounded-soft-lg p-3 shadow-soft">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={previewUrl ?? saved.photoUrl}
              src={previewUrl ?? saved.photoUrl}
              alt={previewUrl ? "Vista previa de la foto nueva" : "Foto actual de Quiénes somos"}
              className="aspect-[4/5] w-full rounded-soft object-cover shadow-soft-inset"
            />
          </div>
          <p className="text-xs text-nm-muted">
            {previewUrl
              ? "Vista previa: todavía no está publicada."
              : saved.photoUrl === defaults.photoUrl
                ? "Es la foto del frente del local."
                : "Es una foto que subiste desde el administrador."}
          </p>
          <label className="nm-transition flex cursor-pointer flex-col items-center justify-center gap-2 rounded-soft-lg p-6 text-center shadow-soft-inset hover:shadow-soft-inset-sm">
            <Upload size={22} className="text-nm-accent" aria-hidden="true" />
            <span className="text-sm font-medium text-nm-text">{file ? file.name : "Elegir otra foto"}</span>
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
        </section>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="accent"
          size="lg"
          onClick={publish}
          disabled={!dirty || busy}
          loading={busy}
          leading={<Save size={17} aria-hidden="true" />}
        >
          {busy ? "Guardando..." : "Guardar y publicar"}
        </Button>
        {!isDefault && (
          <Button type="button" variant="raised" size="lg" onClick={restore} disabled={busy} leading={<RotateCcw size={15} aria-hidden="true" />}>
            Volver al original
          </Button>
        )}
      </div>
    </div>
  );
}

function TextBlock({
  label,
  value,
  onChange,
  disabled,
  idPrefix,
}: {
  label: string;
  value: { title: string; body: string };
  onChange: (next: { title: string; body: string }) => void;
  disabled: boolean;
  idPrefix: string;
}) {
  return (
    <section className="space-y-4 rounded-soft-lg p-5 shadow-soft sm:p-6">
      <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-nm-muted">{label}</h3>
      <FormField label="Título" htmlFor={`${idPrefix}-title`}>
        <Input
          id={`${idPrefix}-title`}
          value={value.title}
          maxLength={ABOUT_LIMITS.title}
          disabled={disabled}
          onChange={(event) => onChange({ ...value, title: event.target.value })}
        />
      </FormField>
      <FormField label="Historia" htmlFor={`${idPrefix}-body`} hint={`${value.body.length} / ${ABOUT_LIMITS.body} caracteres`}>
        <Textarea
          id={`${idPrefix}-body`}
          value={value.body}
          maxLength={ABOUT_LIMITS.body}
          rows={12}
          disabled={disabled}
          onChange={(event) => onChange({ ...value, body: event.target.value })}
        />
      </FormField>
    </section>
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
