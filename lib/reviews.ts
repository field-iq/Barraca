import type { Testimonial } from "@/components/reviews/testimonial-card";

export type LocalizedTestimonial = Omit<Testimonial, "quote" | "piece"> & {
  quote: { es: string; en: string };
  piece: { es: string; en: string };
};

/** Reseñas reales de clientes. Agregá acá las que tengas; la sección se muestra sola cuando hay al menos una. */
export const REVIEWS: LocalizedTestimonial[] = [];

export function getHomeReviews(): { reviews: LocalizedTestimonial[]; isSample: boolean } {
  return { reviews: REVIEWS, isSample: false };
}
