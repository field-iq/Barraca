"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Button } from "@/components/ui/button";

interface ComingSoonProps {
  productName: string;
  onBack: () => void;
}

export function ComingSoon({ productName, onBack }: ComingSoonProps) {
  const { t } = useLanguage();
  return (
    <section className="mx-auto max-w-xl rounded-soft-lg bg-nm-surface p-8 text-center shadow-soft">
      <h2 className="font-heading text-2xl text-nm-text">{productName}</h2>
      <p className="mt-3 text-nm-muted">
        {t("comingSoon.description")}
      </p>
      <Button type="button" variant="accent" onClick={onBack} className="mt-6">
        {t("comingSoon.back")}
      </Button>
    </section>
  );
}
