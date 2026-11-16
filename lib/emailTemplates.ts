import { site } from "./site";
import { formatDate, formatEUR } from "./utils";

const baseStyles = `
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #0f172a; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 24px;
`;
const headerStyles = `background:#1f4a85; color:#fff; padding:24px; border-radius:8px 8px 0 0;`;
const bodyStyles = `background:#fff; border:1px solid #e2e8f0; border-top:none; padding:24px; border-radius:0 0 8px 8px;`;
const btnStyles = `display:inline-block; background:#c8102e; color:#fff; padding:12px 20px; border-radius:6px; text-decoration:none; font-weight:600; margin-top:16px;`;
const mutedStyles = `color:#64748b; font-size:13px;`;

export function bookingConfirmationEmail(opts: {
  customerName: string;
  courseTitle: string;
  startDate: string;
  endDate: string;
  amountCents: number;
  invoiceNumber: string;
}) {
  return `
<!DOCTYPE html>
<html lang="de"><body style="${baseStyles}">
  <div style="${headerStyles}">
    <h1 style="margin:0; font-size:22px;">Buchungsbestätigung</h1>
    <p style="margin:8px 0 0; opacity:.9;">${site.name}</p>
  </div>
  <div style="${bodyStyles}">
    <p>Hallo ${opts.customerName},</p>
    <p>vielen Dank für Ihre Buchung bei der Verkehrsfachschule Rheinland. Wir freuen uns auf Sie!</p>
    <table style="width:100%; border-collapse:collapse; margin:20px 0;">
      <tr><td style="padding:6px 0; ${mutedStyles}">Kurs</td><td><strong>${opts.courseTitle}</strong></td></tr>
      <tr><td style="padding:6px 0; ${mutedStyles}">Beginn</td><td>${formatDate(opts.startDate)}</td></tr>
      <tr><td style="padding:6px 0; ${mutedStyles}">Ende</td><td>${formatDate(opts.endDate)}</td></tr>
      <tr><td style="padding:6px 0; ${mutedStyles}">Betrag</td><td><strong>${formatEUR(opts.amountCents)}</strong> (bezahlt)</td></tr>
      <tr><td style="padding:6px 0; ${mutedStyles}">Rechnungs-Nr.</td><td>${opts.invoiceNumber}</td></tr>
    </table>
    <p>Ihre Rechnung finden Sie im Anhang dieser E-Mail.</p>
    <p>Sie haben Fragen? Antworten Sie einfach auf diese E-Mail oder rufen Sie uns an: <a href="tel:${site.phoneClean}" style="color:#1f4a85;">${site.phone}</a></p>
    <p style="margin-top:24px;">Bis bald in Niederkassel!<br><strong>Ihr VFR-Team</strong></p>
  </div>
  <p style="${mutedStyles} text-align:center; margin-top:16px;">
    ${site.address.street} · ${site.address.zip} ${site.address.city} · ${site.phone}<br>
    <a href="${site.url}" style="color:#1f4a85;">${site.url}</a>
  </p>
</body></html>`;
}

export function registrationConfirmRequestEmail(opts: {
  customerName: string;
  courseTitle: string;
  startDate: string;
  endDate: string;
  amountCents: number;
  paymentMethod: "invoice" | "card";
  confirmUrl: string;
  participantNames?: string[];
}) {
  const payLabel =
    opts.paymentMethod === "invoice"
      ? "Rechnung (14 Tage Zahlungsziel)"
      : "Direktzahlung";
  const participants = opts.participantNames ?? [];
  const participantsRow =
    participants.length > 0
      ? `<tr><td style="padding:6px 0; ${mutedStyles}; vertical-align:top;">${participants.length === 1 ? "Teilnehmer" : "Teilnehmer:innen"}</td><td>${participants.map((n) => `<div>${n}</div>`).join("")}</td></tr>`
      : "";
  return `
<!DOCTYPE html>
<html lang="de"><body style="${baseStyles}">
  <div style="${headerStyles}">
    <h1 style="margin:0; font-size:22px;">Bitte Anmeldung bestätigen</h1>
    <p style="margin:8px 0 0; opacity:.9;">${site.name}</p>
  </div>
  <div style="${bodyStyles}">
    <p>Hallo ${opts.customerName},</p>
    <p>Sie haben folgende Anmeldung vorgenommen:</p>
    <table style="width:100%; border-collapse:collapse; margin:16px 0;">
      <tr><td style="padding:6px 0; ${mutedStyles}">Kurs</td><td><strong>${opts.courseTitle}</strong></td></tr>
      <tr><td style="padding:6px 0; ${mutedStyles}">Zeitraum</td><td>${formatDate(opts.startDate)} – ${formatDate(opts.endDate)}</td></tr>
      ${participantsRow}
      <tr><td style="padding:6px 0; ${mutedStyles}">Betrag</td><td><strong>${formatEUR(opts.amountCents)}</strong></td></tr>
      <tr><td style="padding:6px 0; ${mutedStyles}">Zahlung</td><td>${payLabel}</td></tr>
    </table>
    <p><strong>Bitte bestätigen Sie die Anmeldung mit einem Klick:</strong></p>
    <p style="text-align:center; margin:24px 0;">
      <a href="${opts.confirmUrl}" style="${btnStyles} background:#2080c0;">Anmeldung verbindlich bestätigen</a>
    </p>
    <p style="${mutedStyles}">Der Link ist 48 Stunden gültig. Ohne Ihre Bestätigung wird nichts gebucht.</p>
    <p style="margin-top:24px;">Fragen? Antworten Sie einfach oder rufen Sie uns an: <a href="tel:${site.phoneClean}" style="color:#2080c0;">${site.phone}</a></p>
    <p style="margin-top:24px;">Beste Grüße<br><strong>Ihr VFR-Team</strong></p>
  </div>
  <p style="${mutedStyles} text-align:center; margin-top:16px;">
    ${site.address.street} · ${site.address.zip} ${site.address.city} · ${site.phone}<br>
    <a href="${site.url}" style="color:#2080c0;">${site.url}</a>
  </p>
</body></html>`;
}

