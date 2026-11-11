import { defineConfig, devices } from "@playwright/test";

const api = "http://127.0.0.1:4402";
const baseURL = "http://127.0.0.1:3102";

export default defineConfig({
  testDir: "./tests",
  workers: 1,
  use: {
    ...devices["Desktop Chrome"],
    baseURL,
    channel:
      process.env.PLAYWRIGHT_CHANNEL || (process.platform === "win32" ? "msedge" : undefined),
    viewport: { width: 1440, height: 900 },
    trace: "retain-on-failure",
  },
  webServer: [
    {
      command: "node tests/fixtures/api.mjs 4402",
      url: api + "/health",
      reuseExistingServer: false,
    },
    {
      command: "pnpm exec next dev --hostname 127.0.0.1 --port 3102",
      url: baseURL + "/en/cart",
      timeout: 120000,
      reuseExistingServer: false,
      env: { FAKE_STORE_API_URL: api, SITE_URL: baseURL, NOVA_NEXT_DIST_DIR: ".next-playwright" },
    },
  ],
});
