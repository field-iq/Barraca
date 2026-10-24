import { CONTACT_EMAIL, SITE_URL, WHATSAPP_NUMBER } from "./contactInfo";
import type { CatalogProduct } from "./catalog";

export type SeoLocale = "es" | "en";

export const BUSINESS_NAME = "La Barraca de Juan";

export function toLocale(value: string): SeoLocale {
  return value === "en" ? "en" : "es";
}

/** Ruta pública de una página en el idioma pedido ("/" y "/en" para la home). */
export function localePath(path: string, locale: SeoLocale): string {
  if (locale === "es") return path;
  return path === "/" ? "/en" : `/en${path}`;
}

/** Canonical + hreflang de una página que existe en español e inglés. */
export function pageAlternates(path: string, locale: SeoLocale) {
  return {
    canonical: localePath(path, locale),
    languages: { es: localePath(path, "es"), en: localePath(path, "en"), "x-default": localePath(path, "es") },
  };
}

export const HOME_SEO = {
  es: {
    title: "Muebles de madera a medida en Tigre | La Barraca de Juan",
    description:
      "Muebles de madera maciza y a medida en Tigre: mesas de comedor, mesas ratonas, bancos, estanterías y espejos. Piezas listas para llevar y cotización online. Local en Boulevard Sáenz Peña 1213.",
    h1: "La Barraca de Juan: muebles de madera y muebles a medida en Tigre",
  },
  en: {
    title: "Custom Solid Wood Furniture in Tigre, Argentina | La Barraca de Juan",
    description:
      "Solid wood and custom-made furniture in Tigre, Argentina: dining tables, coffee tables, benches, shelves and mirrors. Ready-to-take-home pieces and online quotes. Store at Boulevard Sáenz Peña 1213.",
    h1: "La Barraca de Juan: wooden and custom-made furniture in Tigre",
  },
} as const;

export const CATALOG_SEO = {
  es: {
    title: "Catálogo de muebles de madera: mesas, bancos, espejos y más",
    description:
      "Mirá el catálogo de La Barraca de Juan: mesas de comedor, mesas ratonas, camastros, estanterías, espejos y cilindros de madera, con precios. También cotizá muebles a medida online.",
    h1: "Catálogo de muebles de madera",
  },
  en: {
    title: "Wooden Furniture Catalog: Tables, Benches, Mirrors and More",
    description:
      "Browse the La Barraca de Juan catalog: dining tables, coffee tables, daybeds, shelves, mirrors and wooden cylinders, with prices. You can also quote custom-made furniture online.",
    h1: "Wooden furniture catalog",
  },
} as const;

export interface HomeSeoCopy {
  heading: string;
  intro: string;
  sections: { title: string; body: string }[];
  faqTitle: string;
  faq: { question: string; answer: string }[];
}

export const HOME_COPY: Record<SeoLocale, HomeSeoCopy> = {
  es: {
    heading: "Muebles de madera hechos a mano en Tigre",
    intro:
      "En La Barraca de Juan fabricamos y vendemos muebles de madera con historia, pensados para durar. Tenemos piezas listas para llevar y también hacemos muebles a medida, para que tu casa, tu quincho o tu local queden como los imaginás.",
    sections: [
      {
        title: "Muebles a medida",
        body: "Diseñamos mesas de comedor, bancos y espejos a medida. Elegís las medidas, cotizás online y te escribimos para confirmar los detalles.",
      },
      {
        title: "Mesas, bancos, estanterías y espejos de madera",
        body: "Trabajamos madera maciza y madera recuperada: reciclamos y reutilizamos materiales para darles una segunda vida dentro de una economía circular. En el catálogo vas a encontrar mesas de comedor, mesas ratonas, camastros, estanterías, espejos y cilindros, cada una con su precio y medidas.",
      },
      {
        title: "Muebles en Tigre, Buenos Aires",
        body: "Nuestro local está en Boulevard Sáenz Peña 1213, esquina Guareschi, en Tigre. Te esperamos los sábados y domingos de 9 a 19:30 para que veas las piezas en persona.",
      },
    ],
    faqTitle: "Preguntas frecuentes",
    faq: [
      {
        question: "¿Hacen muebles a medida?",
        answer:
          "Sí. Hacemos mesas de comedor, bancos y espejos a medida. Podés cotizar online eligiendo las medidas o escribirnos por WhatsApp con tu idea.",
      },
      {
        question: "¿Dónde queda La Barraca de Juan?",
        answer:
          "En Boulevard Sáenz Peña 1213, esquina Guareschi, Tigre, provincia de Buenos Aires. Abrimos sábados y domingos de 9 a 19:30.",
      },
      {
        question: "¿Qué tipo de madera usan?",
        answer:
          "Trabajamos con madera maciza y madera recuperada. Reciclamos y reutilizamos materiales para darles una segunda vida, con terminaciones artesanales pensadas para durar muchos años.",
      },
      {
        question: "¿Tienen muebles listos para llevar?",
        answer:
          "Sí. En el catálogo hay mesas, mesas ratonas, camastros, estanterías, espejos y cilindros en medidas estándar. La disponibilidad está sujeta a confirmación, así que consultanos antes de venir.",
      },
    ],
  },
  en: {
    heading: "Handmade wooden furniture in Tigre",
    intro:
      "At La Barraca de Juan we make and sell wooden furniture with history, built to last. We have ready-to-take-home pieces and we also build custom-made furniture, so your home, patio or shop turns out the way you imagine it.",
    sections: [
      {
        title: "Custom-made furniture",
        body: "We design custom dining tables, benches and mirrors. You choose the dimensions, get an online quote and we get in touch to confirm the details.",
      },
      {
        title: "Wooden tables, benches, shelves and mirrors",
        body: "We work with solid and reclaimed wood: we recycle and reuse materials to give them a second life, as part of a circular economy. In the catalog you will find dining tables, coffee tables, daybeds, shelves, mirrors and cylinders, each with its price and dimensions.",
      },
      {
        title: "Furniture in Tigre, Buenos Aires",
        body: "Our store is at Boulevard Sáenz Peña 1213, corner of Guareschi, in Tigre. We are open Saturdays and Sundays from 9 am to 7:30 pm so you can see the pieces in person.",
      },
    ],
    faqTitle: "Frequently asked questions",
    faq: [
      {
        question: "Do you make custom furniture?",
        answer:
          "Yes. We make custom dining tables, benches and mirrors. You can get an online quote by choosing the dimensions, or message us on WhatsApp with your idea.",
      },
      {
        question: "Where is La Barraca de Juan?",
        answer:
          "At Boulevard Sáenz Peña 1213, corner of Guareschi, Tigre, Buenos Aires province, Argentina. We are open Saturdays and Sundays from 9 am to 7:30 pm.",
      },
      {
        question: "What kind of wood do you use?",
        answer: "We work with solid wood and reclaimed wood. We recycle and reuse materials to give them a second life, with handcrafted finishes made to last for years.",
      },
      {
        question: "Do you have ready-to-take-home furniture?",
        answer:
          "Yes. The catalog has tables, coffee tables, daybeds, shelves, mirrors and cylinders in standard sizes. Availability is subject to confirmation, so please check with us before visiting.",
      },
    ],
  },
};

