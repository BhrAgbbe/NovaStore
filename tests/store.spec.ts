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
  await expect(page.getByRole("dialog", { name: "Remove this item?" })).toContainText(
    "City Carry Handbag"
  );
  await page.getByRole("dialog").getByRole("button", { name: "Remove item" }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "City Carry Handbag removed" })
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear cart" }).click();
  await expect(page.getByRole("button", { name: "Cancel" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("heading", { name: "Clear your cart?" })).toHaveCount(0);
  await page.getByRole("button", { name: "Clear cart" }).click();
  await page
    .getByRole("dialog", { name: "Clear your cart?" })
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
  for (const width of [320, 360, 375, 390, 767, 768, 834, 1023, 1024, 1440]) {
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
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("dialog").getByRole("button", { name: "تغییر پوسته" }).click();
  await page.getByRole("button", { name: "بستن منو" }).click();
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

test("uses SSR once, retries through the internal endpoint, and searches category names without refetching", async ({
  page,
  request,
}) => {
  let clientRetries = 0;
  page.on("request", (entry) => {
    if (new URL(entry.url()).pathname === "/api/catalog") clientRetries++;
  });
  await control(request, "mode=error");
  await page.goto("/en");
  await expect(page.getByRole("heading", { name: "Unable to load the catalog" })).toBeVisible();
  const stats = async () => (await (await request.get(API + "/__stats")).json()).requests;
  expect((await stats())["/products"]).toBe(1);
  expect((await stats())["/products/categories"]).toBe(1);
  expect(clientRetries).toBe(0);
  await control(request, "mode=ok");
  await page.getByRole("button", { name: "Try again" }).click();
  await expect(page.locator("article")).toHaveCount(6);
  const search = page.getByRole("searchbox");
  await search.fill("Apparel");
  await search.press("Enter");
  await expect(page.locator("article")).toHaveCount(3);
  await page.getByRole("button", { name: "Electronics", exact: true }).click();
  await expect(page.getByRole("heading", { name: "No products found" })).toBeVisible();
  expect((await stats())["/products"]).toBe(2);
  expect((await stats())["/products/categories"]).toBe(2);
  expect(clientRetries).toBe(2);
  expect((await stats())["/products/category/electronics"]).toBe(1);
});

test("supports tablet navigation, keyboard sorting, the mobile search and carousel, and the empty cart footer", async ({
  page,
}) => {
  await page.setViewportSize({ width: 834, height: 900 });
  await page.goto("/en");
  const nav = page.getByRole("navigation", { name: "NOVA Store" });
  await expect(nav.getByRole("link", { name: "Products" })).toBeVisible();
  const sort = page.getByRole("button", { name: "Sort: Featured" });
  await sort.focus();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Featured", exact: true })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(sort).toBeFocused();
  await expect(sort).toHaveAttribute("aria-expanded", "false");

  await page.setViewportSize({ width: 390, height: 900 });
  const brand = await page.locator("header .brand").boundingBox();
  expect((brand?.x ?? 0) + (brand?.width ?? 0) / 2).toBeCloseTo(195, 0);
  const menu = page.getByRole("button", { name: "Open menu" });
  await menu.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("dialog").getByRole("link", { name: /cart/i })).toHaveCount(0);
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  const search = page.getByRole("searchbox");
  await expect(search).toBeHidden();
  await page.getByRole("button", { name: "Open product search" }).click();
  await expect(search).toBeFocused();
  await search.fill("electronics");
  await expect(page.getByRole("button", { name: "Clear search" })).toHaveCount(1);
  await page.getByRole("button", { name: "Close product search" }).click();
  await expect(search).toBeHidden();
  const slide = page.getByRole("region", { name: "Featured collections" }).locator("[aria-live]");
  await slide.dispatchEvent("pointerdown", {
    pointerType: "touch",
    isPrimary: true,
    clientX: 280,
    clientY: 130,
  });
  await slide.dispatchEvent("pointerup", {
    pointerType: "touch",
    isPrimary: true,
    clientX: 105,
    clientY: 135,
  });
  await expect(page.getByRole("heading", { name: "Tech for every day" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Next slide" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Previous slide" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Tech for every day" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Slide 2" })).toHaveAttribute(
    "aria-current",
    "true"
  );
  await page.getByRole("button", { name: "Slide 3" }).click();
  await expect(page.getByRole("heading", { name: "Find your everyday style" })).toBeVisible();
  await page.getByRole("button", { name: "Slide 2" }).click();
  await expect(page.getByRole("heading", { name: "Tech for every day" })).toBeVisible();
  await page.getByRole("button", { name: "Explore products" }).click();
  await expect(page).toHaveURL(/category=electronics/);
  await page.getByRole("link", { name: /Shopping cart/ }).click();
  await expect(page.getByRole("heading", { name: "Your cart is empty" })).toBeVisible();
  await expect(page.locator("footer")).toContainText("© " + new Date().getUTCFullYear() + " NOVA");
  const footerBottom = await page
    .locator("footer")
    .evaluate((node) => node.getBoundingClientRect().bottom);
  expect(footerBottom).toBeCloseTo(900, 0);
});

test("cycles real photographs every five seconds and loads dropdown categories from the API", async ({
  page,
  request,
}) => {
  await page.clock.install();
  await page.goto("/en");
  const carousel = page.getByRole("region", { name: "Featured collections" });
  await expect(carousel.getByRole("button", { name: "Slide 2" })).toBeVisible();
  await page.clock.runFor(5000);
  await expect(carousel.getByRole("button", { name: "Slide 2" })).toHaveAttribute(
    "aria-current",
    "true"
  );
  await expect(carousel.locator(".product-photo img")).toHaveAttribute("src", /photos/);
  await carousel.getByRole("button", { name: "Pause slideshow" }).click();
  await page.clock.runFor(5000);
  await expect(carousel.getByRole("button", { name: "Slide 2" })).toHaveAttribute(
    "aria-current",
    "true"
  );
  await page.getByRole("combobox", { name: "Categories" }).selectOption("apparel");
  await expect(page).toHaveURL(/category=apparel/);
  await expect(page.locator("article")).toHaveCount(3);
  const stats = (await (await request.get(API + "/__stats")).json()).requests;
  expect(stats["/products/category/men's%20clothing"]).toBe(1);
  expect(stats["/products/category/women's%20clothing"]).toBe(1);
  const badge = page.locator("article").first().locator("[data-category]");
  await expect(badge).toHaveAttribute("data-category", "apparel");
  const details = page.getByRole("button", { name: "View details for Everyday Sneakers" });
  await details.click();
  await expect(page.getByRole("dialog", { name: "Everyday Sneakers" })).toContainText(
    "Description"
  );
  await page.keyboard.press("Escape");
  await expect(details).toBeFocused();
});
