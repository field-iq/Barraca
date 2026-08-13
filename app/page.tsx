import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  Camera,
  MapPin,
  MessageCircle,
  Ruler,
  ShoppingBag,
} from "lucide-react";
import { Header } from "@/components/Header";
import { CircularShowcase, type ShowcaseItem } from "@/components/ui/circular-showcase";
import { ParallaxHero } from "@/components/ui/parallax-hero";

const WHATSAPP_URL = "https://wa.me/5491153791654";

const featuredPieces: ShowcaseItem[] = [
  {
    title: "Mesas que reúnen historias",
    eyebrow: "Mesas de comedor",
    description: "Madera, color y marcas que hacen que cada mesa sea única. Piezas sólidas, pensadas para acompañar la vida cotidiana.",
    detail: "Pieza lista para llevar",
    src: "/mesa-2.jpeg",
    alt: "Mesa de comedor artesanal de madera",
    href: "/catalogo",
  },
  {
    title: "Detalles con identidad propia",
    eyebrow: "Mesas ratonas",
    description: "Formatos bajos y versátiles con el carácter de la madera recuperada. Cada terminación conserva una historia distinta.",
    detail: "Madera recuperada",
    src: "/mesa-ratona-1.jpeg",
    alt: "Mesa ratona artesanal con detalles recuperados",
    href: "/catalogo",
  },
  {
    title: "Piezas que ordenan el espacio",
    eyebrow: "Muebles auxiliares",
    description: "Estanterías y muebles de apoyo que combinan guardado, presencia y una terminación artesanal imposible de repetir en serie.",
    detail: "Disponible a confirmar",
    src: "/estanteria-1.jpeg",
    alt: "Estantería artesanal de madera",
    href: "/catalogo",
  },
  {
    title: "Un lugar para bajar el ritmo",
    eyebrow: "Bancos y camastros",
    description: "Piezas amplias y firmes para galerías, livings y rincones de descanso, construidas para durar y disfrutarse.",
    detail: "Consultá disponibilidad",
    src: "/banco-1.jpeg",
    alt: "Banco artesanal de madera",
    href: "/catalogo",
  },
];

const stores = [
  {
    name: "Boulevard Sáenz Peña",
    address: "Boulevard Sáenz Peña 1213, esquina Guareschi",
    hours: "Sábados y domingos de 9 a 19:30",
    map: "https://www.google.com/maps/search/?api=1&query=Boulevard+Saenz+Pena+1213+Tigre",
  },
  {
    name: "Rincón de Milberg",
    address: "Av. Santa María 2148, Rincón de Milberg",
    hours: "Lunes a sábados de 10 a 17",
    map: "https://www.google.com/maps/search/?api=1&query=Av+Santa+Maria+2148+Rincon+de+Milberg",
  },
];

