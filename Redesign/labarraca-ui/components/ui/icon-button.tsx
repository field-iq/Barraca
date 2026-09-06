import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string; size?: 'sm' | 'md' | 'lg'; pressed?: boolean; accent?: boolean;
}
const sizes = { sm: 'size-9', md: 'size-11', lg: 'size-14' };
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, size = 'md', pressed, accent, className, children, ...rest }, ref) {
  return (
    <button ref={ref} aria-label={label} aria-pressed={pressed}
      className={cn('nm-transition inline-grid place-items-center rounded-full bg-nm-surface active:shadow-soft-inset-sm active:scale-95 disabled:opacity-50',
        pressed ? 'shadow-soft-inset-sm text-nm-accent' : 'shadow-soft hover:shadow-soft-lg text-nm-text',
        accent && 'bg-nm-accent text-nm-accent-fg', sizes[size], className)} {...rest}>
      {children}
    </button>
  );
});
