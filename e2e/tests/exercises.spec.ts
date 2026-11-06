import { expect, test } from "@playwright/test";
import { expectNoA11yViolations } from "../helpers/a11y";
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
  await expectNoA11yViolations(page, "empty library");
  await page.getByRole("button", { name: "New Exercise" }).click();
  await expect(
    page.getByRole("heading", { name: "New Exercise" }),
  ).toBeVisible();
  await expectNoA11yViolations(page, "new exercise form");
  await page.getByRole("button", { name: "Create" }).click();
  await expect(page.getByText("Exercise name is required")).toBeVisible();
  await expectNoA11yViolations(page, "new exercise form with errors");
  await page.getByLabel("Title", { exact: true }).fill(exerciseNewTitle);
  await page.getByRole("button", { name: "Create" }).click();
  await expect(page.getByRole("heading", { name: "Library" })).toBeVisible();
  await expect(page.getByText(exerciseNewTitle)).toBeVisible();
  await expectNoA11yViolations(page, "library with an exercise");

  await page.getByRole("button", { name: exerciseNewTitle }).press("Enter");
  await expect(
    page.getByRole("heading", { name: "Edit Exercise" }),
  ).toBeVisible();
  await expectNoA11yViolations(page, "edit exercise form");
  await page.getByLabel("Title", { exact: true }).fill(exerciseEditTitle);
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByRole("heading", { name: "Library" })).toBeVisible();
  await expect(page.getByText(exerciseEditTitle)).toBeVisible();

  await page
    .getByRole("listitem")
    .filter({ hasText: exerciseEditTitle })
    .getByRole("button", { name: "Exercise options" })
    .click();
  await expectNoA11yViolations(page, "exercise options menu");
  await page.getByRole("button", { name: "Delete" }).click();
  await expect(page.getByRole("alertdialog")).toBeVisible();
  await expectNoA11yViolations(page, "delete confirmation");
  await page
    .getByRole("alertdialog")
    .getByRole("button", { name: "Delete" })
    .click();
  await expect(page.getByText(exerciseEditTitle)).not.toBeVisible();
});
