import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";

async function assertOwnership(organizationId: string, objectifId: string) {
  const objectif = await prisma.objectif.findUnique({ where: { id: objectifId } });
  return objectif && objectif.organizationId === organizationId ? objectif : null;
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const owned = await assertOwnership(session.organizationId, params.id);
  if (!owned) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

  const { titre } = await req.json();
  const updated = await prisma.objectif.update({
    where: { id: params.id },
    data: { titre },
  });
  return NextResponse.json({ objectif: updated });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const owned = await assertOwnership(session.organizationId, params.id);
  if (!owned) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

  await prisma.objectif.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
