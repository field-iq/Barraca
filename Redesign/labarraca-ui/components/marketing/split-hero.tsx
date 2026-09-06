import { Button } from '@/components/ui/button';
export function SplitHero({ title, body, stats }: { title: string; body: string; stats: { value: string; label: string }[] }) {
  return (
    <section className="mx-auto max-w-6xl rounded-soft-lg bg-nm-surface p-10 shadow-soft md:p-16">
      <div className="grid gap-10 md:grid-cols-[1.2fr_1fr]">
        <div><h2 className="text-4xl md:text-6xl">{title}</h2><p className="mt-6 max-w-lg text-lg text-nm-muted">{body}</p><Button variant="accent" size="lg" className="mt-8">Start your piece</Button></div>
        <dl className="grid content-start gap-4 sm:grid-cols-2">
          {stats.map(s => <div key={s.label} className="rounded-soft p-6 shadow-soft-inset"><dt className="text-xs uppercase tracking-wider text-nm-muted">{s.label}</dt><dd className="mt-2 font-heading text-4xl text-nm-accent">{s.value}</dd></div>)}
        </dl>
      </div>
    </section>
  );
}
