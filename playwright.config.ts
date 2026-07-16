import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: /mobile-nav\.spec\.ts/,
    },
    {
      name: 'mobile-chromium',
      use: { ...devices['Pixel 7'] },
      testMatch: /mobile-nav\.spec\.ts/,
    },
  ],
  webServer: {
    // `astro preview` is unavailable with the @astrojs/netlify adapter, so serve
    // the static `dist/` output with a tiny Node server instead (see scripts/preview-static.mjs).
    command: 'pnpm run build && pnpm run preview:static',
    url: 'http://localhost:4321/',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
