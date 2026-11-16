export function LegalBody({ children }: { children: React.ReactNode }) {
  return (
    <section className="vfr-section">
      <div
        className="vfr-wrap max-w-[760px] text-[var(--vfr-fg-muted)] [&_h2]:font-[family-name:var(--font-serif)] [&_h2]:text-[1.25rem] [&_h2]:text-[var(--vfr-fg)] [&_h2]:font-medium [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:first:mt-0 [&_p]:my-3 [&_p]:leading-[1.6] [&_a]:text-[var(--vfr-accent-dark)] [&_a]:underline [&_a]:underline-offset-2 [&_ol]:ml-5 [&_ul]:ml-5 [&_li]:my-1.5 [&_strong]:text-[var(--vfr-fg)]"
      >
        {children}
      </div>
    </section>
  );
}
