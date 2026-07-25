import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendCodeRecoveryEmail } from "@/lib/resend";

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "Email requis." }, { status: 400 });

  const member = await prisma.member.findUnique({ where: { email } });

  if (member) {
    const resetToken = crypto.randomBytes(24).toString("hex");
    await prisma.member.update({
      where: { id: member.id },
      data: { resetToken, resetTokenExpiry: new Date(Date.now() + 60 * 60 * 1000) },
    });

    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "";
    const resetUrl = `${origin}/reset?token=${resetToken}`;

    await sendCodeRecoveryEmail({ to: member.email, nom: member.nom, resetUrl });
  }

  return NextResponse.json({
    ok: true,
    message: "Si un compte existe avec cet email, un lien de réinitialisation vient d'être envoyé.",
  });
}
