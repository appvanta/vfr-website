/**
 * Visualisiert den offiziellen Ausbildungsablauf der BE-Fahrlehrerausbildung
 * als vertikale Zeitleiste mit Start/Ziel und Hover-Zusatzinfos.
 */

type AblaufItem = {
  title: string;
  sub?: string;
  emphasize?: boolean;
  /** Erscheint bei Mouse-Over */
  detail?: string;
};

type Phase = {
  nr: string;
  dauer: string;
  einheit: string;
  items: AblaufItem[];
};

type Meilenstein = {
  label: string;
  detail?: string;
};

const PHASEN: Phase[] = [
  {
    nr: "1",
    dauer: "1",
    einheit: "Monat",
    items: [
      {
        title: "Einführungs- und Auswertungsphase",
        sub: "in der VFR",
        emphasize: true,
        detail:
          "Wir holen dich dort ab, wo du stehst: Einstiegs-Workshop, Lernmethoden, erste Grundlagen in Pädagogik und Didaktik. Du bekommst deinen festen Dozenten als Ansprechpartner.",
      },
      {
        title: "Hospitation",
        sub: "in der Ausbildungsfahrschule",
        detail:
          "Wir vermitteln dir eine passende Ausbildungsfahrschule in deiner Region, wenn du noch keine hast. Du begleitest einen erfahrenen Fahrlehrer und wir stimmen uns regelmäßig mit dir ab.",
      },
    ],
  },
  {
    nr: "2",
    dauer: "7",
    einheit: "Monate",
    items: [
      {
        title: "Theoretische Ausbildung",
        sub: "in der VFR",
        emphasize: true,
        detail:
          "Wir unterrichten dich Montag bis Freitag in Niederkassel: Verkehrsrecht, Fahrphysik, Fahrzeugtechnik, Pädagogik, Didaktik. Zusätzlich jeden Dienstag kostenloses Repetitorium.",
      },
      {
        title: "Fahrpraktische Prüfung",
        detail:
          "Wir bereiten dich gezielt auf die Prüfungssituation vor — Autobahn, Überland, Grenzbereich — und begleiten dich bis zur bestandenen Prüfung.",
      },
      {
        title: "Hospitation",
        sub: "in der Ausbildungsfahrschule",
        detail:
          "Weitere Hospitationstage, bei denen wir im Austausch mit dir und deiner Fahrschule bleiben, um deinen Fortschritt zu sichern.",
      },
      {
        title: "Fachkundeprüfung",
        detail:
          "Wir stellen sicher, dass du prüfungsreif bist: gezielte Wiederholungen, Simulationen und individuelles Feedback vor der schriftlichen Abschlussprüfung.",
      },
    ],
  },
];

const MEILENSTEIN_MITTE: Meilenstein = {
  label: "Erteilung der Anwärterbefugnis",
  detail:
    "Du darfst jetzt eigenständig unterrichten. Wir begleiten dich auch in dieser Phase weiter mit Reflexionstagen, telefonischer Beratung und Austausch.",
};

const PHASE_3: Phase = {
  nr: "3",
  dauer: "4",
  einheit: "Monate",
  items: [
    {
      title: "Praktische Ausbildung",
      sub: "in der Ausbildungsfahrschule",
      detail:
        "Du unterrichtest echte Fahrschüler — und wir bleiben für dich erreichbar: per Telefon, Mail oder persönlichem Termin, wenn du Fragen oder Herausforderungen hast.",
    },
    {
      title: "2 Reflexionstage",
      sub: "in der VFR",
      emphasize: true,
      detail:
        "Du kommst zurück zu uns an die VFR. Wir sprechen deine ersten echten Unterrichts-Erfahrungen durch, geben Feedback und arbeiten an deinen individuellen Entwicklungsfeldern.",
    },
    {
      title: "Reflexionswoche",
      sub: "in der VFR",
      emphasize: true,
      detail:
        "Eine komplette Woche bei uns. Wir bereiten dich intensiv auf die Lehrprobe vor — Simulationen, Probedurchläufe, individuelles Coaching.",
    },
    {
      title: "Theoretische und praktische Lehrprobe",
      sub: "in der Ausbildungsfahrschule",
      detail:
        "Deine Abschlussprüfung. Wir sind vorab erreichbar für letzte Fragen und stehen dir auch nach der Prüfung weiter zur Seite.",
    },
  ],
};

