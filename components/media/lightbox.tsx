'use client';
import { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { IconButton } from '@/components/ui/icon-button';
import type { GalleryImage } from './gallery-grid';
export function Lightbox({ images, index, onClose, onIndex }: { images: GalleryImage[]; index: number | null; onClose: () => void; onIndex: (i: number) => void }) {
  useEffect(() => { const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); if (index !== null && e.key === 'ArrowRight') onIndex((index + 1) % images.length); if (index !== null && e.key === 'ArrowLeft') onIndex((index - 1 + images.length) % images.length); }; addEventListener('keydown', k); return () => removeEventListener('keydown', k); }, [index, images.length, onClose, onIndex]);
  if (index === null) return null;
  const im = images[index];
  return (
    <div role="dialog" aria-modal className="fixed inset-0 z-50 grid place-items-center bg-nm-bg/90 p-6 backdrop-blur-md animate-nm-in" onClick={onClose}>
      <div className="relative max-w-5xl rounded-soft-lg bg-nm-surface p-4 shadow-soft-lg" onClick={e => e.stopPropagation()}>
        <img src={im.src} alt={im.alt} className="max-h-[80vh] rounded-soft object-contain shadow-soft-inset" />
        <p className="mt-3 px-2 text-sm text-nm-muted">{im.alt} · {index + 1} / {images.length}</p>
        <IconButton label="Close" size="sm" className="absolute -right-3 -top-3" onClick={onClose}><X className="size-4" /></IconButton>
        <IconButton label="Previous" className="absolute -left-5 top-1/2 -translate-y-1/2" onClick={() => onIndex((index - 1 + images.length) % images.length)}><ChevronLeft className="size-5" /></IconButton>
        <IconButton label="Next" className="absolute -right-5 top-1/2 -translate-y-1/2" onClick={() => onIndex((index + 1) % images.length)}><ChevronRight className="size-5" /></IconButton>
      </div>
    </div>
  );
}
