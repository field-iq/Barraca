import { cn } from '@/lib/cn';
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn('animate-nm-shimmer rounded-soft-sm bg-[linear-gradient(90deg,rgb(var(--nm-sunken))_25%,rgb(var(--nm-surface))_50%,rgb(var(--nm-sunken))_75%)] bg-[length:200%_100%] shadow-soft-inset-sm', className)} />;
}
