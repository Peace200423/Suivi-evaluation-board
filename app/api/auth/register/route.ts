import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSessionToken, SESSION_COOKIE } from "@/lib/auth";
import { slugify, randomSuffix } from "@/lib/slug";

export async function POST(req: Request) {
  const { orgName, adminNom, adminEmail, adminCode } = await req.json();

  if (!orgName || !adminNom || !adminEmail || !adminCode) {
    return NextResponse.json({ error: "Tous les champs sont requis." }, { status: 400 });
  }
  if (adminCode.length < 4) {
    return NextResponse.json({ error: "Le code d'accès doit faire au moins 4 caractères." }, { status: 400 });
  }

  const existing = await prisma.member.findUnique({ where: { email: adminEmail } });
  if (existing) {
    return NextResponse.json(
      { error: "Cet email est déjà associé à un compte. Connectez-vous plutôt." },
      { status: 409 }
    );
  }

  try {
    const slug = `${slugify(orgName)}-${randomSuffix()}`;
    const codeHash = await bcrypt.hash(adminCode, 10);

    const org = await prisma.organization.create({
      data: {
        name: orgName,
        slug,
        members: {
          create: { nom: adminNom, email: adminEmail, role: "admin", codeHash },
        },
      },
      include: { members: true },
    });

    const admin = org.members[0];
    const token = await createSessionToken({
      organizationId: org.id,
      memberId: admin.id,
      role: "admin",
    });

    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 180,
      path: "/",
    });
    return res;
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: "Erreur lors de la création de l'espace." }, { status: 500 });
  }
}
