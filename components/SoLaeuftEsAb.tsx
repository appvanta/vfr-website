import {
  MessageCircle,
  BookOpen,
  Users,
  GraduationCap,
} from "lucide-react";

const stationen = [
  { nr: "1", t: "Beratung", d: "kostenlos & unverbindlich", Icon: MessageCircle },
  { nr: "2", t: "Theorie & Praxis", d: "8 Monate", Icon: BookOpen },
  { nr: "3", t: "Lehrpraktikum", d: "≥ 4 Monate", Icon: Users },
  { nr: "4", t: "Fahrlehrerschein", d: "Prüfung + Berufsstart", Icon: GraduationCap },
];

export function SoLaeuftEsAb() {
  return (
    <section
      style={{
        background: "var(--vfr-bg-alt)",
        paddingBlock: "60px",
        borderTop: "1px solid var(--vfr-rule)",
        borderBottom: "1px solid var(--vfr-rule)",
      }}
    >
      <div className="vfr-wrap">
        <div className="text-[0.75rem] uppercase tracking-[0.12em] text-[var(--vfr-fg-muted)] font-semibold mb-5">
          So läuft es ab
        </div>
        <div className="relative">
          <div
            aria-hidden="true"
            className="hidden sm:block absolute top-6 left-[12%] right-[12%] h-0.5"
            style={{ background: "var(--vfr-accent)", opacity: 0.2 }}
          />
          <ol className="relative grid sm:grid-cols-4 gap-5 list-none p-0 m-0">
            {stationen.map((s) => {
              const Icon = s.Icon;
              return (
                <li
                  key={s.nr}
                  className="relative flex sm:flex-col items-center sm:text-center gap-3"
                >
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-full bg-[var(--vfr-accent)] text-white flex items-center justify-center shadow-md ring-4 ring-[var(--vfr-bg-alt)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span
                      aria-hidden="true"
                      className="absolute -top-1 -right-1 bg-white border-2 border-[var(--vfr-accent)] text-[var(--vfr-accent)] text-[0.6rem] font-bold rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      {s.nr}
                    </span>
                  </div>
                  <div className="sm:mt-2">
                    <div className="font-semibold text-[var(--vfr-fg)] text-[0.95rem] leading-tight">
                      {s.t}
                    </div>
                    <div className="text-[0.8rem] text-[var(--vfr-fg-muted)] mt-0.5">
                      {s.d}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
