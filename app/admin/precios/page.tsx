import { getPricingConfig, isKvConfigured } from "@/lib/pricing/pricingConfig";
import { PricingForm } from "./PricingForm";

export default async function AdminPreciosPage() {
  const config = await getPricingConfig();
  const canEdit = isKvConfigured();

  return (
    <div className="min-h-screen bg-sand/20">
      <header className="bg-white border-b border-sand px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-xl text-walnut">Panel de Precios</h1>
          <p className="text-xs text-walnut/50 mt-0.5">La Barraca De Juan</p>
        </div>
        <a
          href="/api/admin/logout"
          className="text-sm text-bark hover:text-walnut underline underline-offset-4"
        >
          Cerrar sesión
        </a>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <PricingForm config={config} canEdit={canEdit} />
      </main>
    </div>
  );
}
