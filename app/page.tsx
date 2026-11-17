import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { BeHighlight } from "@/components/BeHighlight";
import { Foerderung } from "@/components/Foerderung";
import { SoLaeuftEsAb } from "@/components/SoLaeuftEsAb";
import { Quickstart } from "@/components/Quickstart";
import { WarumVfr } from "@/components/WarumVfr";
import { PersoenlicheBetreuung } from "@/components/PersoenlicheBetreuung";
import { Repetitorium } from "@/components/Repetitorium";
import { ImpressionenStreifen } from "@/components/ImpressionenStreifen";
import { TermineTabelle } from "@/components/TermineTabelle";
import { Reviews } from "@/components/Reviews";
import { Kontakt } from "@/components/Kontakt";

export const metadata: Metadata = {
  title:
    "Fahrlehrer werden in Niederkassel — VFR Verkehrsfachschule Rheinland",
  description:
    "AZAV-zertifizierte Fahrlehrerausbildung zwischen Köln und Bonn. Klassen BE, A, CE, DE. Mit kostenlosem Dienstags-Repetitorium und persönlicher Begleitung.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <BeHighlight />
      <Foerderung />
      <SoLaeuftEsAb />
      <Quickstart />
      <WarumVfr />
      <PersoenlicheBetreuung />
      <Repetitorium />
      <ImpressionenStreifen />
      <TermineTabelle />
      <Reviews />
      <Kontakt />
    </>
  );
}
