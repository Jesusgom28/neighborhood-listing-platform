
import { test, expect } from "@playwright/test";

test("property search requires login before inquiry submission", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Neighborhood Listings" })
  ).toBeVisible();

  const propertyLink = page.getByRole("link", {
    name: /View details/,
  }).first();

  await expect(propertyLink).toBeVisible();
  await propertyLink.click();

  await expect(
    page.getByRole("heading", { name: /Property #/ })
  ).toBeVisible();

  await page.getByLabel("Your message").fill(
    "Playwright authentication test"
  );

  await page.getByRole("button", {
    name: "Send inquiry",
  }).click();

  await expect(page.getByRole("status")).toContainText(
    "Please sign in before sending an inquiry."
  );

  await page.getByRole("link", {
    name: "Go to login",
  }).click();

  await expect(
    page.getByRole("heading", { name: "Sign in" })
  ).toBeVisible();
});

test("authenticated user can submit a property inquiry", async ({
  page,
}) => {
  const email = process.env.PLAYWRIGHT_TEST_EMAIL;
  const password = process.env.PLAYWRIGHT_TEST_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "Missing Playwright test credentials in .env.local"
    );
  }

  // Open the login page.
  await page.goto("/login");

  // Enter local test account credentials.
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);

  // Submit the login form.
  await page.getByRole("button", {
    name: "Sign in",
  }).click();

  // Wait until the application leaves the login page.
  await expect(page).not.toHaveURL(
    /\/login(?:\?|$)/,
    { timeout: 15000 }
  );

  // Open the homepage and search for properties.
  await page.goto("/");

  await page.getByRole("button", {
    name: "Search properties",
  }).click();

  const propertyLink = page.getByRole("link", {
    name: /View details for Property #/,
  }).first();

  await expect(propertyLink).toBeVisible();
  await propertyLink.click();

  // Submit a unique inquiry message.
  const message = `Playwright authenticated inquiry ${Date.now()}`;

  await page.getByLabel("Your message").fill(message);

  await page.getByRole("button", {
    name: "Send inquiry",
  }).click();

  // Verify that the application reports success.
  await expect(page.getByRole("status")).toContainText(
    "Inquiry submitted successfully!",
    { timeout: 15000 }
  );
});
