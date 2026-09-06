'use client';
import Link from 'next/link';
import { X } from 'lucide-react';
import { IconButton } from '@/components/ui/icon-button';
import { Button } from '@/components/ui/button';
import type { NavLink } from './navbar';

export function MobileMenu({ open, onClose, links }: { open: boolean; onClose: () => void; links: NavLink[] }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-nm-bg p-6 animate-nm-in" role="dialog" aria-modal>
      <div className="flex items-center justify-between">
        <span className="font-heading text-xl">La Barraca <span className="text-nm-accent">de Juan</span></span>
        <IconButton label="Close" onClick={onClose}><X className="size-5" /></IconButton>
      </div>
      <nav className="mt-10 grid gap-3">
        {links.map(l => <Link key={l.href} href={l.href} onClick={onClose} className="rounded-soft bg-nm-surface px-6 py-5 font-heading text-2xl shadow-soft active:shadow-soft-inset">{l.label}</Link>)}
      </nav>
      <Button variant="accent" size="lg" block className="mt-8">Get a quote</Button>
    </div>
  );
}
