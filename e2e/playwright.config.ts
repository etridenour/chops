import { defineConfig, devices } from "@playwright/test";

const API_PORT = 4001;
const WEB_PORT = 3001;

export const API_URL = `http://localhost:${API_PORT}`;
export const WEB_URL = `http://localhost:${WEB_PORT}`;
export const MAILPIT_URL = "http://localhost:8025";
export const E2E_DATABASE_URL =
  "postgresql://chops:chops@localhost:5433/chops_e2e?schema=public";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [["html", { open: "never" }], ["list"]],

  use: {
    baseURL: WEB_URL,
    trace: "on-first-retry",
  },

  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],

  webServer: [
    {
      command: "pnpm exec tsx src/index.ts",
      cwd: "../apps/api",
      url: `${API_URL}/health`,
      reuseExistingServer: false,
      timeout: 60_000,
      env: {
        DATABASE_URL: E2E_DATABASE_URL,
        API_PORT: String(API_PORT),
        WEB_URL,
        JWT_SECRET: "e2e-not-a-real-secret",
        SMTP_HOST: "localhost",
        SMTP_PORT: "1025",
        SMTP_SECURE: "false",
        SMTP_FROM: "chops@example.test",
      },
    },
    {
      command: `pnpm exec next dev --port ${WEB_PORT}`,
      cwd: "../apps/web",
      url: WEB_URL,
      reuseExistingServer: false,
      timeout: 120_000,
      env: {
        NEXT_PUBLIC_API_URL: API_URL,
      },
    },
  ],
});
