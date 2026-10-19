"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, MessageCircle, X } from "lucide-react";
import { useLanguage, withLocalePrefix } from "@/lib/i18n/LanguageContext";
import { IconButton } from "@/components/ui/icon-button";

const WHATSAPP_NUMBER = "5491153791654";

const inputClass =
  "w-full rounded-soft bg-nm-surface px-4 py-2.5 text-sm text-nm-text shadow-soft-inset-sm outline-none placeholder:text-nm-muted focus:ring-2 focus:ring-nm-accent/40";

type FaqId = "hours" | "ready" | "custom" | "buy" | "delivery" | "human";
type FaqAction = "catalog" | "custom" | "map" | "whatsapp" | "email";

const FAQS: { id: FaqId; actions: FaqAction[] }[] = [
  { id: "hours", actions: ["map"] },
  { id: "ready", actions: ["catalog"] },
  { id: "custom", actions: ["custom", "whatsapp"] },
  { id: "buy", actions: ["catalog"] },
  { id: "delivery", actions: ["whatsapp"] },
  { id: "human", actions: ["whatsapp", "email"] },
];

const MAP_URL = "https://www.google.com/maps/search/?api=1&query=Boulevard+Saenz+Pena+1213+Tigre";

const actionClass =
  "nm-transition inline-flex h-8 items-center justify-center rounded-pill bg-nm-surface px-3.5 text-xs font-semibold text-nm-accent shadow-soft-sm hover:shadow-soft active:shadow-soft-inset-sm";

