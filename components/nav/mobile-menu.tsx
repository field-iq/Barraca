'use client';
import Link from 'next/link';
import { X } from 'lucide-react';
import { IconButton } from '@/components/ui/icon-button';
import { cn } from '@/lib/cn';
import type { NavLink } from './navbar';

export function MobileMenu({
  open,
  onClose,
  links,
  brand,
  ctaLabel,
  ctaHref,
}: {
  open: boolean;
  onClose: () => void;
  links: NavLink[];
  brand?: React.ReactNode;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-nm-bg p-6 animate-nm-in" role="dialog" aria-modal>
      <div className="flex items-center justify-between">
        <span className="font-heading text-xl">{brand ?? <>La Barraca <span className="text-nm-accent">de Juan</span></>}</span>
        <IconButton label="Close" onClick={onClose}><X className="size-5" /></IconButton>
      </div>
      <nav className="mt-10 grid gap-3">
        {links.map(l => <Link key={l.href} href={l.href} onClick={onClose} className="rounded-soft bg-nm-surface px-6 py-5 font-heading text-2xl shadow-soft active:shadow-soft-inset">{l.label}</Link>)}
      </nav>
      {ctaLabel && ctaHref && (
        <a
          href={ctaHref}
          target="_blank"
          rel="noreferrer"
          onClick={onClose}
          className={cn(
            'nm-transition mt-8 flex h-14 w-full items-center justify-center rounded-pill bg-nm-accent px-8 text-base font-semibold text-nm-accent-fg shadow-soft hover:brightness-105 active:shadow-soft-inset-sm active:brightness-95'
          )}
        >
          {ctaLabel}
        </a>
      )}
    </div>
  );
}
