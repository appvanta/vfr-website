const items = [
  "AZAV-zertifiziert",
  "BAGFA-Mitglied",
  "100 % Bildungsgutschein",
  "Jobgarantie",
  "Seit 2010",
];

export function TrustBar() {
  return (
    <section className="bg-cream-50 border-y border-ink-100">
      <div className="container-vfr py-8">
        <div className="flex flex-wrap items-center justify-between gap-x-12 gap-y-4">
          {items.map((label, i) => (
            <div key={label} className="flex items-center gap-4 text-[11px] uppercase font-medium text-ink-700" style={{ letterSpacing: "0.22em" }}>
              <span className="font-display italic text-ink-400 font-light text-base">0{i + 1}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
