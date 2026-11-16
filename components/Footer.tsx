import Link from "next/link";
import Image from "next/image";
import { Instagram, Youtube, Facebook } from "lucide-react";
import { site } from "@/lib/site";

const groups = [
  {
    title: "Ausbildung",
    links: [
      { label: "Klasse BE", href: "/fahrlehrerausbildung#be" },
      { label: "Klasse A", href: "/fahrlehrerausbildung#a" },
      { label: "Klasse CE", href: "/fahrlehrerausbildung#ce" },
      { label: "Klasse DE", href: "/fahrlehrerausbildung#de" },
      { label: "Förderung", href: "/foerderung" },
    ],
  },
  {
    title: "Fortbildung",
    links: [
      { label: "§ 53 (1) FahrlG", href: "/fahrlehrerfortbildung" },
      { label: "§ 53 (2) ASF / FES", href: "/fahrlehrerfortbildung" },
      { label: "§ 53 (3)", href: "/fahrlehrerfortbildung" },
      { label: "§ 7 BKrFQV", href: "/fahrlehrerfortbildung" },
      { label: "Reform der Fahrausbildung", href: "/fahrlehrerfortbildung" },
    ],
  },
  {
    title: "Spezialschulungen",
    links: [
      { label: "Feuerwehr", href: "/feuerwehr" },
      { label: "Ladungssicherung", href: "/service" },
      { label: "Bürokräfte", href: "/service" },
      { label: "Smartboardschulung", href: "/service" },
      { label: "Alle Angebote", href: "/service" },
    ],
  },
  {
    title: "Über uns",
    links: [
      { label: "Team & Dozenten", href: "/team" },
      { label: "Impressionen", href: "/impressionen" },
      { label: "Stellenbörse", href: "/stellenboerse" },
      { label: "Downloads", href: "/downloads" },
      { label: "Gerichtsurteile", href: "/gerichtsurteile" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-[var(--vfr-dark)] text-[#cdd6dc] pt-16 pb-8" style={{ paddingBottom: "calc(2rem + env(safe-area-inset-bottom, 0px))" }}>
      <div className="vfr-wrap">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_repeat(4,1fr)] gap-10 lg:gap-12 pb-10 mb-10 border-b border-[var(--vfr-dark-rule)]">
          {/* Brand */}
          <div>
            <div className="bg-white inline-block p-3 rounded-sm">
              <Image
                src="/vfr-logo-trimmed.jpg"
                alt="VFR Verkehrsfachschule Rheinland GmbH"
                width={318}
                height={110}
                className="h-14 w-auto"
              />
            </div>
            <p className="text-[#8f9ba4] text-[0.88rem] mt-4 max-w-[30ch]">
              {site.name} — AZAV-zertifizierte Fahrlehrerausbildungsstätte in
              Niederkassel.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a
                href={site.social.instagram}
                aria-label="Instagram"
                className="p-2 bg-[var(--vfr-dark-alt)] hover:bg-[var(--vfr-accent)] transition rounded-[2px]"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={site.social.youtube}
                aria-label="YouTube"
                className="p-2 bg-[var(--vfr-dark-alt)] hover:bg-[var(--vfr-accent)] transition rounded-[2px]"
              >
                <Youtube className="h-4 w-4" />
              </a>
              <a
                href={site.social.facebook}
                aria-label="Facebook"
                className="p-2 bg-[var(--vfr-dark-alt)] hover:bg-[var(--vfr-accent)] transition rounded-[2px]"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          {groups.map((g) => (
            <div key={g.title}>
              <h4 className="font-sans text-[0.72rem] uppercase tracking-[0.1em] text-white mb-5 font-semibold">
                {g.title}
              </h4>
              <ul className="list-none p-0 m-0 grid gap-2.5 text-[0.88rem]">
                {g.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-[#cdd6dc] hover:text-white no-underline transition"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Kontakt */}
          <div>
            <h4 className="font-sans text-[0.72rem] uppercase tracking-[0.1em] text-white mb-5 font-semibold">
              Kontakt
            </h4>
            <ul className="list-none p-0 m-0 grid gap-2.5 text-[0.88rem]">
              <li>
                <a href={`tel:${site.phoneClean}`} className="text-[#cdd6dc] hover:text-white no-underline">
                  {site.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="text-[#cdd6dc] hover:text-white no-underline">
                  {site.email}
                </a>
              </li>
              <li>
                {site.address.street}
                <br />
                {site.address.zip} {site.address.city}
              </li>
              <li>Mo – Fr 07:30 – 16:00</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap justify-between gap-4 text-[0.8rem] text-[var(--vfr-fg-soft)]">
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/impressum" className="text-[var(--vfr-fg-soft)] hover:text-white no-underline">
              Impressum
            </Link>
            <Link href="/datenschutz" className="text-[var(--vfr-fg-soft)] hover:text-white no-underline">
              Datenschutz
            </Link>
            <Link href="/agb" className="text-[var(--vfr-fg-soft)] hover:text-white no-underline">
              AGB
            </Link>
            <Link href="/widerruf" className="text-[var(--vfr-fg-soft)] hover:text-white no-underline">
              Widerruf
            </Link>
          </div>
          <div>© {new Date().getFullYear()} {site.name}</div>
        </div>
      </div>
    </footer>
  );
}
