import { stripe } from "@/lib/stripe";
import type { NextRequest } from "next/server";

// Risky pattern #2: hard-fails on any event type outside a hardcoded
// allow-list. Stripe periodically introduces new event types, and Stripe
// will disable a webhook endpoint after enough consecutive failures — so an
// endpoint written this way can go dark the moment Stripe adds something new,
// with no code change on this side at all.
export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") as string;

  const event = stripe.webhooks.constructEvent(
    body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET as string
  );

  switch (event.type) {
    case "checkout.session.completed":
      // handle checkout completion
      break;
    case "invoice.paid":
      // handle invoice paid
      break;
    default:
      // Unrecognized event types are logged and ignored rather than
      // treated as failures, so Stripe doesn't disable this endpoint
      // when it introduces new event types.
      console.log(`Unhandled event type: ${event.type}`);
      break;
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}
