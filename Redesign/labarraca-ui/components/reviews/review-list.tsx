import { RatingStars } from '@/components/ui/rating-stars';
import { Progress } from '@/components/ui/progress';
import { TestimonialCard, type Testimonial } from './testimonial-card';
export function ReviewList({ reviews, average, distribution }: { reviews: Testimonial[]; average: number; distribution: number[] }) {
  const total = distribution.reduce((a, b) => a + b, 0);
  return (
    <section className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[280px_1fr]">
      <div className="grid content-start gap-5 rounded-soft p-7 shadow-soft-inset">
        <div><p className="font-heading text-6xl">{average.toFixed(1)}</p><RatingStars value={average} count={total} /></div>
        <div className="grid gap-2">{[5, 4, 3, 2, 1].map((s, i) => <div key={s} className="grid grid-cols-[16px_1fr_32px] items-center gap-3 text-xs"><span>{s}</span><Progress value={(distribution[i] / total) * 100} /><span className="text-right text-nm-muted">{distribution[i]}</span></div>)}</div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">{reviews.map((r, i) => <TestimonialCard key={i} t={r} />)}</div>
    </section>
  );
}
