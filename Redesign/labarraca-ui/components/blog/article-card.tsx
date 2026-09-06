import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
export interface Article { slug: string; title: string; excerpt: string; category: string; date: string; readTime: string; image: string }
export function ArticleCard({ a, featured }: { a: Article; featured?: boolean }) {
  return (
    <article className={featured ? 'grid gap-6 rounded-soft-lg bg-nm-surface p-5 shadow-soft md:grid-cols-2 md:items-center' : 'grid gap-4 rounded-soft bg-nm-surface p-4 shadow-soft nm-transition hover:shadow-soft-lg'}>
      <img src={a.image} alt="" className={featured ? 'aspect-[4/3] w-full rounded-soft object-cover shadow-soft-inset' : 'aspect-[16/10] w-full rounded-soft-sm object-cover shadow-soft-inset'} />
      <div className="grid gap-3 px-2 pb-2">
        <div className="flex items-center gap-3"><Badge tone="accent" sunken>{a.category}</Badge><span className="text-xs text-nm-muted">{a.date} · {a.readTime}</span></div>
        <Link href={`/journal/${a.slug}`} className={featured ? 'font-heading text-4xl leading-tight hover:text-nm-accent' : 'font-heading text-2xl leading-tight hover:text-nm-accent'}>{a.title}</Link>
        <p className="text-sm leading-relaxed text-nm-muted">{a.excerpt}</p>
      </div>
    </article>
  );
}
