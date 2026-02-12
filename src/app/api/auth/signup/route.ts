import { NextResponse } from "next/server";

import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ message: "email/password/name required" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing && existing.passwordHash) {
      return NextResponse.json({ message: "email already exists" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    if (existing) {
      await prisma.user.update({
        where: { email },
        data: { name, passwordHash },
      });
    } else {
      await prisma.user.create({
        data: { email, name, passwordHash },
      });
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "server error" }, { status: 500 });
  }
}
