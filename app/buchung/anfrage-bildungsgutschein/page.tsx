import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Anfrage Bildungsgutschein",
  robots: { index: false, follow: false },
};

export default function GutscheinAnfragePage() {
  return (
    <section className="vfr-section">
      <div className="vfr-wrap max-w-[720px] text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-[var(--vfr-bg-alt)] border border-[var(--vfr-rule)] flex items-center justify-center text-[var(--vfr-accent)]">
          <BadgeCheck className="h-10 w-10" />
        </div>
        <span className="vfr-eyebrow mt-8 inline-flex">Anfrage gesendet</span>
        <h1 className="vfr-h1 mt-4" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
          Danke, wir melden uns <em>bei dir.</em>
        </h1>
        <p className="mt-6 text-[var(--vfr-fg-muted)] leading-[1.6]">
          Wir melden uns innerhalb eines Werktags und besprechen die Abwicklung
          deines Bildungsgutscheins.
        </p>
        <Link href="/" className="vfr-btn vfr-btn--primary mt-10">
          Zur Startseite
        </Link>
      </div>
    </section>
  );
}
