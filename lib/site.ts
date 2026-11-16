export const site = {
  name: "VFR Verkehrsfachschule Rheinland GmbH",
  shortName: "VFR",
  tagline: "Die Fahrlehrer Aus- und Weiterbildungsstätte",
  claim: "Mit uns in Ihre Zukunft.",
  foundingYear: 2010,
  managingDirector: "Andreas Hombach",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.vfr-gmbh.de",
  address: {
    street: "Karl-Hass-Str. 13",
    zip: "53859",
    city: "Niederkassel",
    country: "Deutschland",
  },
  phone: "+49 2208 919 626-0",
  phoneClean: "+4922089196260",
  whatsapp: "+4922089196260",
  email: "info@vfr-gmbh.de",
  hours: [
    { d: "Mo. – Fr.", h: "07:30 – 16:00 Uhr" },
    { d: "Samstag", h: "nach Vereinbarung" },
  ],
  stats: [
    { value: "269+", label: "abgeschlossene Ausbildungen" },
    { value: "250+", label: "geschaffene Arbeitsplätze" },
    { value: "100%", label: "zertifiziert nach AZAV" },
    { value: "4,9★", label: "Google-Bewertung" },
  ],
  social: {
    instagram: "https://www.instagram.com/vfr_gmbh",
    youtube: "https://www.youtube.com/@vfr-gmbh",
    tiktok: "https://www.tiktok.com/@vfr_gmbh",
    facebook: "https://www.facebook.com/vfrgmbh",
  },
  nav: [
    { label: "Fahrlehrerausbildung", href: "/fahrlehrerausbildung" },
    { label: "Fortbildung", href: "/fahrlehrerfortbildung" },
    { label: "Weiterbildung", href: "/fahrlehrerweiterbildung" },
    { label: "Termine & Preise", href: "/termine-preise" },
    { label: "Förderung", href: "/foerderung" },
    { label: "Service", href: "/service" },
    { label: "Kontakt", href: "/kontakt" },
  ],
} as const;

export type Site = typeof site;
