"use client";

import { useState } from "react";
import { Mail, Loader2 } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.includes("@") || email.length < 5) {
      setError("Bitte gültige E-Mail-Adresse eingeben.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: typeof window !== "undefined" ? window.location.pathname : "footer",
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error ?? "Anmeldung fehlgeschlagen");
      }
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="newsletter"
      className="border-t border-[var(--vfr-rule)] scroll-mt-24"
      style={{
        background: "var(--vfr-bg-alt)",
        paddingBlock: "60px",
      }}
    >
      <div className="vfr-wrap">
        <div className="max-w-[720px] mx-auto text-center">
          <div
            className="inline-flex items-center justify-center w-12 h-12 mb-5"
            style={{
              background: "var(--vfr-accent)",
              color: "#fff",
              borderRadius: "50%",
            }}
          >
            <Mail className="h-5 w-5" />
          </div>
          <h2
            style={{
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              margin: "0 0 10px",
            }}
          >
            Unser Newsletter
          </h2>
          <p
            style={{
              color: "var(--vfr-fg-muted)",
              fontSize: 16,
              maxWidth: 520,
              margin: "0 auto 28px",
            }}
          >
            Aktuelle News, Termine und Angebote direkt in deine Inbox. Jederzeit
            abbestellbar.
          </p>

          {sent ? (
            <div
              className="inline-block px-6 py-4"
              style={{
                background: "#fff",
                border: "1px solid var(--vfr-accent)",
                color: "var(--vfr-fg)",
                fontSize: 15,
              }}
            >
              <strong>Fast geschafft!</strong> Prüfe dein Postfach — wir haben dir
              einen Bestätigungslink geschickt.
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-[520px] mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Deine E-Mail-Adresse"
                required
                className="flex-1 px-4 py-3 bg-white border border-[var(--vfr-rule)] focus:outline-2 focus:outline-[var(--vfr-accent)] focus:border-[var(--vfr-accent)]"
                style={{ fontSize: 15, borderRadius: 2 }}
              />
              <button
                type="submit"
                disabled={loading}
                className="vfr-btn vfr-btn--primary justify-center disabled:opacity-60"
                style={{ paddingBlock: 12 }}
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {loading ? "Senden …" : "Anmelden"}
              </button>
            </form>
          )}

          {error && (
            <p
              style={{
                color: "#b84b2a",
                fontSize: 13,
                marginTop: 10,
              }}
            >
              {error}
            </p>
          )}

          <p
            className="mt-5"
            style={{
              color: "var(--vfr-fg-soft)",
              fontSize: 12,
            }}
          >
            Mit der Anmeldung akzeptierst du die{" "}
            <a
              href="/datenschutz"
              style={{ color: "var(--vfr-accent-dark)", textDecoration: "underline" }}
            >
              Datenschutzerklärung
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
