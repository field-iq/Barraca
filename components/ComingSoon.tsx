"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";

interface ComingSoonProps {
  productName: string;
  onBack: () => void;
}

export function ComingSoon({ productName, onBack }: ComingSoonProps) {
  const { t } = useLanguage();
  return (
    <section className="max-w-xl mx-auto text-center bg-white border border-sand rounded-2xl p-8">
      <h2 className="font-serif text-2xl text-walnut">{productName}</h2>
      <p className="mt-3 text-walnut/70">
        {t("comingSoon.description")}
      </p>
      <button
        type="button"
        onClick={onBack}
        className="mt-6 inline-flex items-center justify-center rounded-lg bg-bark text-cream px-5 py-2.5 text-sm font-medium hover:bg-walnut transition"
      >
        {t("comingSoon.back")}
      </button>
    </section>
  );
}
