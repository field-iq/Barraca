import { Armchair } from 'lucide-react';
import { Button } from '@/components/ui/button';
export function EmptyState({ title, body, action, onAction }: { title: string; body: string; action?: string; onAction?: () => void }) {
  return (
    <div className="grid place-items-center gap-4 rounded-soft p-10 text-center shadow-soft-inset">
      <span className="grid size-16 place-items-center rounded-full bg-nm-surface text-nm-accent shadow-soft"><Armchair className="size-6" /></span>
      <div><p className="font-heading text-xl">{title}</p><p className="mt-1 text-sm text-nm-muted">{body}</p></div>
      {action && <Button onClick={onAction}>{action}</Button>}
    </div>
  );
}
