import { site } from "@/lib/site";

export function Stats() {
  return (
    <section className="bg-cream-50 border-y border-ink-100">
      <div className="container-vfr py-16 md:py-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-y-12 lg:gap-y-0 lg:divide-x divide-ink-200">
          {site.stats.map((s) => (
            <div key={s.label} className="lg:px-8 first:lg:pl-0 last:lg:pr-0">
              <div className="font-display font-extralight text-6xl md:text-7xl text-vfr-500 tabular-nums tracking-tightest leading-none">
                {s.value}
              </div>
              <div className="mt-4 eyebrow text-ink-500 [&::before]:hidden">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
