import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface HeroCta { label: string; href: string }

export function Hero({
  eyebrow,
  title,
  body,
  image,
  imageAlt,
  primaryCta,
  secondaryCta,
}: {
  eyebrow: string;
  title: React.ReactNode;
  body: string;
  image: string;
  imageAlt: string;
  primaryCta?: HeroCta;
  secondaryCta?: HeroCta;
}) {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 lg:px-8">
      <div className="grid gap-7">
        <Badge tone="accent">{eyebrow}</Badge>
        <h1 className="text-5xl leading-[1.05] md:text-7xl">{title}</h1>
        <p className="max-w-md text-lg leading-relaxed text-nm-muted">{body}</p>
        <div className="flex flex-wrap gap-4">
          {primaryCta && (
            <Link
              href={primaryCta.href}
              className="nm-transition inline-flex h-14 items-center justify-center gap-3 rounded-pill bg-nm-accent px-8 text-base font-semibold text-nm-accent-fg shadow-soft hover:brightness-105 active:shadow-soft-inset-sm active:brightness-95"
            >
              {primaryCta.label} <ArrowRight className="size-4" />
            </Link>
          )}
          {secondaryCta && (
            <Link
              href={secondaryCta.href}
              className="nm-transition inline-flex h-14 items-center justify-center rounded-pill bg-nm-surface px-8 text-base font-semibold text-nm-text shadow-soft hover:shadow-soft-lg active:shadow-soft-inset-sm"
            >
              {secondaryCta.label}
            </Link>
          )}
        </div>
      </div>
      <div className="rounded-soft-lg p-4 shadow-soft"><img src={image} alt={imageAlt} className="aspect-[4/5] w-full rounded-soft object-cover shadow-soft-inset" /></div>
    </section>
  );
}
