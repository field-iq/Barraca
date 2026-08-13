import type { Metadata } from "next";
import { StoreCartProvider } from "@/components/StoreCartProvider";
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
  return (
    <html lang="es">
      <body className="min-h-screen font-sans antialiased">
        <StoreCartProvider>{children}</StoreCartProvider>
      </body>
    </html>
  );
}
