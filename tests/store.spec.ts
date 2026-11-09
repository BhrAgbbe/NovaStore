import { expect, test, type APIRequestContext } from "@playwright/test";

const API = "http://127.0.0.1:4402";
async function control(request: APIRequestContext, query: string) {
  const result = await request.get(API + "/__control?" + query);
  expect(result.ok()).toBeTruthy();
}

test.beforeEach(async ({ request }) => {
  await control(request, "reset=1");
});

test("filters, sorts and pages the catalog with back and locale navigation", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator("article")).toHaveCount(6);
  await page.getByRole("button", { name: "Page 2", exact: true }).click();
  await expect(page).toHaveURL(/page=2/);
  await expect(page.locator("article")).toHaveCount(3);
  await page.getByRole("button", { name: "Electronics" }).click();
  await expect(page).toHaveURL(/category=electronics/);
  await expect(page).not.toHaveURL(/page=2/);
  await expect(page.locator("article")).toHaveCount(5);
  await page.getByRole("button", { name: "Sort: Featured" }).click();
  await page.getByRole("button", { name: "Price: low to high", exact: true }).click();
  await expect(page.locator("article").first()).toContainText("Sport Smartwatch");
  await page.getByRole("searchbox", { name: "Search products" }).fill("wireless");
  await page.getByRole("searchbox", { name: "Search products" }).press("Enter");
  await expect(page.locator("article")).toHaveCount(1);
  await expect(page.locator("article")).toContainText("Studio Wireless Headphones");
  await page.getByRole("link", { name: "فارسی" }).click();
  await expect(page).toHaveURL(/\/fa\?q=wireless.*category=electronics/);
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
});

test("persists a cart, calculates amounts and supports remove and clear confirmation", async ({
  page,
}) => {
  await page.goto("/en");
  const sneakers = page.locator("article").filter({ hasText: "Everyday Sneakers" });
  await sneakers.getByRole("button", { name: "Add to cart" }).click();
  await sneakers.getByRole("button", { name: "Add to cart" }).click();
  await page
    .locator("article")
    .filter({ hasText: "City Carry Handbag" })
    .getByRole("button", { name: "Add to cart" })
    .click();
  await page.getByRole("link", { name: /Shopping cart.*3/ }).click();
  await expect(page).toHaveURL(/\/en\/cart$/);
  await expect(page.getByText("8,997,000 toman", { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText("8,997,000 toman", { exact: true })).toBeVisible();
  await page
    .locator("article")
    .filter({ hasText: "Everyday Sneakers" })
    .getByRole("button", { name: "Decrease quantity" })
    .click();
  await expect(page.getByText("5,498,000 toman", { exact: true })).toBeVisible();
  await expect(
    page
      .locator("article")
      .filter({ hasText: "Everyday Sneakers" })
      .getByRole("button", { name: "Decrease quantity" })
  ).toBeDisabled();
  await page
    .locator("article")
    .filter({ hasText: "City Carry Handbag" })
    .getByRole("button", { name: "Remove item" })
    .click();
  await expect(
    page.getByRole("status").filter({ hasText: "City Carry Handbag removed" })
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear cart" }).click();
  await expect(page.getByRole("button", { name: "Cancel" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("heading", { name: "Clear your cart?" })).toHaveCount(0);
  await page.getByRole("button", { name: "Clear cart" }).click();
  await page
    .getByRole("region", { name: "Clear your cart?" })
    .getByRole("button", { name: "Clear cart" })
    .click();
  await expect(page.getByRole("heading", { name: "Your cart is empty" })).toBeVisible();
});

test("renders request errors, retry and empty search, and recovers invalid cart storage", async ({
  page,
  request,
}) => {
  await control(request, "mode=error");
  await page.goto("/en");
  await expect(page.getByRole("alert")).toContainText("Products could not be loaded");
  await control(request, "mode=empty");
  await page.getByRole("button", { name: "Try again" }).click();
  await expect(page.getByRole("heading", { name: "No products yet" })).toBeVisible();
  await control(request, "mode=ok");
  await page.reload();
  await page.getByRole("searchbox", { name: "Search products" }).fill("no matches here");
  await page.getByRole("searchbox", { name: "Search products" }).press("Enter");
  await expect(page.getByRole("heading", { name: "No products found" })).toBeVisible();
  await page.evaluate(() => localStorage.setItem("nova-store:cart", "{broken"));
  await page.goto("/en/cart");
  await expect(page.getByRole("heading", { name: "Your cart is empty" })).toBeVisible();
});

test("serves locale metadata and SSR styles, stays within responsive widths and captures the Store", async ({
  page,
  request,
}, info) => {
  await control(request, "locale=fa");
  const home = await request.get("/fa");
  const html = await home.text();
  expect(html).toContain('lang="fa"');
  expect(html).toContain('dir="rtl"');
  expect(html).toContain("data-styled");
  expect(html).toMatch(/hreflang="en"/i);
  expect(await (await request.get("/en/cart")).text()).toContain('content="noindex, follow"');
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain("/fa");
  expect(sitemap).toContain("/en");
  expect(sitemap).not.toContain("/cart");
  const hydrationErrors: string[] = [];
  page.on("console", (entry) => {
    if (entry.type() === "error" && /hydrat/i.test(entry.text()))
      hydrationErrors.push(entry.text());
  });
  await page.goto("/fa");
  await expect(page.locator("article")).toHaveCount(6);
  await expect(page.getByRole("button", { name: "افزودن به سبد" }).first()).toBeEnabled();
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: info.outputPath("store-desktop.png"),
    fullPage: true,
    caret: "initial",
  });
  for (const width of [360, 390, 767, 768, 834, 1023, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: info.outputPath("store-mobile.png"),
    fullPage: true,
    caret: "initial",
  });
  await page.getByRole("button", { name: "منوی اصلی" }).click();
  await expect(page.locator("#store-menu")).toBeVisible();
  await page.getByRole("button", { name: "بستن منو" }).click();
  await page.getByRole("button", { name: "تغییر پوسته" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  expect(hydrationErrors).toEqual([]);
  await expect(page.getByRole("button", { name: "افزودن به سبد" }).first()).toBeEnabled();
  await page
    .locator("article")
    .filter({ hasText: "کتانی ورزشی" })
    .getByRole("button", { name: "افزودن به سبد" })
    .click();
  await page
    .locator("article")
    .filter({ hasText: "کیف دستی زنانه" })
    .getByRole("button", { name: "افزودن به سبد" })
    .click();
  await page.getByRole("link", { name: /سبد خرید · ۲/ }).click();
  await expect(page.getByRole("heading", { name: "خلاصه سبد خرید" })).toBeVisible();
  await page.screenshot({
    path: info.outputPath("store-cart-mobile-dark.png"),
    fullPage: true,
    caret: "initial",
  });
});
