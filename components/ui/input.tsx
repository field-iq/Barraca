import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> { leading?: React.ReactNode; trailing?: React.ReactNode; invalid?: boolean }
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ leading, trailing, invalid, className, ...rest }, ref) {
  return (
    <div className={cn('nm-transition flex h-12 items-center gap-3 rounded-pill bg-nm-surface px-5 shadow-soft-inset focus-within:shadow-soft-inset-lg',
      invalid && 'ring-2 ring-nm-danger/60', className)}>
      {leading && <span className="text-nm-muted [&>svg]:size-4">{leading}</span>}
      <input ref={ref} aria-invalid={invalid} className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-nm-muted/70" {...rest} />
      {trailing && <span className="text-nm-muted [&>svg]:size-4">{trailing}</span>}
    </div>
  );
});
