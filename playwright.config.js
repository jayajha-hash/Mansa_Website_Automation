import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    headless: false,        // show browser
    viewport: null,         // allow full screen
    launchOptions: {
      args: ['--start-maximized'] // true fullscreen
    }
  }
});

