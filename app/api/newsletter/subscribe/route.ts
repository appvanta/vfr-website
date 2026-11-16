import { NextResponse } from "next/server";
import { createConfirmToken } from "@/lib/confirmToken";
import { sendEmail } from "@/lib/email";
import { newsletterConfirmEmail } from "@/lib/emailTemplates";
import { site } from "@/lib/site";

export type PendingNewsletter = {
  email: string;
  source?: string;
  ipAddress?: string;
  userAgent?: string;
  signedUpAt: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      email: string;
      source?: string;
    };

    const email = (body.email ?? "").trim().toLowerCase();
    if (!email || !email.includes("@") || email.length < 5) {
      return NextResponse.json(
        { ok: false, error: "Bitte gültige E-Mail-Adresse angeben" },
        { status: 400 },
      );
    }

    const ipAddress =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      undefined;
    const userAgent = req.headers.get("user-agent") ?? undefined;

    const pending: PendingNewsletter = {
      email,
      source: body.source,
      ipAddress,
      userAgent,
      signedUpAt: new Date().toISOString(),
    };

    // Token: 7 Tage gültig
    const token = createConfirmToken(pending, 24 * 7);
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ??
      site.url ??
      new URL(req.url).origin;
    const confirmUrl = `${baseUrl}/newsletter/bestaetigen/${token}`;

    await sendEmail({
      to: email,
      subject: "Bitte Newsletter-Anmeldung bestätigen",
      html: newsletterConfirmEmail({ email, confirmUrl }),
    });

    return NextResponse.json({
      ok: true,
      message: "Bestätigungs-Mail unterwegs.",
      ...(process.env.NODE_ENV === "development" ? { devConfirmUrl: confirmUrl } : {}),
    });
  } catch (err) {
    console.error("[newsletter/subscribe]", err);
    return NextResponse.json(
      { ok: false, error: "Anmeldung fehlgeschlagen, bitte später erneut." },
      { status: 500 },
    );
  }
}
