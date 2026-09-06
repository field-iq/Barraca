'use client';
import { cn } from '@/lib/cn';
export interface GalleryImage { src: string; alt: string; span?: 'wide' | 'tall' }
export function GalleryGrid({ images, onOpen }: { images: GalleryImage[]; onOpen?: (i: number) => void }) {
  return (
    <div className="grid auto-rows-[200px] grid-cols-2 gap-5 md:grid-cols-4">
      {images.map((im, i) => (
        <button key={im.src} onClick={() => onOpen?.(i)} className={cn('group rounded-soft p-3 shadow-soft nm-transition hover:shadow-soft-lg', im.span === 'wide' && 'col-span-2', im.span === 'tall' && 'row-span-2')}>
          <img src={im.src} alt={im.alt} className="size-full rounded-soft-sm object-cover shadow-soft-inset nm-transition group-hover:brightness-105" />
        </button>
      ))}
    </div>
  );
}
