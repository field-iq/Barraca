import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
export function CategoryTile({ name, subtitle, image, imageAlt, href }: { name: string; subtitle?: string; image: string; imageAlt?: string; href: string }) {
  return (
    <Link href={href} className="group relative block overflow-hidden rounded-soft p-3 shadow-soft nm-transition hover:shadow-soft-lg">
      <img src={image} alt={imageAlt ?? ''} className="aspect-[4/3] w-full rounded-soft-sm object-cover shadow-soft-inset" />
      <div className="flex items-center justify-between px-3 pb-2 pt-4"><div><p className="text-xl font-heading">{name}</p>{subtitle && <p className="text-xs text-nm-muted">{subtitle}</p>}</div><span className="grid size-10 place-items-center rounded-full shadow-soft-sm nm-transition group-hover:text-nm-accent group-hover:shadow-soft-inset-sm"><ArrowUpRight className="size-4" /></span></div>
    </Link>
  );
}
