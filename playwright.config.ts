
import { defineConfig, devices } from "@playwright/test";
import { loadEnvConfig } from "@next/env";

// Load credentials from .env.local.
loadEnvConfig(process.cwd());

export default defineConfig({
  testDir: "./tests",

  use: {
    baseURL: "http://127.0.0.1:3000",
    ...devices["Desktop Chrome"],
  },

  webServer: {
    command: "npm run start -- --hostname 127.0.0.1",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },

  reporter: [["list"], ["html", { open: "never" }]],
});
