import Link from "next/link";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="inline-flex items-center gap-3 group">
      <span
        aria-hidden
        className={`grid h-12 w-12 place-items-center font-bold text-base tracking-wider rounded-sm ${
          light ? "bg-white text-[#2080c0]" : "bg-[#2080c0] text-white"
        } group-hover:bg-[#1a6ba0] transition-colors`}
        style={{ background: light ? "#fff" : "#2080c0" }}
      >
        VFR
      </span>
      <span className={`hidden sm:flex flex-col leading-tight`}>
        <span
          className="font-bold text-base"
          style={{ color: light ? "#fff" : "#2b2b2b" }}
        >
          Verkehrsfachschule
        </span>
        <span
          className="text-xs"
          style={{ color: light ? "rgba(255,255,255,0.8)" : "#7a7a7a" }}
        >
          Rheinland GmbH
        </span>
      </span>
    </Link>
  );
}
