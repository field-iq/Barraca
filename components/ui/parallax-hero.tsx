"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

export function ParallaxHero() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="relative -mt-16 flex min-h-[640px] overflow-hidden bg-[#1d2924] px-6 pb-16 pt-32 text-[#f8f4ec] sm:min-h-[720px] sm:px-10 sm:pb-20 sm:pt-36 lg:min-h-[min(820px,100svh)]"
      aria-label="La Barraca de Juan"
    >
      <div aria-hidden="true" className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(248,244,236,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(248,244,236,0.07)_1px,transparent_1px)] [background-size:52px_52px]" />
      <div aria-hidden="true" className="absolute -left-28 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full border border-[#d6b26d]/20 sm:h-[32rem] sm:w-[32rem]" />
      <div aria-hidden="true" className="absolute -right-32 -top-20 h-72 w-72 rounded-full border border-[#d6b26d]/20 sm:h-[26rem] sm:w-[26rem]" />

      <motion.div
        className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center justify-center text-center"
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <Image
          src="/logo.png"
          alt="Logo de La Barraca de Juan"
          width={320}
          height={320}
          priority
          className="h-48 w-48 rounded-full ring-1 ring-[#d6b26d]/70 shadow-[0_16px_42px_rgba(0,0,0,0.35)] sm:h-64 sm:w-64 lg:h-72 lg:w-72"
        />
      </motion.div>
    </section>
  );
}
