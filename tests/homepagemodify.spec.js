import { test, expect } from '@playwright/test';

test.describe.serial('Mansa Jewellery Navigation Tests', () => {
  let sharedPage;

  test.beforeAll(async ({ browser }) => {
    // Create a persistent page for all tests
    const context = await browser.newContext();
    sharedPage = await context.newPage();
    
    // Perform login once
    console.log('Performing login...');
    await sharedPage.goto('https://mansajewellery.com');
    await sharedPage.waitForTimeout(2000);
    await sharedPage.locator('input').fill('RedefiningElegance');
    await sharedPage.locator('input').press('Enter');
    await sharedPage.waitForSelector('text=Welcome!', { timeout: 10000 });
    await sharedPage.click('text=Welcome!');
    await sharedPage.waitForLoadState('networkidle');
    await sharedPage.waitForTimeout(3000);
    console.log('Login completed successfully');
  });

  // Helper function to click hamburger menu
  async function clickHamburgerMenu(page) {
    console.log('Clicking hamburger menu...');
    const clicked = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
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
      await page.click('button >> nth=0');
    }
    await page.waitForTimeout(2000);
  }

  test('TC01_Verify homepage loads successfully', async () => {
    await expect(sharedPage).toHaveURL('https://mansajewellery.com');
    console.log('Homepage verification completed');
  });

  test('TC02_Navigate to About page and scroll', async () => {
    // Click hamburger menu
    await clickHamburgerMenu(sharedPage);
    
    // Navigate to About page
    console.log('Clicking About...');
    await sharedPage.click('text=About');
    await sharedPage.waitForLoadState('networkidle');
    await sharedPage.waitForTimeout(2000);
    
    // Scroll to bottom
    console.log('Scrolling to bottom...');
    await sharedPage.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
    await sharedPage.waitForTimeout(3000);
    
    // Scroll back to top
    console.log('Scrolling back to top...');
    await sharedPage.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await sharedPage.waitForTimeout(3000);
    
    console.log('About page navigation and scroll completed');
  });

  test('TC03_Navigate back to menu and go to Shop', async () => {
    // Click hamburger menu to go back
    console.log('Navigating back to menu...');
    await clickHamburgerMenu(sharedPage);
    await sharedPage.waitForTimeout(1000);
    
    // Navigate to Shop
    console.log('Clicking Shop...');
    await sharedPage.click('text=Shop');
    await sharedPage.waitForLoadState('networkidle');
    await sharedPage.waitForTimeout(2000);
    
    // Click Categories
    console.log('Clicking Categories...');
    await sharedPage.click('text=Categories');
    await sharedPage.waitForTimeout(2000);
    
    // Click All
    console.log('Clicking All...');
    await sharedPage.click('text=All');
    await sharedPage.waitForLoadState('networkidle');
    await sharedPage.waitForTimeout(2000);
    
    // Scroll through the page
    console.log('Scrolling through products...');
    for (let i = 0; i < 5; i++) {
      await sharedPage.evaluate(() => window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' }));
      await sharedPage.waitForTimeout(2000);
    }
    
    console.log('Shop navigation and scroll completed');
  });

  test.afterAll(async () => {
    if (sharedPage) {
      await sharedPage.close();
      console.log('Test suite completed and page closed');
    }
  });
});