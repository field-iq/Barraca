import { Button } from '@/components/ui/button';
export function PromoBanner({ kicker, title, cta, onCta }: { kicker: string; title: string; cta: string; onCta?: () => void }) {
  return (
    <section className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 rounded-soft-lg bg-nm-accent p-10 text-nm-accent-fg shadow-soft-lg md:flex-row md:items-center">
      <div><p className="text-xs font-semibold uppercase tracking-[.16em] opacity-80">{kicker}</p><h2 className="mt-2 text-3xl md:text-4xl">{title}</h2></div>
      <Button size="lg" onClick={onCta} className="bg-nm-bg text-nm-text shadow-[6px_6px_14px_rgba(0,0,0,.25),-6px_-6px_14px_rgba(255,255,255,.15)]">{cta}</Button>
    </section>
  );
}
