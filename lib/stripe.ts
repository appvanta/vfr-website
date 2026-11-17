import "server-only";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("[stripe] STRIPE_SECRET_KEY is not set – payment flows are disabled.");
}

// Lazy init — Stripe-SDK validiert den Key beim Konstruieren, darum erst
// erzeugen wenn der Key tatsächlich da ist. Sonst scheitert `next build`,
// weil die Route-Handler beim Collect-Pagedata importiert werden.
let _stripe: Stripe | null = null;
function makeStub(): Stripe {
  const err = () => {
    throw new Error("Stripe ist nicht konfiguriert (STRIPE_SECRET_KEY fehlt).");
  };
  return new Proxy({} as Stripe, {
    get() { return err; },
  });
}

export const stripe: Stripe = process.env.STRIPE_SECRET_KEY
  ? (_stripe ??= new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-12-18.acacia",
      typescript: true,
    }))
  : makeStub();

export const STRIPE_CONFIGURED = Boolean(
  process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET,
);
