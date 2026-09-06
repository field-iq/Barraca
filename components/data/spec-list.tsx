export function SpecList({ items, title = 'Specifications' }: { items: [string, string][]; title?: string }) {
  return (
    <div className="rounded-soft p-6 shadow-soft-inset">
      <h3 className="text-xl">{title}</h3>
      <dl className="mt-4 grid gap-0 text-sm">{items.map(([k, v]) => <div key={k} className="flex justify-between gap-6 border-b border-nm-line py-3 last:border-0"><dt className="text-nm-muted">{k}</dt><dd className="text-right font-medium">{v}</dd></div>)}</dl>
    </div>
  );
}
