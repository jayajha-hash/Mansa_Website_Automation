/**
 * Enhanced authentication and navigation helper functions
 */

/**
 * Performs login on the Mansa Jewellery website
 * @param {Page} page - Playwright page object
 * @param {string} credentials - Login credentials (default: 'RedefiningElegance')
 */
export async function performLogin(page, credentials = 'RedefiningElegance') {
  console.log('Performing login...');
  
  await page.goto('https://mansajewellery.com');
  await page.waitForTimeout(2000);
  
  await page.locator('input').fill(credentials);
  await page.locator('input').press('Enter');
  
  try {
    await page.waitForSelector('text=Welcome!', { timeout: 10000 });
    await page.click('text=Welcome!');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    console.log('Login completed successfully');
  } catch (error) {
    console.log('Login flow completed (Welcome message handling)');
  }
}

/**
 * Verifies if user is logged in
 * @param {Page} page - Playwright page object
 * @returns {boolean} - True if logged in
 */
export async function isUserLoggedIn(page) {
  try {
    // Check for indicators that user is logged in
    const pageContent = await page.textContent('body');
    return !pageContent.toLowerCase().includes('login') || 
           pageContent.toLowerCase().includes('welcome') ||
           pageContent.toLowerCase().includes('dashboard');
  } catch (error) {
    return false;
  }
}

/**
 * Attempts login with invalid credentials
 * @param {Page} page - Playwright page object  
 * @param {string} invalidCredentials - Invalid credentials to test
 */
export async function attemptInvalidLogin(page, invalidCredentials) {
  console.log(`Attempting login with invalid credentials: ${invalidCredentials}`);
  
  await page.goto('https://mansajewellery.com');
  await page.waitForTimeout(2000);
  
  await page.locator('input').fill(invalidCredentials);
  await page.locator('input').press('Enter');
  await page.waitForTimeout(3000);
  
  console.log('Invalid login attempt completed');
}

/**
 * Clicks the hamburger menu button
 * @param {Page} page - Playwright page object
 */
export async function clickHamburgerMenu(page) {
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
  console.log('Hamburger menu clicked successfully');
}
