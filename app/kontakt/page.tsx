import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { CallbackForm } from "@/components/CallbackForm";
import { site } from "@/lib/site";
import { IMG } from "@/lib/images";

export const metadata: Metadata = {
  title: "Kontakt & Anfahrt",
  description:
    "VFR Verkehrsfachschule Rheinland in Niederkassel — Telefon, WhatsApp, Mail, Rückruf-Service. 70 kostenlose Parkplätze auf dem Gelände.",
  alternates: { canonical: "/kontakt" },
};

export default function KontaktPage() {
  return (
    <>
      <PageHero
        eyebrow="Kontakt"
        image={IMG.kontakt}
        title="So erreichst du uns."
        lead="Persönlich, telefonisch, per WhatsApp oder über unseren Rückruf-Service. Wir freuen uns auf deine Nachricht."
      />

      <section className="vfr-section">
        <div className="vfr-wrap grid lg:grid-cols-[1fr_1.4fr] gap-10 lg:gap-16 items-start">
          <div>
            <span className="vfr-eyebrow">Direkter Draht</span>
            <h2 className="vfr-h2 mt-4 text-[1.6rem]">So erreichst du uns.</h2>

            <div className="grid gap-3 mt-6">
              <ContactRow k="Telefon">
                <a
                  href={`tel:${site.phoneClean}`}
                  className="text-[var(--vfr-fg)] no-underline border-b border-[var(--vfr-accent)]"
                >
                  {site.phone}
                </a>
              </ContactRow>
              <ContactRow k="WhatsApp">
                <a
                  href={`https://wa.me/${site.whatsapp.replace("+", "")}`}
                  className="text-[var(--vfr-fg)] no-underline border-b border-[var(--vfr-accent)]"
                >
                  Chat starten
                </a>
              </ContactRow>
              <ContactRow k="E-Mail">
                <a
                  href={`mailto:${site.email}`}
                  className="text-[var(--vfr-fg)] no-underline border-b border-[var(--vfr-accent)]"
                >
                  {site.email}
                </a>
              </ContactRow>
              <ContactRow k="Adresse">
                {site.address.street}
                <br />
                {site.address.zip} {site.address.city}
              </ContactRow>
              <ContactRow k="Bürozeit">
                {site.hours.map((h) => (
                  <div key={h.d}>
                    {h.d} · {h.h}
                  </div>
                ))}
              </ContactRow>
            </div>

            <div className="mt-8 border border-[var(--vfr-rule)] overflow-hidden">
              <iframe
                title="Anfahrt VFR Niederkassel"
                src="https://maps.google.com/maps?q=Karl-Hass-Stra%C3%9Fe%2013%2C%2053859%20Niederkassel&output=embed"
                className="w-full h-72 block"
                loading="lazy"
              />
            </div>

            <div className="mt-5 text-[0.88rem] text-[var(--vfr-fg-muted)]">
              <strong className="text-[var(--vfr-fg)]">70 kostenlose Parkplätze</strong>{" "}
              am Schulgelände — inklusive E-Ladesäulen.
            </div>
          </div>

          <div id="rueckruf">
            <CallbackForm />
          </div>
        </div>
      </section>
    </>
  );
}

function ContactRow({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[110px_1fr] gap-4 pb-3 border-b border-[var(--vfr-rule)] text-[0.95rem]">
      <div className="text-[var(--vfr-fg-soft)] text-[0.72rem] uppercase tracking-[0.1em] font-semibold pt-1">
        {k}
      </div>
      <div className="text-[var(--vfr-fg)]">{children}</div>
    </div>
  );
}
