import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { getCourse, bookCourseInFlario } from "@/lib/flario";
import { nextInvoiceNumber } from "@/lib/invoiceNumber";
import { generateInvoicePdf, archiveInvoice, type InvoiceData } from "@/lib/invoice";
import { sendEmail } from "@/lib/email";
import { bookingConfirmationEmail } from "@/lib/emailTemplates";

// Stripe braucht den Raw-Body für die Signatur-Prüfung
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) {
    return NextResponse.json({ error: "Webhook nicht konfiguriert" }, { status: 503 });
  }

  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    return NextResponse.json(
      { error: `Webhook-Signatur ungültig: ${(err as Error).message}` },
      { status: 400 },
    );
  }

  try {
    if (event.type === "checkout.session.completed") {
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
    }
  } catch (err) {
    console.error("[stripe webhook] error:", err);
    // 500 sorgt dafür, dass Stripe den Webhook nochmal versucht.
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  if (session.payment_status !== "paid") return;

  const md = session.metadata ?? {};
  const courseId = md.courseId;
  if (!courseId) throw new Error("courseId fehlt in Metadata");

  const course = await getCourse(courseId);
  if (!course) throw new Error(`Kurs ${courseId} nicht gefunden`);

  const invoiceNumber = await nextInvoiceNumber();
  const email = session.customer_details?.email ?? session.customer_email ?? "";

  const paymentMethodTypes = session.payment_method_types ?? [];
  const paymentMethod =
    paymentMethodTypes.includes("paypal")     ? "PayPal" :
    paymentMethodTypes.includes("sepa_debit") ? "SEPA-Lastschrift" :
    paymentMethodTypes.includes("card")       ? "Kreditkarte" :
    "Online-Zahlung";

  const invoiceData: InvoiceData = {
    invoiceNumber,
    invoiceDate: new Date(),
    customer: {
      salutation: md.salutation,
      firstName: md.firstName ?? "",
      lastName:  md.lastName ?? "",
      company:   md.company || undefined,
      street:    md.street ?? "",
      zip:       md.zip ?? "",
      city:      md.city ?? "",
      email,
    },
    items: [
      {
        description: course.title + (course.subtitle ? ` – ${course.subtitle}` : ""),
        courseRef: course.id,
        startDate: course.startDate,
        quantity: 1,
        unitPriceCents: course.priceCents,
      },
    ],
    vatRate: Number(process.env.INVOICE_VAT_RATE ?? "0"),
    vatNote: process.env.INVOICE_VAT_NOTE,
    paymentReference: session.id,
    paymentMethod,
  };

  const pdf = await generateInvoicePdf(invoiceData);
  await archiveInvoice(invoiceData, pdf);

  // 1) Mail an Kunde mit Rechnung im Anhang
  if (email) {
    await sendEmail({
      to: email,
      subject: `Buchungsbestätigung & Rechnung ${invoiceNumber} – VFR`,
      html: bookingConfirmationEmail({
        customerName: `${md.firstName ?? ""} ${md.lastName ?? ""}`.trim(),
        courseTitle: course.title,
        startDate: course.startDate,
        endDate: course.endDate,
        amountCents: course.priceCents,
        invoiceNumber,
      }),
      attachments: [{ filename: `${invoiceNumber}.pdf`, content: pdf }],
    });
  }

  // 2) Buchung an Flario melden (Seat reservieren)
  await bookCourseInFlario({
    courseId: course.id,
    participant: {
      salutation: (md.salutation as "Herr" | "Frau" | "Divers") ?? "Divers",
      firstName: md.firstName ?? "",
      lastName:  md.lastName ?? "",
      email,
      phone: md.phone ?? "",
      street: md.street ?? "",
      zip:    md.zip ?? "",
      city:   md.city ?? "",
    },
    paymentReference: session.id,
    invoiceNumber,
    amountCents: course.priceCents,
  });
}
