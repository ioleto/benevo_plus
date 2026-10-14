import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion");
  const configured = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((x) => x.trim().toLowerCase())
    .filter(Boolean);
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user?.email || !configured.includes(user.email.toLowerCase()))
    notFound();
  return user;
}
export async function isAdmin() {
  try {
    await requireAdmin();
    return true;
  } catch {
    return false;
  }
}
