import { notFound } from "next/navigation";
import { DM_Serif_Display, Manrope } from "next/font/google";
import { StoreCartProvider } from "@/components/StoreCartProvider";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import type { Language } from "@/lib/i18n/translations";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ToastProvider } from "@/components/feedback/toast";

const heading = DM_Serif_Display({ subsets: ["latin"], weight: "400", variable: "--font-heading" });
const body = Manrope({ subsets: ["latin"], variable: "--font-body" });

export function generateStaticParams() {
  return [{ locale: "es" }, { locale: "en" }];
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;
  if (locale !== "es" && locale !== "en") notFound();

  return (
    <LanguageProvider initialLanguage={locale as Language}>
      <ThemeProvider>
        <div className={`nm-theme ${heading.variable} ${body.variable}`}>
          <ToastProvider>
            <StoreCartProvider>{children}</StoreCartProvider>
          </ToastProvider>
        </div>
      </ThemeProvider>
    </LanguageProvider>
  );
}
