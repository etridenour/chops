import { expect, test } from "@playwright/test";
import { randomUUID } from "crypto";
import { getVerificationLink } from "../helpers/user";

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

  const link = await getVerificationLink(request, email);
  await page.goto(link);
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
