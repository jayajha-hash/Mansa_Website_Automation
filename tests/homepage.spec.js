import { test, expect } from '@playwright/test';


test('TC01_View full homepage flow (slow demo view)', async ({ page }) => {


  /* -------------------- FORCE TRUE FULLSCREEN -------------------- */
  const session = await page.context().newCDPSession(page);
  const { windowId } = await session.send('Browser.getWindowForTarget');
  await session.send('Browser.setWindowBounds', {
    windowId,
    bounds: { windowState: 'maximized' },
  });


  /* -------------------- STEP 1: Open website -------------------- */
  await page.goto('https://mansajewellery.com/', {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });


  /* -------------------- STEP 2: Shopify password -------------------- */
  const passwordInput = page.getByRole('textbox');
  if (await passwordInput.isVisible()) {
    await passwordInput.fill('RedefiningElegance');
    await page.getByRole('button', { name: /submit password/i }).click();
  }


  /* -------------------- STEP 3: Let homepage breathe -------------------- */
  await page.waitForLoadState('networkidle', { timeout: 60000 });
  await page.waitForTimeout(2000); // viewer can read opening content


  /* -------------------- STEP 4: First slow scroll (Crafted / Intro section) -------------------- */
  for (let i = 0; i < 3; i++) {
    await page.mouse.wheel(0, 350);
    await page.waitForTimeout(1200);
  }


  /* -------------------- STEP 5: Lock banner into perfect view -------------------- */
  const bannerImage = page.locator('section img').first();
  await bannerImage.waitFor({ state: 'visible', timeout: 30000 });


  await bannerImage.scrollIntoViewIfNeeded();
  await page.waitForTimeout(2000); // pause to view banner clearly


  /* -------------------- STEP 6: Gentle banner interaction -------------------- */
  const slide2 = page.getByRole('button', { name: /go to slide 2/i });
  if (await slide2.isVisible()) {
    await slide2.click();
    await page.waitForTimeout(2000);
  }


  const slide3 = page.getByRole('button', { name: /go to slide 3/i });
  if (await slide3.isVisible()) {
    await slide3.click();
    await page.waitForTimeout(2000);
  }


  /* -------------------- STEP 7: Slow scroll through rest of homepage -------------------- */
  for (let i = 0; i < 6; i++) {
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(1500);
  }


  /* -------------------- STEP 8: Final pause (end of page) -------------------- */
  await page.waitForTimeout(2000);
  await expect(page.locator('body')).toBeVisible();
});








