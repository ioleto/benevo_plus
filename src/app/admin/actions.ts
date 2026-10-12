"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { sendEmail } from "@/lib/email";
export async function saveSettings(formData: FormData) {
  await requireAdmin();
  for (const [key, value] of formData.entries())
    await prisma.setting.upsert({
      where: { key },
      update: { value: value === "on" ? true : value },
      create: { key, value: value === "on" ? true : value },
    });
  revalidatePath("/app/admin");
}
export async function sendTestEmail(formData: FormData) {
  const admin = await requireAdmin();
  const to = String(formData.get("to") || admin.email || "");
  if (to) await sendEmail(to, "Test Bénévo+", "E-mail de test.");
  revalidatePath("/app/admin");
}
export async function suspendUser(formData: FormData) {
  await requireAdmin();
  await prisma.user.update({
    where: { id: String(formData.get("id")) },
    data: { suspended: true },
  });
  revalidatePath("/app/admin");
}
export async function deleteCommunity(formData: FormData) {
  await requireAdmin();
  await prisma.community.delete({ where: { id: String(formData.get("id")) } });
  revalidatePath("/app/admin");
}
