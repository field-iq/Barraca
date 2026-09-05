import type { Metadata } from "next";
import { headers } from "next/headers";
import { StoreCartProvider } from "@/components/StoreCartProvider";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import type { Language } from "@/lib/i18n/translations";
import "./globals.css";

export const metadata: Metadata = {
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
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale: Language = headers().get("x-app-locale") === "en" ? "en" : "es";

  return (
    <html lang={locale}>
      <body className="min-h-screen font-sans antialiased">
        <LanguageProvider initialLanguage={locale}>
          <StoreCartProvider>{children}</StoreCartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
