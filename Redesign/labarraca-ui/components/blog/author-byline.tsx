import { Avatar } from '@/components/ui/avatar';
export function AuthorByline({ name, role, date, avatar }: { name: string; role: string; date: string; avatar?: string }) {
  return <div className="inline-flex items-center gap-3 rounded-pill py-2 pl-2 pr-6 shadow-soft-inset-sm"><Avatar name={name} src={avatar} size="sm" /><div className="text-sm leading-tight"><p className="font-semibold">{name}</p><p className="text-xs text-nm-muted">{role} · {date}</p></div></div>;
}
