import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea({ className, ...rest }, ref) {
  return <textarea ref={ref} className={cn('nm-transition w-full min-h-[120px] resize-y rounded-soft bg-nm-surface px-5 py-4 text-sm shadow-soft-inset outline-none placeholder:text-nm-muted/70 focus:shadow-soft-inset-lg', className)} {...rest} />;
});
