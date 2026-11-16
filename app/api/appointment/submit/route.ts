import { NextResponse } from "next/server";
import { submitAppointment, APPOINTMENT_KIND_LABEL } from "@/lib/flario";
import type { AppointmentInput } from "@/lib/flario";
import { sendEmail } from "@/lib/email";
import { site } from "@/lib/site";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as AppointmentInput;

    if (
      !body.kind ||
      !body.start ||
      !body.contact?.email ||
      !body.contact?.firstName ||
      !body.contact?.lastName ||
      !body.contact?.phone
    ) {
      return NextResponse.json(
        { ok: false, error: "Bitte alle Pflichtfelder ausfüllen" },
        { status: 400 },
      );
    }

    const result = await submitAppointment({
      ...body,
      source: "website",
    });

    const whenDe = new Date(body.start).toLocaleString("de-DE", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    // Interne Benachrichtigung ans Büro
    try {
      await sendEmail({
        to: process.env.MAIL_CC_BUERO ?? site.email,
        subject: `Neuer Beratungstermin: ${APPOINTMENT_KIND_LABEL[body.kind]} am ${whenDe}`,
        html: `
          <h2>Neuer Beratungstermin</h2>
          <p><strong>Art:</strong> ${APPOINTMENT_KIND_LABEL[body.kind]}</p>
          <p><strong>Zeit:</strong> ${whenDe} (${body.durationMin} Min)</p>
          <p><strong>Teilnehmer:</strong> ${body.contact.salutation ?? ""} ${body.contact.firstName} ${body.contact.lastName}</p>
          <p><strong>E-Mail:</strong> ${body.contact.email}</p>
          <p><strong>Telefon:</strong> ${body.contact.phone}</p>
          ${body.contact.topic ? `<p><strong>Thema:</strong> ${body.contact.topic}</p>` : ""}
          ${body.contact.message ? `<p><strong>Nachricht:</strong><br>${body.contact.message.replace(/\n/g, "<br>")}</p>` : ""}
          <p style="color:#64748b; font-size:13px; margin-top:24px;">Flario-Referenz: ${result.appointmentId}</p>
        `,
      });
    } catch (e) {
      console.warn("[appointment] office email failed", e);
    }

    // Bestätigung an Kunde
    try {
      await sendEmail({
        to: body.contact.email,
        subject: `Dein Beratungstermin bei VFR — ${whenDe}`,
        html: `
          <h2>Dein Termin ist gebucht</h2>
          <p>Hallo ${body.contact.firstName} ${body.contact.lastName},</p>
          <p>vielen Dank für deine Terminbuchung. Hier die Details:</p>
          <ul>
            <li><strong>Art:</strong> ${APPOINTMENT_KIND_LABEL[body.kind]}</li>
            <li><strong>Zeit:</strong> ${whenDe}</li>
            <li><strong>Dauer:</strong> ca. ${body.durationMin} Minuten</li>
          </ul>
          <p>${
            body.kind === "phone"
              ? `Wir rufen dich pünktlich an der angegebenen Nummer an: <strong>${body.contact.phone}</strong>`
              : body.kind === "video"
                ? "Den Einwahl-Link zur Videokonferenz bekommst du am Tag vorher per E-Mail."
                : `Bitte komm pünktlich zu uns: ${site.address.street}, ${site.address.zip} ${site.address.city}`
          }</p>
          <p>Falls du den Termin absagen oder verschieben musst, antworte einfach auf diese Mail.</p>
          <p>Bis bald!<br>Dein VFR-Team</p>
        `,
      });
    } catch (e) {
      console.warn("[appointment] customer email failed", e);
    }

    return NextResponse.json({ ok: true, appointmentId: result.appointmentId });
  } catch (err) {
    console.error("[appointment/submit]", err);
    return NextResponse.json(
      { ok: false, error: "Interner Fehler, bitte später erneut versuchen." },
      { status: 500 },
    );
  }
}
