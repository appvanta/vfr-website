import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { verifyConfirmToken } from "@/lib/confirmToken";
import { submitRegistration, getCourse } from "@/lib/flario";
import { sendEmail } from "@/lib/email";
import { registrationReceivedOfficeEmail } from "@/lib/emailTemplates";
import { site } from "@/lib/site";
import type { PendingRegistration } from "@/app/api/registration/submit/route";

export const metadata: Metadata = {
  title: "Anmeldung bestätigen",
  robots: { index: false, follow: false },
};

export default async function ConfirmPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const verified = verifyConfirmToken<PendingRegistration>(token);

  if (!verified.ok) {
    return (
      <ResultBox
        kind={verified.error === "expired" ? "expired" : "invalid"}
      />
    );
  }

  const pending = verified.data;
  const course = await getCourse(pending.courseId);

  if (!course || !course.bookable) {
    return <ResultBox kind="course_gone" />;
  }

  // Anmeldung an Flario senden
  let registrationId = "";
  try {
    const result = await submitRegistration({
      courseId: pending.courseId,
      participants: pending.participants,
      billing: pending.billing,
      contract: {
        version: "2026-v1",
        acceptedAgb: pending.acceptedAgb,
        acceptedWiderruf: pending.acceptedWiderruf,
        acceptedDatenschutz: pending.acceptedDatenschutz,
        signature: {
          format: "image/png;base64",
          data: "", // Double-Opt-In statt handschriftl. Unterschrift
          signedAt: pending.acceptedAt,
          ipAddress: pending.ipAddress,
          userAgent: pending.userAgent,
        },
      },
      payment: {
        method: "invoice",
        status: "pending",
        amountCents: course.priceCents * pending.participants.length,
        invoiceNumber: pending.invoiceNumber,
      },
      source: "website",
    });
    registrationId = result.registrationId;
  } catch (err) {
    console.error("[confirm] submitRegistration failed", err);
    return <ResultBox kind="flario_error" />;
  }

  // Interne Mail ans Büro
  try {
    await sendEmail({
      to: process.env.MAIL_CC_BUERO ?? site.email,
      subject: `Neue Anmeldung bestätigt: ${course.title}`,
      html: registrationReceivedOfficeEmail({
        customerName: `${pending.billing.firstName} ${pending.billing.lastName}${pending.billing.company ? ` (${pending.billing.company})` : ""}`,
        customerEmail: pending.billing.email,
        courseTitle: `${course.title} — ${pending.participants.length} Teilnehmer`,
        paymentMethod: "invoice",
        registrationId,
      }),
    });
  } catch (err) {
    console.warn("[confirm] office email failed", err);
  }

  return <ResultBox kind="success" courseTitle={course.title} />;
}

function ResultBox({
  kind,
  courseTitle,
}: {
  kind: "success" | "expired" | "invalid" | "course_gone" | "flario_error";
  courseTitle?: string;
}) {
  const config = {
    success: {
      icon: <CheckCircle2 className="h-14 w-14 text-emerald-600" />,
      title: "Anmeldung bestätigt!",
      text: `Vielen Dank — deine verbindliche Anmeldung${
        courseTitle ? ` für „${courseTitle}"` : ""
      } ist bei uns eingegangen. Unser Büro prüft die Anmeldung und meldet sich innerhalb von 1–3 Werktagen bei dir. Die Rechnung geht separat per E-Mail raus.`,
      cta: { label: "Zur Startseite", href: "/" },
    },
    expired: {
      icon: <Clock className="h-14 w-14 text-amber-600" />,
      title: "Link abgelaufen",
      text: "Dein Bestätigungslink ist abgelaufen (48 h Gültigkeit). Bitte melde dich erneut an — die Anmeldung dauert nur 2 Minuten.",
      cta: { label: "Neu anmelden", href: "/termine-preise" },
    },
    invalid: {
      icon: <XCircle className="h-14 w-14 text-rose-600" />,
      title: "Ungültiger Link",
      text: "Dieser Bestätigungslink ist nicht gültig. Bitte prüfe, ob du den richtigen Link aus der E-Mail verwendet hast.",
      cta: { label: "Zur Startseite", href: "/" },
    },
    course_gone: {
      icon: <XCircle className="h-14 w-14 text-rose-600" />,
      title: "Kurs nicht mehr verfügbar",
      text: "Leider ist dieser Kurs inzwischen nicht mehr buchbar. Bitte melde dich bei uns — wir finden einen passenden Alternativtermin.",
      cta: { label: "Kontakt aufnehmen", href: "/kontakt" },
    },
    flario_error: {
      icon: <XCircle className="h-14 w-14 text-rose-600" />,
      title: "Übertragung fehlgeschlagen",
      text: "Es gab ein technisches Problem beim Übertragen deiner Anmeldung. Bitte ruf uns kurz an — wir erledigen das manuell.",
      cta: { label: "Kontakt aufnehmen", href: "/kontakt" },
    },
  }[kind];

  return (
    <section className="vfr-section">
      <div className="vfr-wrap max-w-[640px] text-center">
        <div className="flex justify-center">{config.icon}</div>
        <h1 className="vfr-h2 mt-6">{config.title}</h1>
        <p className="text-[var(--vfr-fg-muted)] mt-4 text-[1.05rem] leading-relaxed">
          {config.text}
        </p>
        <Link
          href={config.cta.href}
          className="inline-block mt-8 bg-[var(--vfr-accent)] text-white px-6 py-3 rounded-[2px] font-semibold no-underline hover:bg-[var(--vfr-accent-dark)] transition"
        >
          {config.cta.label}
        </Link>
      </div>
    </section>
  );
}
