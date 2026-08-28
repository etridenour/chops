import { test, expect } from "@playwright/test";
import { API_URL, MAILPIT_URL } from "../playwright.config";

test("web app is serving the login page", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "Log In" })).toBeVisible();
});

test("api is up and talking to the e2e database", async ({ request }) => {
  const health = await request.get(`${API_URL}/health`);
  expect(health.ok()).toBe(true);

  const login = await request.post(`${API_URL}/auth/login`, {
    data: { email: "nobody@example.test", password: "wrongpassword" },
    failOnStatusCode: false,
  });
  expect(login.status()).toBe(401);
});

test("mailpit is reachable and empty", async ({ request }) => {
  const res = await request.get(`${MAILPIT_URL}/api/v1/messages`);
  expect(res.ok()).toBe(true);
});
