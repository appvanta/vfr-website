"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, Calendar, MessageCircle, Phone, X } from "lucide-react";
import { site } from "@/lib/site";

/**
 * Floating Schnellzugriff am rechten Rand — WhatsApp, Email, Beratungs-Termin,
 * Telefon. Auf Mobile als kompakte FAB-Leiste unten rechts,
 * auf Desktop als vertikale Spalte rechts mitte.
 */

const whatsappNumber = site.whatsapp.replace(/[^0-9+]/g, "").replace(/^\+/, "");
const whatsappText = encodeURIComponent(
  "Hallo VFR-Team, ich habe eine Frage zu eurer Ausbildung.",
);

const actions = [
  {
    key: "termin",
    label: "Termin",
    sub: "Beratung buchen",
    href: "/beratung",
    icon: Calendar,
    color: "#2080c0",
    bg: "#2080c0",
    text: "white",
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    sub: "Chat starten",
    href: `https://wa.me/${whatsappNumber}?text=${whatsappText}`,
    icon: MessageCircle,
    color: "#25D366",
    bg: "#25D366",
    text: "white",
    external: true,
  },
  {
    key: "email",
    label: "E-Mail",
    sub: site.email,
    href: `mailto:${site.email}`,
    icon: Mail,
    color: "#1e6ba0",
    bg: "white",
    text: "#1e6ba0",
  },
  {
    key: "phone",
    label: "Anrufen",
    sub: site.phone,
    href: `tel:${site.phoneClean}`,
    icon: Phone,
    color: "#1e6ba0",
    bg: "white",
    text: "#1e6ba0",
  },
] as const;

export function QuickActions() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className="fixed z-40 right-3 sm:right-5 top-1/2 -translate-y-1/2 hidden sm:flex flex-col gap-2"
      aria-label="Schnellzugriff"
    >
      {!collapsed && (
        <>
          {actions.map((a) => {
            const Icon = a.icon;
            const content = (
              <>
                <Icon className="h-5 w-5 shrink-0" />
                <div className="hidden lg:block">
                  <div className="font-semibold text-[0.82rem] leading-tight">
                    {a.label}
                  </div>
                  <div className="text-[0.7rem] opacity-80 leading-tight truncate max-w-[140px]">
                    {a.sub}
                  </div>
                </div>
              </>
            );
            const className =
              "flex items-center gap-3 p-3 lg:py-2.5 lg:px-4 rounded-full lg:rounded-md shadow-md hover:shadow-lg transition-all hover:scale-105 no-underline border border-black/5";
            const style = {
              background: a.bg,
              color: a.text,
            } as const;

            if ("external" in a && a.external) {
              return (
                <a
                  key={a.key}
                  href={a.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={className}
                  style={style}
                  aria-label={a.label}
                >
                  {content}
                </a>
              );
            }
            return (
              <Link
                key={a.key}
                href={a.href}
                className={className}
                style={style}
                aria-label={a.label}
              >
                {content}
              </Link>
            );
          })}
        </>
      )}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="hidden lg:flex self-end items-center justify-center w-7 h-7 rounded-full bg-white border border-[var(--vfr-rule)] text-[var(--vfr-fg-muted)] shadow-sm hover:bg-[var(--vfr-bg-alt)] transition text-[0.7rem]"
        aria-label={collapsed ? "Schnellzugriff einblenden" : "Schnellzugriff ausblenden"}
        title={collapsed ? "Einblenden" : "Ausblenden"}
      >
        {collapsed ? "›" : <X className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}

/**
 * Mobile-Variante: eine kompakte Leiste unten (floating bottom bar).
 */
export function QuickActionsMobile() {
  return (
    <div
      className="fixed sm:hidden z-40 bottom-0 left-0 right-0 bg-white border-t border-[var(--vfr-rule)] shadow-[0_-4px_12px_rgba(0,0,0,0.05)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0)" }}
      aria-label="Schnellzugriff"
    >
      <div className="grid grid-cols-4">
        {actions.map((a) => {
          const Icon = a.icon;
          const inner = (
            <>
              <Icon className="h-5 w-5" style={{ color: a.color }} />
              <span className="text-[0.68rem] font-medium text-[var(--vfr-fg)]">
                {a.label}
              </span>
            </>
          );
          const cls =
            "flex flex-col items-center gap-1 py-2.5 no-underline active:bg-[var(--vfr-bg-alt)] transition";
          if ("external" in a && a.external) {
            return (
              <a
                key={a.key}
                href={a.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cls}
                aria-label={a.label}
              >
                {inner}
              </a>
            );
          }
          return (
            <Link key={a.key} href={a.href} className={cls} aria-label={a.label}>
              {inner}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