export default function HomePage() {
  return (
    <>
      <Header overlay />
      <main>
        <ParallaxHero />

        <section id="coleccion" className="scroll-mt-4 border-b border-black/10 bg-[#f7f4ee]">
          <div className="mx-auto grid max-w-7xl md:grid-cols-2">
            <Link href="/catalogo" className="group flex min-h-48 items-center gap-5 border-b border-black/10 px-5 py-9 md:border-b-0 md:border-r sm:px-8 lg:px-12">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#233c33] text-white">
                <ShoppingBag size={21} aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="font-serif text-2xl text-walnut sm:text-3xl">Listos para llevar</span>
                <span className="mt-2 block max-w-md text-sm leading-6 text-walnut/65">
                  Piezas construidas, con medidas y precios definidos. Consultá disponibilidad y coordinamos la entrega.
                </span>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#216e4e]">
                  Explorar catálogo <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                </span>
              </span>
            </Link>

            <Link href="/catalogo#a-medida" className="group flex min-h-48 items-center gap-5 px-5 py-9 sm:px-8 lg:px-12">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#b85c3d] text-white">
                <Ruler size={21} aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="font-serif text-2xl text-walnut sm:text-3xl">Hecho a tu medida</span>
                <span className="mt-2 block max-w-md text-sm leading-6 text-walnut/65">
                  Elegí el tipo de mueble y sus dimensiones. Te damos una referencia y confirmamos cada proyecto con vos.
                </span>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#b04d31]">
                  Empezar cotización <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                </span>
              </span>
            </Link>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#f1ede5] py-16 sm:py-24">
          <Image src="/textures/washed-planks.jpg" alt="" fill sizes="100vw" className="object-cover opacity-40" />
          <div aria-hidden="true" className="absolute inset-0 bg-[#f7f4ee]/70" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b04d31]">Piezas reales</p>
                <h2 className="mt-3 max-w-2xl font-serif text-4xl leading-tight text-walnut sm:text-5xl">
                  El carácter está en cada detalle
                </h2>
              </div>
              <Link href="/catalogo" className="inline-flex items-center gap-2 text-sm font-semibold text-walnut hover:text-[#216e4e]">
                Ver todo el catálogo <ArrowRight size={17} />
              </Link>
            </div>
            <div className="mt-8 sm:mt-12">
              <CircularShowcase items={featuredPieces} />
            </div>
          </div>
        </section>

        <section className="grid bg-[#22372f] text-white lg:grid-cols-2">
          <div className="relative min-h-[460px] lg:min-h-[680px]">
            <Image
              src="/textures/red-timber.jpg"
              alt="Tablas de madera recuperada en tonos naturales y rojizos"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </div>
          <div className="flex items-center px-5 py-14 sm:px-10 lg:px-16 lg:py-20">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e4a58d]">A medida</p>
              <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
                Una pieza pensada para tu espacio
              </h2>
              <p className="mt-6 text-base leading-7 text-white/75">
                Mesas, bancos y espejos con las dimensiones que necesitás. Armá una cotización inicial y nos ponemos en contacto para confirmar materiales, terminación y tiempos.
              </p>
              <Link
                href="/catalogo#a-medida"
                className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#e7a181] px-5 text-sm font-semibold text-[#1f2d28] transition hover:bg-[#f0b69c]"
              >
                Cotizar mi mueble <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </section>

        <section id="locales" className="scroll-mt-20 bg-[#f7f4ee]">
          <div className="relative flex min-h-[360px] items-end overflow-hidden text-white sm:min-h-[460px]">
            <Image src="/textures/timber-rings.jpg" alt="Troncos de madera vistos de frente" fill sizes="100vw" className="object-cover object-center" />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-[#1d241f]/90 via-[#1d241f]/55 to-black/15" />
            <div className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
              <div className="max-w-2xl border-l border-white/45 pl-5 sm:pl-8">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/65">Vení a conocernos</p>
                <h2 className="mt-3 font-serif text-4xl sm:text-5xl">Encontranos en Tigre</h2>
                <p className="mt-4 max-w-xl leading-7 text-white/75">
                Visitá nuestros espacios para ver las piezas disponibles. Los envíos y retiros se coordinan una vez confirmado el pedido.
                </p>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <div className="grid gap-px overflow-hidden border border-black/10 bg-black/10 md:grid-cols-2">
              {stores.map((store) => (
                <article key={store.name} className="bg-white p-6 sm:p-8">
                  <MapPin size={22} className="text-[#b04d31]" aria-hidden="true" />
                  <h3 className="mt-5 font-serif text-2xl text-walnut">{store.name}</h3>
                  <p className="mt-2 max-w-md text-sm leading-6 text-walnut/70">{store.address}</p>
                  <p className="mt-4 flex items-start gap-2 text-sm font-medium text-walnut">
                    <Clock3 size={16} className="mt-0.5 shrink-0 text-[#216e4e]" aria-hidden="true" />
                    {store.hours}
                  </p>
                  <a href={store.map} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#216e4e] hover:underline">
                    Cómo llegar <ArrowRight size={16} />
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden px-4 py-16 text-white sm:px-6 sm:py-20">
          <Image src="/textures/blue-boards.jpg" alt="" fill sizes="100vw" className="object-cover" />
          <div aria-hidden="true" className="absolute inset-0 bg-[#182522]/80 mix-blend-multiply" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-black/10" />
          <div className="relative mx-auto flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl">¿Tenés una idea en mente?</h2>
              <p className="mt-2 text-sm text-white/80">Escribinos y la pensamos juntos.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center gap-2 rounded-md bg-white px-5 text-sm font-semibold text-[#77321f]">
                <MessageCircle size={18} /> WhatsApp
              </a>
              <a href="https://www.instagram.com/labarracadejuan_/" target="_blank" rel="noreferrer" className="inline-flex h-12 items-center gap-2 rounded-md border border-white/50 px-5 text-sm font-semibold text-white hover:bg-white/10">
                <Camera size={18} /> Instagram
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#17231f] text-white/65">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-7 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>La Barraca de Juan · Muebles &amp; deco</p>
          <p>Disponibilidad y envíos sujetos a confirmación.</p>
        </div>
      </footer>
    </>
  );
}