const MEILENSTEIN_ZIEL: Meilenstein = {
  label: "Erteilung der Fahrlehrerlaubnis Klasse BE",
  detail:
    "Du bist Fahrlehrer. Und auch jetzt bist du bei uns richtig: Pflichtfortbildungen, Zusatzqualifikationen (A, CE, DE, Seminarleiter) — alles in deiner VFR.",
};

export function AusbildungAblauf() {
  return (
    <section className="vfr-section" style={{ paddingBlock: "80px" }}>
      <div className="vfr-wrap">
        <div className="max-w-[720px] mb-10">
          <span className="vfr-eyebrow">So läuft die Ausbildung</span>
          <h2 className="vfr-h2 mt-3">Dein Weg zur Fahrlehrerlaubnis BE.</h2>
          <p
            className="mt-4"
            style={{
              color: "var(--vfr-fg-muted)",
              fontSize: 17,
              lineHeight: 1.6,
            }}
          >
            12 Monate von der Einführung bis zur Fahrlehrerlaubnis.
            <span
              style={{ color: "var(--vfr-accent)", fontWeight: 500 }}
            >
              {" "}
              Fahre mit der Maus über die Stationen
            </span>{" "}
            und sieh, wie wir dich bei jedem Schritt begleiten.
          </p>
        </div>

        <div
          className="vfr-ablauf"
          style={{
            position: "relative",
            paddingLeft: "clamp(90px, 15vw, 120px)",
            maxWidth: 820,
          }}
        >
          {/* Vertikale Zeitachse */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "clamp(60px, 10vw, 80px)",
              top: 0,
              bottom: 0,
              width: 3,
              background: "var(--vfr-accent)",
              borderRadius: 2,
            }}
          />

          {/* Start-Marker oben */}
          <StartZielMarker label="Start" subtitle="Deine Fahrlehrer-Reise beginnt" />

          {PHASEN.map((p) => (
            <PhaseBlock key={p.nr} phase={p} />
          ))}

          <MeilensteinBalken {...MEILENSTEIN_MITTE} />

          <PhaseBlock phase={PHASE_3} />

          <MeilensteinBalken {...MEILENSTEIN_ZIEL} big />

          {/* Ziel-Marker unten */}
          <StartZielMarker label="Ziel erreicht" subtitle="Fahrlehrer BE" isZiel />
        </div>
      </div>

      <style>{`
        .vfr-ablauf-item {
          background: var(--vfr-bg-alt);
          border: 1px solid var(--vfr-rule);
          padding: 14px 18px;
          transition: border-color 0.18s, box-shadow 0.18s, transform 0.18s;
          position: relative;
        }
        .vfr-ablauf-item:hover {
          border-color: var(--vfr-accent);
          box-shadow: 0 4px 16px rgba(23, 105, 165, 0.12);
          z-index: 2;
        }
        .vfr-ablauf-detail {
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          transition: max-height 0.3s ease, opacity 0.2s, margin-top 0.3s;
          font-size: 13.5px;
          color: var(--vfr-fg-muted);
          line-height: 1.5;
        }
        .vfr-ablauf-item:hover .vfr-ablauf-detail,
        .vfr-ablauf-item:focus-within .vfr-ablauf-detail {
          max-height: 200px;
          opacity: 1;
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px solid var(--vfr-rule);
        }
        .vfr-meilenstein {
          background: var(--vfr-accent);
          color: #fff;
          padding: 18px 24px;
          text-align: center;
          font-family: var(--font-serif), Georgia, serif;
          letter-spacing: -0.01em;
          transition: background 0.18s, transform 0.18s;
          cursor: default;
        }
        .vfr-meilenstein:hover {
          background: var(--vfr-accent-dark);
        }
        .vfr-meilenstein-detail {
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          transition: max-height 0.3s ease, opacity 0.2s, margin-top 0.3s, padding-top 0.3s;
          font-family: var(--font-sans), system-ui, sans-serif;
          font-size: 13.5px;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.92);
          font-weight: 400;
        }
        .vfr-meilenstein:hover .vfr-meilenstein-detail {
          max-height: 200px;
          opacity: 1;
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </section>
  );
}

function StartZielMarker({
  label,
  subtitle,
  isZiel = false,
}: {
  label: string;
  subtitle: string;
  isZiel?: boolean;
}) {
  return (
    <div
      style={{
        position: "relative",
        marginBottom: isZiel ? 0 : 36,
        marginTop: isZiel ? 24 : 0,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "calc(-1 * clamp(28px, 4vw, 34px) - 10px)",
          top: "50%",
          transform: "translateY(-50%)",
          width: 20,
          height: 20,
          background: "var(--vfr-accent)",
          borderRadius: "50%",
          border: "4px solid #fff",
          boxShadow: "0 0 0 2px var(--vfr-accent)",
          boxSizing: "content-box",
        }}
      />
      <div
        style={{
          fontFamily: "var(--font-serif), Georgia, serif",
          fontSize: 14,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "var(--vfr-accent)",
          fontWeight: 600,
          marginBottom: 2,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 14,
          color: "var(--vfr-fg-muted)",
        }}
      >
        {subtitle}
      </div>
    </div>
  );
}

function PhaseBlock({ phase }: { phase: Phase }) {
  return (
    <div style={{ position: "relative", marginBottom: 28 }}>
      <div
        style={{
          position: "absolute",
          left: "calc(-1 * clamp(90px, 15vw, 120px))",
          top: 2,
          width: "clamp(60px, 10vw, 72px)",
          textAlign: "right",
          fontFamily: "var(--font-serif), Georgia, serif",
        }}
      >
        <div
          style={{
            fontSize: 34,
            fontWeight: 500,
            color: "var(--vfr-accent)",
            lineHeight: 1,
          }}
        >
          {phase.dauer}
        </div>
        <div
          style={{
            fontSize: 12,
            color: "var(--vfr-fg-muted)",
            marginTop: 2,
            letterSpacing: "0.02em",
          }}
        >
          {phase.einheit}
        </div>
      </div>

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "calc(-1 * clamp(28px, 4vw, 34px) - 6px)",
          top: 10,
          width: 28,
          height: 28,
          background: "#fff",
          borderRadius: "50%",
          border: "3px solid var(--vfr-accent)",
          boxSizing: "content-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-sans), system-ui, sans-serif",
          fontSize: 14,
          fontWeight: 700,
          color: "var(--vfr-accent)",
        }}
      >
        {phase.nr === "1" ? "1" : phase.nr === "2" ? "2" : "3"}
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        {phase.items.map((item) => (
          <div
            key={item.title}
            className="vfr-ablauf-item"
            tabIndex={0}
          >
            <div
              style={{
                fontWeight: 600,
                fontSize: 15,
                color: "var(--vfr-fg)",
              }}
            >
              {item.title}
            </div>
            {item.sub && (
              <div
                style={{
                  fontSize: 13,
                  color: item.emphasize
                    ? "var(--vfr-accent)"
                    : "var(--vfr-fg-muted)",
                  marginTop: 2,
                }}
              >
                {item.sub}
              </div>
            )}
            {item.detail && (
              <div className="vfr-ablauf-detail">{item.detail}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function MeilensteinBalken({
  label,
  detail,
  big = false,
}: Meilenstein & { big?: boolean }) {
  return (
    <div style={{ position: "relative", margin: "36px 0 36px 0" }}>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "calc(-1 * clamp(28px, 4vw, 34px) - 10px)",
          top: 32,
          width: 20,
          height: 20,
          background: "var(--vfr-accent)",
          borderRadius: "50%",
          border: "4px solid #fff",
          boxShadow: "0 0 0 2px var(--vfr-accent)",
          boxSizing: "content-box",
        }}
      />
      <div
        className="vfr-meilenstein"
        tabIndex={0}
        style={{
          padding: big ? "22px 24px" : "18px 24px",
          fontSize: big ? 22 : 18,
          fontWeight: 500,
        }}
      >
        <div>{label}</div>
        {detail && <div className="vfr-meilenstein-detail">{detail}</div>}
      </div>
    </div>
  );
}
