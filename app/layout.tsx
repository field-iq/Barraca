import type { Metadata } from "next";
import { SITE_URL } from "@/lib/contactInfo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "La Barraca de Juan | Muebles & deco",
    template: "%s | La Barraca de Juan",
  },
  description:
    "Muebles con historia, piezas listas para llevar y diseños a medida en Tigre. Conocé La Barraca de Juan.",
  openGraph: {
    title: "La Barraca de Juan | Muebles & deco",
    description: "Piezas listas para llevar y muebles hechos a medida en Tigre.",
    locale: "es_AR",
    type: "website",
    siteName: "La Barraca de Juan",
    images: [{ url: "/hero-poster.jpg", alt: "La Barraca de Juan, muebles y deco en Tigre" }],
  },
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
