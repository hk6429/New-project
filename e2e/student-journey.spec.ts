import { expect, test } from "@playwright/test";

test("學生從首頁進入並完成第一組借代配對", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /破解詞語的/ })).toBeVisible();
  await page.getByRole("link", { name: "開始第一局" }).click();
  await expect(page.getByRole("heading", { name: "找出借代詞的真正身分" })).toBeVisible();

  const firstTerm = page.locator('[data-card-side="metonym"]').first();
  const questionId = await firstTerm.getAttribute("data-question-id");
  await firstTerm.click();
  await page.locator(`[data-question-id="${questionId}"][data-card-side="referent"]`).click();

  await expect(page.getByRole("status")).toContainText("配對成功");
  await expect(page.locator(".explanation")).toContainText("解析：");
});

test("手機版首頁沒有水平溢位", async ({ page }) => {
  await page.goto("/");
  const sizes = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, innerWidth }));
  expect(sizes.scrollWidth).toBeLessThanOrEqual(sizes.innerWidth);
});

test("學生可完成語境判讀並看到解析", async ({ page }) => {
  await page.goto("/context");
  await expect(page.locator(".context-card h1")).toBeVisible();
  await page.locator(".option-grid .quiz-option").first().click();
  await expect(page.getByRole("status")).toBeVisible();
  await expect(page.getByText(/解析：/)).toBeVisible();
});

test("六個冒險區都已開放", async ({ page }) => {
  await page.goto("/adventure");
  await expect(page.locator(".map-node")).toHaveCount(6);
  await expect(page.locator(".map-action")).toHaveCount(6);
  await expect(page.getByText("即將開放")).toHaveCount(0);
});
