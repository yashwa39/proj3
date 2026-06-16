import { expect, test } from "@playwright/test";

test("homepage renders and what-if simulation works", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: /see the future/i, level: 1 }),
  ).toBeVisible();

  await page.getByRole("link", { name: /see your future/i }).click();
  await expect(page.locator("#simulator")).toBeVisible();

  await page.getByRole("heading", { name: /what-if scanner/i }).scrollIntoViewIfNeeded();

  const input = page.getByLabel("Enter your what-if question (max 200 characters)");
  await input.fill("What if I install solar panels?");
  await page.getByRole("button", { name: /^simulate$/i }).click();

  await expect(page.getByRole("region", { name: /simulation result/i })).toBeVisible();
  await expect(
    page
      .getByRole("region", { name: /simulation result/i })
      .getByText("Simulation Complete", { exact: true }),
  ).toBeVisible();
});
