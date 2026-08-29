import { expect, test } from "@playwright/test";
import { randomUUID } from "crypto";
import { MAILPIT_URL } from "../playwright.config";

test("a new user can sign up, verify, log out and log back in", async ({
  page,
  request,
}) => {
  const email = `user-${randomUUID()}@example.test`;
  const password = "password";
  await page.goto("/signup");
  await page.getByLabel("Email").fill(email);
  await page.getByRole("button", { name: "Send Verification Email" }).click();
  await expect(
    page.getByRole("heading", { name: "Check your email" }),
  ).toBeVisible();

  await expect
    .poll(async () => {
      const res = await request.get(
        `${MAILPIT_URL}/api/v1/search?query=to:${email}`,
      );
      const body = await res.json();
      return body.messages.length;
    })
    .toBeGreaterThan(0);

  const res = await request.get(
    `${MAILPIT_URL}/api/v1/search?query=to:${email}`,
  );
  const { messages } = await res.json();
  const id = messages[0].ID;

  const message = await request.get(`${MAILPIT_URL}/api/v1/message/${id}`);
  const { HTML } = await message.json();
  const link = HTML.match(/http:\/\/localhost:3001\/verify\?token=[a-f0-9]+/);
  expect(link).not.toBeNull();
  await page.goto(link![0]);
  await expect(
    page.getByRole("heading", { name: "Complete Your Account" }),
  ).toBeVisible();

  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByLabel("Confirm Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Create Account" }).click();
  await expect(page.getByRole("complementary").getByText(email)).toBeVisible();

  await page
    .getByRole("complementary")
    .getByRole("button", { name: "Log Out" })
    .click();
  await expect(page.getByRole("heading", { name: "Log In" })).toBeVisible();

  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Log In" }).click();
  await expect(page.getByRole("complementary").getByText(email)).toBeVisible();
});
