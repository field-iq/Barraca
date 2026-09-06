'use client';
import Link from 'next/link';
import { Menu, ShoppingBag, Moon, Sun } from 'lucide-react';
import { IconButton } from '@/components/ui/icon-button';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/ui/theme-provider';
import { cn } from '@/lib/cn';

export interface NavLink { label: string; href: string }
export function Navbar({ links, cartCount = 0, onMenu, className }: { links: NavLink[]; cartCount?: number; onMenu?: () => void; className?: string }) {
  const { theme, toggle } = useTheme();
  return (
    <header className={cn('sticky top-4 z-40 mx-auto flex h-16 max-w-6xl items-center gap-6 rounded-pill bg-nm-surface px-4 pl-6 shadow-soft', className)}>
      <Link href="/" className="font-heading text-xl leading-none">La Barraca <span className="text-nm-accent">de Juan</span></Link>
      <nav className="hidden flex-1 items-center justify-center gap-1 md:flex">
        {links.map(l => <Link key={l.href} href={l.href} className="nm-transition rounded-pill px-4 py-2 text-sm font-medium text-nm-muted hover:text-nm-text hover:shadow-soft-sm">{l.label}</Link>)}
      </nav>
      <div className="ml-auto flex items-center gap-2">
        <IconButton size="sm" label="Toggle theme" onClick={toggle}>{theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}</IconButton>
        <span className="relative">
          <IconButton size="sm" label="Cart"><ShoppingBag className="size-4" /></IconButton>
          {cartCount > 0 && <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-nm-accent text-[10px] font-bold text-nm-accent-fg">{cartCount}</span>}
        </span>
        <Button size="sm" variant="accent" className="hidden sm:inline-flex">Get a quote</Button>
        <IconButton size="sm" label="Menu" className="md:hidden" onClick={onMenu}><Menu className="size-4" /></IconButton>
      </div>
    </header>
  );
}
