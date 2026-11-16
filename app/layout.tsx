import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Newsletter } from "@/components/Newsletter";
import { QuickActions, QuickActionsMobile } from "@/components/QuickActions";
import { ChatBubble } from "@/components/ChatBubble";
import { site } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Fahrlehrerausbildung Rhein-Sieg-Kreis — Köln, Bonn, Niederkassel`,
    template: `%s — ${site.shortName}`,
  },
  description:
    "AZAV-zertifizierte Fahrlehrerausbildung & Fortbildung in Niederkassel zwischen Köln und Bonn. Klassen BE, A, CE, DE. § 53 FahrlG Fortbildung, Seminarleiter ASF/FES, BWL-Lehrgang, Feuerwehr-Spezialausbildung. Mit kostenlosem Dienstags-Repetitorium.",
  keywords: [
    "Fahrlehrerausbildung",
    "Fahrlehrerschule",
    "Verkehrsfachschule",
    "Fahrlehrer werden",
    "Fahrlehrer Rhein-Sieg-Kreis",
    "Fahrlehrer Köln",
    "Fahrlehrer Bonn",
    "Fahrlehrer Niederkassel",
    "Klasse BE",
    "Klasse A",
    "Klasse CE",
    "Klasse DE",
    "§ 53 FahrlG Fortbildung",
    "Seminarleiter ASF",
    "Seminarleiter FES",
    "Ausbildungsfahrlehrer",
    "BWL Fahrschule",
    "Bildungsgutschein Fahrlehrer",
    "AZAV Fahrlehrer",
    "Feuerwehr Schulung",
    "Einsatzfahrten § 35 StVO",
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  category: "education",
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description:
      "AZAV-zertifizierte Fahrlehrerausbildung in Niederkassel zwischen Köln und Bonn. Mit kostenlosem Dienstags-Repetitorium.",
    images: [
      {
        url: `${site.url}/hero/startseite-flotte.jpg`,
        width: 1200,
        height: 630,
        alt: `${site.name} — Fahrzeug-Flotte`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description:
      "AZAV-zertifizierte Fahrlehrerausbildung in Niederkassel.",
    images: [`${site.url}/hero/startseite-flotte.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: site.url,
    languages: { "de-DE": site.url },
  },
  formatDetection: {
    telephone: true,
    address: true,
    email: true,
  },
  verification: {
    // Später ergänzen: google: "...", other: { "msvalidate.01": "..." }
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={inter.variable}>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pb-16 sm:pb-0">{children}</main>
        <Newsletter />
        <Footer />
        <QuickActions />
        <QuickActionsMobile />
        <ChatBubble />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": ["EducationalOrganization", "LocalBusiness"],
                  "@id": `${site.url}#organization`,
                  name: site.name,
                  alternateName: site.shortName,
                  description:
                    "AZAV-zertifizierte Fahrlehrer-Aus- und Weiterbildungsstätte in Niederkassel, Rhein-Sieg-Kreis — zwischen Köln und Bonn.",
                  url: site.url,
                  logo: `${site.url}/vfr-logo-trimmed.jpg`,
                  image: `${site.url}/hero/startseite-flotte.jpg`,
                  foundingDate: `${site.foundingYear}`,
                  founder: { "@type": "Person", name: site.managingDirector },
                  employee: { "@type": "Person", name: site.managingDirector, jobTitle: "Geschäftsführer" },
                  telephone: site.phone,
                  email: site.email,
                  priceRange: "€€",
                  address: {
                    "@type": "PostalAddress",
                    streetAddress: site.address.street,
                    postalCode: site.address.zip,
                    addressLocality: site.address.city,
                    addressRegion: "NW",
                    addressCountry: "DE",
                  },
                  geo: {
                    "@type": "GeoCoordinates",
                    latitude: 50.8158,
                    longitude: 7.0381,
                  },
                  areaServed: [
                    { "@type": "City", name: "Niederkassel" },
                    { "@type": "City", name: "Köln" },
                    { "@type": "City", name: "Bonn" },
                    { "@type": "AdministrativeArea", name: "Rhein-Sieg-Kreis" },
                    { "@type": "AdministrativeArea", name: "Nordrhein-Westfalen" },
                  ],
                  openingHoursSpecification: [
                    {
                      "@type": "OpeningHoursSpecification",
                      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                      opens: "07:30",
                      closes: "16:00",
                    },
                  ],
                  sameAs: Object.values(site.social),
                  hasOfferCatalog: {
                    "@type": "OfferCatalog",
                    name: "Ausbildungs- und Fortbildungsangebote",
                    itemListElement: [
                      { "@type": "OfferCatalog", name: "Fahrlehrerausbildung BE/A/CE/DE" },
                      { "@type": "OfferCatalog", name: "Fahrlehrerfortbildung § 53 FahrlG" },
                      { "@type": "OfferCatalog", name: "Seminarleiter ASF / FES" },
                      { "@type": "OfferCatalog", name: "BWL-Lehrgang Fahrschulinhaber" },
                      { "@type": "OfferCatalog", name: "Feuerwehr-Spezialausbildung" },
                      { "@type": "OfferCatalog", name: "Ladekran / Flurförderzeuge" },
                    ],
                  },
                  aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: "4.9",
                    reviewCount: "52",
                    bestRating: "5",
                    worstRating: "1",
                  },
                },
                {
                  "@type": "WebSite",
                  "@id": `${site.url}#website`,
                  url: site.url,
                  name: site.name,
                  publisher: { "@id": `${site.url}#organization` },
                  inLanguage: "de-DE",
                  potentialAction: {
                    "@type": "SearchAction",
                    target: {
                      "@type": "EntryPoint",
                      urlTemplate: `${site.url}/termine-preise?topic={search_term_string}`,
                    },
                    "query-input": "required name=search_term_string",
                  },
                },
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
