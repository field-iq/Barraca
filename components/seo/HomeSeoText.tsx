import { HOME_COPY, type SeoLocale } from "@/lib/seo";

/** Texto visible e indexable de la home: es lo que Google lee para saber de qué trata el sitio. */
export function HomeSeoText({ locale }: { locale: SeoLocale }) {
  const copy = HOME_COPY[locale];

  return (
    <section aria-labelledby="home-seo-title" className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 id="home-seo-title" className="font-heading text-4xl text-nm-text sm:text-5xl">
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

        <h2 className="mt-14 font-heading text-3xl text-nm-text">{copy.faqTitle}</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {copy.faq.map((entry) => (
            <div key={entry.question} className="rounded-soft bg-nm-surface p-6 shadow-soft">
              <h3 className="text-base font-semibold text-nm-text">{entry.question}</h3>
              <p className="mt-2 text-sm leading-6 text-nm-muted">{entry.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
