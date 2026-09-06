'use client';
import { createContext, useCallback, useContext, useState } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '@/lib/cn';
type Tone = 'success' | 'warning' | 'info';
interface ToastItem { id: number; title: string; body?: string; tone: Tone }
const Ctx = createContext<(t: Omit<ToastItem, 'id'>) => void>(() => {});
export const useToast = () => useContext(Ctx);
const icons = { success: CheckCircle2, warning: AlertTriangle, info: Info };
const colors = { success: 'text-nm-success', warning: 'text-nm-warning', info: 'text-nm-accent' };
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const push = useCallback((t: Omit<ToastItem, 'id'>) => { const id = Date.now(); setItems(x => [...x, { ...t, id }]); setTimeout(() => setItems(x => x.filter(i => i.id !== id)), 5000); }, []);
  return (
    <Ctx.Provider value={push}>{children}
      <div className="fixed bottom-6 right-6 z-50 grid gap-3">{items.map(t => <Toast key={t.id} {...t} onClose={() => setItems(x => x.filter(i => i.id !== t.id))} />)}</div>
    </Ctx.Provider>
  );
}
export function Toast({ title, body, tone = 'info', onClose }: { title: string; body?: string; tone?: Tone; onClose?: () => void }) {
  const Icon = icons[tone];
  return (
    <div role="status" className="flex w-[340px] items-start gap-3 rounded-soft bg-nm-surface p-4 shadow-soft-lg animate-nm-in">
      <span className={cn('grid size-9 shrink-0 place-items-center rounded-full shadow-soft-inset-sm', colors[tone])}><Icon className="size-4" /></span>
      <div className="flex-1 text-sm"><p className="font-semibold">{title}</p>{body && <p className="text-nm-muted">{body}</p>}</div>
      {onClose && <button aria-label="Dismiss" onClick={onClose} className="text-nm-muted hover:text-nm-text"><X className="size-4" /></button>}
    </div>
  );
}
