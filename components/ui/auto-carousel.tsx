'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { IconButton } from '@/components/ui/icon-button';

export interface CarouselItem { key: string; node: ReactNode }

/** Pixeles que hay que arrastrar para que el gesto cuente como deslizar y no como un toque. */
const SWIPE_THRESHOLD = 40;

/**
 * Carrusel que avanza solo (se pausa al tocarlo o pasar el mouse) y también se maneja a mano:
 * flechas en todos los tamaños y arrastre con el dedo en el celular.
 * Muestra `perViewWide` elementos en pantallas anchas y `perViewMobile` (1 por defecto) en el celular.
 */
export function AutoCarousel({ items, intervalMs = 3000, perViewWide = 3, perViewMobile = 1, framed = false, previousLabel = 'Previous', nextLabel = 'Next' }: {
  items: CarouselItem[];
  intervalMs?: number;
  perViewWide?: number;
  perViewMobile?: number;
  framed?: boolean;
  previousLabel?: string;
  nextLabel?: string;
}) {
  const [perView, setPerView] = useState(perViewMobile);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const horizontal = useRef(false);

  useEffect(() => {
    const query = window.matchMedia('(min-width: 768px)');
    const update = () => setPerView(query.matches ? perViewWide : perViewMobile);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, [perViewWide, perViewMobile]);

  const lastIndex = Math.max(0, items.length - perView);
  const current = Math.min(index, lastIndex);

  useEffect(() => {
    if (paused || lastIndex === 0) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => setIndex((i) => (Math.min(i, lastIndex) >= lastIndex ? 0 : i + 1)), intervalMs);
    return () => window.clearInterval(id);
  }, [paused, lastIndex, intervalMs, current]);

  const step = (delta: number) => setIndex((current + delta + lastIndex + 1) % (lastIndex + 1));

  function endDrag(commit: boolean) {
    const moved = dragX;
    touchStart.current = null;
    horizontal.current = false;
    setDragging(false);
    setDragX(0);
    setPaused(false);
    if (commit && Math.abs(moved) > SWIPE_THRESHOLD) step(moved < 0 ? 1 : -1);
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={(event) => {
        const touch = event.touches[0];
        touchStart.current = { x: touch.clientX, y: touch.clientY };
        horizontal.current = false;
        setPaused(true);
      }}
      onTouchMove={(event) => {
        const start = touchStart.current;
        if (!start) return;
        const touch = event.touches[0];
        const dx = touch.clientX - start.x;
        const dy = touch.clientY - start.y;
        // Solo arrastra si el gesto es claramente horizontal; si es vertical, la página hace scroll.
        if (!horizontal.current) {
          if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(dy)) return;
          horizontal.current = true;
          setDragging(true);
        }
        setDragX(dx);
      }}
      onTouchEnd={() => endDrag(horizontal.current)}
      onTouchCancel={() => endDrag(false)}
    >
      <div className={framed ? 'overflow-hidden rounded-soft-lg p-3 shadow-soft-inset sm:p-4' : '-mx-2 overflow-hidden px-2 py-4 sm:-mx-3 sm:px-3'}>
        <ul
          className={`flex touch-pan-y items-stretch ${dragging ? '' : 'transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none'}`}
          style={{ transform: `translateX(calc(-${(current * 100) / perView}% + ${dragX}px))` }}
        >
          {items.map((item) => (
            <li key={item.key} className="min-w-0 shrink-0 px-2 sm:px-3" style={{ flexBasis: `${100 / perView}%` }}>
              {item.node}
            </li>
          ))}
        </ul>
      </div>

      {lastIndex > 0 && (
        <>
          {/* Pantallas anchas: flechas a los costados. */}
          <IconButton label={previousLabel} className="absolute -left-5 top-1/2 hidden -translate-y-1/2 sm:flex" onClick={() => step(-1)}>
            <ChevronLeft className="size-5" />
          </IconButton>
          <IconButton label={nextLabel} className="absolute -right-5 top-1/2 hidden -translate-y-1/2 sm:flex" onClick={() => step(1)}>
            <ChevronRight className="size-5" />
          </IconButton>

          {/* Celular: flechas a los lados del indicador, debajo del carrusel. */}
          <div className="mt-2 flex items-center justify-center gap-5">
            <IconButton size="sm" label={previousLabel} className="sm:hidden" onClick={() => step(-1)}>
              <ChevronLeft className="size-4" />
            </IconButton>
            {lastIndex + 1 > 10 ? (
              <p className="min-w-12 text-center text-xs font-medium text-nm-muted" aria-hidden="true">
                {current + 1} / {lastIndex + 1}
              </p>
            ) : (
              <div className="flex justify-center gap-2" aria-hidden="true">
                {Array.from({ length: lastIndex + 1 }, (_, i) => (
                  <span key={i} className={`h-2 rounded-full bg-nm-accent transition-all ${i === current ? 'w-6 opacity-100' : 'w-2 opacity-30'}`} />
                ))}
              </div>
            )}
            <IconButton size="sm" label={nextLabel} className="sm:hidden" onClick={() => step(1)}>
              <ChevronRight className="size-4" />
            </IconButton>
          </div>
        </>
      )}
    </div>
  );
}
