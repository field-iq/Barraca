import Image from "next/image";
import Link from "next/link";
import { Camera } from "lucide-react";
import { StoreCartButton } from "./StoreCartButton";

const WHATSAPP_URL = "https://wa.me/5491153791654";

export function Header({ overlay = false }: { overlay?: boolean }) {
  return (
    <header
      className={
        overlay
          ? "absolute inset-x-0 top-0 z-40 border-b border-white/20 bg-black/10 text-white backdrop-blur-sm"
          : "sticky top-0 z-40 border-b border-black/10 bg-[#f7f4ee]/95 backdrop-blur-md"
      }
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-2 px-4 sm:gap-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 flex-1 items-center gap-3.5" aria-label="Ir al inicio">
          <span className={`relative h-9 w-9 shrink-0 overflow-hidden rounded-full ${overlay ? "ring-1 ring-white/30" : "bg-black"}`}>
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
            <span className={`block truncate font-serif text-lg sm:text-[1.35rem] ${overlay ? "text-white" : "text-walnut"}`}>
              La Barraca <em className="font-normal text-[#e9b298]">de Juan</em>
            </span>
            <span className={`mt-1 hidden text-[9px] font-medium uppercase tracking-[0.22em] sm:block ${overlay ? "text-white/55" : "text-bark/65"}`}>
              Muebles · objetos · oficio
            </span>
          </span>
        </Link>

        <nav className={`hidden items-center gap-6 text-sm font-medium lg:flex ${overlay ? "text-white/80" : "text-walnut/75"}`} aria-label="Principal">
          <Link href="/catalogo" className={`transition ${overlay ? "hover:text-white" : "hover:text-walnut"}`}>Listos para llevar</Link>
          <Link href="/catalogo#a-medida" className={`transition ${overlay ? "hover:text-white" : "hover:text-walnut"}`}>A medida</Link>
          <Link href="/#locales" className={`transition ${overlay ? "hover:text-white" : "hover:text-walnut"}`}>Locales</Link>
          <a
            href="https://www.instagram.com/labarracadejuan_/"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram de La Barraca de Juan"
            title="Instagram"
            className={`inline-flex h-10 w-10 items-center justify-center rounded-md transition ${overlay ? "hover:bg-white/10" : "hover:bg-black/5"}`}
          >
            <Camera size={18} strokeWidth={1.6} aria-hidden="true" />
          </a>
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-1 lg:gap-3">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className={`inline-flex h-10 items-center justify-center px-3 text-[11px] font-semibold uppercase tracking-[0.14em] transition ${
              overlay
                ? "text-white/85 hover:text-white"
                : "rounded-md bg-[#216e4e] text-white hover:bg-[#195b40]"
            }`}
            aria-label="Consultar por WhatsApp"
          >
            <span className="inline text-[9px] sm:text-[11px]">Consultar</span>
          </a>
          <StoreCartButton overlay={overlay} />
        </div>
      </div>
    </header>
  );
}