export function registrationReceivedOfficeEmail(opts: {
  customerName: string;
  customerEmail: string;
  courseTitle: string;
  paymentMethod: "invoice" | "card";
  registrationId: string;
}) {
  return `
<!DOCTYPE html>
<html lang="de"><body style="${baseStyles}">
  <div style="${headerStyles}">
    <h1 style="margin:0; font-size:20px;">Neue Anmeldung (bestätigt)</h1>
  </div>
  <div style="${bodyStyles}">
    <p>Soeben ist eine bestätigte Anmeldung eingegangen:</p>
    <table style="width:100%; border-collapse:collapse; margin:16px 0;">
      <tr><td style="padding:6px 0; ${mutedStyles}">Teilnehmer</td><td><strong>${opts.customerName}</strong></td></tr>
      <tr><td style="padding:6px 0; ${mutedStyles}">E-Mail</td><td>${opts.customerEmail}</td></tr>
      <tr><td style="padding:6px 0; ${mutedStyles}">Kurs</td><td>${opts.courseTitle}</td></tr>
      <tr><td style="padding:6px 0; ${mutedStyles}">Zahlung</td><td>${opts.paymentMethod === "invoice" ? "Rechnung" : "Direktzahlung"}</td></tr>
      <tr><td style="padding:6px 0; ${mutedStyles}">Flario-ID</td><td>${opts.registrationId}</td></tr>
    </table>
    <p style="${mutedStyles}">Bitte in Flario prüfen und auf „bestätigt" setzen.</p>
  </div>
</body></html>`;
}

export function newsletterConfirmEmail(opts: {
  email: string;
  confirmUrl: string;
}) {
  return `
<!DOCTYPE html>
<html lang="de"><body style="${baseStyles}">
  <div style="${headerStyles}">
    <h1 style="margin:0; font-size:22px;">Newsletter bestätigen</h1>
    <p style="margin:8px 0 0; opacity:.9;">${site.name}</p>
  </div>
  <div style="${bodyStyles}">
    <p>Hallo,</p>
    <p>du hast dich für den VFR-Newsletter angemeldet. Bitte bestätige deine
    E-Mail-Adresse <strong>${opts.email}</strong> mit einem Klick:</p>
    <p style="text-align:center; margin:24px 0;">
      <a href="${opts.confirmUrl}" style="${btnStyles} background:#2080c0;">Anmeldung bestätigen</a>
    </p>
    <p style="${mutedStyles}">Der Link ist 7 Tage gültig. Ohne Bestätigung passiert nichts — falls du dich nicht angemeldet hast, ignoriere diese Mail einfach.</p>
    <p style="margin-top:24px;">Beste Grüße<br><strong>Ihr VFR-Team</strong></p>
  </div>
</body></html>`;
}

export function callbackRequestEmail(opts: {
  name: string;
  phone: string;
  email?: string;
  desiredDate: string;
  desiredTime: string;
  topic?: string;
  message?: string;
}) {
  return `
<!DOCTYPE html>
<html lang="de"><body style="${baseStyles}">
  <div style="${headerStyles}">
    <h1 style="margin:0; font-size:20px;">Neue Rückruf-Anfrage</h1>
  </div>
  <div style="${bodyStyles}">
    <table style="width:100%; border-collapse:collapse;">
      <tr><td style="padding:6px 0; ${mutedStyles}">Name</td><td><strong>${opts.name}</strong></td></tr>
      <tr><td style="padding:6px 0; ${mutedStyles}">Telefon</td><td><a href="tel:${opts.phone}" style="color:#1f4a85;">${opts.phone}</a></td></tr>
      ${opts.email ? `<tr><td style="padding:6px 0; ${mutedStyles}">E-Mail</td><td>${opts.email}</td></tr>` : ""}
      <tr><td style="padding:6px 0; ${mutedStyles}">Wunschtermin</td><td><strong>${opts.desiredDate} um ${opts.desiredTime}</strong></td></tr>
      ${opts.topic ? `<tr><td style="padding:6px 0; ${mutedStyles}">Thema</td><td>${opts.topic}</td></tr>` : ""}
    </table>
    ${opts.message ? `<p style="margin-top:16px; padding:12px; background:#f8fafc; border-left:3px solid #1f4a85;">${opts.message.replace(/\n/g, "<br>")}</p>` : ""}
  </div>
</body></html>`;
}

export function callbackCustomerConfirmation(opts: {
  name: string;
  desiredDate: string;
  desiredTime: string;
}) {
  return `
<!DOCTYPE html>
<html lang="de"><body style="${baseStyles}">
  <div style="${headerStyles}">
    <h1 style="margin:0; font-size:20px;">Wir rufen Sie zurück</h1>
  </div>
  <div style="${bodyStyles}">
    <p>Hallo ${opts.name},</p>
    <p>vielen Dank für Ihre Rückruf-Anfrage. Wir melden uns am <strong>${opts.desiredDate} gegen ${opts.desiredTime}</strong> bei Ihnen.</p>
    <p>Falls Sie uns vorher erreichen möchten: <a href="tel:${site.phoneClean}" style="color:#1f4a85;">${site.phone}</a></p>
    <p>Beste Grüße<br><strong>Ihr VFR-Team</strong></p>
  </div>
</body></html>`;
}
