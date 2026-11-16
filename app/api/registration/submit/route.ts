import { NextResponse } from "next/server";
import { getCourse } from "@/lib/flario";
import type { Participant, BillingContact } from "@/lib/flario";
import { nextInvoiceNumber } from "@/lib/invoiceNumber";
import { createConfirmToken } from "@/lib/confirmToken";
import { sendEmail } from "@/lib/email";
import { registrationConfirmRequestEmail } from "@/lib/emailTemplates";
import { site } from "@/lib/site";

/**
 * Nimmt eine Anmeldung (1-n Teilnehmer + Rechnungsadresse) entgegen und
 * verschickt eine Bestätigungs-Email mit signiertem Token an die
 * Rechnungsadresse. Erst nach Klick auf den Link wird alles an Flario
 * weitergegeben (siehe /buchung/bestaetigen/[token]).
 */

export type PendingRegistration = {
  courseId: string;
  participants: Participant[];
  billing: BillingContact;
  acceptedAgb: boolean;
  acceptedWiderruf: boolean;
  acceptedDatenschutz: boolean;
  acceptedAt: string;
  invoiceNumber: string;
  paymentMethod: "invoice";
  ipAddress?: string;
  userAgent?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      courseId: string;
      participants: Participant[];
      billing: BillingContact;
      acceptedAgb: boolean;
      acceptedWiderruf: boolean;
      acceptedDatenschutz: boolean;
    };

    // 1. Grundvalidierung
    if (!body.participants?.length) {
      return NextResponse.json(
        { ok: false, error: "Mindestens einen Teilnehmer angeben" },
        { status: 400 },
      );
    }
    if (!body.billing?.email) {
      return NextResponse.json(
        { ok: false, error: "Rechnungsadresse (inkl. E-Mail) ist erforderlich" },
        { status: 400 },
      );
    }

    // 2. Kurs prüfen
    const course = await getCourse(body.courseId);
    if (!course || !course.bookable) {
      return NextResponse.json(
        { ok: false, error: "Kurs nicht buchbar" },
        { status: 400 },
      );
    }
    if (course.seatsAvailable < body.participants.length) {
      return NextResponse.json(
        {
          ok: false,
          error: `Nur noch ${course.seatsAvailable} Platz/Plätze verfügbar — bitte Anzahl Teilnehmer anpassen.`,
        },
        { status: 400 },
      );
    }

    // 3. Pflicht-Häkchen
    if (
      !body.acceptedAgb ||
      !body.acceptedWiderruf ||
      !body.acceptedDatenschutz
    ) {
      return NextResponse.json(
        { ok: false, error: "Bitte alle Pflichtfelder bestätigen" },
        { status: 400 },
      );
    }

    // 4. Rechnungsnummer vorreservieren
    const invoiceNumber = await nextInvoiceNumber();

    // 5. Kontext
    const ipAddress =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      undefined;
    const userAgent = req.headers.get("user-agent") ?? undefined;

    const pending: PendingRegistration = {
      courseId: body.courseId,
      participants: body.participants,
      billing: body.billing,
      acceptedAgb: body.acceptedAgb,
      acceptedWiderruf: body.acceptedWiderruf,
      acceptedDatenschutz: body.acceptedDatenschutz,
      acceptedAt: new Date().toISOString(),
      invoiceNumber,
      paymentMethod: "invoice",
      ipAddress,
      userAgent,
    };

    // 6. Token + Bestätigungs-URL
    const token = createConfirmToken(pending);
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ??
      site.url ??
      new URL(req.url).origin;
    const confirmUrl = `${baseUrl}/buchung/bestaetigen/${token}`;

    // 7. Bestätigungs-Mail an Rechnungs-Empfänger
    //    (bei Mehrfach-Anmeldung bestätigt der Rechnungs-Empfänger für alle)
    await sendEmail({
      to: body.billing.email,
      subject: `Bitte Anmeldung bestätigen: ${course.title}`,
      html: registrationConfirmRequestEmail({
        customerName: `${body.billing.firstName} ${body.billing.lastName}`,
        courseTitle: course.title,
        startDate: course.startDate,
        endDate: course.endDate,
        amountCents: course.priceCents * body.participants.length,
        paymentMethod: "invoice",
        confirmUrl,
        participantNames: body.participants.map(
          (p) => `${p.firstName} ${p.lastName}`,
        ),
      }),
    });

    return NextResponse.json({
      ok: true,
      message:
        "Bestätigungs-E-Mail verschickt. Bitte prüfen Sie Ihr Postfach.",
      ...(process.env.NODE_ENV === "development"
        ? { devConfirmUrl: confirmUrl }
        : {}),
    });
  } catch (err) {
    console.error("[registration/submit]", err);
    return NextResponse.json(
      { ok: false, error: "Interner Fehler, bitte später erneut versuchen." },
      { status: 500 },
    );
  }
}
