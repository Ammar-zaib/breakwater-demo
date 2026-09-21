import { stripe } from "@/lib/stripe";
import type { NextRequest } from "next/server";

// Unrecognized/unhandled event types are logged and ignored rather than
// failing the delivery, since Stripe periodically introduces new event
// types and will disable this endpoint after enough consecutive failures.
// Frequently-seen unhandled types are tracked via metrics so they can be
// intentionally added to the switch below over time.
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
      // Unrecognized/unhandled event types are logged and ignored rather than
      // failing the delivery, since Stripe periodically introduces new event
      // types and will disable this endpoint after enough consecutive failures.
      console.log(`Unhandled event type: ${event.type}`);
      break;
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}
