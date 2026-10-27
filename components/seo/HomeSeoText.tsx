import { Accordion } from "@/components/ui/accordion";
import { HOME_COPY, type SeoLocale } from "@/lib/seo";

/** Texto visible e indexable sobre el negocio: vive en Quiénes somos y es lo que Google lee para saber de qué trata el sitio. */
export function AboutSeoText({ locale }: { locale: SeoLocale }) {
  const copy = HOME_COPY[locale];

  return (
    <section aria-labelledby="about-seo-title" className="px-4 pb-10 sm:px-6 sm:pb-14 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 id="about-seo-title" className="font-heading text-3xl text-nm-text sm:text-4xl">
          {copy.heading}
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-7 text-nm-muted">{copy.intro}</p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {copy.sections.map((section) => (
            <article key={section.title} className="rounded-soft bg-nm-surface p-6 shadow-soft">
              <h3 className="font-heading text-xl text-nm-text">{section.title}</h3>
              <p className="mt-3 text-sm leading-6 text-nm-muted">{section.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Preguntas frecuentes de la home: se ve la pregunta y al tocarla se despliega la respuesta. */
export function HomeFaq({ locale }: { locale: SeoLocale }) {
  const copy = HOME_COPY[locale];

  return (
    <section aria-labelledby="home-faq-title" className="px-4 pb-10 sm:px-6 sm:pb-14 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h2 id="home-faq-title" className="font-heading text-3xl text-nm-text sm:text-4xl">
          {copy.faqTitle}
        </h2>
        <Accordion
          className="mt-8"
          items={copy.faq.map((entry) => ({
            id: entry.question,
            title: entry.question,
            content: entry.answer,
          }))}
        />
      </div>
    </section>
  );
}
