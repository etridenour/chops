import AxeBuilder from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";

const WCAG_22_AA = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

export async function expectNoA11yViolations(page: Page, screen: string) {
  const { violations } = await new AxeBuilder({ page })
    .withTags(WCAG_22_AA)
    .analyze();

  const summary = violations.map(
    ({ id, impact, help, nodes }) =>
      `${id} (${impact}): ${help} → ${nodes
        .map((n) => `${n.html} (${n.failureSummary?.split("\n")[1]?.trim()})`)
        .join(" | ")}`,
  );

  expect.soft(summary, `a11y violations on ${screen}`).toEqual([]);
}
