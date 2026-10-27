import { GOOGLE_MANUAL_REVIEWS, GOOGLE_PROFILE } from "./googleManualReviews";

/** Puntuación y reseñas de la ficha de Google del local, vía Google Places API (New) o cargadas a mano. */
export interface GoogleReview {
  id: string;
  author: string;
  authorPhoto?: string;
  rating: number;
  text: string;
  when: string;
}

export interface GoogleReviewsData {
  /** null cuando no se conoce la nota (carga manual sin nota); entonces no se muestra la tarjeta de puntuación. */
  rating: number | null;
  count: number | null;
  mapsUrl: string;
  reviews: GoogleReview[];
}

interface PlacesResponse {
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: {
    name?: string;
    rating?: number;
    relativePublishTimeDescription?: string;
    text?: { text?: string };
    originalText?: { text?: string };
    authorAttribution?: { displayName?: string; photoUri?: string };
  }[];
}

export async function getGoogleReviews(language: "es" | "en"): Promise<GoogleReviewsData | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY ?? process.env.GOOGLE_MAPS_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) return manualGoogleReviews();

  try {
    const response = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=${language}`, {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri,reviews",
      },
      next: { revalidate: 3600 },
    });
    if (!response.ok) return manualGoogleReviews();

    const place = (await response.json()) as PlacesResponse;
    if (typeof place.rating !== "number") return manualGoogleReviews();

    const reviews = (place.reviews ?? [])
      .map((review, index): GoogleReview => ({
        id: review.name ?? String(index),
        author: review.authorAttribution?.displayName ?? "",
        authorPhoto: review.authorAttribution?.photoUri,
        rating: review.rating ?? 5,
        text: review.text?.text ?? review.originalText?.text ?? "",
        when: review.relativePublishTimeDescription ?? "",
      }))
      .filter((review) => review.text.trim().length > 0);

    return {
      rating: place.rating,
      count: place.userRatingCount ?? reviews.length,
      mapsUrl: place.googleMapsUri ?? GOOGLE_PROFILE.mapsUrl,
      reviews,
    };
  } catch {
    return manualGoogleReviews();
  }
}

function manualGoogleReviews(): GoogleReviewsData | null {
  if (GOOGLE_MANUAL_REVIEWS.length === 0) return null;
  return { ...GOOGLE_PROFILE, reviews: GOOGLE_MANUAL_REVIEWS };
}
