import Stripe from "stripe";

// Risky pattern #1: no explicit dated API version pinned.
// Stripe's own docs on versioning (docs.stripe.com/sdks/versioning) call this
// out as the single most common way an integration breaks silently — twice a
// year Stripe ships a named major release that CAN include breaking changes,
// and any integration that doesn't pin a version gets that new behavior with
// zero code change and zero deploy.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2026-08-26.dahlia",
});
