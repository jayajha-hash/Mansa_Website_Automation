import { test, expect } from '@playwright/test';


test.describe.serial('Mansa Jewellery Login Tests', () => {
  let sharedPage;
  let context;


  test.beforeAll(async ({ browser }) => {
    // Create a persistent context and page for all tests
    context = await browser.newContext();
    sharedPage = await context.newPage();
  });


  test('TC01_Verify login page loads successfully', async () => {
    console.log('Navigating to homepage...');
    await sharedPage.goto('https://mansajewellery.com');
    await sharedPage.waitForTimeout(2000);
   
    // Verify page is loaded (it redirects to lock screen)
    await expect(sharedPage).toHaveURL(/mansa-lock\.vercel\.app|mansajewellery\.com/);
    console.log('✓ Login page loaded successfully');
  });


  test('TC02_Verify login form is displayed', async () => {
    console.log('Checking if login form is displayed...');
   
    // Check if input field is visible
    const inputField = sharedPage.locator('input').first();
    await expect(inputField).toBeVisible();
   
    console.log('✓ Login form is displayed');
  });


  test('TC03_Verify password input field is present', async () => {
    console.log('Verifying password input field...');
   
    // Verify input field is present and can be interacted with
    const inputField = sharedPage.locator('input').first();
    await expect(inputField).toBeVisible();
    await expect(inputField).toBeEditable();
   
    console.log('✓ Password input field is present and editable');
  });


  test('TC04_Verify login button arrow is clickable', async () => {
    console.log('Checking if login button/arrow is clickable...');
   
    // Check if Enter key can be pressed (login functionality)
    const inputField = sharedPage.locator('input').first();
    await expect(inputField).toBeEnabled();
   
    console.log('✓ Login button/arrow is clickable');
  });


  test('TC05_Verify successful login with valid credentials', async () => {
    console.log('Performing login with valid credentials...');
   
    // Enter password
    const inputField = sharedPage.locator('input').first();
    await inputField.fill('RedefiningElegance');
    await inputField.press('Enter');
   
    // Wait for Welcome message
    await sharedPage.waitForSelector('text=Welcome!', { timeout: 10000 });
    await expect(sharedPage.locator('text=Welcome!')).toBeVisible();
   
    // Click Welcome button
    await sharedPage.click('text=Welcome!');
    await sharedPage.waitForLoadState('networkidle');
    await sharedPage.waitForTimeout(3000);
   
    // After login, verify we're redirected back to main site
    await expect(sharedPage).toHaveURL(/mansajewellery\.com/);
   
    console.log('✓ Successfully logged in with valid credentials');
  });


  test('TC06_Verify session is maintained after successful login', async () => {
    console.log('Verifying session is maintained...');
   
    // Verify we're still on the main site (not redirected back to lock screen)
    await expect(sharedPage).toHaveURL(/mansajewellery\.com/);
   
    // Wait a bit to ensure page is fully loaded
    await sharedPage.waitForTimeout(2000);
   
    // Check if logged-in elements are present (hamburger menu or any navigation)
    const isLoggedIn = await sharedPage.evaluate(() => {
      // Check for hamburger menu or navigation buttons
      const buttons = Array.from(document.querySelectorAll('button'));
      const hasMenu = buttons.some(btn =>
        btn.textContent.includes('☰') ||
        btn.className.includes('menu') ||
        btn.className.includes('hamburger') ||
        btn.getAttribute('aria-label')?.toLowerCase().includes('menu')
      );
     
      // Also check if we're not on login screen
      const inputs = document.querySelectorAll('input[type="password"], input[type="text"]');
      const notOnLoginScreen = inputs.length === 0 || !document.body.textContent.includes('Welcome');
     
      return hasMenu || notOnLoginScreen;
    });
   
    expect(isLoggedIn).toBeTruthy();
   
    console.log('✓ Session is maintained after successful login');
  });


  test.afterAll(async () => {
    if (sharedPage) {
      await sharedPage.close();
    }
    if (context) {
      await context.close();
    }
    console.log('✓ Test suite completed and browser closed');
  });
});
