import { test, expect, type APIRequestContext, type Page } from "@playwright/test";
import path from "node:path";
import fs from "node:fs";
import os from "node:os";

const API = "http://localhost:4070";
const USER = { username: "sean", pin: "1234" };

async function apiLogin(request: APIRequestContext) {
  const res = await request.post(`${API}/api/auth/login`, {
    data: USER,
  });
  expect(res.ok(), await res.text()).toBeTruthy();
  return res;
}

async function uiLogin(page: Page) {
  await page.goto("/login");
  await page.getByLabel(/User ID/i).fill(USER.username);
  await page.locator('label:has-text("PIN") input').fill(USER.pin);
  await page.getByRole("button", { name: /Unlock/i }).click();
  await expect(page.getByRole("link", { name: "Today" })).toBeVisible({ timeout: 15_000 });
}

test.describe("health + auth edge cases", () => {
  test("API health responds", async ({ request }) => {
    const res = await request.get(`${API}/api/health`);
    expect(res.status()).toBe(200);
    expect(await res.json()).toMatchObject({ ok: true });
  });

  test("rejects wrong PIN", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/User ID/i).fill(USER.username);
    await page.locator('label:has-text("PIN") input').fill("9999");
    await page.getByRole("button", { name: /Unlock/i }).click();
    await expect(page.locator(".error")).toContainText(/Invalid username or PIN/i);
    await expect(page).toHaveURL(/login/);
  });

  test("rejects oversized / non-digit PIN via API", async ({ request }) => {
    const long = await request.post(`${API}/api/auth/login`, {
      data: { username: "sean", pin: "1".repeat(64) },
    });
    expect(long.status()).toBe(400);

    const letters = await request.post(`${API}/api/auth/login`, {
      data: { username: "sean", pin: "abcd" },
    });
    expect(letters.status()).toBe(400);
  });

  test("unauthenticated API routes return 401", async ({ request }) => {
    const paths = [
      "/api/tasks/today",
      "/api/jobs",
      "/api/progress",
      "/api/reviews/weekly",
      "/api/system/export",
      "/api/roadmap?from=2026-07-27&to=2026-08-02",
    ];
    for (const p of paths) {
      const res = await request.get(`${API}${p}`);
      expect(res.status(), p).toBe(401);
    }
  });

  test("protected routes redirect to login when locked", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/login/);
    await page.goto("/jobs");
    await expect(page).toHaveURL(/login/);
    await page.goto("/settings");
    await expect(page).toHaveURL(/login/);
  });

  test("setup is blocked when already initialized", async ({ request }) => {
    const res = await request.post(`${API}/api/auth/setup`, {
      data: { username: "hacker", pin: "5678" },
    });
    expect(res.status()).toBe(409);
  });
});

test.describe("UI happy path + navigation", () => {
  test("login and visit all nav destinations", async ({ page }) => {
    await uiLogin(page);
    for (const name of ["Today", "Progress", "Jobs", "Review", "Roadmap", "Settings"]) {
      await page.getByRole("link", { name }).click();
      await expect(page.getByRole("link", { name })).toBeVisible();
    }
    await expect(page.getByText(/OS notifications|Export \/ import/i).first()).toBeVisible();
  });

  test("Lock returns to login and blocks Today", async ({ page }) => {
    await uiLogin(page);
    await page.getByRole("button", { name: /Lock/i }).click();
    await expect(page).toHaveURL(/login/);
    await page.goto("/");
    await expect(page).toHaveURL(/login/);
  });
});

test.describe("job validation edge cases", () => {
  test("rejects javascript: URL via API", async ({ request }) => {
    await apiLogin(request);
    const res = await request.post(`${API}/api/jobs`, {
      data: {
        company: "XSSCo",
        title: "Bad URL",
        url: "javascript:alert(1)",
      },
    });
    expect(res.status()).toBe(400);
  });

  test("rejects invalid calendar follow-up date", async ({ request }) => {
    await apiLogin(request);
    const res = await request.post(`${API}/api/jobs`, {
      data: {
        company: "DateCo",
        title: "Bad date",
        followUpDate: "2026-02-31",
      },
    });
    expect(res.status()).toBe(400);
  });

  test("creates job with https URL and deletes it", async ({ page, request }) => {
    await uiLogin(page);
    await page.getByRole("link", { name: "Jobs" }).click();
    const company = `EdgeCo-${Date.now()}`;
    await page.locator("form.card label").filter({ hasText: /^Company$/ }).locator("input").fill(company);
    await page.locator("form.card label").filter({ hasText: /^Title$/ }).locator("input").fill("QA Role");
    await page.locator("form.card label").filter({ hasText: /^URL$/ }).locator("input").fill("https://example.com/jobs/edge");
    await page.getByRole("button", { name: /Save job/i }).click();
    const card = page.locator("article.card").filter({ hasText: company });
    await expect(card).toBeVisible();
    await expect(card.getByRole("link", { name: "https://example.com/jobs/edge" })).toBeVisible();

    await apiLogin(request);
    const board = await (await request.get(`${API}/api/jobs`)).json();
    const matches = board.jobs.filter((j: { company: string }) => j.company.startsWith("EdgeCo-"));
    expect(matches.length).toBeGreaterThan(0);
    for (const job of matches) {
      const del = await request.delete(`${API}/api/jobs/${job.id}`);
      expect(del.ok()).toBeTruthy();
    }
  });

  test("rejects disallowed attachment type", async ({ request }) => {
    await apiLogin(request);
    const board = await (await request.get(`${API}/api/jobs`)).json();
    const job = board.jobs[0];
    expect(job).toBeTruthy();
    const tmp = path.join(os.tmpdir(), "gyam-evil.html");
    fs.writeFileSync(tmp, "<script>alert(1)</script>");
    const res = await request.post(`${API}/api/jobs/${job.id}/attachment`, {
      multipart: {
        file: {
          name: "evil.html",
          mimeType: "text/html",
          buffer: fs.readFileSync(tmp),
        },
      },
    });
    expect(res.status()).toBe(400);
  });

  test("accepts txt attachment then clears it", async ({ request }) => {
    await apiLogin(request);
    const create = await request.post(`${API}/api/jobs`, {
      data: { company: `Attach-${Date.now()}`, title: "File", status: "Wishlist" },
    });
    expect(create.status()).toBe(201);
    const { job } = await create.json();
    const tmp = path.join(os.tmpdir(), "gyam-ok.txt");
    fs.writeFileSync(tmp, "employer correspondence archive");
    const up = await request.post(`${API}/api/jobs/${job.id}/attachment`, {
      multipart: {
        file: {
          name: "note.txt",
          mimeType: "text/plain",
          buffer: fs.readFileSync(tmp),
        },
      },
    });
    expect(up.status()).toBe(200);
    const body = await up.json();
    expect(body.job.emailAttachmentName).toBe("note.txt");

    const dl = await request.get(`${API}/api/jobs/${job.id}/attachment`);
    expect(dl.status()).toBe(200);
    expect(await dl.text()).toContain("employer correspondence");

    const clear = await request.delete(`${API}/api/jobs/${job.id}/attachment`);
    expect(clear.ok()).toBeTruthy();
    await request.delete(`${API}/api/jobs/${job.id}`);
  });
});

