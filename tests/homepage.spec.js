import { test, expect } from '@playwright/test';


// Helper function for login
async function login(page) {
  await page.goto('/');
  await page.waitForTimeout(2000);
  await page.locator('input').fill('RedefiningElegance');
  await page.locator('input').press('Enter');
  await page.waitForSelector('text=Welcome!', { timeout: 10000 });
  await page.click('text=Welcome!');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
}


test('TC01_Verify homepage loads successfully', async ({ page }) => {
  await login(page);
  await expect(page).toHaveURL('https://mansajewellery.com');
});


test('TC02_Navigate to About page and scroll', async ({ page }) => {
  await login(page);
 
  // Try to find and click hamburger - with screenshot for debugging
  console.log('Looking for hamburger menu...');
  await page.screenshot({ path: 'debug-before-hamburger.png' });
 
  // Try different selectors
  const clicked = await page.evaluate(() => {
    // Find all buttons
    const buttons = Array.from(document.querySelectorAll('button'));
    console.log('Found buttons:', buttons.length);
   
    // Look for menu button (usually in top right)
    const menuButton = buttons.find(btn =>
      btn.textContent.includes('☰') ||
      btn.className.includes('menu') ||
      btn.className.includes('hamburger') ||
      btn.getAttribute('aria-label')?.includes('menu')
    );
   
    if (menuButton) {
      menuButton.click();
      return true;
    }
    return false;
  });
 
  if (!clicked) {
    // Fallback: click button in top right corner
    await page.click('button >> nth=0');
  }
 
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'debug-after-hamburger.png' });
 
  console.log('Clicking About...');
  await page.click('text=About');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
 
  // Scroll down
  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
  await page.waitForTimeout(3000);
 
  // Scroll up
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await page.waitForTimeout(3000);
});


test('TC03_Navigate to Shop, select All category and scroll', async ({ page }) => {
  await login(page);
 
  // Click hamburger
  const clicked = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const menuButton = buttons.find(btn =>
      btn.textContent.includes('☰') ||
      btn.className.includes('menu') ||
      btn.className.includes('hamburger')
    );
    if (menuButton) {
      menuButton.click();
      return true;
    }
    return false;
  });
 
  if (!clicked) await page.click('button >> nth=0');
 
  await page.waitForTimeout(2000);
 
  console.log('Clicking Shop...');
  await page.click('text=Shop');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
 
  console.log('Clicking Categories...');
  await page.click('text=Categories');
  await page.waitForTimeout(2000);
 
  console.log('Clicking All...');
  await page.click('text=All');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
 
  // Scroll
  for (let i = 0; i < 5; i++) {
    await page.evaluate(() => window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' }));
    await page.waitForTimeout(2000);
  }
});