export function ChatWidget({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { language, t } = useLanguage();
  const [asked, setAsked] = useState<FaqId[]>([]);
  const [view, setView] = useState<"chat" | "email">("chat");
  const endRef = useRef<HTMLDivElement>(null);

  const remaining = FAQS.filter((faq) => !asked.includes(faq.id));
  const transcript = asked
    .map((id) => `Cliente: ${t(`chat.faq.${id}.q`)}\nAsistente: ${t(`chat.faq.${id}.a`)}`)
    .join("\n");

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ block: "end" });
  }, [open, asked, view]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const lastQuestion = asked.length ? t(`chat.faq.${asked[asked.length - 1]}.q`) : null;
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    lastQuestion ? `${t("chat.waMessage")} ${lastQuestion}` : t("chat.waMessage"),
  )}`;

  function renderAction(action: FaqAction) {
    switch (action) {
      case "catalog":
        return (
          <Link key={action} href={withLocalePrefix("/catalogo", language)} onClick={onClose} className={actionClass}>
            {t("chat.action.catalog")}
          </Link>
        );
      case "custom":
        return (
          <Link key={action} href={withLocalePrefix("/catalogo#a-medida", language)} onClick={onClose} className={actionClass}>
            {t("chat.action.custom")}
          </Link>
        );
      case "map":
        return (
          <a key={action} href={MAP_URL} target="_blank" rel="noreferrer" className={actionClass}>
            {t("chat.action.map")}
          </a>
        );
      case "whatsapp":
        return (
          <a key={action} href={whatsappHref} target="_blank" rel="noreferrer" className={actionClass}>
            {t("chat.whatsapp")}
          </a>
        );
      case "email":
        return (
          <button key={action} type="button" onClick={() => setView("email")} className={actionClass}>
            {t("chat.action.email")}
          </button>
        );
    }
  }

  return (
    <div
      role="dialog"
      aria-label={t("chat.title")}
      aria-hidden={!open}
      className={`fixed inset-x-3 bottom-3 z-50 flex max-h-[min(640px,calc(100svh-1.5rem))] flex-col overflow-hidden rounded-soft-lg bg-nm-bg shadow-soft-lg sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[390px] ${open ? "" : "hidden"}`}
    >
      <div className="flex items-center gap-2 bg-nm-surface px-4 py-3 shadow-soft-sm">
        {view === "email" && (
          <IconButton size="sm" label={t("chat.form.back")} onClick={() => setView("chat")}>
            <ArrowLeft className="size-4" />
          </IconButton>
        )}
        <p className="flex-1 font-heading text-lg leading-none text-nm-text">
          {view === "email" ? t("chat.form.title") : t("chat.title")}
        </p>
        {view === "chat" && (
          <>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              aria-label={t("chat.whatsapp")}
              title={t("chat.whatsapp")}
              className="nm-transition inline-grid size-9 place-items-center rounded-full bg-nm-surface text-nm-text shadow-soft-sm hover:text-nm-accent"
            >
              <MessageCircle className="size-4" />
            </a>
            <button
              type="button"
              onClick={() => setView("email")}
              aria-label={t("chat.email")}
              title={t("chat.email")}
              className="nm-transition inline-grid size-9 place-items-center rounded-full bg-nm-surface text-nm-text shadow-soft-sm hover:text-nm-accent"
            >
              <Mail className="size-4" />
            </button>
          </>
        )}
        <IconButton size="sm" label={t("chat.close")} onClick={onClose}>
          <X className="size-4" />
        </IconButton>
      </div>

      {view === "chat" ? (
        <div className="flex min-h-[260px] flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
          <Bubble role="assistant">{t("chat.welcome")}</Bubble>
          {asked.map((id) => {
            const faq = FAQS.find((f) => f.id === id)!;
            return (
              <div key={id} className="flex flex-col gap-3">
                <Bubble role="user">{t(`chat.faq.${id}.q`)}</Bubble>
                <Bubble role="assistant">
                  {t(`chat.faq.${id}.a`)}
                  <span className="mt-3 flex flex-wrap gap-2">{faq.actions.map(renderAction)}</span>
                </Bubble>
              </div>
            );
          })}
          {remaining.length > 0 && (
            <div className="flex flex-col gap-2 pt-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-nm-muted">
                {asked.length ? t("chat.moreQuestions") : t("chat.suggestions")}
              </p>
              {remaining.map((faq) => (
                <button
                  key={faq.id}
                  type="button"
                  onClick={() => setAsked((prev) => [...prev, faq.id])}
                  className="nm-transition rounded-soft bg-nm-surface px-3.5 py-2.5 text-left text-sm font-medium text-nm-text shadow-soft-sm hover:shadow-soft active:shadow-soft-inset-sm"
                >
                  {t(`chat.faq.${faq.id}.q`)}
                </button>
              ))}
            </div>
          )}
          <div ref={endRef} />
        </div>
      ) : (
        <EmailForm transcript={transcript} whatsappHref={whatsappHref} onDone={() => setView("chat")} />
      )}
    </div>
  );
}

function Bubble({ role, children }: { role: "user" | "assistant"; children: React.ReactNode }) {
  const mine = role === "user";
  return (
    <div
      className={`max-w-[85%] whitespace-pre-wrap rounded-soft px-3.5 py-2.5 text-sm leading-relaxed ${
        mine
          ? "self-end bg-nm-accent text-nm-accent-fg shadow-soft-sm"
          : "self-start bg-nm-surface text-nm-text shadow-soft-sm"
      }`}
    >
      {children}
    </div>
  );
}

function EmailForm({
  transcript,
  whatsappHref,
  onDone,
}: {
  transcript: string;
  whatsappHref: string;
  onDone: () => void;
}) {
  const { t } = useLanguage();
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setState("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          phone: form.get("phone"),
          message: form.get("message"),
          website: form.get("website"),
          transcript,
        }),
      });
      setState(response.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className="grid gap-4 px-4 py-8 text-center">
        <p className="text-sm text-nm-text">{t("chat.form.sent")}</p>
        <button
          type="button"
          onClick={onDone}
          className="nm-transition mx-auto h-10 rounded-pill bg-nm-surface px-5 text-sm font-semibold text-nm-text shadow-soft-sm hover:shadow-soft"
        >
          {t("chat.form.back")}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-3 overflow-y-auto px-4 py-4">
      <input name="name" required minLength={2} maxLength={100} placeholder={t("chat.form.name")} aria-label={t("chat.form.name")} className={inputClass} />
      <input name="email" type="email" required maxLength={254} placeholder={t("chat.form.email")} aria-label={t("chat.form.email")} className={inputClass} />
      <input name="phone" type="tel" maxLength={40} placeholder={t("chat.form.phone")} aria-label={t("chat.form.phone")} className={inputClass} />
      <textarea name="message" required minLength={3} maxLength={2000} rows={4} placeholder={t("chat.form.message")} aria-label={t("chat.form.message")} className={`${inputClass} resize-none`} />
      {/* Honeypot: real users never see or fill this. */}
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      {state === "error" && (
        <p className="text-xs text-nm-danger">
          {t("chat.form.error")}{" "}
          <a href={whatsappHref} target="_blank" rel="noreferrer" className="underline">
            WhatsApp
          </a>
        </p>
      )}
      <button
        type="submit"
        disabled={state === "sending"}
        className="nm-transition inline-flex h-11 items-center justify-center rounded-pill bg-nm-accent px-6 text-sm font-semibold text-nm-accent-fg shadow-soft-sm hover:brightness-105 disabled:opacity-60"
      >
        {state === "sending" ? t("chat.form.sending") : t("chat.form.submit")}
      </button>
    </form>
  );
}
