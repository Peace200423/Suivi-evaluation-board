import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") || "";

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err: any) {
    console.error("Signature webhook invalide", err.message);
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const s = event.data.object as Stripe.Checkout.Session;
        const organizationId = s.metadata?.organizationId;
        if (organizationId) {
          await prisma.organization.update({
            where: { id: organizationId },
            data: {
              plan: "pro",
              stripeCustomerId: s.customer as string,
              stripeSubscriptionId: s.subscription as string,
              subscriptionStatus: "active",
            },
          });
        }
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const organizationId = sub.metadata?.organizationId;
        if (organizationId) {
          const isActive = sub.status === "active" || sub.status === "trialing";
          await prisma.organization.update({
            where: { id: organizationId },
            data: {
              plan: isActive ? "pro" : "free",
              subscriptionStatus: sub.status,
            },
          });
        }
        break;
      }
      default:
        break;
    }
  } catch (e) {
    console.error("Erreur traitement webhook", e);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
