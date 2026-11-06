import { expect, test } from "@playwright/test";
import { createVerifiedUser } from "../helpers/user";

test("a user can CRUD an exercise", async ({ page, request }) => {
  const { email, password } = await createVerifiedUser(request);
  const exerciseNewTitle = "Test Exercise New";
  const exerciseEditTitle = "Test Exercise Edit";

  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "Log In" })).toBeVisible();

  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Log In" }).click();
  await expect(page.getByRole("complementary").getByText(email)).toBeVisible();

  await page
    .getByRole("complementary")
    .getByRole("link", { name: "Library" })
    .click();
  await expect(page.getByRole("heading", { name: "Library" })).toBeVisible();
  await page.getByRole("button", { name: "New Exercise" }).click();
  await expect(
    page.getByRole("heading", { name: "New Exercise" }),
  ).toBeVisible();
  await page.getByLabel("Title", { exact: true }).fill(exerciseNewTitle);
  await page.getByRole("button", { name: "Create" }).click();
  await expect(page.getByRole("heading", { name: "Library" })).toBeVisible();
  await expect(page.getByText(exerciseNewTitle)).toBeVisible();

  await page.getByRole("button").getByText(exerciseNewTitle).click();
  await expect(
    page.getByRole("heading", { name: "Edit Exercise" }),
  ).toBeVisible();
  await page.getByLabel("Title", { exact: true }).fill(exerciseEditTitle);
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByRole("heading", { name: "Library" })).toBeVisible();
  await expect(page.getByText(exerciseEditTitle)).toBeVisible();

  await page
    .getByRole("button", { name: exerciseEditTitle })
    .getByRole("button", { name: "Exercise options" })
    .click();
  await page.getByRole("button", { name: "Delete" }).click();
  await page
    .getByRole("alertdialog")
    .getByRole("button", { name: "Delete" })
    .click();
  await expect(page.getByText(exerciseEditTitle)).not.toBeVisible();
});
