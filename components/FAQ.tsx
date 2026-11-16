"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import type { FaqEntry } from "@/lib/faq";

type Props = {
  entries: FaqEntry[];
  eyebrow?: string;
  title?: string;
  subtitle?: string;
};

export function FAQ({
  entries,
  eyebrow = "FAQ",
  title = "Häufige Fragen.",
  subtitle = "Antworten auf die wichtigsten Fragen. Dein Thema nicht dabei? Frag unseren Chat oder ruf an.",
}: Props) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  if (entries.length === 0) return null;

  return (
    <section className="vfr-section bg-[var(--vfr-bg-alt)]">
      <div className="vfr-wrap">
        <div className="max-w-[640px] mb-10">
          <span className="vfr-eyebrow">{eyebrow}</span>
          <h2 className="vfr-h2 mt-3 flex items-center gap-3">
            <HelpCircle className="h-7 w-7 text-[var(--vfr-accent)] shrink-0" />
            {title}
          </h2>
          {subtitle && (
            <p className="text-[var(--vfr-fg-muted)] mt-3 text-[1rem]">
              {subtitle}
            </p>
          )}
        </div>

        <div className="max-w-[820px] divide-y divide-[var(--vfr-rule)] border-y border-[var(--vfr-rule)]">
          {entries.map((e, i) => {
            const open = openIdx === i;
            return (
              <div key={e.q}>
                <button
                  type="button"
                  onClick={() => setOpenIdx(open ? null : i)}
                  className="w-full flex items-center justify-between gap-4 py-5 text-left transition hover:text-[var(--vfr-accent)]"
                  aria-expanded={open}
                >
                  <span className="text-[1.02rem] font-semibold text-[var(--vfr-fg)]">
                    {e.q}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 text-[var(--vfr-fg-muted)] shrink-0 transition-transform ${
                      open ? "rotate-180 text-[var(--vfr-accent)]" : ""
                    }`}
                  />
                </button>
                {open && (
                  <div className="pb-5 pr-9 text-[0.95rem] text-[var(--vfr-fg)] leading-relaxed">
                    <p className="m-0">{e.a}</p>
                    {e.source && (
                      <p className="mt-3 text-[0.78rem] text-[var(--vfr-fg-soft)]">
                        Quelle: {e.source}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-8 text-[0.88rem] text-[var(--vfr-fg-muted)]">
          Noch Fragen? Nutze unseren Chat unten rechts, oder vereinbare direkt
          einen{" "}
          <a href="/beratung" className="text-[var(--vfr-accent-dark)] underline">
            Beratungstermin
          </a>
          .
        </p>

        {/* FAQPage Structured Data — für Google Rich Snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: entries.map((e) => ({
                "@type": "Question",
                name: e.q,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: e.a + (e.source ? ` (Quelle: ${e.source})` : ""),
                },
              })),
            }),
          }}
        />
      </div>
    </section>
  );
}
