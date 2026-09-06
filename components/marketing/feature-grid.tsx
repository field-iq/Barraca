import type { LucideIcon } from 'lucide-react';
export function FeatureGrid({ items }: { items: { icon: LucideIcon; title: string; body: string }[] }) {
  return (
    <section className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(({ icon: Icon, title, body }) => (
        <div key={title} className="rounded-soft bg-nm-surface p-7 shadow-soft">
          <span className="grid size-12 place-items-center rounded-full text-nm-accent shadow-soft-inset-sm"><Icon className="size-5" /></span>
          <h3 className="mt-5 text-xl">{title}</h3><p className="mt-2 text-sm leading-relaxed text-nm-muted">{body}</p>
        </div>
      ))}
    </section>
  );
}
