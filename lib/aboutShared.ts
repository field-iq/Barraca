export interface AboutText {
  title: string;
  /** Párrafos separados por una línea en blanco. */
  body: string;
}

export interface AboutSettings {
  photoUrl: string;
  es: AboutText;
  en: AboutText;
  updatedAt: string | null;
}

export const ABOUT_LIMITS = { title: 120, body: 4000 } as const;
