'use client';
import { useState } from 'react';
import { cn } from '@/lib/cn';
export interface Tab { id: string; label: string; content: React.ReactNode }
export function Tabs({ tabs, defaultTab, className }: { tabs: Tab[]; defaultTab?: string; className?: string }) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id);
  return (
    <div className={cn('grid gap-6', className)}>
      <div role="tablist" className="inline-flex gap-1 rounded-pill p-1.5 shadow-soft-inset">
        {tabs.map(t => (
          <button key={t.id} role="tab" aria-selected={active === t.id} onClick={() => setActive(t.id)}
            className={cn('nm-transition h-10 rounded-pill px-5 text-sm font-semibold', active === t.id ? 'bg-nm-surface shadow-soft-sm text-nm-accent' : 'text-nm-muted hover:text-nm-text')}>{t.label}</button>
        ))}
      </div>
      <div role="tabpanel" className="animate-nm-in">{tabs.find(t => t.id === active)?.content}</div>
    </div>
  );
}
