"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Camera, Languages } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { StoreCartButton } from "./StoreCartButton";

const WHATSAPP_URL = "https://wa.me/5491153791654";

export function Header({ overlay = false }: { overlay?: boolean }) {
  const { language, toggleLanguage, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!overlay) return;
    function handleScroll() {
      setScrolled(window.scrollY > window.innerHeight * 0.5);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [overlay]);

  // On the home page the header floats transparent over the hero photo, then
  // solidifies once you scroll past it so text stays readable over the
  // lighter sections below. Other pages are always solid.
  const transparent = overlay && !scrolled;

  return (
    <header
      className={`z-40 transition-colors duration-300 ${overlay ? "fixed inset-x-0 top-0" : "sticky top-0"} ${
        transparent
          ? "border-b border-white/20 bg-black/10 text-white backdrop-blur-sm"
          : "border-b border-black/10 bg-[#f7f4ee]/95 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1800px] items-center gap-2 px-4 sm:gap-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 flex-1 items-center gap-3.5" aria-label={t("header.homeAriaLabel")}>
          <span className={`relative h-9 w-9 shrink-0 overflow-hidden rounded-full ${transparent ? "ring-1 ring-white/30" : "bg-black"}`}>
            <Image
              src="/logo.jpg"
              alt="Logo de La Barraca de Juan"
              fill
              sizes="44px"
              className="object-cover"
              priority
            />
          </span>
          <span className="min-w-0 leading-none">
            <span className={`block truncate font-serif text-lg sm:text-[1.35rem] transition-colors duration-300 ${transparent ? "text-white" : "text-walnut"}`}>
              La Barraca <em className="font-normal text-[#e9b298]">de Juan</em>
            </span>
            <span className={`mt-1 hidden text-[9px] font-medium uppercase tracking-[0.22em] sm:block transition-colors duration-300 ${transparent ? "text-white/55" : "text-bark/65"}`}>
              {t("header.tagline")}
            </span>
          </span>
        </Link>

        <nav className={`hidden items-center gap-6 text-sm font-medium lg:flex transition-colors duration-300 ${transparent ? "text-white/80" : "text-walnut/75"}`} aria-label="Principal">
          <Link href="/catalogo" className={`transition ${transparent ? "hover:text-white" : "hover:text-walnut"}`}>{t("header.nav.ready")}</Link>
          <Link href="/catalogo#a-medida" className={`transition ${transparent ? "hover:text-white" : "hover:text-walnut"}`}>{t("header.nav.custom")}</Link>
          <Link href="/#locales" className={`transition ${transparent ? "hover:text-white" : "hover:text-walnut"}`}>{t("header.nav.stores")}</Link>
          <a
            href="https://www.instagram.com/labarracadejuan_/"
            target="_blank"
            rel="noreferrer"
            aria-label={t("header.instagramAriaLabel")}
            title="Instagram"
            className={`inline-flex h-10 w-10 items-center justify-center rounded-md transition ${transparent ? "hover:bg-white/10" : "hover:bg-black/5"}`}
          >
            <Camera size={18} strokeWidth={1.6} aria-hidden="true" />
          </a>
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-1 lg:gap-3">
          <button
            type="button"
            onClick={toggleLanguage}
            title={t("header.languageToggle")}
            aria-label={t("header.languageToggle")}
            className={`inline-flex h-10 items-center justify-center gap-1.5 rounded-md px-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] transition ${
              transparent
                ? "text-white/85 hover:text-white"
                : "border border-sand bg-white text-walnut hover:bg-sand/40"
            }`}
          >
            <Languages size={16} strokeWidth={1.7} aria-hidden="true" />
            {language === "es" ? "EN" : "ES"}
          </button>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className={`inline-flex h-10 items-center justify-center px-3 text-[11px] font-semibold uppercase tracking-[0.14em] transition ${
              transparent
                ? "text-white/85 hover:text-white"
                : "rounded-md bg-[#216e4e] text-white hover:bg-[#195b40]"
            }`}
            aria-label={t("header.consultAriaLabel")}
          >
            <span className="inline text-[9px] sm:text-[11px]">{t("header.consult")}</span>
          </a>
          <StoreCartButton overlay={transparent} />
        </div>
      </div>
    </header>
  );
}
