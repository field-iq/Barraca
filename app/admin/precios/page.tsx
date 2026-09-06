import {
  getPricingConfig,
  isPricingCloudStorageConfigured,
} from "@/lib/pricing/pricingStore";
import { AdminShell } from "@/components/admin/AdminShell";
import { PricingForm } from "./PricingForm";

export const dynamic = "force-dynamic";

export default async function AdminPreciosPage() {
  const config = await getPricingConfig();

  return (
    <AdminShell title="Muebles a medida" active="precios" externalHref="/catalogo#a-medida" externalLabel="Ver cotizador">
      <PricingForm
        initialConfig={config}
        cloudStorageConfigured={isPricingCloudStorageConfigured()}
      />
    </AdminShell>
  );
}
