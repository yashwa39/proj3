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

test("sharing an eco-hack adds it to the feed", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("heading", { name: /social carbon swap/i })
    .scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: /share your eco-hack/i }).click();

  await page
    .getByPlaceholder(/walk 2km/i)
    .fill("Just walk to the nearby shop instead of driving.");
  await page.getByLabel(/co₂ saved/i).fill("4.4");
  await page.getByRole("button", { name: /^share$/i }).click();

  await expect(page.getByText(/your eco-hack was added/i)).toBeVisible();
  await expect(
    page.getByRole("feed", { name: /community eco-hacks feed/i }),
  ).toContainText("Just walk to the nearby shop instead of driving.");
});
