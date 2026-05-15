import Image from "next/image";
import { OFFERS, type Offer } from "@/lib/offers";

export function OffersSection() {
  if (OFFERS.length === 0) {
    return (
      <section
        aria-labelledby="offers-title"
        className=""
      >
        <h2
          id="offers-title"
          className="font-serif text-2xl sm:text-3xl text-walnut text-center"
        >
          Ofertas en stock
        </h2>
        <p className="mt-3 text-center text-walnut/70">
          Próximamente vamos a publicar las piezas disponibles para entrega
          inmediata.
        </p>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="offers-title"
      className=""
    >
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h2
          id="offers-title"
          className="font-serif text-2xl sm:text-3xl text-walnut"
        >
          Ofertas en stock
        </h2>
        <p className="mt-2 text-walnut/70">
          Piezas ya fabricadas, listas para entrega inmediata.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {OFFERS.map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </div>
    </section>
  );
}

function OfferCard({ offer }: { offer: Offer }) {
  return (
    <article className="rounded-2xl border border-sand bg-white overflow-hidden flex flex-col">
      <div className="relative aspect-[4/3] w-full bg-sand">
        <Image
          src={offer.image}
          alt={offer.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
        {offer.badge && (
          <span className="absolute top-3 left-3 text-xs uppercase tracking-wide bg-walnut text-cream rounded-full px-2.5 py-1">
            {offer.badge}
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-serif text-lg text-walnut">{offer.name}</h3>
        <p className="mt-1 text-sm text-walnut/70">{offer.description}</p>

        <div className="mt-4 pt-4 border-t border-sand flex items-baseline gap-3">
          {offer.price > 0 ? (
            <>
              <span className="font-serif text-xl text-walnut">
                {formatARS(offer.price)}
              </span>
              {offer.oldPrice && offer.oldPrice > offer.price && (
                <span className="text-sm text-walnut/50 line-through">
                  {formatARS(offer.oldPrice)}
                </span>
              )}
            </>
          ) : (
            <span className="font-serif text-lg text-walnut/70">
              Consultar precio
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

function formatARS(amount: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(amount);
}
