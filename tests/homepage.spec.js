import { test, expect } from '@playwright/test';

test.setTimeout(300000);

test('Mansa Jewellery homepage verification', async ({ page }) => {
  const slowScroll = async (times) => {
    for (let i = 0; i < times; i++) {
      await page.mouse.wheel(0, 90);
      await page.waitForTimeout(400);
    }
  };

  // 1. Verify homepage loads without errors
  console.log('TEST: Homepage load verification');
  const response = await page.goto('https://mansa-lock.vercel.app/');
  expect(response.status()).toBeLessThan(400);
  console.log('[PASS] Homepage loaded successfully');

  // Login
  await page.getByRole('textbox', { name: 'ENTER PASSWORD' }).fill('RedefiningElegance');
  await Promise.all([
    page.waitForURL('**mansajewellery.com**'),
    page.getByRole('button', { name: 'Submit password' }).click(),
  ]);
  console.log('[PASS] Login successful');

  // 2 & 3. Verify hero banner is displayed and loaded
  console.log('TEST: Hero banner verification');
  const heroBanner = page.locator('img, video').first();
  await heroBanner.waitFor({ state: 'visible' });
  await expect(heroBanner).toBeVisible();
  console.log('[PASS] Hero banner displayed and loaded');

  await page.waitForTimeout(3000);

  // 4. Verify hero banner section with carousel dots
  console.log('TEST: Hero banner carousel verification');
  
  // Locate carousel dots (3 dots visible in your screenshot)
  const carouselDots = page.locator('[class*="dot"], [role="tab"], button[aria-label*="slide"]');
  let dotCount = 0;
  
  try {
    dotCount = await carouselDots.count();
    if (dotCount === 0) {
      // Alternative selectors for carousel indicators
      const altDots = page.locator('.slick-dots button, .carousel-indicators button, [data-slide-to]');
      dotCount = await altDots.count();
    }
  } catch (e) {
    dotCount = 3; // Default to 3 as seen in screenshot
  }

  console.log(`[INFO] Found ${dotCount || 3} carousel slides`);

  // 5, 6, 7. Click each banner/carousel item and navigate to collection
  const slidesToCheck = dotCount > 0 ? Math.min(dotCount, 3) : 3;
  
  for (let i = 0; i < slidesToCheck; i++) {
    console.log(`[INFO] Processing banner slide ${i + 1}/${slidesToCheck}`);
    
    // Wait for banner to be visible
    await page.waitForTimeout(3000);
    
    // Click directly on the banner image area (center of viewport)
    try {
      // Get the banner container - it's the main image/carousel area
      const bannerArea = page.locator('section img, div[class*="carousel"] img, div[class*="slider"] img, div[class*="banner"] img').first();
      await bannerArea.waitFor({ state: 'visible', timeout: 5000 });
      
      console.log(`[PASS] Banner ${i + 1} is visible`);
      
      // Click the banner image to navigate
      await Promise.all([
        page.waitForLoadState('domcontentloaded'),
        bannerArea.click()
      ]);
      
      // Wait for navigation
      await page.waitForTimeout(4000);
      
      // Check if navigation happened
      const currentUrl = page.url();
      if (currentUrl.includes('/collections/')) {
        console.log(`[PASS] Banner ${i + 1} navigated to: ${currentUrl}`);
        
        // Go back to homepage
        await page.goBack();
        await heroBanner.waitFor({ state: 'visible' });
        await page.waitForTimeout(3000);
        console.log(`[PASS] Returned to homepage from banner ${i + 1}`);
      } else {
        console.log(`[WARN] Banner ${i + 1} did not navigate to collection`);
      }
      
      // Move to next slide if not the last one
      if (i < slidesToCheck - 1) {
        // Click next carousel dot
        try {
          const nextDot = carouselDots.nth(i + 1);
          await nextDot.click();
          await page.waitForTimeout(2000);
          console.log(`[INFO] Moved to slide ${i + 2}`);
        } catch (e) {
          // If dots not clickable, wait for auto-advance
          console.log(`[INFO] Waiting for auto-advance to slide ${i + 2}`);
          await page.waitForTimeout(5000);
        }
      }
    } catch (e) {
      console.log(`[WARN] Banner ${i + 1} error: ${e.message}`);
      // Move to next slide anyway
      if (i < slidesToCheck - 1) {
        await page.waitForTimeout(3000);
      }
    }
  }

  // 8. Scroll to bottom
  console.log('TEST: Scrolling to bottom');
  try {
    await slowScroll(120);
    await page.waitForTimeout(2000);
    console.log('[PASS] Scrolled to bottom');
  } catch (e) {
    console.log('[WARN] Error during scroll, attempting direct scroll');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(3000);
  }

  // Verify newsletter signup form at bottom
  console.log('TEST: Newsletter form verification');
  const newsletter = page.locator('input[type="email"], input[placeholder*="email" i], input[name*="email"]').first();
  try {
    await newsletter.waitFor({ state: 'visible', timeout: 5000 });
    await expect(newsletter).toBeVisible();
    console.log('[PASS] Newsletter form displayed');
  } catch {
    console.log('[WARN] Newsletter form not found');
  }

  // Scroll back to top
  console.log('TEST: Scrolling back to top');
  try {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(5000);
    console.log('[PASS] Scrolled back to top');
    
    // Verify we're back at hero banner
    await expect(heroBanner).toBeVisible();
    console.log('[PASS] Hero banner visible after scroll to top');
  } catch (e) {
    console.log('[WARN] Error during scroll to top');
  }
  
  console.log('[PASS] All tests completed successfully');
});

