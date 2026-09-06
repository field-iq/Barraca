import { cn } from '@/lib/cn';
export function Tooltip({ content, side = 'top', children, className }: { content: string; side?: 'top' | 'bottom'; children: React.ReactNode; className?: string }) {
  return (
    <span className={cn('group relative inline-flex', className)}>
      {children}
      <span role="tooltip" className={cn('pointer-events-none absolute left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-soft-sm bg-nm-surface px-3 py-1.5 text-xs font-medium shadow-soft opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100',
        side === 'top' ? 'bottom-[calc(100%+10px)]' : 'top-[calc(100%+10px)]')}>{content}</span>
    </span>
  );
}
