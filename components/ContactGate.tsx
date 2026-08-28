"use client";

import type { ContactDetails, ContactMethod } from "@/lib/quoteTypes";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export interface ContactGateProps {
  value: ContactDetails;
  onChange: (next: ContactDetails) => void;
}

/**
 * Collects contact details + consent. The submit button lives in the parent
 * form, but the parent uses `isContactValid(value)` (exported below) to decide
 * when to enable it.
 */
export function ContactGate({ value, onChange }: ContactGateProps) {
  const { t } = useLanguage();
  const update = (patch: Partial<ContactDetails>) =>
    onChange({ ...value, ...patch });

  return (
    <fieldset className="space-y-4">
      <legend className="font-serif text-xl text-walnut">
        {t("contactGate.legend")}
      </legend>
      <p className="text-sm text-walnut/70 -mt-2">
        {t("contactGate.description")}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label={t("contactGate.email")} htmlFor="contact-email">
          <input
            id="contact-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder={t("contactGate.emailPlaceholder")}
            value={value.email ?? ""}
            onChange={(e) => update({ email: e.target.value })}
            className={inputClass}
          />
        </Field>
        <Field label={t("contactGate.phone")} htmlFor="contact-phone">
          <input
            id="contact-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+54 9 ..."
            value={value.phone ?? ""}
            onChange={(e) => update({ phone: e.target.value })}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label={t("contactGate.preferredMethod")} htmlFor="contact-method">
        <select
          id="contact-method"
          value={value.preferredMethod}
          onChange={(e) =>
            update({ preferredMethod: e.target.value as ContactMethod })
          }
          className={inputClass}
        >
          <option value="email">{t("contactGate.email")}</option>
          <option value="whatsapp">{t("contactGate.whatsapp")}</option>
        </select>
      </Field>

      <label className="flex items-start gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={value.consent}
          onChange={(e) => update({ consent: e.target.checked })}
          className="mt-1 h-5 w-5 rounded border-sand text-bark focus:ring-accent"
        />
        <span className="text-sm text-walnut">
          {t("contactGate.consent")}
        </span>
      </label>
    </fieldset>
  );
}

/** Validation rule re-used by the page and the form. */
export function isContactValid(value: ContactDetails): boolean {
  const hasEmail = !!value.email && /\S+@\S+\.\S+/.test(value.email);
  const hasPhone = !!value.phone && value.phone.replace(/\D/g, "").length >= 6;
  return (hasEmail || hasPhone) && value.consent;
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-walnut">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-sand bg-white px-3 py-2.5 text-walnut placeholder:text-walnut/40 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent";
