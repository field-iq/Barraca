"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface ImageSlideshowProps {
  images: string[];
  alt: string;
  /** Pasado a next/image para hint de responsive sizing. */
  sizes?: string;
  /** Cada cuántos milisegundos cambia la imagen. Default: 3s. */
  intervalMs?: number;
  /** Si la primera imagen debe cargarse con prioridad (LCP). */
  priority?: boolean;
  /** Cómo ajustar la imagen al contenedor. Default: 'cover'. */
  objectFit?: "cover" | "contain";
}

/**
 * Apila todas las imágenes con `fill` y va alternando la opacidad para hacer
 * un fade suave entre fotos. El contenedor padre tiene que ser `relative` y
 * con un alto definido (aspect-ratio o h-*).
 */
export function ImageSlideshow({
  images,
  alt,
  sizes,
  intervalMs = 3000,
  priority = false,
  objectFit = "cover",
}: ImageSlideshowProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, intervalMs);
    return () => clearInterval(t);
  }, [images.length, intervalMs]);

  return (
    <>
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority && i === 0}
          className={`${objectFit === "contain" ? "object-contain" : "object-cover"} transition-opacity duration-700 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </>
  );
}
