import { cn } from '@/lib/cn';
export interface Column<T> { key: keyof T & string; header: string; align?: 'left' | 'right'; render?: (row: T) => React.ReactNode }
export function DataTable<T extends { id: string | number }>({ columns, rows, caption }: { columns: Column<T>[]; rows: T[]; caption?: string }) {
  return (
    <div className="overflow-x-auto rounded-soft bg-nm-surface p-2 shadow-soft">
      <table className="w-full text-sm">
        {caption && <caption className="px-4 py-3 text-left font-heading text-xl">{caption}</caption>}
        <thead><tr>{columns.map(c => <th key={c.key} className={cn('px-4 py-3 text-xs font-semibold uppercase tracking-wider text-nm-muted', c.align === 'right' ? 'text-right' : 'text-left')}>{c.header}</th>)}</tr></thead>
        <tbody>{rows.map(r => <tr key={r.id} className="nm-transition hover:shadow-soft-inset-sm [&>td]:first:rounded-l-soft-sm [&>td]:last:rounded-r-soft-sm">{columns.map(c => <td key={c.key} className={cn('px-4 py-3.5', c.align === 'right' && 'text-right tabular-nums')}>{c.render ? c.render(r) : String(r[c.key])}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}
