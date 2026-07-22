import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const indicateur = await prisma.indicateur.findUnique({
    where: { id: params.id },
    include: { objectif: true },
  });
  if (!indicateur || indicateur.objectif.organizationId !== session.organizationId) {
    return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  }

  await prisma.indicateur.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
