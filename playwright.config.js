// playwright.config.js
require('dotenv').config();

const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/api',

  // Gagal di CI kalau ada test.only yang tertinggal
  forbidOnly: !!process.env.CI,

  // Instance demo publik cukup sering tidak stabil, jadi satu retry
  // membantu membedakan kegagalan nyata dari gangguan sesaat
  retries: process.env.CI ? 2 : 1,

  // Dibatasi supaya tidak membanjiri instance demo dengan request paralel
  workers: 1,

  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],

  use: {
    baseURL: process.env.BASE_URL ?? 'https://petstore.swagger.io/#/',

    // Bukti hanya diambil saat dibutuhkan, agar ukuran repo tetap wajar
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',

    actionTimeout: 30_000,
    navigationTimeout: 60_000,
  },

  timeout: 60 * 1000,
  expect: { timeout: 20 * 1000 },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});