import { getCatalog, isCatalogCloudStorageConfigured } from "@/lib/catalogStore";
import { AdminCatalog } from "./AdminCatalog";

export const dynamic = "force-dynamic";

export default async function AdminCatalogPage() {
  const catalog = await getCatalog();

  return (
    <AdminCatalog
      initialCatalog={catalog}
      cloudStorageConfigured={isCatalogCloudStorageConfigured()}
    />
  );
}
