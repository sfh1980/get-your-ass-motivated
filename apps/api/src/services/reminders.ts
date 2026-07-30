import { prisma } from "../db.js";
import { formatDateOnly, todayUtc } from "../dates.js";
import { sendEmail, smtpConfigured } from "./notify.js";

export async function getDueFollowUps(userId: string) {
  const today = todayUtc();
  const jobs = await prisma.job.findMany({
    where: {
      userId,
      followUpDate: { lte: today },
      status: { in: ["Applied", "Interview", "Wishlist"] },
    },
    orderBy: { followUpDate: "asc" },
  });
  return jobs.map((j) => ({
    id: j.id,
    company: j.company,
    title: j.title,
    status: j.status,
    followUpDate: j.followUpDate ? formatDateOnly(j.followUpDate) : null,
  }));
}

export async function sendFollowUpDigest(userId: string) {
  const due = await getDueFollowUps(userId);
  if (due.length === 0) {
    return { ok: true as const, sent: false, count: 0, message: "No follow-ups due" };
  }
  if (!smtpConfigured()) {
    return { ok: false as const, sent: false, count: due.length, error: "SMTP not configured" };
  }

  const lines = due.map(
    (j) => `- ${j.followUpDate} | ${j.company} — ${j.title} [${j.status}]`,
  );
  const result = await sendEmail({
    userId,
    subject: `GYAM: ${due.length} job follow-up(s) due`,
    text: `Follow-ups due on or before today:\n\n${lines.join("\n")}\n\n— GYAM`,
  });

  if (!result.ok) return { ok: false as const, sent: false, count: due.length, error: result.error };
  return { ok: true as const, sent: true, count: due.length };
}
