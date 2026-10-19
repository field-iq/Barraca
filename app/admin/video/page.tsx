import { AdminShell } from "@/components/admin/AdminShell";
import { isCatalogCloudStorageConfigured } from "@/lib/catalogStore";
import { getHeroSettings } from "@/lib/heroStore";
import { HeroVideoForm } from "./HeroVideoForm";

export const dynamic = "force-dynamic";

export default async function AdminVideoPage() {
  const settings = await getHeroSettings();

  return (
    <AdminShell title="Video del inicio" active="video" externalHref="/" externalLabel="Ver inicio">
      <HeroVideoForm initialSettings={settings} cloudStorageConfigured={isCatalogCloudStorageConfigured()} />
    </AdminShell>
  );
}
