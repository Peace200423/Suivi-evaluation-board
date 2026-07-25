import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { token, newCode } = await req.json();
  if (!token || !newCode) {
    return NextResponse.json({ error: "Lien invalide." }, { status: 400 });
  }
  if (newCode.length < 4) {
    return NextResponse.json({ error: "Le code doit faire au moins 4 caractères." }, { status: 400 });
  }

  const member = await prisma.member.findFirst({ where: { resetToken: token } });
  if (!member || !member.resetTokenExpiry || member.resetTokenExpiry < new Date()) {
    return NextResponse.json({ error: "Ce lien a expiré, demandez-en un nouveau." }, { status: 400 });
  }

  const codeHash = await bcrypt.hash(newCode, 10);
  await prisma.member.update({
    where: { id: member.id },
    data: { codeHash, resetToken: null, resetTokenExpiry: null },
  });

  return NextResponse.json({ ok: true });
}
