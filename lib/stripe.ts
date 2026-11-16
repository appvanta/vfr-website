import "server-only";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  // Nicht throwen — sonst bricht Next.js beim Build. Stattdessen lazy validieren.
  console.warn("[stripe] STRIPE_SECRET_KEY is not set – payment flows are disabled.");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "sk_test_placeholder", {
  apiVersion: "2024-12-18.acacia",
  typescript: true,
});

export const STRIPE_CONFIGURED = Boolean(
  process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET,
);
