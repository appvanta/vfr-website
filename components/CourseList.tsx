"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutGrid, Rows3, ArrowRight } from "lucide-react";
import { type Course, CATEGORY_LABEL } from "@/lib/flario";
import { CourseCard } from "./CourseCard";
import { formatDate, formatEUR } from "@/lib/utils";

type ViewMode = "cards" | "list";
const STORAGE_KEY = "vfr-course-view";

export function CourseList({ courses }: { courses: Course[] }) {
  const [view, setView] = useState<ViewMode>("cards");
  const [ready, setReady] = useState(false);

  // Gespeicherte Ansicht laden
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "list" || saved === "cards") setView(saved);
    } catch {}
    setReady(true);
  }, []);

  function setAndPersist(v: ViewMode) {
    setView(v);
    try {
      localStorage.setItem(STORAGE_KEY, v);
    } catch {}
  }

  if (courses.length === 0) return null;

  return (
    <div>
      {/* Toggle oben rechts */}
      <div className="flex justify-end mb-5">
        <div
          className="inline-flex items-center rounded-full border border-[var(--vfr-rule)] bg-[var(--vfr-card)] p-1"
          role="tablist"
          aria-label="Ansicht"
        >
          <button
            type="button"
            onClick={() => setAndPersist("cards")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[0.82rem] font-medium transition ${
              view === "cards"
                ? "bg-[var(--vfr-accent)] text-white"
                : "text-[var(--vfr-fg-muted)] hover:text-[var(--vfr-fg)]"
            }`}
            aria-pressed={view === "cards"}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            Karten
          </button>
          <button
            type="button"
            onClick={() => setAndPersist("list")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[0.82rem] font-medium transition ${
              view === "list"
                ? "bg-[var(--vfr-accent)] text-white"
                : "text-[var(--vfr-fg-muted)] hover:text-[var(--vfr-fg)]"
            }`}
            aria-pressed={view === "list"}
          >
            <Rows3 className="h-3.5 w-3.5" />
            Liste
          </button>
        </div>
      </div>

      {/* Render */}
      {ready && view === "list" ? (
        <CourseTable courses={courses} />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      )}
    </div>
  );
}

function CourseTable({ courses }: { courses: Course[] }) {
  return (
    <>
      {/* Tabelle für Desktop */}
      <div className="hidden md:block border border-[var(--vfr-rule)] overflow-hidden rounded-sm">
        <table className="w-full text-[0.9rem]">
          <thead className="bg-[var(--vfr-topbar)] text-white text-left">
            <tr>
              <th className="px-4 py-3 font-semibold">Gruppe</th>
              <th className="px-4 py-3 font-semibold">Kurs</th>
              <th className="px-4 py-3 font-semibold whitespace-nowrap">Termin</th>
              <th className="px-4 py-3 font-semibold">Ort</th>
              <th className="px-4 py-3 font-semibold whitespace-nowrap">Verfügbarkeit</th>
              <th className="px-4 py-3 font-semibold text-right whitespace-nowrap">Preis</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {courses.map((c, i) => {
              const soldOut = c.seatsAvailable <= 0;
              return (
                <tr
                  key={c.id}
                  className={`border-t border-[var(--vfr-rule)] hover:bg-[var(--vfr-bg-alt)] transition ${
                    i % 2 === 1 ? "bg-[var(--vfr-bg-alt)]/40" : ""
                  }`}
                >
                  <td className="px-4 py-3 text-[var(--vfr-fg-muted)]">
                    {CATEGORY_LABEL[c.category]}
                  </td>
                  <td className="px-4 py-3 font-medium text-[var(--vfr-fg)]">
                    {c.title}
                    {c.subtitle && (
                      <div className="text-[0.8rem] text-[var(--vfr-fg-soft)] font-normal mt-0.5">
                        {c.subtitle}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap tabular-nums">
                    {formatDate(c.startDate)}
                  </td>
                  <td className="px-4 py-3 text-[var(--vfr-fg-muted)]">
                    {c.location}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {soldOut ? (
                      <span className="text-[#b84b2a] font-semibold">
                        Ausgebucht
                      </span>
                    ) : c.seatsVisible ? (
                      <span className="text-[var(--vfr-fg-muted)]">
                        noch {c.seatsAvailable} frei
                      </span>
                    ) : (
                      <span className="text-[var(--vfr-fg-muted)]">
                        Verfügbar
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap font-semibold tabular-nums">
                    {c.priceCents === 0 ? "Preis auf Anfrage" : formatEUR(c.priceCents)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={soldOut ? "/kontakt#rueckruf" : `/buchung/${c.id}`}
                      className="inline-flex items-center gap-1 bg-[var(--vfr-accent)] text-white px-4 py-2 rounded-full text-[0.8rem] font-semibold hover:bg-[var(--vfr-accent-dark)] transition no-underline"
                    >
                      Details
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Kompaktere Listen-Darstellung für Mobile */}
      <div className="md:hidden divide-y divide-[var(--vfr-rule)] border-y border-[var(--vfr-rule)]">
        {courses.map((c) => {
          const soldOut = c.seatsAvailable <= 0;
          return (
            <Link
              key={c.id}
              href={soldOut ? "/kontakt#rueckruf" : `/buchung/${c.id}`}
              className="block py-4 no-underline group"
            >
              <div className="text-[0.7rem] uppercase tracking-[0.1em] text-[var(--vfr-accent)] font-semibold mb-1">
                {CATEGORY_LABEL[c.category]}
              </div>
              <div className="font-semibold text-[var(--vfr-fg)] text-[0.98rem] group-hover:text-[var(--vfr-accent)] transition">
                {c.title}
              </div>
              <div className="flex items-center justify-between mt-2 text-[0.85rem] text-[var(--vfr-fg-muted)]">
                <div>
                  <span className="tabular-nums">{formatDate(c.startDate)}</span>
                  {soldOut && (
                    <>
                      <span className="mx-2">·</span>
                      <span className="text-[#b84b2a] font-semibold">Ausgebucht</span>
                    </>
                  )}
                  {!soldOut && c.seatsVisible && (
                    <>
                      <span className="mx-2">·</span>
                      <span>noch {c.seatsAvailable} frei</span>
                    </>
                  )}
                </div>
                <div className="font-semibold text-[var(--vfr-fg)] tabular-nums">
                  {c.priceCents === 0 ? "Preis auf Anfrage" : formatEUR(c.priceCents)}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
