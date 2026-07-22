import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";
import { sendUpdateNotification } from "@/lib/resend";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { valeur, date, note } = await req.json();
  if (valeur === undefined || !date) {
    return NextResponse.json({ error: "Valeur et date requises" }, { status: 400 });
  }

  const indicateur = await prisma.indicateur.findUnique({
    where: { id: params.id },
    include: { objectif: { include: { organization: true } } },
  });
  if (!indicateur || indicateur.objectif.organizationId !== session.organizationId) {
    return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  }

  const relevé = await prisma.valeurRelevee.create({
    data: {
      valeur: parseFloat(valeur),
      date: new Date(date),
      note: note || null,
      indicateurId: params.id,
    },
  });

  const org = indicateur.objectif.organization;
  if (org.notifyEmail) {
    // Fire-and-forget : ne bloque pas la réponse si l'email met du temps.
    sendUpdateNotification({
      to: org.notifyEmail,
      orgName: org.name,
      indicateurNom: indicateur.nom,
      valeur: parseFloat(valeur),
      cible: indicateur.cible,
    }).catch(() => {});
  }

  return NextResponse.json({ relevé });
}
