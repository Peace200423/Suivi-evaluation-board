import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";
import { BRAND } from "@/lib/branding";

export async function GET(req: Request) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const org = await prisma.organization.findUnique({
    where: { id: session.organizationId },
    include: {
      objectifs: {
        include: { indicateurs: { include: { valeurs: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!org) return NextResponse.json({ error: "Espace introuvable" }, { status: 404 });

  return NextResponse.json({ organization: org });
}

export async function POST(req: Request) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { titre } = await req.json();
  if (!titre) return NextResponse.json({ error: "Titre requis" }, { status: 400 });

  const org = await prisma.organization.findUnique({
    where: { id: session.organizationId },
    include: { objectifs: true },
  });
  if (!org) return NextResponse.json({ error: "Espace introuvable" }, { status: 404 });

  const limit = BRAND.plans[org.plan === "pro" ? "pro" : "free"].objectifsMax;
  if (org.objectifs.length >= limit) {
    return NextResponse.json(
      { error: `Limite du plan ${org.plan} atteinte (${limit} objectifs). Passez au plan Pro pour continuer.` },
      { status: 403 }
    );
  }

  const objectif = await prisma.objectif.create({
    data: { titre, organizationId: org.id },
  });

  return NextResponse.json({ objectif });
}
