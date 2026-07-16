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
    // The @astrojs/netlify adapter does not support `astro preview`, so serve
    // the static `dist/` output with `serve` instead. `serve` also streams
    // dist/404.html for unknown routes (matching the deployed 404 behavior).
    command: 'pnpm run build && pnpm run preview:e2e',
    url: 'http://localhost:4321/',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
