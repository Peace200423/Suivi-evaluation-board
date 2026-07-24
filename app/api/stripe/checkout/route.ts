import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const org = await prisma.organization.findUnique({ where: { id: session.organizationId } });
  if (!org) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

  const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "";

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: process.env.STRIPE_PRICE_ID_PRO, quantity: 1 }],
    customer: org.stripeCustomerId || undefined,
    success_url: `${origin}/dashboard?upgraded=1`,
    cancel_url: `${origin}/dashboard`,
    metadata: { organizationId: org.id },
    subscription_data: { metadata: { organizationId: org.id } },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
