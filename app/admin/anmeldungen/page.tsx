import type { Metadata } from "next";
import { headers } from "next/headers";
import { listRegistrations, listCourses } from "@/lib/flario";
import { formatEUR } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Angemeldet",
  robots: { index: false, follow: false },
};

/**
 * Interne Admin-Angemeldet-Liste.
 *
 * Zugriffsschutz: Basic-Auth via Env-Variable ADMIN_BASIC_AUTH ("user:pass").
 * In der Produktion hinter Vercel-Protection oder einem richtigen Login
 * schützen — die Basic-Auth hier ist nur Übergangs-Lösung.
 */

function checkAuth(authHeader: string | null) {
  const expected = process.env.ADMIN_BASIC_AUTH;
  if (!expected) return true; // ohne Env = offen für lokale Dev
  if (!authHeader?.startsWith("Basic ")) return false;
  const decoded = Buffer.from(authHeader.slice(6), "base64").toString("utf8");
  return decoded === expected;
}

export default async function AngemeldetPage() {
  const h = await headers();
  if (!checkAuth(h.get("authorization"))) {
    return (
      <section className="vfr-section">
        <div className="vfr-wrap">
          <h1 className="vfr-h2">Nicht autorisiert</h1>
          <p className="text-[var(--vfr-fg-muted)]">
            Bitte Basic-Auth-Zugangsdaten verwenden.
          </p>
        </div>
      </section>
    );
  }

  const [regs, courses] = await Promise.all([
    listRegistrations(),
    listCourses({ includeHidden: true }),
  ]);

  const courseTitle = (id: string) =>
    courses.find((c) => c.id === id)?.title ?? id;

  const statusBadge = (status: string) => {
    const s = {
      pending_confirmation: { label: "Prüfen", cls: "bg-amber-100 text-amber-800" },
      confirmed: { label: "Bestätigt", cls: "bg-emerald-100 text-emerald-800" },
      rejected: { label: "Abgelehnt", cls: "bg-rose-100 text-rose-800" },
      cancelled: { label: "Storniert", cls: "bg-stone-100 text-stone-800" },
    }[status] ?? { label: status, cls: "bg-stone-100 text-stone-800" };
    return (
      <span className={`inline-block px-2 py-0.5 text-[0.75rem] rounded ${s.cls}`}>
        {s.label}
      </span>
    );
  };

  return (
    <section className="vfr-section">
      <div className="vfr-wrap">
        <span className="vfr-eyebrow">Admin</span>
        <h1 className="vfr-h2 mt-3">Angemeldete Teilnehmer.</h1>
        <p className="text-[var(--vfr-fg-muted)] mt-2 max-w-[60ch]">
          Hier erscheinen alle Anmeldungen über die Website. Nach Prüfung wird
          die Bestätigung direkt in Flario gemacht — die Liste hier dient als
          Backup / Übersicht.
        </p>

        {regs.length === 0 ? (
          <p className="mt-10 text-[var(--vfr-fg-muted)]">
            Noch keine Anmeldungen.
          </p>
        ) : (
          <div className="mt-8 overflow-x-auto border border-[var(--vfr-rule)]">
            <table className="w-full text-[0.88rem]">
              <thead className="bg-[var(--vfr-bg-alt)] text-left">
                <tr>
                  <th className="p-3">Datum</th>
                  <th className="p-3">Teilnehmer</th>
                  <th className="p-3">Rechnungs-Empfänger</th>
                  <th className="p-3">Kurs</th>
                  <th className="p-3">Zahlung</th>
                  <th className="p-3">Betrag</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {regs.map((r) => (
                  <tr key={r.registrationId} className="border-t border-[var(--vfr-rule)] align-top">
                    <td className="p-3 whitespace-nowrap text-[var(--vfr-fg-muted)]">
                      {new Date(r.createdAt).toLocaleDateString("de-DE")}
                    </td>
                    <td className="p-3">
                      {r.participants.map((p, i) => (
                        <div key={i} className={i > 0 ? "mt-2 pt-2 border-t border-[var(--vfr-rule)]" : ""}>
                          <div className="font-medium text-[var(--vfr-fg)]">
                            {p.firstName} {p.lastName}
                          </div>
                          <div className="text-[var(--vfr-fg-soft)] text-[0.8rem]">
                            {p.email}
                          </div>
                        </div>
                      ))}
                    </td>
                    <td className="p-3">
                      {r.billing.company && (
                        <div className="font-medium text-[var(--vfr-fg)]">{r.billing.company}</div>
                      )}
                      <div className="text-[var(--vfr-fg)]">
                        {r.billing.firstName} {r.billing.lastName}
                      </div>
                      <div className="text-[var(--vfr-fg-soft)] text-[0.8rem]">
                        {r.billing.email}
                      </div>
                    </td>
                    <td className="p-3">{courseTitle(r.courseId)}</td>
                    <td className="p-3 whitespace-nowrap">{r.payment.method}</td>
                    <td className="p-3 whitespace-nowrap">
                      {formatEUR(r.payment.amountCents * r.participants.length)}
                      {r.participants.length > 1 && (
                        <div className="text-[0.75rem] text-[var(--vfr-fg-soft)]">
                          {r.participants.length}× {formatEUR(r.payment.amountCents)}
                        </div>
                      )}
                    </td>
                    <td className="p-3">{statusBadge(r.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-8 p-5 bg-[var(--vfr-bg-alt)] border border-[var(--vfr-rule)] rounded-sm">
          <h3 className="font-semibold text-[var(--vfr-fg)] mb-2">
            Workflow
          </h3>
          <ol className="list-decimal pl-5 text-[0.9rem] text-[var(--vfr-fg-muted)] space-y-1">
            <li>Anmeldung erscheint hier mit Status „Prüfen"</li>
            <li>
              Büro prüft in Flario und setzt den Status dort auf „bestätigt"
            </li>
            <li>
              Flario schickt einen Webhook zurück, Website sendet Bestätigungsmail
            </li>
            <li>Teilnehmer ist im Kurs eingetragen</li>
          </ol>
        </div>
      </div>
    </section>
  );
}
