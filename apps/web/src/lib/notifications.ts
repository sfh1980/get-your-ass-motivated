export async function ensureOsNotificationPermission(): Promise<NotificationPermission> {
  if (!("Notification" in window)) return "denied";
  if (Notification.permission === "granted" || Notification.permission === "denied") {
    return Notification.permission;
  }
  return Notification.requestPermission();
}

export function showOsNotification(title: string, body: string, tag?: string) {
  if (!("Notification" in window) || Notification.permission !== "granted") return false;
  try {
    const n = new Notification(title, {
      body,
      tag,
      silent: false,
    });
    window.setTimeout(() => n.close(), 20_000);
    return true;
  } catch {
    return false;
  }
}

/** Keep-alive prompt: OS notification + confirm; returns true if user confirmed continue. */
export async function keepAlivePrompt(taskTitle: string): Promise<boolean> {
  await ensureOsNotificationPermission();
  showOsNotification(
    "GYAM — still working?",
    taskTitle,
    `gyam-keepalive-${taskTitle.slice(0, 24)}`,
  );
  return window.confirm(
    `Still working on:\n\n${taskTitle}\n\nClick OK to continue. No response in 60s will auto-pause.`,
  );
}
