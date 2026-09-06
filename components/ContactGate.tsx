"use client";

import type { ContactDetails, ContactMethod } from "@/lib/quoteTypes";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Checkbox } from "@/components/ui/checkbox";

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
      <legend className="font-heading text-xl text-nm-text">
        {t("contactGate.legend")}
      </legend>
      <p className="-mt-2 text-sm text-nm-muted">
        {t("contactGate.description")}
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

      <Checkbox
        checked={value.consent}
        onChange={(consent) => update({ consent })}
        label={t("contactGate.consent")}
      />
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
      <label htmlFor={htmlFor} className="text-sm font-medium text-nm-text">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-soft-sm bg-nm-surface px-3 py-2.5 text-nm-text shadow-soft-inset placeholder:text-nm-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-nm-accent";
