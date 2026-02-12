const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',

  use: {
    headless: false,

    // Allow real fullscreen (no fixed viewport)
    viewport: null,

    launchOptions: {
      args: ['--start-maximized'],
      slowMo: 1000,
    },

    actionTimeout: 15000,
    navigationTimeout: 60000,
  },

  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
      },
    },
  ],
});


