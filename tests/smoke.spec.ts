import { test, expect } from "@playwright/test";

test.describe("Smoke", () => {
  test("home loads", async ({ page }) => {
    await page.goto("/");
    // At least check that main UI renders something meaningful
    await expect(
      page.locator("text=Gerador de Topo de Bolo").first()
    ).toBeVisible();
  });
});
