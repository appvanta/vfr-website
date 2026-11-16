import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { site } from "@/lib/site";

type Crumb = { label: string; href: string };

/**
 * Semantische Breadcrumbs mit JSON-LD für Google.
 * Render-Variante: `variant="hero"` auf dunklem Hintergrund,
 * `variant="plain"` für helle Flächen.
 */
export function Breadcrumbs({
  trail,
  variant = "plain",
}: {
  trail: Crumb[];
  variant?: "hero" | "plain";
}) {
  if (trail.length === 0) return null;

  const items = [{ label: "Start", href: "/" }, ...trail];
  const baseUrl = site.url.replace(/\/$/, "");

  const textCls =
    variant === "hero"
      ? "text-white/80"
      : "text-[var(--vfr-fg-muted)]";
  const linkCls =
    variant === "hero"
      ? "hover:text-white transition no-underline"
      : "hover:text-[var(--vfr-accent)] transition no-underline";

  return (
    <>
      <nav
        aria-label="Breadcrumb"
        className={`flex items-center flex-wrap gap-1 text-[0.78rem] ${textCls}`}
      >
        {items.map((c, i) => {
          const isLast = i === items.length - 1;
          return (
            <span key={c.href + i} className="inline-flex items-center gap-1">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 opacity-60" />}
              {isLast ? (
                <span aria-current="page" className="font-semibold">
                  {c.label}
                </span>
              ) : (
                <Link href={c.href} className={linkCls}>
                  {c.label}
                </Link>
              )}
            </span>
          );
        })}
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: items.map((c, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: c.label,
              item: baseUrl + c.href,
            })),
          }),
        }}
      />
    </>
  );
}
