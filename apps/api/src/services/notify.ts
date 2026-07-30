import nodemailer from "nodemailer";
import { logActivity } from "../activity.js";

export function smtpConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.SMTP_TO,
  );
}

export function getNotifyStatus() {
  return {
    smtpConfigured: smtpConfigured(),
    smtpHost: process.env.SMTP_HOST ?? null,
    smtpUser: process.env.SMTP_USER ?? null,
    smtpTo: process.env.SMTP_TO ?? null,
    from: process.env.SMTP_FROM ?? process.env.SMTP_USER ?? null,
  };
}

export async function sendEmail(input: {
  subject: string;
  text: string;
  userId?: string;
}) {
  if (!smtpConfigured()) {
    return { ok: false as const, error: "SMTP not configured" };
  }

  const port = Number(process.env.SMTP_PORT ?? 587);
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
    to: process.env.SMTP_TO,
    subject: input.subject,
    text: input.text,
  });

  await logActivity({
    userId: input.userId ?? null,
    eventType: "notification_sent",
    entityType: "email",
    payload: { subject: input.subject, channel: "smtp" },
  });

  return { ok: true as const };
}
