import { notFound } from "next/navigation";
import { StoreCartProvider } from "@/components/StoreCartProvider";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import type { Language } from "@/lib/i18n/translations";

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
      <StoreCartProvider>{children}</StoreCartProvider>
    </LanguageProvider>
  );
}
