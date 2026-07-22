import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";
import { BRAND } from "@/lib/branding";

export async function POST(req: Request) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { objectifId, nom, cible, unite } = await req.json();
  if (!objectifId || !nom || cible === undefined) {
    return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
  }

  const objectif = await prisma.objectif.findUnique({
    where: { id: objectifId },
    include: { indicateurs: true, organization: { include: { objectifs: { include: { indicateurs: true } } } } },
  });
  if (!objectif || objectif.organizationId !== session.organizationId) {
    return NextResponse.json({ error: "Objectif introuvable" }, { status: 404 });
  }

  const totalIndicateurs = objectif.organization.objectifs.reduce(
    (sum: number, o: (typeof objectif.organization.objectifs)[number]) => sum + o.indicateurs.length,
    0
  );
  const plan = objectif.organization.plan === "pro" ? "pro" : "free";
  const limit = BRAND.plans[plan].indicateursMax;
  if (totalIndicateurs >= limit) {
    return NextResponse.json(
      { error: `Limite du plan ${plan} atteinte (${limit} indicateurs). Passez au plan Pro pour continuer.` },
      { status: 403 }
    );
  }

  const indicateur = await prisma.indicateur.create({
    data: { objectifId, nom, cible: parseFloat(cible), unite: unite || null },
  });

  return NextResponse.json({ indicateur });
}
