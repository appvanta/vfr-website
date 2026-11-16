import "server-only";
import { createHmac, timingSafeEqual } from "crypto";

/**
 * Signierte Bestätigungs-Tokens für Double-Opt-In-Emails.
 *
 * Die Anmelde-Daten werden direkt in den Token gepackt (JSON → base64url)
 * und HMAC-signiert. So brauchen wir keine Datenbank — der Confirm-Link
 * enthält alle Daten, die wir nach Email-Klick an Flario weitergeben.
 *
 * Secret kommt aus REGISTRATION_TOKEN_SECRET; Fallback ist FLARIO_WEBHOOK_SECRET,
 * damit ein Setup mit nur einem Secret reicht.
 */

const SECRET =
  process.env.REGISTRATION_TOKEN_SECRET ??
  process.env.FLARIO_WEBHOOK_SECRET ??
  "DEV_ONLY_NOT_FOR_PRODUCTION_" + "x".repeat(16);

const MAX_AGE_HOURS = 48; // Link läuft nach 48 h ab

type TokenPayload<T> = {
  /** epoch-ms, wann erzeugt */
  iat: number;
  /** epoch-ms, wann ungültig */
  exp: number;
  /** Nutzdaten */
  data: T;
};

function b64urlEncode(buf: Buffer): string {
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function b64urlDecode(str: string): Buffer {
  const pad = str.length % 4 === 0 ? "" : "=".repeat(4 - (str.length % 4));
  return Buffer.from(
    str.replace(/-/g, "+").replace(/_/g, "/") + pad,
    "base64",
  );
}

export function createConfirmToken<T>(data: T, maxAgeHours = MAX_AGE_HOURS): string {
  const now = Date.now();
  const payload: TokenPayload<T> = {
    iat: now,
    exp: now + maxAgeHours * 3600 * 1000,
    data,
  };
  const body = b64urlEncode(Buffer.from(JSON.stringify(payload), "utf8"));
  const sig = b64urlEncode(
    createHmac("sha256", SECRET).update(body).digest(),
  );
  return `${body}.${sig}`;
}

export type VerifyResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: "invalid" | "expired" };

export function verifyConfirmToken<T>(token: string): VerifyResult<T> {
  const parts = token.split(".");
  if (parts.length !== 2) return { ok: false, error: "invalid" };
  const [body, sig] = parts;

  const expectedSig = b64urlEncode(
    createHmac("sha256", SECRET).update(body).digest(),
  );
  const givenBuf = Buffer.from(sig, "utf8");
  const expBuf = Buffer.from(expectedSig, "utf8");
  if (givenBuf.length !== expBuf.length || !timingSafeEqual(givenBuf, expBuf)) {
    return { ok: false, error: "invalid" };
  }

  let payload: TokenPayload<T>;
  try {
    payload = JSON.parse(b64urlDecode(body).toString("utf8")) as TokenPayload<T>;
  } catch {
    return { ok: false, error: "invalid" };
  }

  if (typeof payload.exp !== "number" || Date.now() > payload.exp) {
    return { ok: false, error: "expired" };
  }

  return { ok: true, data: payload.data };
}
