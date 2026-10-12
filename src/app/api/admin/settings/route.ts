import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
export async function GET() {
  await requireAdmin();
  return NextResponse.json(await prisma.setting.findMany());
}
export async function PUT(request: Request) {
  await requireAdmin();
  const body = (await request.json()) as Record<string, unknown>;
  await prisma.$transaction(
    Object.entries(body).map(([key, value]) =>
      prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      }),
    ),
  );
  return NextResponse.json({ ok: true });
}
