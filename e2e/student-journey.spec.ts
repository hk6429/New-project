import { expect, test } from "@playwright/test";

test("學生從首頁進入並完成第一組借代配對", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /破解詞語的/ })).toBeVisible();
  await page.getByRole("link", { name: "開始第一局" }).click();
  await expect(page.getByRole("heading", { name: "找出借代詞的真正身分" })).toBeVisible();

  await page.getByRole("button", { name: "借代詞：杜康" }).click();
  await page.getByRole("button", { name: "實際所指：酒" }).click();

  await expect(page.getByRole("status")).toContainText("配對成功");
  await expect(page.getByText(/杜康相傳善於造酒/)).toBeVisible();
});

test("手機版首頁沒有水平溢位", async ({ page }) => {
  await page.goto("/");
  const sizes = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, innerWidth }));
  expect(sizes.scrollWidth).toBeLessThanOrEqual(sizes.innerWidth);
});

