import Image from "next/image";
import { IMG } from "@/lib/images";

const reviews = [
  {
    img: IMG.portraitMan2,
    name: "Amko S.",
    meta: "Fahrlehrerausbildung",
    text: "Die Dozenten sind nicht nur kompetent, sondern auch engagiert und hilfsbereit. Der Unterricht ist praxisnah gestaltet, was den Lernstoff leicht verständlich und anwendbar macht.",
  },
  {
    img: IMG.portraitWoman,
    name: "Safiye B.",
    meta: "Fort- und Weiterbildung",
    text: "Das VFR-Team ist sehr hilfsbereit, nett und engagiert. Ich bedanke mich für die gute Qualität und Freundlichkeit.",
  },
  {
    img: IMG.portraitMan,
    name: "Hadi B.",
    meta: "Fortbildungslehrgang",
    text: "Die Dozenten nehmen sich immer viel Zeit für die Fragen der Teilnehmer und erklären alles gut verständlich. Ich freue mich auf den nächsten Lehrgang.",
  },
];

export function Reviews() {
  return (
    <section className="vfr-section bg-[var(--vfr-bg-alt)]">
      <div className="vfr-wrap">
        <div className="text-center mb-16">
          <span className="vfr-eyebrow">Teilnehmerstimmen</span>
          <h2 className="vfr-h2 mt-2 mx-auto" style={{ maxWidth: "20ch" }}>
            Was unsere Teilnehmer sagen.
          </h2>
          <p
            className="mx-auto mt-5"
            style={{
              color: "var(--vfr-fg-muted)",
              fontWeight: 300,
              fontSize: 18,
              maxWidth: 640,
            }}
          >
            Original-Rezensionen von Google. Nur mit Zustimmung der Teilnehmer veröffentlicht.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {reviews.map((r) => (
            <div key={r.name} className="text-center">
              <div
                className="relative mx-auto overflow-hidden"
                style={{ width: 96, height: 96, borderRadius: "50%" }}
              >
                <Image
                  src={r.img}
                  alt={r.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>
              <blockquote
                className="mt-7 mx-auto"
                style={{
                  fontFamily: "var(--font-serif), Georgia, serif",
                  fontSize: 20,
                  fontStyle: "italic",
                  fontWeight: 400,
                  color: "var(--vfr-fg)",
                  lineHeight: 1.5,
                  maxWidth: 420,
                }}
              >
                „{r.text}"
              </blockquote>
              <div className="mt-6">
                <div
                  style={{
                    fontFamily: "var(--font-serif), Georgia, serif",
                    fontSize: 18,
                    fontWeight: 500,
                    color: "var(--vfr-fg)",
                  }}
                >
                  {r.name}
                </div>
                <div
                  className="text-[var(--vfr-accent)] mt-1"
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    fontWeight: 500,
                  }}
                >
                  {r.meta}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
