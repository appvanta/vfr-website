import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Bitte Email bestätigen",
  robots: { index: false, follow: false },
};

export default async function CheckEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const sp = await searchParams;
  const email = sp.email;

  return (
    <section className="vfr-section">
      <div className="vfr-wrap max-w-[640px] text-center">
        <div className="flex justify-center">
          <Mail className="h-14 w-14 text-[var(--vfr-accent)]" />
        </div>
        <h1 className="vfr-h2 mt-6">Prüfe dein Postfach.</h1>
        <p className="text-[var(--vfr-fg-muted)] mt-4 text-[1.05rem] leading-relaxed">
          Wir haben dir eine E-Mail
          {email ? (
            <>
              {" "}an <strong className="text-[var(--vfr-fg)]">{email}</strong>{" "}
            </>
          ) : (
            " "
          )}
          geschickt. Darin findest du einen Bestätigungslink. Erst mit einem
          Klick darauf ist deine Anmeldung verbindlich.
        </p>
        <p className="text-[var(--vfr-fg-soft)] mt-4 text-[0.9rem]">
          Nichts bekommen? Prüfe den Spam-Ordner. Der Link ist 48 Stunden
          gültig.
        </p>
        <Link
          href="/"
          className="inline-block mt-8 bg-[var(--vfr-fg)] text-white px-6 py-3 rounded-[2px] font-semibold no-underline hover:bg-[var(--vfr-accent)] transition"
        >
          Zurück zur Startseite
        </Link>
      </div>
    </section>
  );
}
