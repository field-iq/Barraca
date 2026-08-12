import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { AddToStoreCartButton } from "@/components/AddToStoreCartButton";
import { getVisibleProducts } from "@/lib/catalog";
import { getCatalog } from "@/lib/catalogStore";
import { formatARS } from "@/lib/format";

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
  const [mainImage, ...secondaryImages] = item.images;
  const savings = Math.max(0, item.listPrice - item.cashPrice);
  const discountPercentage = item.listPrice > 0
    ? Math.max(0, Math.round((savings / item.listPrice) * 100))
    : 0;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
        <Link
          href="/"
          className="text-sm text-bark underline underline-offset-4 hover:text-walnut"
        >
          Volver a muebles estándar
        </Link>

        <section className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <p className="text-xs uppercase text-bark/70">
              {category?.name ?? "La Barraca De Juan"}
            </p>
            <h1 className="mt-2 font-serif text-4xl text-walnut sm:text-5xl">
              {item.detailTitle}
            </h1>
            <p className="mt-4 text-lg text-walnut/75">{item.description}</p>
            <p className="mt-5 leading-7 text-walnut/75">{item.detailDescription}</p>
          </div>

          <div className="overflow-hidden rounded-lg border border-sand bg-white">
            <div className="p-4">
              <h2 className="font-serif text-xl text-walnut">Precio y medidas</h2>
              <dl className="mt-4 text-sm">
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-walnut/50">Medidas</dt>
                  <dd className="text-right font-medium text-walnut">{item.dimensions}</dd>
                </div>
              </dl>
            </div>

            <div className="bg-walnut px-5 py-5 text-cream">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs font-medium uppercase">Precio especial en efectivo</p>
                {discountPercentage > 0 && (
                  <p className="rounded-md bg-emerald-700 px-3 py-1.5 text-sm font-bold text-white">
                    {discountPercentage}% OFF
                  </p>
                )}
              </div>
              <p className="mt-1 font-serif text-4xl">{formatARS(item.cashPrice)}</p>
              <p className="mt-2 text-sm text-cream/70">
                Antes: <span className="line-through">{formatARS(item.listPrice)}</span>
              </p>
              {savings > 0 && (
                <p className="mt-4 inline-flex rounded-md bg-emerald-700 px-3 py-2 text-sm font-semibold text-white">
                  Ahorr&aacute;s {formatARS(savings)} pagando en efectivo
                </p>
              )}
              <div className="mt-4 border-t border-cream/20 pt-4">
                <AddToStoreCartButton productId={item.id} fullWidth />
              </div>
            </div>
          </div>
        </section>

        <section aria-label={`Fotos de ${item.detailTitle}`} className="mt-10">
          <div className="relative mx-auto aspect-[3/4] w-full max-w-2xl overflow-hidden rounded-lg bg-sand">
            <Image
              src={mainImage}
              alt={item.imageAlt}
              fill
              sizes="(max-width: 672px) 100vw, 672px"
              className="object-contain"
              priority
            />
          </div>

          {secondaryImages.length > 0 && (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {secondaryImages.map((image, index) => (
                <div key={image} className="relative aspect-[3/4] overflow-hidden rounded-lg bg-sand">
                  <Image
                    src={image}
                    alt={`${item.imageAlt} ${index + 2}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
