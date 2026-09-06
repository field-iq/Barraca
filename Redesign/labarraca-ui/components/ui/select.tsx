import { forwardRef, type SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';
export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> { options: { value: string; label: string }[] }
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select({ options, className, ...rest }, ref) {
  return (
    <div className={cn('relative h-12 rounded-pill bg-nm-surface shadow-soft-inset', className)}>
      <select ref={ref} className="h-full w-full appearance-none bg-transparent pl-5 pr-12 text-sm outline-none" {...rest}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-nm-muted" />
    </div>
  );
});
