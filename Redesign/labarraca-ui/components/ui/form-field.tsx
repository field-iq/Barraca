import { cn } from '@/lib/cn';
export interface FormFieldProps { label: string; htmlFor?: string; hint?: string; error?: string; required?: boolean; children: React.ReactNode; className?: string }
export function FormField({ label, htmlFor, hint, error, required, children, className }: FormFieldProps) {
  return (
    <div className={cn('grid gap-2', className)}>
      <label htmlFor={htmlFor} className="px-1 text-xs font-semibold uppercase tracking-[.12em] text-nm-muted">
        {label}{required && <span className="text-nm-accent"> *</span>}
      </label>
      {children}
      {(error || hint) && <p className={cn('px-1 text-xs', error ? 'text-nm-danger' : 'text-nm-muted')}>{error ?? hint}</p>}
    </div>
  );
}
