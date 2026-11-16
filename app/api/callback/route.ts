import { NextResponse } from "next/server";
import { z } from "zod";
import { sendEmail } from "@/lib/email";
import { callbackRequestEmail, callbackCustomerConfirmation } from "@/lib/emailTemplates";
import { site } from "@/lib/site";

const Body = z.object({
  name:  z.string().min(2),
  phone: z.string().min(5),
  email: z.string().email().optional().or(z.literal("")),
  desiredDate: z.string().min(1),
  desiredTime: z.string().min(1),
  topic: z.string().optional(),
  message: z.string().optional(),
});

export async function POST(req: Request) {
  let payload: z.infer<typeof Body>;
  try {
    payload = Body.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Ungültige Eingaben" }, { status: 400 });
  }

  const desiredDateFmt = new Intl.DateTimeFormat("de-DE", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(payload.desiredDate));

  // 1) Mail an internes Office
  await sendEmail({
    to: process.env.MAIL_BCC_INTERNAL ?? site.email,
    subject: `Rückruf-Anfrage: ${payload.name} – ${desiredDateFmt} ${payload.desiredTime}`,
    html: callbackRequestEmail({
      name: payload.name,
      phone: payload.phone,
      email: payload.email || undefined,
      desiredDate: desiredDateFmt,
      desiredTime: payload.desiredTime,
      topic: payload.topic,
      message: payload.message,
    }),
  });

  // 2) Bestätigung an Kunde (wenn E-Mail angegeben)
  if (payload.email) {
    await sendEmail({
      to: payload.email,
      subject: "Ihre Rückruf-Anfrage bei VFR",
      html: callbackCustomerConfirmation({
        name: payload.name,
        desiredDate: desiredDateFmt,
        desiredTime: payload.desiredTime,
      }),
    });
  }

  return NextResponse.json({ ok: true });
}
