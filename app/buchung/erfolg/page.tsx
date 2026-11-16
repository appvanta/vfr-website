import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Buchung erfolgreich",
  robots: { index: false, follow: false },
};

export default function ErfolgPage() {
  return (
    <section className="vfr-section">
      <div className="vfr-wrap max-w-[720px] text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-[var(--vfr-bg-alt)] border border-[var(--vfr-rule)] flex items-center justify-center text-[var(--vfr-accent)]">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <span className="vfr-eyebrow mt-8 inline-flex">Bestätigung</span>
        <h1 className="vfr-h1 mt-4" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
          Vielen Dank für deine <em>Buchung.</em>
        </h1>
        <p className="mt-6 text-[var(--vfr-fg-muted)] leading-[1.6]">
          Deine Zahlung war erfolgreich. Wir haben dir die Buchungsbestätigung
          und die Rechnung soeben per E-Mail zugeschickt. Schau auch im
          Spam-Ordner nach, falls die Mail nicht direkt angezeigt wird.
        </p>
        <p className="mt-4 text-[var(--vfr-fg-muted)]">
          Fragen? Schreib uns an{" "}
          <a
            href="mailto:info@vfr-gmbh.de"
            className="text-[var(--vfr-accent-dark)] underline"
          >
            info@vfr-gmbh.de
          </a>{" "}
          oder ruf uns an.
        </p>
        <div className="mt-10 flex justify-center gap-4 flex-wrap">
          <Link href="/" className="vfr-btn vfr-btn--primary">
            Zur Startseite
          </Link>
          <Link href="/termine-preise" className="vfr-btn vfr-btn--ghost">
            Weitere Termine
          </Link>
        </div>
      </div>
    </section>
  );
}
