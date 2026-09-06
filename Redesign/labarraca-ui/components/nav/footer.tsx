import Link from 'next/link';
import { Instagram, Facebook, Mail } from 'lucide-react';
import { IconButton } from '@/components/ui/icon-button';
export interface FooterColumn { title: string; links: { label: string; href: string }[] }
export function Footer({ columns, abn }: { columns: FooterColumn[]; abn?: string }) {
  return (
    <footer className="mt-24 rounded-t-soft-lg bg-nm-surface px-8 pb-10 pt-16 shadow-soft-lg">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <p className="font-heading text-2xl">La Barraca <span className="text-nm-accent">de Juan</span></p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-nm-muted">Solid-timber tables, robes and cabinetry, made to order in our workshop.</p>
          <div className="mt-6 flex gap-3">
            <IconButton size="sm" label="Instagram"><Instagram className="size-4" /></IconButton>
            <IconButton size="sm" label="Facebook"><Facebook className="size-4" /></IconButton>
            <IconButton size="sm" label="Email"><Mail className="size-4" /></IconButton>
          </div>
        </div>
        {columns.map(c => (
          <div key={c.title}>
            <p className="text-xs font-semibold uppercase tracking-[.14em] text-nm-muted">{c.title}</p>
            <ul className="mt-4 grid gap-2.5">{c.links.map(l => <li key={l.href}><Link href={l.href} className="text-sm hover:text-nm-accent">{l.label}</Link></li>)}</ul>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-12 flex max-w-6xl flex-wrap justify-between gap-2 border-t border-nm-line pt-6 text-xs text-nm-muted">
        <span>© {new Date().getFullYear()} La Barraca de Juan{abn && ` · ABN ${abn}`}</span><span>Made in Australia</span>
      </div>
    </footer>
  );
}
