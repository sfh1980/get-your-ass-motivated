import { test, expect } from "@playwright/test";
import path from "node:path";
import fs from "node:fs";

/** Live LAN: set GYAM_E2E_ORIGIN, GYAM_E2E_USER, GYAM_E2E_PIN. Do not commit the PIN. */
const USER = {
  username: process.env.GYAM_E2E_USER ?? "sean",
  pin: process.env.GYAM_E2E_PIN ?? "1234",
};
const OUT = path.resolve("docs/pm/portfolio-export/screenshots");

async function login(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.getByLabel(/User ID/i).fill(USER.username);
  await page.locator('label:has-text("PIN") input').fill(USER.pin);
  await page.getByRole("button", { name: /Unlock/i }).click();
  await expect(page.getByRole("link", { name: "Today" })).toBeVisible({ timeout: 15_000 });
}

test("capture portfolio screenshots", async ({ page }) => {
  fs.mkdirSync(OUT, { recursive: true });
  await page.setViewportSize({ width: 1440, height: 900 });

  // Login screen (before auth)
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "GYAM" })).toBeVisible();
  await page.screenshot({
    path: path.join(OUT, "gyam-login.png"),
    fullPage: true,
  });

  await login(page);

  const shots: Array<{ name: string; link?: string; wait?: RegExp }> = [
    { name: "gyam-today.png", wait: /Today|progress|Backlog/i },
    { name: "gyam-progress.png", link: "Progress", wait: /streak|heatmap|Progress/i },
    { name: "gyam-pm.png", link: "PM", wait: /PM dashboard|Risk matrix|Burnup/i },
    { name: "gyam-jobs.png", link: "Jobs", wait: /quota|Wishlist|Save job/i },
    { name: "gyam-review.png", link: "Review", wait: /wins|blockers|focus|plan/i },
    { name: "gyam-roadmap.png", link: "Roadmap", wait: /Roadmap|milestone|subject/i },
    { name: "gyam-settings.png", link: "Settings", wait: /OS notifications|Export/i },
  ];

  for (const shot of shots) {
    if (shot.link) {
      await page.getByRole("link", { name: shot.link, exact: true }).click();
    }
    if (shot.wait) {
      await expect(page.getByText(shot.wait).first()).toBeVisible({ timeout: 15_000 });
    }
    await page.waitForTimeout(400);
    await page.screenshot({
      path: path.join(OUT, shot.name),
      fullPage: true,
    });
  }

  // Mobile Today
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("link", { name: "Today" }).click();
  await expect(page.getByText(/Today|progress/i).first()).toBeVisible();
  await page.waitForTimeout(400);
  await page.screenshot({
    path: path.join(OUT, "gyam-today-mobile.png"),
    fullPage: true,
  });

  const files = fs.readdirSync(OUT).filter((f) => f.endsWith(".png"));
  expect(files.length).toBeGreaterThanOrEqual(7);
  console.log("Wrote screenshots:", files.sort().join(", "));
});
