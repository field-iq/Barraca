import { NextResponse } from "next/server";
import { Resend } from "resend";
import { CONTACT_EMAIL } from "@/lib/contactInfo";
import { reserveEmails } from "@/lib/emailQuota";
import { checkRateLimit, clientKey } from "@/lib/rateLimit";

export const runtime = "nodejs";

const ADMIN_EMAIL = CONTACT_EMAIL;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    if (!checkRateLimit(`contact:${clientKey(request)}`, 5, 60 * 60_000)) {
      return NextResponse.json({ error: "rate_limited" }, { status: 429 });
    }

    const payload = (await request.json()) as Record<string, unknown>;
    if (payload.website) return NextResponse.json({ ok: true });

    const name = clean(payload.name, 100);
    const email = clean(payload.email, 254).toLowerCase();
    const phone = clean(payload.phone, 40);
    const message = clean(payload.message, 2000);
    const transcript = clean(payload.transcript, 6000);

    if (name.length < 2 || !EMAIL_PATTERN.test(email) || message.length < 3) {
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.ORDER_FROM_EMAIL;
    if (!apiKey || !from) {
      console.error("[contact] RESEND_API_KEY u ORDER_FROM_EMAIL no configurados.");
      return NextResponse.json({ error: "not_configured" }, { status: 503 });
    }

    const html = `
      <div style="font-family:Arial,sans-serif;color:#3f2e22;line-height:1.6">
        <h2 style="margin:0 0 16px">Nueva consulta desde la web</h2>
        <p><strong>Nombre:</strong> ${escapeHtml(name)}<br>
        <strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a><br>
        ${phone ? `<strong>Teléfono:</strong> ${escapeHtml(phone)}<br>` : ""}</p>
        <p><strong>Mensaje:</strong><br>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
        ${transcript ? `<hr><p style="font-size:13px;color:#6b4f3a"><strong>Conversación previa con el asistente:</strong><br>${escapeHtml(transcript).replace(/\n/g, "<br>")}</p>` : ""}
      </div>`;
    const text = `Nueva consulta desde la web\n\nNombre: ${name}\nEmail: ${email}${phone ? `\nTeléfono: ${phone}` : ""}\n\n${message}${transcript ? `\n\n--- Conversación previa ---\n${transcript}` : ""}`;

    if (!(await reserveEmails(1))) {
      console.error("[contact] Tope de mails alcanzado.");
      return NextResponse.json({ error: "quota_reached" }, { status: 503 });
    }

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: [ADMIN_EMAIL],
      replyTo: email,
      subject: `Consulta web - ${name}`,
      html,
      text,
    });

    if (error) {
      console.error("[contact] Resend error:", error);
      return NextResponse.json({ error: "send_failed" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[contact] Unexpected error:", error);
    return NextResponse.json({ error: "unexpected" }, { status: 500 });
  }
}

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
