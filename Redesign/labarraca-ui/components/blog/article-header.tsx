import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { AuthorByline } from './author-byline';
export function ArticleHeader({ title, dek, category, author, date, image }: { title: string; dek: string; category: string; author: { name: string; role: string }; date: string; image: string }) {
  return (
    <header className="mx-auto grid max-w-4xl gap-8">
      <Breadcrumbs items={[{ label: 'Journal', href: '/journal' }, { label: category, href: '/journal' }, { label: title }]} />
      <h1 className="text-5xl leading-[1.05] md:text-6xl">{title}</h1>
      <p className="max-w-2xl text-xl leading-relaxed text-nm-muted">{dek}</p>
      <AuthorByline name={author.name} role={author.role} date={date} />
      <div className="rounded-soft-lg p-4 shadow-soft"><img src={image} alt="" className="aspect-[21/9] w-full rounded-soft object-cover shadow-soft-inset" /></div>
    </header>
  );
}
