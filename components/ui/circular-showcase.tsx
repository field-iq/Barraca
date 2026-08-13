"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

export interface ShowcaseItem {
  title: string;
  eyebrow: string;
  description: string;
  detail: string;
  src: string;
  alt: string;
  href: string;
}

interface CircularShowcaseProps {
  items: ShowcaseItem[];
  autoplay?: boolean;
}

export function CircularShowcase({ items, autoplay = true }: CircularShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const itemCount = items.length;

  useEffect(() => {
    if (activeIndex >= itemCount) setActiveIndex(0);
  }, [activeIndex, itemCount]);

  const goTo = useCallback(
    (nextIndex: number, nextDirection: number) => {
      if (itemCount < 2) return;
      setDirection(nextDirection);
      setActiveIndex((nextIndex + itemCount) % itemCount);
    },
    [itemCount],
  );

  const goNext = useCallback(() => {
    setDirection(1);
    setActiveIndex((current) => (current + 1) % itemCount);
  }, [itemCount]);

  const goPrevious = useCallback(() => {
    setDirection(-1);
    setActiveIndex((current) => (current - 1 + itemCount) % itemCount);
  }, [itemCount]);

  useEffect(() => {
    if (!autoplay || paused || reduceMotion || itemCount < 2) return;
    const interval = window.setInterval(goNext, 5500);
    return () => window.clearInterval(interval);
  }, [autoplay, goNext, itemCount, paused, reduceMotion]);

  if (itemCount === 0) return null;

  const activeItem = items[activeIndex];

  function positionFor(index: number) {
    const isActive = index === activeIndex;
    const isPrevious = index === (activeIndex - 1 + itemCount) % itemCount;
    const isNext = index === (activeIndex + 1) % itemCount;

    if (isActive) return { x: "0%", y: "0%", scale: 1, rotate: 0, opacity: 1, zIndex: 3 };
    if (isPrevious) return { x: "-18%", y: "-9%", scale: 0.88, rotate: -3, opacity: 0.72, zIndex: 2 };
    if (isNext) return { x: "18%", y: "-9%", scale: 0.88, rotate: 3, opacity: 0.72, zIndex: 2 };
    return { x: "0%", y: "0%", scale: 0.82, rotate: 0, opacity: 0, zIndex: 1 };
  }

  return (
    <div
      ref={rootRef}
      className="grid min-w-0 items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20"
      role="region"
      aria-roledescription="carrusel"
      aria-label="Piezas destacadas de La Barraca de Juan"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          goPrevious();
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          goNext();
        }
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
    >
      <div className="relative mx-auto h-[430px] min-w-0 w-full max-w-[620px] sm:h-[570px]">
        {items.map((item, index) => {
          const position = positionFor(index);
          const isVisible = position.opacity > 0;
          return (
            <motion.button
              type="button"
              key={item.src}
              className="absolute inset-x-[8%] bottom-0 top-[8%] overflow-hidden bg-sand text-left shadow-[0_24px_70px_rgba(32,25,20,0.2)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b65337] focus-visible:ring-offset-4 sm:inset-x-[13%]"
              animate={position}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => goTo(index, index >= activeIndex ? 1 : -1)}
              aria-label={`Mostrar ${item.title}`}
              aria-hidden={!isVisible}
              tabIndex={isVisible ? 0 : -1}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 1024px) 84vw, 44vw"
                className="object-cover"
              />
              {index === activeIndex && (
                <span className="absolute inset-x-0 bottom-0 bg-black/65 px-5 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-sm">
                  {item.detail}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="flex min-h-[360px] min-w-0 flex-col justify-center">
        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#b65337]">
          <span>{String(activeIndex + 1).padStart(2, "0")}</span>
          <span className="h-px w-10 bg-[#b65337]/40" />
          <span>{String(itemCount).padStart(2, "0")}</span>
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeItem.title}
            custom={direction}
            initial={reduceMotion ? false : { opacity: 0, y: direction * 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: direction * -12 }}
            transition={{ duration: reduceMotion ? 0 : 0.35, ease: "easeOut" }}
            className="mt-7"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-walnut/50">
              {activeItem.eyebrow}
            </p>
            <h3 className="mt-3 max-w-lg font-serif text-4xl leading-tight text-walnut sm:text-5xl">
              {activeItem.title}
            </h3>
            <p className="mt-5 max-w-lg text-base leading-7 text-walnut/65">
              {activeItem.description}
            </p>
          </motion.div>
        </AnimatePresence>

        <Link
          href={activeItem.href}
          className="mt-7 inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#216e4e] hover:underline hover:underline-offset-4"
        >
          Ver en el catálogo <ArrowRight size={17} aria-hidden="true" />
        </Link>

        <div className="mt-10 flex gap-3">
          <button
            type="button"
            onClick={goPrevious}
            disabled={itemCount < 2}
            aria-label="Ver pieza anterior"
            title="Anterior"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-walnut/20 text-walnut transition hover:border-walnut hover:bg-walnut hover:text-white disabled:opacity-40"
          >
            <ArrowLeft size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={itemCount < 2}
            aria-label="Ver pieza siguiente"
            title="Siguiente"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-walnut text-white transition hover:bg-[#216e4e] disabled:opacity-40"
          >
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
