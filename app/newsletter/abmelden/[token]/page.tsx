import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { verifyConfirmToken } from "@/lib/confirmToken";
import { unsubscribeNewsletter } from "@/lib/flario";

export const metadata: Metadata = {
  title: "Newsletter abmelden",
  robots: { index: false, follow: false },
};

type UnsubPayload = { email: string };

export default async function UnsubscribePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const verified = verifyConfirmToken<UnsubPayload>(token);

  if (!verified.ok || !verified.data.email) {
    return (
      <section className="vfr-section">
        <div className="vfr-wrap max-w-[640px] text-center">
          <div className="flex justify-center">
            <XCircle className="h-14 w-14 text-rose-600" />
          </div>
          <h1 className="vfr-h2 mt-6">Link ungültig</h1>
          <p className="text-[var(--vfr-fg-muted)] mt-4">
            Der Abmelde-Link ist nicht mehr gültig. Schick uns kurz eine Mail an
            info@vfr-gmbh.de, dann nehmen wir dich sofort raus.
          </p>
        </div>
      </section>
    );
  }

  await unsubscribeNewsletter(verified.data.email);

  return (
    <section className="vfr-section">
      <div className="vfr-wrap max-w-[640px] text-center">
        <div className="flex justify-center">
          <CheckCircle2 className="h-14 w-14 text-emerald-600" />
        </div>
        <h1 className="vfr-h2 mt-6">Schade, dass du gehst.</h1>
        <p className="text-[var(--vfr-fg-muted)] mt-4 text-[1.05rem]">
          Du hast dich erfolgreich vom VFR-Newsletter abgemeldet und bekommst
          keine weiteren Mails von uns.
        </p>
        <p className="text-[var(--vfr-fg-soft)] mt-3 text-[0.9rem]">
          Falls das ein Versehen war: trag dich einfach wieder ein.
        </p>
        <Link
          href="/"
          className="inline-block mt-8 bg-[var(--vfr-fg)] text-white px-6 py-3 rounded-[2px] font-semibold no-underline hover:bg-[var(--vfr-accent)] transition"
        >
          Zur Startseite
        </Link>
      </div>
    </section>
  );
}
