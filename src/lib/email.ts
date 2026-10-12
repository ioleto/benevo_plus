import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";
export async function sendEmail(to: string, subject: string, text: string) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_FROM) {
    await prisma.emailLog.create({ data: { to, subject, status: "skipped" } });
    return;
  }
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
    });
    await transporter.sendMail({
      from: `${process.env.SMTP_FROM_NAME || "Bénévo+"} <${process.env.SMTP_FROM}>`,
      to,
      subject,
      text,
    });
    await prisma.emailLog.create({ data: { to, subject, status: "sent" } });
  } catch (error) {
    await prisma.emailLog.create({
      data: { to, subject, status: "failed", error: String(error) },
    });
  }
}
