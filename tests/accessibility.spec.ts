
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("homepage has no critical or serious accessibility violations", async ({
  page,
}) => {
  // Open the homepage.
  await page.goto("/");

  // Confirm that the homepage loaded.
  await expect(page.locator("body")).toBeVisible();

  // Scan the page using axe-core.
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  // Display violations in the test report if the test fails.
  const violations = results.violations.filter(
    (violation) =>
      violation.impact === "critical" ||
      violation.impact === "serious"
  );

  expect(
    violations,
    JSON.stringify(violations, null, 2)
  ).toEqual([]);
});
