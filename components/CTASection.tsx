import Link from "next/link";
import { site } from "@/lib/site";

export function CTASection({
  title = "Noch Fragen? Wir beraten dich persönlich.",
  lead = "Kostenlose, unverbindliche Erstberatung — per Mail oder Anruf. Wir melden uns innerhalb eines Werktags.",
  primaryLabel = "Jetzt Beratung vereinbaren",
  primaryHref = "/kontakt",
  secondaryLabel = "Termine ansehen",
  secondaryHref = "/termine-preise",
}: {
  title?: string;
  lead?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}) {
  return (
    <section className="vfr-section bg-[var(--vfr-bg-alt)]">
      <div className="vfr-wrap grid lg:grid-cols-[1.4fr_1fr] gap-10 items-center">
        <div>
          <span className="vfr-eyebrow">Beratung & Kontakt</span>
          <h2 className="vfr-h2 mt-4">{title}</h2>
          <p className="text-[var(--vfr-fg-muted)] mt-2 max-w-[48ch]">{lead}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href={primaryHref} className="vfr-btn vfr-btn--primary">
              {primaryLabel}
            </Link>
            <Link href={secondaryHref} className="vfr-btn vfr-btn--ghost">
              {secondaryLabel}
            </Link>
          </div>
        </div>
        <div className="bg-[var(--vfr-card)] border border-[var(--vfr-rule)] p-7 text-[0.95rem]">
          <div className="grid gap-3">
            <div className="flex justify-between items-baseline border-b border-[var(--vfr-rule)] pb-2">
              <span className="text-[0.72rem] uppercase tracking-[0.1em] text-[var(--vfr-fg-soft)] font-semibold">Telefon</span>
              <a href={`tel:${site.phoneClean}`} className="text-[var(--vfr-fg)] font-[family-name:var(--font-serif)] font-medium no-underline">
                {site.phone}
              </a>
            </div>
            <div className="flex justify-between items-baseline border-b border-[var(--vfr-rule)] pb-2">
              <span className="text-[0.72rem] uppercase tracking-[0.1em] text-[var(--vfr-fg-soft)] font-semibold">E-Mail</span>
              <a href={`mailto:${site.email}`} className="text-[var(--vfr-fg)] no-underline">
                {site.email}
              </a>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-[0.72rem] uppercase tracking-[0.1em] text-[var(--vfr-fg-soft)] font-semibold">Bürozeit</span>
              <span className="text-[var(--vfr-fg)] text-right">Mo – Fr · 07:30 – 16:00</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
