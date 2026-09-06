import { cn } from '@/lib/cn';
export interface AvatarProps { src?: string; name: string; size?: 'sm' | 'md' | 'lg' | 'xl'; className?: string }
const sizes = { sm: 'size-8 text-xs', md: 'size-11 text-sm', lg: 'size-14 text-base', xl: 'size-20 text-xl' };
export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  return (
    <span className={cn('grid shrink-0 place-items-center overflow-hidden rounded-full bg-nm-surface font-heading shadow-soft-sm', sizes[size], className)}>
      {src ? <img src={src} alt={name} className="size-full object-cover" /> : <span className="text-nm-accent">{initials}</span>}
    </span>
  );
}
