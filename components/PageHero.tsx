import Image from "next/image";
import { Breadcrumbs } from "./Breadcrumbs";
import { HeroSlideshow } from "./HeroSlideshow";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=2000&q=85";

type Crumb = { label: string; href: string };
type Slide = { src: string; alt: string };

export function PageHero({
  eyebrow,
  title,
  lead,
  image = DEFAULT_IMAGE,
  slides,
  children,
  breadcrumbs,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: string;
  image?: string;
  slides?: Slide[];
  children?: React.ReactNode;
  breadcrumbs?: Crumb[];
}) {
  return (
    <section
      className="relative overflow-hidden flex items-center"
      style={{ height: "50vh", minHeight: 380 }}
    >
      {slides && slides.length > 0 ? (
        <HeroSlideshow slides={slides} />
      ) : (
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover z-0"
        />
      )}
      <div
        className="absolute inset-0 z-10"
        style={{ background: "rgba(0,0,0,0.5)" }}
      />

      <div className="relative z-20 w-full text-center text-white">
        <div className="vfr-wrap">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <div className="mb-5 flex justify-center">
              <Breadcrumbs trail={breadcrumbs} variant="hero" />
            </div>
          )}
          {eyebrow && (
            <span className="vfr-eyebrow" style={{ color: "#fff" }}>
              {eyebrow}
            </span>
          )}
          <h1
            className="mt-4"
            style={{
              color: "#fff",
              fontFamily: "var(--font-serif), Georgia, serif",
              fontWeight: 300,
              fontSize: "clamp(36px, 5vw, 64px)",
              lineHeight: 1.12,
              margin: "0 auto",
              maxWidth: "20ch",
            }}
          >
            {title}
          </h1>
          {lead && (
            <p
              className="mx-auto mt-6 max-w-[640px] font-light"
              style={{ color: "rgba(255,255,255,0.9)", fontSize: 18 }}
            >
              {lead}
            </p>
          )}
          {children && <div className="mt-8">{children}</div>}
        </div>
      </div>
    </section>
  );
}
