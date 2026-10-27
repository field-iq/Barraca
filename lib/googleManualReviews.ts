import type { GoogleReview } from "./googleReviews";

/**
 * Datos de la ficha de Google cargados a mano. Se usan cuando la API de Google Places
 * (GOOGLE_PLACE_ID) no está configurada; con la API, estos datos se ignoran.
 *
 * `rating` y `count` son la nota y el total que se ven arriba de las reseñas en Google Maps.
 * Mientras estén en null, la tarjeta de puntuación no se muestra.
 */
export const GOOGLE_PROFILE: { rating: number | null; count: number | null; mapsUrl: string } = {
  rating: 4.6,
  count: 36,
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=La+Barraca+de+Juan+Tigre",
};

/** Reseñas de Google copiadas de la ficha, de la más nueva a la más vieja. Todas se cargaron como de 5 estrellas. */
export const GOOGLE_MANUAL_REVIEWS: GoogleReview[] = [
  { id: "g1", author: "Lucia Pons", rating: 5, when: "2026", text: "Muebles exclusivos y hermosos!! entre y me lleve todo! mil gracias!!" },
  { id: "g2", author: "Vanina Chioma", rating: 5, when: "2024", text: "Excelente buenos muebles y accesibles. La atencion de juan muy buena." },
  { id: "g3", author: "Sixta Muñiz", rating: 5, when: "2023", text: "Los diseños son hermosos de buen gusto y la atención es excelente....super recomendable!!!" },
  { id: "g4", author: "Federico Ostermeyer", rating: 5, when: "2020", text: "Excelente atención y predisposición!" },
  { id: "g5", author: "Mercedes Byrne", rating: 5, when: "2020", text: "Un lugar con buenos precios y lindas cosas!" },
  { id: "g6", author: "Dulce Naa", rating: 5, when: "2019", text: "Ingresamos a preguntar precios, y nos atendió muy bien!.. son muebles muy originales, lindos y originales, en su presentación, y en su construcción. Nos encantó!." },
  { id: "g7", author: "Lucia Meretta", rating: 5, when: "2019", text: "Enamorada de mi barra !" },
  { id: "g8", author: "Mariano Podestá", rating: 5, when: "2019", text: "Excelente calidad! Tengo una mesa espectacular hecha por ellos." },
  { id: "g9", author: "Carla Fabio", rating: 5, when: "2019", text: "Si pasas por el local seguro vas a encontrar algo original que te sorprenda y te guste." },
  { id: "g10", author: "Maria Beatriz Greco", rating: 5, when: "2019", text: "Los muebles con madera de demoliciones son geniales. Muy buen gusto" },
  { id: "g11", author: "Gonzalo Caride", rating: 5, when: "2019", text: "Diseños en muebles de madera super originales y de muy buena calidad. Se pueden encontrar muebles de todo tipo, especialmente en maderas duras, cosa dificil de encontrar hoy. Muy buena atención y asesoramiento." },
  { id: "g12", author: "Gerardo Nallar", rating: 5, when: "2018", text: "Excelentes precios y muy lindos muebles..." },
  { id: "g13", author: "Elisa Hio", rating: 5, when: "2018", text: "Excelente atención y productos artesanal de calidad. Realizan pedidos específicos con entrega en tiempo pautado." },
  { id: "g14", author: "Elpeñón Hardware Alternativo", rating: 5, when: "2018", text: "En el Tigre un lugar de artesanos de la madera, buen gusto, y buenos precios. Compramos y lo volveremos a hacer." },
];
