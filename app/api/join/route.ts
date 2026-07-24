import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSessionToken, SESSION_COOKIE } from "@/lib/auth";

function slugify(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function randomSuffix() {
  return Math.random().toString(36).slice(2, 6);
}

export async function POST(req: Request) {
  const body = await req.json();

  try {
    if (body.action === "create") {
      const { name, code, notifyEmail } = body;
      if (!name || !code) {
        return NextResponse.json(
          { error: "Nom et code d'accès requis." },
          { status: 400 }
        );
      }
      const slug = `${slugify(name)}-${randomSuffix()}`;
      const accessCodeHash = await bcrypt.hash(code, 10);

      const org = await prisma.organization.create({
        data: { name, slug, accessCodeHash, notifyEmail: notifyEmail || null },
      });

      const token = await createSessionToken({
        organizationId: org.id,
        slug: org.slug,
      });

      const res = NextResponse.json({ ok: true, slug: org.slug });
      res.cookies.set(SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 180,
        path: "/",
      });
      return res;
    }

    if (body.action === "join") {
      const { slug, code } = body;
      if (!slug || !code) {
        return NextResponse.json(
          { error: "Identifiant d'espace et code requis." },
          { status: 400 }
        );
      }
      const org = await prisma.organization.findUnique({ where: { slug } });
      if (!org) {
        return NextResponse.json(
          { error: "Aucun espace ne correspond à cet identifiant." },
          { status: 404 }
        );
      }
      const valid = await bcrypt.compare(code, org.accessCodeHash);
      if (!valid) {
        return NextResponse.json(
          { error: "Code d'accès incorrect." },
          { status: 401 }
        );
      }

      const token = await createSessionToken({
        organizationId: org.id,
        slug: org.slug,
      });

      const res = NextResponse.json({ ok: true, slug: org.slug });
      res.cookies.set(SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 180,
        path: "/",
      });
      return res;
    }

    return NextResponse.json({ error: "Action invalide." }, { status: 400 });
  } catch (e: any) {
    if (e.code === "P2002") {
      return NextResponse.json(
        { error: "Ce nom d'association est déjà pris, réessayez." },
        { status: 409 }
      );
    }
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
