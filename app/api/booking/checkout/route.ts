import { NextResponse } from "next/server";
import { z } from "zod";
import { stripe } from "@/lib/stripe";
import { getCourse } from "@/lib/flario";
import { site } from "@/lib/site";

const Body = z.object({
  courseId: z.string().min(1),
  salutation: z.enum(["Herr", "Frau", "Divers"]),
  firstName: z.string().min(2),
  lastName:  z.string().min(2),
  email:     z.string().email(),
  phone:     z.string().min(5),
  street:    z.string().min(3),
  zip:       z.string().min(4),
  city:      z.string().min(2),
  company:   z.string().optional(),
  bildungsgutschein: z.boolean().optional(),
});

export async function POST(req: Request) {
  let payload: z.infer<typeof Body>;
  try {
    payload = Body.parse(await req.json());
  } catch (e) {
    return NextResponse.json(
      { error: "Validierung fehlgeschlagen", details: (e as z.ZodError).flatten?.() },
      { status: 400 },
    );
  }

  const course = await getCourse(payload.courseId);
  if (!course) return NextResponse.json({ error: "Kurs nicht gefunden" }, { status: 404 });
  if (!course.bookable || course.seatsAvailable <= 0) {
    return NextResponse.json({ error: "Kurs nicht mehr buchbar" }, { status: 409 });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      {
        error:
          "Zahlung ist noch nicht konfiguriert. Bitte STRIPE_SECRET_KEY in .env setzen.",
      },
      { status: 503 },
    );
  }

  // Bildungsgutschein-Fall: keine direkte Zahlung, Buchung als Anfrage erfassen
  if (payload.bildungsgutschein) {
    // TODO: hier Buchung als "warten auf Bildungsgutschein" anlegen + E-Mail an Office
    return NextResponse.json({
      url: `${site.url}/buchung/anfrage-bildungsgutschein?courseId=${course.id}`,
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card", "paypal", "sepa_debit"],
    locale: "de",
    customer_email: payload.email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: course.priceCents,
          product_data: {
            name: course.title,
            description: `${course.subtitle ?? ""} · Beginn ${course.startDate}`.trim(),
          },
          tax_behavior: "exclusive",
        },
      },
    ],
    metadata: {
      courseId: course.id,
      courseTitle: course.title,
      startDate: course.startDate,
      endDate: course.endDate,
      salutation: payload.salutation,
      firstName: payload.firstName,
      lastName:  payload.lastName,
      phone:     payload.phone,
      street:    payload.street,
      zip:       payload.zip,
      city:      payload.city,
      company:   payload.company ?? "",
    },
    success_url: `${site.url}/buchung/erfolg?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url:  `${site.url}/buchung/${course.id}?abgebrochen=1`,
  });

  return NextResponse.json({ url: session.url });
}
