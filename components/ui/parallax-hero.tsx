"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

export function ParallaxHero() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="relative -mt-16 h-[calc(66.5vw+4rem)] overflow-hidden bg-[#202522] text-[#f8f4ec] sm:h-auto sm:min-h-[800px] sm:pt-16 lg:min-h-[min(900px,100svh)]"
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

      <h1 id="hero-title" className="sr-only">La Barraca de Juan</h1>
    </section>
  );
}
