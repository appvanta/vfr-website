import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { revalidateTag } from "next/cache";

/**
 * Nimmt Webhook-Events von Flario entgegen.
 *
 * Events (siehe docs/flario-api-spec.md § 3):
 *   - registration.confirmed  → Bestätigungsmail an Kunde
 *   - registration.rejected   → Absagemail an Kunde
 *   - course.updated          → ISR-Cache invalidieren
 *   - course.seats_changed    → ISR-Cache invalidieren
 *
 * Signatur-Prüfung per HMAC-SHA256 über den rohen Body, mit Secret aus
 * FLARIO_WEBHOOK_SECRET.
 */

type FlarioEvent =
  | { event: "registration.confirmed"; registrationId: string; courseId: string; timestamp: string }
  | { event: "registration.rejected"; registrationId: string; courseId: string; timestamp: string; reason?: string }
  | { event: "course.updated"; courseId: string; timestamp: string }
  | { event: "course.seats_changed"; courseId: string; timestamp: string };

export async function POST(req: Request) {
  const secret = process.env.FLARIO_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[flario/webhook] FLARIO_WEBHOOK_SECRET nicht gesetzt");
    return NextResponse.json({ ok: false, error: "Nicht konfiguriert" }, { status: 503 });
  }

  const rawBody = await req.text();
  const signature = req.headers.get("x-flario-signature") ?? "";

  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
    return NextResponse.json({ ok: false, error: "Ungültige Signatur" }, { status: 401 });
  }

  let payload: FlarioEvent;
  try {
    payload = JSON.parse(rawBody) as FlarioEvent;
  } catch {
    return NextResponse.json({ ok: false, error: "Ungültiges JSON" }, { status: 400 });
  }

  switch (payload.event) {
    case "registration.confirmed":
      // TODO: Mail an Kunde senden („Dein Platz ist bestätigt")
      //       lib/emailTemplates.ts erweitern
      console.log("[flario/webhook] confirmed", payload.registrationId);
      break;
    case "registration.rejected":
      // TODO: Mail an Kunde senden („Leider können wir …")
      console.log("[flario/webhook] rejected", payload.registrationId);
      break;
    case "course.updated":
    case "course.seats_changed":
      revalidateTag("flario");
      break;
  }

  return NextResponse.json({ ok: true });
}
