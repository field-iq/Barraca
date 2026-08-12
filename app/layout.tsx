import type { Metadata } from "next";
import { StoreCartProvider } from "@/components/StoreCartProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "La Barraca De Juan — Muebles artesanales",
  description:
    "Cotizá tu mueble a medida con La Barraca De Juan. Mesas, bancos, sillas y más, hechos a mano en nuestro taller.",
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
