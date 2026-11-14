import { expect, test, type APIRequestContext } from "@playwright/test";

const API = "http://127.0.0.1:4402";
async function control(request: APIRequestContext, query: string) {
  const result = await request.get(API + "/__control?" + query);
  expect(result.ok()).toBeTruthy();
}

test.beforeEach(async ({ request }) => {
  await control(request, "reset=1");
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
  await page.getByRole("button", { name: "Categories", exact: true }).click();
  await page.getByRole("group", { name: "Categories" }).getByRole("button", { name: "Apparel" }).click();
  await expect(page).toHaveURL(/category=apparel/);
  await expect(page.locator("article")).toHaveCount(3);
  const stats = (await (await request.get(API + "/__stats")).json()).requests;
  expect(stats["/products/category/men's%20clothing"]).toBe(1);
  expect(stats["/products/category/women's%20clothing"]).toBe(1);
  const badge = page.locator("article").first().locator("[data-category]");
  await expect(badge).toHaveAttribute("data-category", "apparel");
  const details = page.getByRole("link", { name: "View details for Everyday Sneakers" });
  await details.click();
  await expect(page).toHaveURL(/\/en\/products\//);
  await expect(page.getByRole("heading", { name: "Everyday Sneakers" })).toBeVisible();
});
