import { RatingStars } from '@/components/ui/rating-stars';
import { Avatar } from '@/components/ui/avatar';
import type { GoogleReview } from '@/lib/googleReviews';

function GoogleG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={className}>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

/** Puntuación de Google: logo, nota, estrellas y cantidad de reseñas; enlaza a la ficha del local. */
export function GoogleRatingBadge({ rating, label, href }: { rating: number; label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="nm-transition flex items-center gap-4 rounded-soft bg-nm-surface px-5 py-4 shadow-soft hover:shadow-soft-lg"
    >
      <span className="grid size-12 shrink-0 place-items-center rounded-full shadow-soft-inset-sm">
        <GoogleG className="size-6" />
      </span>
      <span className="flex flex-col gap-1">
        <span className="flex items-center gap-3">
          <span className="font-heading text-3xl leading-none text-nm-text">{rating.toFixed(1)}</span>
          <RatingStars value={rating} />
        </span>
        <span className="text-xs text-nm-muted">{label}</span>
      </span>
    </a>
  );
}

/** Reseña de Google con el nombre y la foto de quien la escribió, como pide la atribución de Google. */
export function GoogleReviewCard({ review }: { review: GoogleReview }) {
  return (
    <figure className="flex h-full flex-col gap-4 rounded-soft bg-nm-surface p-6 shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <RatingStars value={review.rating} />
        <GoogleG className="size-5 shrink-0" />
      </div>
      <blockquote className="line-clamp-6 flex-1 text-sm leading-6 text-nm-text">“{review.text}”</blockquote>
      <figcaption className="flex items-center gap-3">
        <Avatar name={review.author || 'G'} src={review.authorPhoto} size="sm" />
        <div className="min-w-0 text-sm">
          <p className="truncate font-semibold">{review.author}</p>
          {review.when && <p className="text-xs text-nm-muted">{review.when}</p>}
        </div>
      </figcaption>
    </figure>
  );
}
