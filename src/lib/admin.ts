import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { isConfiguredAdminEmail } from "@/lib/admin-config";
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion");
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user?.email || !isConfiguredAdminEmail(user.email)) notFound();
  // Répare aussi les comptes existants dont la première connexion a précédé la configuration.
  if (user.role !== "ADMIN") {
    return prisma.user.update({ where: { id: user.id }, data: { role: "ADMIN" } });
  }
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
