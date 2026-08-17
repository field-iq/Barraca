import Link from "next/link";
import { ExternalLink, LogOut, Package, Ruler } from "lucide-react";
import {
  getPricingConfig,
  isPricingCloudStorageConfigured,
} from "@/lib/pricing/pricingStore";
import { PricingForm } from "./PricingForm";

export const dynamic = "force-dynamic";

export default async function AdminPreciosPage() {
  const config = await getPricingConfig();

  return (
    <div className="min-h-screen bg-[#f5f4f1] text-walnut">
      <header className="sticky top-0 z-20 border-b border-sand bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <h1 className="truncate font-serif text-xl">Muebles a medida</h1>
            <p className="text-xs text-walnut/55">La Barraca De Juan</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/catalogo#a-medida"
              target="_blank"
              className="inline-flex h-10 items-center gap-2 rounded-md border border-sand px-3 text-sm hover:bg-sand/40"
            >
              <ExternalLink size={16} aria-hidden="true" />
              <span className="hidden sm:inline">Ver cotizador</span>
            </Link>
            <a
              href="/api/admin/logout"
              className="inline-flex h-10 items-center gap-2 rounded-md border border-sand px-3 text-sm hover:bg-sand/40"
            >
              <LogOut size={16} aria-hidden="true" />
              <span className="hidden sm:inline">Salir</span>
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8">
        <nav className="mb-6 flex gap-1 border-b border-sand" aria-label="Administración">
          <Link
            href="/admin/catalogo"
            className="inline-flex h-11 items-center gap-2 border-b-2 border-transparent px-3 text-sm text-walnut/60 hover:text-walnut"
          >
            <Package size={17} /> Catálogo
          </Link>
          <Link
            href="/admin/precios"
            aria-current="page"
            className="inline-flex h-11 items-center gap-2 border-b-2 border-bark px-3 text-sm font-medium text-bark"
          >
            <Ruler size={17} /> A medida
          </Link>
        </nav>

        <PricingForm
          initialConfig={config}
          cloudStorageConfigured={isPricingCloudStorageConfigured()}
        />
      </main>
    </div>
  );
}