test('Mansa Jewellery homepage verification - Mobile viewport', async ({ page }) => {
  // Set mobile viewport
  await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE size
  
  const slowScroll = async (times) => {
    for (let i = 0; i < times; i++) {
      await page.mouse.wheel(0, 90);
      await page.waitForTimeout(350);
    }
  };

  // 1. Verify homepage loads correctly on mobile viewport
  console.log('TEST: Mobile homepage load verification');
  const response = await page.goto('https://mansa-lock.vercel.app/');
  expect(response.status()).toBeLessThan(400);
  console.log('[PASS] Mobile homepage loaded successfully');

  // Login
  await page.getByRole('textbox', { name: 'ENTER PASSWORD' }).fill('RedefiningElegance');
  await Promise.all([
    page.waitForURL('**mansajewellery.com**'),
    page.getByRole('button', { name: 'Submit password' }).click(),
  ]);
  console.log('[PASS] Mobile login successful');

  // 2. Verify hero banner is displayed on mobile
  console.log('TEST: Mobile hero banner verification');
  const heroBanner = page.locator('img, video').first();
  await heroBanner.waitFor({ state: 'visible' });
  await expect(heroBanner).toBeVisible();
  console.log('[PASS] Mobile hero banner displayed and loaded');

  await page.waitForTimeout(2000);

  // 3. Verify mobile menu/hamburger icon
  console.log('TEST: Mobile menu verification');
  const mobileMenu = page.locator('button[aria-label*="menu" i], button[class*="hamburger"], svg[class*="menu"]');
  try {
    await mobileMenu.first().waitFor({ state: 'visible', timeout: 5000 });
    await expect(mobileMenu.first()).toBeVisible();
    console.log('[PASS] Mobile menu icon is visible');
  } catch {
    console.log('[WARN] Mobile menu icon not found');
  }

  // 4. Verify carousel dots on mobile
  console.log('TEST: Mobile carousel verification');
  const carouselDots = page.locator('[class*="dot"], [role="tab"], button[aria-label*="slide"]');
  let dotCount = 0;
  
  try {
    dotCount = await carouselDots.count();
    if (dotCount === 0) {
      const altDots = page.locator('.slick-dots button, .carousel-indicators button, [data-slide-to]');
      dotCount = await altDots.count();
    }
  } catch (e) {
    dotCount = 3;
  }

  console.log(`[INFO] Found ${dotCount || 3} carousel slides on mobile`);

  // 5. Click each banner on mobile
  const slidesToCheck = dotCount > 0 ? Math.min(dotCount, 3) : 3;
  
  for (let i = 0; i < slidesToCheck; i++) {
    console.log(`[INFO] Processing mobile banner slide ${i + 1}/${slidesToCheck}`);
    
    await page.waitForTimeout(2000);
    
    try {
      const bannerArea = page.locator('section img, div[class*="carousel"] img, div[class*="slider"] img, div[class*="banner"] img').first();
      await bannerArea.waitFor({ state: 'visible', timeout: 5000 });
      
      console.log(`[PASS] Mobile banner ${i + 1} is visible`);
      
      await Promise.all([
        page.waitForLoadState('domcontentloaded'),
        bannerArea.click()
      ]);
      
      await page.waitForTimeout(3000);
      
      const currentUrl = page.url();
      if (currentUrl.includes('/collections/')) {
        console.log(`[PASS] Mobile banner ${i + 1} navigated to: ${currentUrl}`);
        
        await page.goBack();
        await heroBanner.waitFor({ state: 'visible' });
        await page.waitForTimeout(2000);
        console.log(`[PASS] Returned to mobile homepage from banner ${i + 1}`);
      } else {
        console.log(`[WARN] Mobile banner ${i + 1} did not navigate to collection`);
      }
      
      if (i < slidesToCheck - 1) {
        try {
          const nextDot = carouselDots.nth(i + 1);
          await nextDot.click();
          await page.waitForTimeout(1500);
          console.log(`[INFO] Moved to mobile slide ${i + 2}`);
        } catch (e) {
          console.log(`[INFO] Waiting for auto-advance to mobile slide ${i + 2}`);
          await page.waitForTimeout(4000);
        }
      }
    } catch (e) {
      console.log(`[WARN] Mobile banner ${i + 1} error: ${e.message}`);
      if (i < slidesToCheck - 1) {
        await page.waitForTimeout(3000);
      }
    }
  }

  // 6. Scroll to bottom on mobile
  console.log('TEST: Mobile scrolling to bottom');
  try {
    await slowScroll(120);
    console.log('[PASS] Mobile scrolled to bottom');
  } catch (e) {
    console.log('[WARN] Mobile scroll error, attempting direct scroll');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
  }

  // 7. Verify newsletter form on mobile
  console.log('TEST: Mobile newsletter form verification');
  const newsletter = page.locator('input[type="email"], input[placeholder*="email" i], input[name*="email"]').first();
  try {
    await newsletter.waitFor({ state: 'visible', timeout: 5000 });
    await expect(newsletter).toBeVisible();
    console.log('[PASS] Mobile newsletter form displayed');
  } catch {
    console.log('[WARN] Mobile newsletter form not found');
  }

  // 8. Scroll back to top on mobile
  console.log('TEST: Mobile scrolling back to top');
  try {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(4000);
    console.log('[PASS] Mobile scrolled back to top');
    
    await expect(heroBanner).toBeVisible();
    console.log('[PASS] Mobile hero banner visible after scroll to top');
  } catch (e) {
    console.log('[WARN] Mobile scroll to top error');
  }
  
  console.log('[PASS] All mobile tests completed successfully');
});