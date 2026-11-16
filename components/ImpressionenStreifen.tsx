"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Slide = { src: string; alt: string; label?: string };

// Handverlesene Highlight-Bilder — Mischung aus Ausbildung, Praxis, Gemeinschaft, Blaulicht.
const slides: Slide[] = [
  { src: "/hero/hero-gruppe.jpg", alt: "Lehrgangsgruppe vor der VFR-Fahrzeugflotte", label: "Lehrgangsgruppe" },
  { src: "/hero/hero-schulungsraum.jpg", alt: "Vorbereiteter Schulungsraum mit VFR-Ordnern", label: "Schulungsraum" },
  { src: "/impressionen/sichertraining-gruppe-sommer.jpg", alt: "Fahrsicherheitstraining mit der Gruppe", label: "Fahrsicherheitstraining" },
  { src: "/hero/hero-fahrsicherheit.jpg", alt: "Praxistraining auf unserem Übungsplatz", label: "Praxis vor Ort" },
  { src: "/hero/hero-terrasse.jpg", alt: "VFR-Außenterrasse mit Liegestühlen", label: "Pause auf der Terrasse" },
  { src: "/hero/hero-dart.jpg", alt: "Dart-Bereich im Pausenraum", label: "Pausenraum mit Dart" },
  { src: "/impressionen/weihnachtsfeier.jpg", alt: "Weihnachtsfeier mit Teilnehmern", label: "Gemeinsame Feiern" },
  { src: "/impressionen/fortbildung-mittagessen.jpg", alt: "Gemeinsames Mittagessen in Fortbildungen", label: "Gemeinsames Essen" },
  { src: "/feuerwehr/fw-truck-112.jpg", alt: "Blaulicht-Ausbildung — Feuerwehr-LKW", label: "Blaulicht-Ausbildung" },
  { src: "/impressionen/lernen-draussen.jpg", alt: "Lernen im Außenbereich", label: "Lernen im Freien" },
];

const INTERVAL_MS = 4500;

export function ImpressionenStreifen() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section
      aria-labelledby="impressionen-streifen-title"
      className="relative overflow-hidden"
      style={{ height: "clamp(420px, 58vh, 620px)" }}
    >
      {/* Slides-Stack mit Ken-Burns-Zoom + Crossfade */}
      {slides.map((s, i) => (
        <div
          key={s.src}
          aria-hidden={i !== index}
          style={{
            position: "absolute",
            inset: 0,
            opacity: i === index ? 1 : 0,
            transition: "opacity 1.6s ease-in-out",
            zIndex: i === index ? 1 : 0,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: i === index ? "scale(1.08)" : "scale(1)",
              transition: `transform ${INTERVAL_MS + 2000}ms linear`,
            }}
          >
            <Image
              src={s.src}
              alt={s.alt}
              fill
              priority={i === 0}
              className="object-cover"
              sizes="100vw"
            />
          </div>
        </div>
      ))}

      {/* Dunkler Vignette-Overlay für Textkontrast */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.25) 40%, rgba(0,0,0,0.75) 100%)",
        }}
      />

      {/* Inhalt: Eyebrow + Titel + CTA + Mini-Label unten */}
      <div className="relative z-20 h-full flex flex-col justify-between py-10 sm:py-14">
        <div className="vfr-wrap">
          <span
            className="vfr-eyebrow"
            style={{ color: "#fff", opacity: 0.9 }}
          >
            VFR erleben
          </span>
          <h2
            id="impressionen-streifen-title"
            className="mt-3"
            style={{
              color: "#fff",
              fontFamily: "var(--font-serif), Georgia, serif",
              fontWeight: 300,
              fontSize: "clamp(32px, 4.8vw, 56px)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              maxWidth: "18ch",
              textShadow: "0 2px 20px rgba(0,0,0,0.4)",
            }}
          >
            So sieht&apos;s bei uns aus.
          </h2>
          <p
            className="mt-5 font-light max-w-[520px]"
            style={{
              color: "rgba(255,255,255,0.92)",
              fontSize: 17,
              lineHeight: 1.55,
              textShadow: "0 1px 10px rgba(0,0,0,0.35)",
            }}
          >
            Schulungsräume, eigene Fahrzeug-Flotte, Praxistraining und das, was
            uns zu mehr als einer Fahrlehrerschule macht — Pausen, Events,
            Gemeinschaft.
          </p>
        </div>

        {/* Unten: CTA + aktuelles Bild-Label + Dots */}
        <div className="vfr-wrap flex flex-wrap items-end justify-between gap-6">
          <Link
            href="/erleben"
            className="inline-flex items-center gap-4 group no-underline"
            style={{
              background: "var(--vfr-accent)",
              color: "#fff",
              padding: "16px 24px 16px 28px",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              transition: "background 0.25s ease",
            }}
          >
            <span>Alle Impressionen ansehen</span>
            <span
              className="flex items-center justify-center group-hover:translate-x-1 transition-transform"
              style={{
                background: "rgba(255,255,255,0.18)",
                width: 32,
                height: 32,
                borderRadius: "50%",
              }}
              aria-hidden
            >
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>

          <div
            className="flex flex-col items-end gap-2"
            style={{ color: "rgba(255,255,255,0.9)" }}
          >
            <div
              style={{
                fontSize: 13,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontWeight: 500,
                textShadow: "0 1px 8px rgba(0,0,0,0.5)",
              }}
            >
              {slides[index].label}
            </div>
            <div
              className="flex gap-1.5"
              role="tablist"
              aria-label="Impressionen"
            >
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Bild ${i + 1} von ${slides.length}`}
                  onClick={() => setIndex(i)}
                  style={{
                    width: i === index ? 22 : 8,
                    height: 4,
                    borderRadius: 2,
                    border: "none",
                    background:
                      i === index
                        ? "#fff"
                        : "rgba(255,255,255,0.45)",
                    cursor: "pointer",
                    padding: 0,
                    transition: "all 0.3s ease",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
