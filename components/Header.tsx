"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Camera, Languages, MessageCircle, Menu, Moon, ShoppingBag, Sparkles, Sun } from "lucide-react";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { WHATSAPP_URL } from "@/lib/contactInfo";
import { LANGUAGE_COOKIE } from "@/lib/i18n/preferredLanguage";
import { useLanguage, withLocalePrefix } from "@/lib/i18n/LanguageContext";
import { useStoreCart } from "./StoreCartProvider";
import { useTheme } from "@/components/ui/theme-provider";
import { IconButton } from "@/components/ui/icon-button";
import { MobileMenu } from "@/components/nav/mobile-menu";
import type { NavLink } from "@/components/nav/navbar";


export function Header() {
  const { language, t } = useLanguage();
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const { itemCount, openCart } = useStoreCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [consultOpen, setConsultOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const consultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!consultOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!consultRef.current?.contains(event.target as Node)) setConsultOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [consultOpen]);

  const otherLanguage = language === "es" ? "en" : "es";
  // usePathname() can report either the external URL ("/catalogo") or the
  // internal one the middleware rewrites Spanish requests to ("/es/catalogo")
  // depending on the route — strip either locale segment so the toggle
  // target is built from the bare path either way.
  const pathWithoutLocale = pathname.replace(/^\/(en|es)(?=\/|$)/, "") || "/";
  const toggleHref = withLocalePrefix(pathWithoutLocale, otherLanguage);

  const links: NavLink[] = [
    { label: t("header.nav.ready"), href: withLocalePrefix("/catalogo", language) },
    { label: t("header.nav.custom"), href: withLocalePrefix("/catalogo#a-medida", language) },
    { label: t("header.nav.about"), href: withLocalePrefix("/quienes-somos", language) },
    { label: t("header.nav.stores"), href: withLocalePrefix("/#locales", language) },
  ];

  return (
    <>
      <header className="sticky top-4 z-40 mx-4 flex h-16 items-center gap-3 rounded-pill bg-nm-surface px-4 pl-5 shadow-soft sm:mx-6 sm:gap-4 sm:px-5 lg:mx-auto lg:max-w-[1200px]">
        <Link href={withLocalePrefix("/", language)} className="flex min-w-0 items-center gap-3" aria-label={t("header.homeAriaLabel")}>
          <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full shadow-soft-inset-sm">
            <Image src="/logo.jpg" alt="Logo de La Barraca de Juan" fill sizes="44px" className="object-cover" priority />
          </span>
          <span className="hidden min-w-0 leading-none sm:block">
            <span className="block truncate font-heading text-lg text-nm-text">
              La Barraca <span className="text-nm-accent">de Juan</span>
            </span>
          </span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex" aria-label="Principal">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="nm-transition rounded-pill px-4 py-2 text-sm font-medium text-nm-muted hover:text-nm-text hover:shadow-soft-sm">
              {l.label}
            </Link>
          ))}
          <a
            href="https://www.instagram.com/labarracadejuan_/"
            target="_blank"
            rel="noreferrer"
            aria-label={t("header.instagramAriaLabel")}
            title="Instagram"
            className="nm-transition rounded-pill p-2.5 text-nm-muted hover:text-nm-text hover:shadow-soft-sm"
          >
            <Camera size={17} strokeWidth={1.6} aria-hidden="true" />
          </a>
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
          <a
            href={toggleHref}
            title={t("header.languageToggle")}
            aria-label={t("header.languageToggle")}
            // A plain link (no prefetch) so the cookie below is saved before the next request.
            onClick={() => {
              // Remember the choice so the phone's language doesn't override it on the next visit.
              document.cookie = `${LANGUAGE_COOKIE}=${otherLanguage}; path=/; max-age=31536000; samesite=lax`;
            }}
            className="nm-transition inline-flex h-9 items-center justify-center gap-1.5 rounded-pill px-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-nm-muted shadow-soft-sm hover:text-nm-text"
          >
            <Languages size={15} strokeWidth={1.7} aria-hidden="true" className="hidden sm:block" />
            {language === "es" ? "EN" : "ES"}
          </a>

          <div ref={consultRef} className="relative hidden sm:block">
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={consultOpen}
              aria-label={t("header.consultAriaLabel")}
              onClick={() => setConsultOpen((v) => !v)}
              className="nm-transition inline-flex h-9 items-center justify-center gap-1.5 rounded-pill bg-nm-accent px-3.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-nm-accent-fg shadow-soft hover:brightness-105"
            >
              <MessageCircle size={15} aria-hidden="true" />
              {t("header.consult")}
            </button>
            {consultOpen && (
              <div role="menu" className="absolute right-0 top-full z-50 mt-3 grid w-64 gap-1 rounded-soft bg-nm-surface p-2 shadow-soft-lg">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => { setConsultOpen(false); setChatOpen(true); }}
                  className="nm-transition flex items-center gap-3 rounded-soft px-3 py-2.5 text-left text-sm font-medium text-nm-text hover:shadow-soft-sm"
                >
                  <Sparkles size={16} className="text-nm-accent" aria-hidden="true" />
                  {t("chat.menu.chat")}
                </button>
                <a
                  role="menuitem"
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setConsultOpen(false)}
                  className="nm-transition flex items-center gap-3 rounded-soft px-3 py-2.5 text-sm font-medium text-nm-text hover:shadow-soft-sm"
                >
                  <MessageCircle size={16} className="text-nm-accent" aria-hidden="true" />
                  {t("chat.menu.whatsapp")}
                </a>
              </div>
            )}
          </div>

          <IconButton size="sm" label={theme === "dark" ? t("header.themeToLight") : t("header.themeToDark")} onClick={toggle}>
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </IconButton>

          <span className="relative">
            <IconButton
              size="sm"
              label={itemCount === 1 ? t("storeCartButton.ariaLabelOne") : t("storeCartButton.ariaLabelMany", { count: itemCount })}
              onClick={openCart}
            >
              <ShoppingBag className="size-4" />
            </IconButton>
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-nm-accent text-[10px] font-bold text-nm-accent-fg">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </span>

          <IconButton size="sm" label={t("header.menuAriaLabel")} className="lg:hidden" onClick={() => setMenuOpen(true)}>
            <Menu className="size-4" />
          </IconButton>
        </div>
      </header>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        links={links}
        ctaLabel={t("header.consult")}
        onCtaClick={() => setChatOpen(true)}
      />

      <ChatWidget open={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
}
