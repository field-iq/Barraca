import { AdminShell } from "@/components/admin/AdminShell";
import { isCatalogCloudStorageConfigured } from "@/lib/catalogStore";
import { DEFAULT_STORE_PHOTO, getStorePhotoSettings } from "@/lib/storePhotoStore";
import { StorePhotoForm } from "./StorePhotoForm";

export const dynamic = "force-dynamic";

export default async function AdminStorePhotoPage() {
  const settings = await getStorePhotoSettings();

  return (
    <AdminShell title="Foto del local" active="local" externalHref="/#locales" externalLabel="Ver en el sitio">
      <StorePhotoForm
        initialSettings={settings}
        defaultPhotoUrl={DEFAULT_STORE_PHOTO.photoUrl}
        cloudStorageConfigured={isCatalogCloudStorageConfigured()}
      />
    </AdminShell>
  );
}
