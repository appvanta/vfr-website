import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { verifyConfirmToken } from "@/lib/confirmToken";
import { confirmNewsletterSubscriber } from "@/lib/flario";
import type { PendingNewsletter } from "@/app/api/newsletter/subscribe/route";

export const metadata: Metadata = {
  title: "Newsletter bestätigen",
  robots: { index: false, follow: false },
};

export default async function NewsletterConfirmPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const verified = verifyConfirmToken<PendingNewsletter>(token);

  if (!verified.ok) {
    return (
      <Result
        kind={verified.error === "expired" ? "expired" : "invalid"}
      />
    );
  }

  const pending = verified.data;
  try {
    await confirmNewsletterSubscriber({
      email: pending.email,
      source: pending.source,
      ipAddress: pending.ipAddress,
      userAgent: pending.userAgent,
    });
  } catch (err) {
    console.error("[newsletter/confirm]", err);
    return <Result kind="error" />;
  }

  return <Result kind="success" email={pending.email} />;
}

function Result({
  kind,
  email,
}: {
  kind: "success" | "expired" | "invalid" | "error";
  email?: string;
}) {
  const cfg = {
    success: {
      icon: <CheckCircle2 className="h-14 w-14 text-emerald-600" />,
      title: "Super — du bist dabei!",
      text: `Wir haben ${email ? email : "deine E-Mail-Adresse"} bestätigt. Du bekommst jetzt alle VFR-News, Termine und Angebote per Mail.`,
      cta: { label: "Zur Startseite", href: "/" },
    },
    expired: {
      icon: <Clock className="h-14 w-14 text-amber-600" />,
      title: "Link abgelaufen",
      text: "Dein Bestätigungslink ist nicht mehr gültig (7 Tage). Trag dich einfach neu ein — die Anmeldung dauert 10 Sekunden.",
      cta: { label: "Zurück zur Startseite", href: "/#newsletter" },
    },
    invalid: {
      icon: <XCircle className="h-14 w-14 text-rose-600" />,
      title: "Ungültiger Link",
      text: "Dieser Bestätigungslink ist nicht gültig. Bitte prüfe, ob du den vollständigen Link aus der E-Mail verwendet hast.",
      cta: { label: "Zur Startseite", href: "/" },
    },
    error: {
      icon: <XCircle className="h-14 w-14 text-rose-600" />,
      title: "Etwas ist schiefgelaufen",
      text: "Wir konnten deine Bestätigung nicht speichern. Bitte versuch es gleich nochmal oder schick uns eine kurze Mail.",
      cta: { label: "Kontakt", href: "/kontakt" },
    },
  }[kind];

  return (
    <section className="vfr-section">
      <div className="vfr-wrap max-w-[640px] text-center">
        <div className="flex justify-center">{cfg.icon}</div>
        <h1 className="vfr-h2 mt-6">{cfg.title}</h1>
        <p className="text-[var(--vfr-fg-muted)] mt-4 text-[1.05rem] leading-relaxed">
          {cfg.text}
        </p>
        <Link
          href={cfg.cta.href}
          className="inline-block mt-8 bg-[var(--vfr-accent)] text-white px-6 py-3 rounded-[2px] font-semibold no-underline hover:bg-[var(--vfr-accent-dark)] transition"
        >
          {cfg.cta.label}
        </Link>
      </div>
    </section>
  );
}