test.describe("tasks / notes / roadmap / import edges", () => {
  test("notes max length enforced", async ({ request }) => {
    await apiLogin(request);
    const today = await (await request.get(`${API}/api/tasks/today`)).json();
    const task = today.tasks[0] ?? today.backlogTasks?.[0];
    expect(task, "need at least one task").toBeTruthy();
    const huge = "x".repeat(10_001);
    const res = await request.patch(`${API}/api/tasks/${task.id}/notes`, {
      data: { notes: huge },
    });
    expect(res.status()).toBe(400);
  });

  test("invalid task id rejected", async ({ request }) => {
    await apiLogin(request);
    const res = await request.post(`${API}/api/tasks/not-a-valid-id!!!/start`, { data: {} });
    expect(res.status()).toBe(400);
  });

  test("roadmap rejects invalid query dates", async ({ request }) => {
    await apiLogin(request);
    const res = await request.get(`${API}/api/roadmap?from=not-a-date&to=2026-08-01`);
    expect(res.status()).toBe(400);
  });

  test("import rejects javascript URL in payload", async ({ request }) => {
    await apiLogin(request);
    const res = await request.post(`${API}/api/system/import`, {
      data: {
        version: 1,
        jobs: [
          {
            company: "Bad",
            title: "Import XSS",
            url: "javascript:alert(1)",
          },
        ],
      },
    });
    expect(res.status()).toBe(400);
  });

  test("export returns versioned JSON", async ({ request }) => {
    await apiLogin(request);
    const res = await request.get(`${API}/api/system/export`);
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json.version).toBe(1);
    expect(Array.isArray(json.tasks)).toBeTruthy();
    expect(Array.isArray(json.jobs)).toBeTruthy();
  });

  test("Today page renders tasks after login", async ({ page }) => {
    await uiLogin(page);
    await expect(page.getByText(/Today|progress|Backlog/i).first()).toBeVisible();
  });

  test("Review and Progress load without crash", async ({ page }) => {
    await uiLogin(page);
    await page.getByRole("link", { name: "Progress" }).click();
    await expect(page.getByText(/streak|heatmap|Progress/i).first()).toBeVisible();
    await page.getByRole("link", { name: "Review" }).click();
    await expect(page.getByText(/wins|blockers|focus|plan/i).first()).toBeVisible();
  });
});

test.describe("UI XSS / injection rendering", () => {
  test("script tags in job company render as text not HTML", async ({ page, request }) => {
    await apiLogin(request);
    const company = `<img src=x onerror=alert(1)>EdgeXSS`;
    const create = await request.post(`${API}/api/jobs`, {
      data: { company, title: "Safe render", notes: "<script>window.__pwned=1</script>" },
    });
    expect(create.status()).toBe(201);
    const { job } = await create.json();

    await uiLogin(page);
    await page.getByRole("link", { name: "Jobs" }).click();
    await expect(page.getByText(/EdgeXSS/)).toBeVisible();
    const pwned = await page.evaluate(() => (window as unknown as { __pwned?: number }).__pwned);
    expect(pwned).toBeUndefined();
    await expect(page.locator('img[src="x"]')).toHaveCount(0);

    await request.delete(`${API}/api/jobs/${job.id}`);
  });
});

test.describe("responsive smoke", () => {
  test("mobile viewport login + today", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await uiLogin(page);
    await expect(page.getByRole("link", { name: "Today" })).toBeVisible();
    await page.getByRole("link", { name: "Jobs" }).click();
    await expect(page.getByRole("button", { name: /Save job/i })).toBeVisible();
  });
});
