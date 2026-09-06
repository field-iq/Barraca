import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';

export type ButtonVariant = 'raised' | 'accent' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant; size?: ButtonSize; loading?: boolean; block?: boolean;
  leading?: React.ReactNode; trailing?: React.ReactNode;
}
const sizes = { sm: 'h-9 px-4 text-sm gap-2', md: 'h-11 px-6 text-sm gap-2.5', lg: 'h-14 px-8 text-base gap-3' };
const variants = {
  raised: 'bg-nm-surface text-nm-text shadow-soft hover:shadow-soft-lg active:shadow-soft-inset-sm',
  accent: 'bg-nm-accent text-nm-accent-fg shadow-soft hover:brightness-105 active:shadow-soft-inset-sm active:brightness-95',
  ghost: 'bg-transparent text-nm-text hover:shadow-soft-sm active:shadow-soft-inset-sm',
  danger: 'bg-nm-surface text-nm-danger shadow-soft hover:shadow-soft-lg active:shadow-soft-inset-sm',
};
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'raised', size = 'md', loading, block, leading, trailing, className, children, disabled, ...rest }, ref) {
  return (
    <button ref={ref} disabled={disabled || loading}
      className={cn('nm-transition inline-flex items-center justify-center rounded-pill font-semibold select-none disabled:opacity-50 disabled:pointer-events-none active:scale-[.98]',
        sizes[size], variants[variant], block && 'w-full', className)} {...rest}>
      {loading ? <Loader2 className="size-4 animate-spin" /> : leading}
      {children}
      {trailing}
    </button>
  );
});
