import { notFound } from "next/navigation";
import { StandardItemView } from "@/components/StandardItemView";
import { getVisibleProducts } from "@/lib/catalog";
import { getCatalog } from "@/lib/catalogStore";

interface StandardItemPageProps {
  params: { section: string };
}
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: StandardItemPageProps) {
  const catalog = await getCatalog();
  const item = getVisibleProducts(catalog).find((product) => product.id === params.section);

  if (!item) return { title: "Muebles estándar - La Barraca De Juan" };

  return {
    title: `${item.detailTitle} - La Barraca De Juan`,
    description: item.description,
  };
}

export default async function StandardItemPage({ params }: StandardItemPageProps) {
  const catalog = await getCatalog();
  const item = getVisibleProducts(catalog).find((product) => product.id === params.section);

  if (!item || item.images.length === 0) notFound();

  const category = catalog.categories.find((entry) => entry.id === item.categoryId);

  return (
    <StandardItemView item={item} categoryName={category?.name} categoryNameEn={category?.nameEn} />
  );
}
