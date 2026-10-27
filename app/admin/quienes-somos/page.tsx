import { AdminShell } from "@/components/admin/AdminShell";
import { DEFAULT_ABOUT, getAboutSettings } from "@/lib/aboutStore";
import { isCatalogCloudStorageConfigured } from "@/lib/catalogStore";
import { AboutForm } from "./AboutForm";

export const dynamic = "force-dynamic";

export default async function AdminAboutPage() {
  const settings = await getAboutSettings();

  return (
    <AdminShell title="Quiénes somos" active="about" externalHref="/quienes-somos" externalLabel="Ver en el sitio">
      <AboutForm
        initialSettings={settings}
        defaults={DEFAULT_ABOUT}
        cloudStorageConfigured={isCatalogCloudStorageConfigured()}
      />
    </AdminShell>
  );
}
