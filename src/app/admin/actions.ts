"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import {
  getSmtpConfig,
  saveSmtpConfig,
  sendEmail,
  smtpConfigFromForm,
} from "@/lib/email";

export async function saveSettings(formData: FormData) {
  await requireAdmin();
  const current = await getSmtpConfig();
  const config = smtpConfigFromForm(
    Object.fromEntries(formData.entries()),
    current || undefined,
  );
  await saveSmtpConfig(config);

  for (const [key, value] of formData.entries()) {
    if (key.startsWith("smtp_")) continue;
    const jsonValue = value === "on" ? true : String(value);
    await prisma.setting.upsert({
      where: { key },
      update: { value: jsonValue },
      create: { key, value: jsonValue },
    });
  }

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
  await prisma.community.delete({
    where: { id: String(formData.get("id")) },
  });
  revalidatePath("/app/admin");
}
