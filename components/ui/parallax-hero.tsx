"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";

export function ParallaxHero() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="relative -mt-16 min-h-[640px] overflow-hidden bg-[#202522] pt-16 text-[#f8f4ec] sm:min-h-[800px] lg:min-h-[min(900px,100svh)]"
      aria-labelledby="hero-title"
    >
      <motion.div
        className="absolute inset-0 hidden sm:block"
        initial={reduceMotion ? false : { scale: 1.045, opacity: 0.8 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <Image
          src="/hero-la-barraca.png"
          alt="La Barraca de Juan grabado sobre tablas de madera recuperada"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>

      <motion.div
        className="absolute inset-x-0 top-16 aspect-[1538/1023] sm:hidden"
        initial={reduceMotion ? false : { scale: 1.035, opacity: 0.8 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <Image
          src="/hero-la-barraca.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      <div aria-hidden="true" className="absolute inset-0 hidden bg-black/[0.08] sm:block" />
      <div aria-hidden="true" className="absolute inset-x-0 top-16 hidden h-36 bg-gradient-to-b from-black/50 to-transparent sm:block" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 hidden h-[38%] bg-gradient-to-t from-[#151815]/95 via-[#151815]/45 to-transparent sm:block" />

      <div className="relative mx-auto flex min-h-[576px] w-full max-w-7xl flex-col justify-end px-4 pb-7 pt-[calc(66.5vw+2rem)] sm:min-h-[736px] sm:px-6 sm:pb-9 sm:pt-24 lg:min-h-[calc(min(900px,100svh)-4rem)] lg:px-8">
        <h1 id="hero-title" className="sr-only">La Barraca de Juan</h1>

        <motion.div
          className="grid gap-7 border-t border-white/35 pt-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/65">Muebles &amp; objetos con historia</p>
            <p className="mt-3 max-w-md font-serif text-xl leading-snug text-white sm:text-2xl">Piezas únicas, hechas para vivir con vos.</p>
          </div>

          <nav className="flex items-center gap-7" aria-label="Acciones destacadas">
            <HeroLink href="/catalogo">Colección</HeroLink>
            <HeroLink href="/catalogo#a-medida">A medida</HeroLink>
          </nav>
        </motion.div>

        <motion.div
          className="mt-8 flex items-center justify-between text-[9px] font-semibold uppercase tracking-[0.2em] text-white/55"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 1.05 }}
        >
          <span>Tigre · Buenos Aires</span>
          <a href="#coleccion" className="group inline-flex items-center gap-2 transition hover:text-white" aria-label="Continuar hacia la colección">
            <span className="hidden sm:inline">Descubrir</span>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/30 transition group-hover:border-white">
              <ArrowDown size={13} aria-hidden="true" />
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function HeroLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-2 border-b border-white/50 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition hover:border-[#f0b08f] hover:text-[#f0b08f]">
      {children}
      <ArrowUpRight size={14} aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </Link>
  );
}
