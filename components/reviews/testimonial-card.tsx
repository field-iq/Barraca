import { Avatar } from '@/components/ui/avatar';
import { RatingStars } from '@/components/ui/rating-stars';
export interface Testimonial { quote: string; name: string; location: string; piece: string; rating: number; avatar?: string }
export function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <figure className="grid gap-5 rounded-soft bg-nm-surface p-7 shadow-soft">
      <RatingStars value={t.rating} />
      <blockquote className="font-heading text-xl leading-snug">“{t.quote}”</blockquote>
      <figcaption className="flex items-center gap-3"><Avatar name={t.name} src={t.avatar} size="sm" /><div className="text-sm"><p className="font-semibold">{t.name}</p><p className="text-xs text-nm-muted">{t.location} · {t.piece}</p></div></figcaption>
    </figure>
  );
}
