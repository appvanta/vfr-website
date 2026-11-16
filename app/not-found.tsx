import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container-vfr max-w-xl text-center">
        <div className="text-7xl font-bold text-vfr-700">404</div>
        <h1 className="mt-4 text-2xl font-bold">Seite nicht gefunden</h1>
        <p className="mt-3 text-slate-600">
          Die angeforderte Seite existiert nicht oder wurde verschoben.
        </p>
        <Link href="/" className="btn-primary mt-8">Zur Startseite</Link>
      </div>
    </section>
  );
}