/** Datos estructurados del negocio local (FurnitureStore). */
export function businessSchema(locale: SeoLocale) {
  return {
    "@context": "https://schema.org",
    "@type": "FurnitureStore",
    "@id": `${SITE_URL}/#business`,
    name: BUSINESS_NAME,
    url: SITE_URL,
    image: [`${SITE_URL}/local-tigre.jpg`, `${SITE_URL}/hero-poster.jpg`],
    logo: `${SITE_URL}/logo.png`,
    description: HOME_SEO[locale].description,
    email: CONTACT_EMAIL,
    telephone: `+${WHATSAPP_NUMBER}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Boulevard Sáenz Peña 1213",
      addressLocality: "Tigre",
      addressRegion: "Buenos Aires",
      addressCountry: "AR",
    },
    areaServed: ["Tigre", "San Fernando", "Nordelta", "Zona Norte", "Buenos Aires"],
    knowsAbout: [
      "muebles de madera",
      "muebles a medida",
      "mesas de comedor",
      "mesas ratonas",
      "bancos de madera",
      "espejos con marco de madera",
      "madera maciza",
      "madera recuperada",
      "madera reciclada",
      "muebles reciclados",
      "reciclaje de madera",
      "reutilización de madera",
      "segunda vida de los materiales",
      "economía circular",
      "muebles sustentables",
      "reclaimed wood furniture",
      "recycled and upcycled furniture",
      "circular economy",
    ],
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Saturday", "Sunday"], opens: "09:00", closes: "19:30" },
    ],
    sameAs: ["https://www.instagram.com/labarracadejuan_/"],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: BUSINESS_NAME,
    url: SITE_URL,
    inLanguage: ["es-AR", "en"],
    publisher: { "@id": `${SITE_URL}/#business` },
  };
}

export function faqSchema(locale: SeoLocale) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale === "en" ? "en" : "es-AR",
    mainEntity: HOME_COPY[locale].faq.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: { "@type": "Answer", text: entry.answer },
    })),
  };
}

export function productSchema(product: CatalogProduct, locale: SeoLocale) {
  const name = locale === "en" && product.detailTitleEn ? product.detailTitleEn : product.detailTitle;
  const description =
    locale === "en" && product.descriptionEn ? product.descriptionEn : product.description;
  const url = `${SITE_URL}${localePath(`/estandar/${product.id}`, locale)}`;
  const price = Math.max(product.listPrice, product.cashPrice);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: product.images.map((image) => (image.startsWith("http") ? image : `${SITE_URL}${image}`)),
    brand: { "@type": "Brand", name: BUSINESS_NAME },
    url,
    ...(price > 0
      ? {
          offers: {
            "@type": "Offer",
            url,
            priceCurrency: "ARS",
            price,
            seller: { "@id": `${SITE_URL}/#business` },
          },
        }
      : {}),
  };
}

export function catalogSchema(products: CatalogProduct[], locale: SeoLocale) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: CATALOG_SEO[locale].h1,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}${localePath(`/estandar/${product.id}`, locale)}`,
      name: locale === "en" && product.nameEn ? product.nameEn : product.name,
    })),
  };
}

export function breadcrumbSchema(crumbs: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${SITE_URL}${crumb.path === "/" ? "" : crumb.path}`,
    })),
  };
}

/** Serializa JSON-LD de forma segura para incrustarlo en un <script>. */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
