import { test, expect } from '@playwright/test';

test('Hamburger → About → Stable Slow Scroll', async ({ page }) => {

  test.setTimeout(120000);

  // Full screen start
  await page.setViewportSize({ width: 1400, height: 900 });

  // 1. Login
  await page.goto('https://mansa-lock.vercel.app/');
  await page.waitForLoadState('domcontentloaded');

  const passwordInput = page.locator('input');
  await expect(passwordInput).toBeVisible();
  await passwordInput.fill('RedefiningElegance');

  await Promise.all([
    page.waitForNavigation({ waitUntil: 'load' }),
    passwordInput.press('Enter')
  ]);

  await expect(page).toHaveURL(/mansajewellery/, { timeout: 20000 });

  // 2. Open Hamburger
  const hamburger = page.locator('button[aria-label*="menu"], button:has(svg)');
  await expect(hamburger.first()).toBeVisible();
  await hamburger.first().click();

  await page.waitForTimeout(1500);

  // 3. Click About
  const aboutBlock = page.locator('text=About').first();
  await expect(aboutBlock).toBeVisible({ timeout: 10000 });

  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle' }),
    aboutBlock.click()
  ]);

  await expect(page).toHaveURL(/about-us/);

  // 4. Close overlay if visible
  const closeButton = page.locator('text=X').first();
  if (await closeButton.isVisible().catch(() => false)) {
    await closeButton.click();
    await page.waitForTimeout(1000);
  }

  // 5. Wait for full page + dynamic height stabilization
  await page.waitForFunction(() => document.readyState === 'complete');
  await page.waitForTimeout(4000); // allow spline + images to load

  // 6. Stable Slow Scroll Down
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      const distance = 20;
      const delay = 300;

      const timer = setInterval(() => {
        const scrollTop = window.scrollY;
        const viewportHeight = window.innerHeight;
        const fullHeight = document.documentElement.scrollHeight;

        window.scrollBy(0, distance);

        if (scrollTop + viewportHeight >= fullHeight - 2) {
          clearInterval(timer);
          resolve();
        }
      }, delay);
    });
  });

  await page.waitForTimeout(2000);

  // 7. Stable Scroll Back Up
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      const distance = 40;
      const delay = 250;

      const timer = setInterval(() => {
        const scrollTop = window.scrollY;

        window.scrollBy(0, -distance);

        if (scrollTop <= 0) {
          clearInterval(timer);
          resolve();
        }
      }, delay);
    });
  });

  await page.waitForTimeout(2000);

});








