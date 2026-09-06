export interface CtaLink { label: string; href: string; icon?: React.ReactNode }

export function CtaSection({ title, body, primary, secondary }: { title: string; body: string; primary: CtaLink; secondary?: CtaLink }) {
  return (
    <section className="mx-auto max-w-3xl rounded-soft-lg p-12 text-center shadow-soft-inset-lg">
      <h2 className="text-4xl">{title}</h2>
      <p className="mx-auto mt-4 max-w-md text-nm-muted">{body}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <a
          href={primary.href}
          target="_blank"
          rel="noreferrer"
          className="nm-transition inline-flex h-14 items-center justify-center gap-2.5 rounded-pill bg-nm-accent px-8 text-base font-semibold text-nm-accent-fg shadow-soft hover:brightness-105 active:shadow-soft-inset-sm active:brightness-95"
        >
          {primary.icon}
          {primary.label}
        </a>
        {secondary && (
          <a
            href={secondary.href}
            target="_blank"
            rel="noreferrer"
            className="nm-transition inline-flex h-14 items-center justify-center gap-2.5 rounded-pill bg-nm-surface px-8 text-base font-semibold text-nm-text shadow-soft hover:shadow-soft-lg active:shadow-soft-inset-sm"
          >
            {secondary.icon}
            {secondary.label}
          </a>
        )}
      </div>
    </section>
  );
}
