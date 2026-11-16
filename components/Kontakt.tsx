"use client";

import { useState } from "react";
import { site } from "@/lib/site";

export function Kontakt() {
  const [sent, setSent] = useState(false);

  return (
    <section className="vfr-section" id="kontakt">
      <div className="vfr-wrap grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        <div>
          <span className="vfr-eyebrow">Beratung & Kontakt</span>
          <h2 className="vfr-h2 mt-4 max-w-[15ch]">Erzähl uns, was du planst.</h2>
          <p className="text-[var(--vfr-fg-muted)] mt-2">
            Wir melden uns innerhalb eines Werktags bei dir — per Mail oder
            Anruf, wie du es wünschst. Die Beratung ist kostenlos und
            unverbindlich.
          </p>

          <div className="grid gap-3 mt-8">
            {[
              {
                k: "Telefon",
                v: (
                  <a
                    href={`tel:${site.phoneClean}`}
                    className="text-[var(--vfr-fg)] no-underline border-b border-[var(--vfr-accent)]"
                  >
                    {site.phone}
                  </a>
                ),
              },
              {
                k: "E-Mail",
                v: (
                  <a
                    href={`mailto:${site.email}`}
                    className="text-[var(--vfr-fg)] no-underline border-b border-[var(--vfr-accent)]"
                  >
                    {site.email}
                  </a>
                ),
              },
              {
                k: "Adresse",
                v: (
                  <>
                    {site.name}
                    <br />
                    {site.address.street}
                    <br />
                    {site.address.zip} {site.address.city}
                  </>
                ),
              },
              {
                k: "Bürozeit",
                v: (
                  <>
                    Mo – Fr, 07:30 – 16:00 Uhr
                    <br />
                    Sa nach Vereinbarung
                  </>
                ),
              },
            ].map((d) => (
              <div
                key={d.k}
                className="grid grid-cols-[110px_1fr] gap-4 pb-4 border-b border-[var(--vfr-rule)] text-[0.95rem]"
              >
                <div className="text-[var(--vfr-fg-soft)] text-[0.72rem] uppercase tracking-[0.1em] font-semibold pt-1">
                  {d.k}
                </div>
                <div className="text-[var(--vfr-fg)]">{d.v}</div>
              </div>
            ))}
          </div>
        </div>

        <form
          className="bg-[var(--vfr-card)] border border-[var(--vfr-rule)] p-8"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          {sent ? (
            <div className="py-10 text-center">
              <div className="text-[var(--vfr-accent)] font-[family-name:var(--font-serif)] text-[1.3rem] mb-2">
                Vielen Dank!
              </div>
              <p className="text-[var(--vfr-fg-muted)]">
                Wir melden uns innerhalb eines Werktags bei dir.
              </p>
            </div>
          ) : (
            <>
              <FormLabel htmlFor="anliegen">Dein Anliegen</FormLabel>
              <FormSelect id="anliegen" name="anliegen">
                <option>Ich möchte Fahrlehrer werden</option>
                <option>Ich suche eine Pflichtfortbildung</option>
                <option>Ich habe Fragen zum Bildungsgutschein</option>
                <option>Allgemeine Beratungsanfrage</option>
              </FormSelect>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <FormLabel htmlFor="vorname">Vorname</FormLabel>
                  <FormInput id="vorname" name="vorname" required />
                </div>
                <div>
                  <FormLabel htmlFor="nachname">Nachname</FormLabel>
                  <FormInput id="nachname" name="nachname" required />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <FormLabel htmlFor="email">E-Mail</FormLabel>
                  <FormInput id="email" name="email" type="email" required />
                </div>
                <div>
                  <FormLabel htmlFor="tel">Telefon (optional)</FormLabel>
                  <FormInput id="tel" name="tel" type="tel" />
                </div>
              </div>

              <FormLabel htmlFor="kontaktweg">Bevorzugter Kontaktweg</FormLabel>
              <FormSelect id="kontaktweg" name="kontaktweg">
                <option>E-Mail</option>
                <option>Telefon</option>
                <option>WhatsApp</option>
              </FormSelect>

              <FormLabel htmlFor="nachricht">Nachricht (optional)</FormLabel>
              <textarea
                id="nachricht"
                name="nachricht"
                placeholder="Worum geht es?"
                className="w-full p-3 border border-[var(--vfr-rule)] bg-[var(--vfr-bg)] font-sans text-[0.95rem] text-[var(--vfr-fg)] mb-4 rounded-[2px] focus:outline-2 focus:outline-[var(--vfr-accent)] focus:border-[var(--vfr-accent)] min-h-[90px] resize-y"
              />

              <label className="text-[0.78rem] text-[var(--vfr-fg-muted)] mb-4 flex gap-2 items-start">
                <input type="checkbox" required className="mt-1" />
                <span>
                  Ich habe die{" "}
                  <a href="/datenschutz" className="text-[var(--vfr-accent-dark)] underline">
                    Datenschutzerklärung
                  </a>{" "}
                  gelesen und bin damit einverstanden, dass meine Angaben zur
                  Bearbeitung der Anfrage verwendet werden.
                </span>
              </label>

              <button
                type="submit"
                className="w-full bg-[var(--vfr-fg)] text-[var(--vfr-bg)] py-4 px-6 font-sans text-[0.95rem] font-semibold hover:bg-[var(--vfr-accent)] transition rounded-[2px] tracking-wide"
              >
                Beratung anfragen
              </button>
            </>
          )}
        </form>
      </div>
    </section>
  );
}

function FormLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-[0.74rem] font-semibold mb-1.5 uppercase tracking-[0.08em] text-[var(--vfr-fg-muted)]"
    >
      {children}
    </label>
  );
}

function FormInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full p-3 border border-[var(--vfr-rule)] bg-[var(--vfr-bg)] font-sans text-[0.95rem] text-[var(--vfr-fg)] mb-4 rounded-[2px] focus:outline-2 focus:outline-[var(--vfr-accent)] focus:border-[var(--vfr-accent)]"
    />
  );
}

function FormSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="w-full p-3 border border-[var(--vfr-rule)] bg-[var(--vfr-bg)] font-sans text-[0.95rem] text-[var(--vfr-fg)] mb-4 rounded-[2px] focus:outline-2 focus:outline-[var(--vfr-accent)] focus:border-[var(--vfr-accent)]"
    />
  );
}
