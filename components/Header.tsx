"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { site } from "@/lib/site";

const nav = [
  { label: "Ausbildung", href: "/fahrlehrerausbildung" },
  { label: "Fortbildung", href: "/fahrlehrerfortbildung" },
  { label: "Weiterbildung", href: "/fahrlehrerweiterbildung" },
  { label: "Blaulicht", href: "/feuerwehr", accent: true },
  { label: "Termine", href: "/termine-preise" },
  { label: "Über uns", href: "/team" },
];

/** Welche URL-Präfixe unter welchen Nav-Punkt fallen (für aktive Markierung) */
const activeMatches: Record<string, string[]> = {
  "/fahrlehrerausbildung": ["/fahrlehrerausbildung", "/foerderung"],
  "/fahrlehrerfortbildung": ["/fahrlehrerfortbildung"],
  "/fahrlehrerweiterbildung": ["/fahrlehrerweiterbildung"],
  "/feuerwehr": ["/feuerwehr"],
  "/termine-preise": ["/termine-preise", "/buchung"],
  "/team": ["/team", "/impressionen", "/stellenboerse", "/gerichtsurteile", "/downloads", "/info-veranstaltungen"],
};

function isActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  const prefixes = activeMatches[href] ?? [href];
  return prefixes.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50">
      {/* Schlanke Top-Bar — nur Erreichbarkeit */}
      <div className="bg-[var(--vfr-topbar)] text-[#b3c6d6] text-[0.78rem] tracking-wide">
        <div className="vfr-wrap flex items-center justify-between gap-4 py-2 flex-wrap">
          <span>Mo – Fr · 07:30 – 16:00 Uhr</span>
          <span className="flex items-center gap-2">
            <a href={`tel:${site.phoneClean}`} className="text-white hover:text-[var(--vfr-accent-light)] transition">
              {site.phone}
            </a>
            <span className="text-[#3a5168]">·</span>
            <a href={`mailto:${site.email}`} className="text-white hover:text-[var(--vfr-accent-light)] transition">
              {site.email}
            </a>
          </span>
        </div>
      </div>

      {/* Hauptnavigation */}
      <div className="bg-[var(--vfr-bg)] border-b border-[var(--vfr-rule)] backdrop-blur-sm shadow-sm">
        <div className="vfr-wrap flex items-center justify-between py-4 gap-6">
          <Link href="/" className="flex items-center gap-4 no-underline">
            <Image
              src="/vfr-logo-trimmed.jpg"
              alt="VFR Verkehrsfachschule Rheinland GmbH"
              width={318}
              height={110}
              priority
              className="h-16 lg:h-20 w-auto"
            />
            <span className="hidden sm:inline text-[0.88rem] tracking-[0.1em] uppercase text-[var(--vfr-fg-muted)] font-semibold leading-tight">
              VFR Verkehrsfachschule<br />Rheinland GmbH
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-7">
            {nav.map((item) => {
              const active = isActive(pathname, item.href);
              if (item.accent) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center gap-2 text-[0.92rem] hover:opacity-80 transition no-underline relative pb-1 ${
                      active ? "font-bold" : "font-semibold"
                    }`}
                    style={{
                      color: "#1d4ed8",
                      borderBottom: active ? "2px solid #1d4ed8" : "2px solid transparent",
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "#1d4ed8",
                        display: "inline-block",
                        boxShadow: "0 0 0 2px rgba(29,78,216,0.25)",
                        animation: "pulseDot 2s infinite",
                      }}
                    />
                    {item.label}
                  </Link>
                );
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-[0.92rem] transition no-underline relative pb-1 ${
                    active
                      ? "font-bold text-[var(--vfr-accent)]"
                      : "font-medium text-[var(--vfr-fg)] hover:text-[var(--vfr-accent)]"
                  }`}
                  style={{
                    borderBottom: active
                      ? "2px solid var(--vfr-accent)"
                      : "2px solid transparent",
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/kontakt"
              className={`px-5 py-2.5 text-[0.92rem] font-semibold transition rounded-[2px] no-underline ${
                isActive(pathname, "/kontakt")
                  ? "bg-[var(--vfr-accent)] text-white"
                  : "bg-[var(--vfr-fg)] text-[var(--vfr-bg)] hover:bg-[var(--vfr-accent)] hover:text-white"
              }`}
            >
              Beratung
            </Link>
          </nav>

          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 text-[var(--vfr-fg)]"
            aria-label={open ? "Menü schließen" : "Menü öffnen"}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile-Menü */}
      {open && (
        <nav className="lg:hidden bg-[var(--vfr-bg)] border-b border-[var(--vfr-rule)]">
          <div className="vfr-wrap py-4 flex flex-col">
            {nav.map((item) => {
              const active = isActive(pathname, item.href);
              const baseColor = item.accent ? "#1d4ed8" : "var(--vfr-fg)";
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="py-3 text-[0.95rem] border-b border-[var(--vfr-rule)] no-underline inline-flex items-center gap-2 pl-3 transition"
                  style={{
                    color: baseColor,
                    fontWeight: active || item.accent ? 700 : 500,
                    borderLeft: active
                      ? `3px solid ${item.accent ? "#1d4ed8" : "var(--vfr-accent)"}`
                      : "3px solid transparent",
                    background: active ? "var(--vfr-bg-alt)" : "transparent",
                  }}
                >
                  {item.accent && (
                    <span
                      aria-hidden="true"
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "#1d4ed8",
                        display: "inline-block",
                      }}
                    />
                  )}
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/kontakt"
              onClick={() => setOpen(false)}
              className="mt-4 bg-[var(--vfr-fg)] text-[var(--vfr-bg)] py-3 text-center font-semibold rounded-[2px] no-underline"
            >
              Beratung vereinbaren
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
