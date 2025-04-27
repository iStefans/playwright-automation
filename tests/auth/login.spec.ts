import { test, expect } from '@playwright/test';
import users from '../../test-data/credentials.json';

// Successful logins (should redirect to inventory page)
users.users.forEach(user => {
  test(`Successful login as ${user.type}`, async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('#user-name', user.username);
    await page.fill('#password', user.password);
    await page.click('#login-button');

    // Assert URL redirection
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    
    // Optional: Verify inventory container is visible
    await expect(page.locator('.inventory_container')).toBeVisible();
  });
});

// Failed logins (error messages)
users.invalidUsers.forEach(user => {
  test(`Failed login for ${user.type}`, async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('#user-name', user.username);
    await page.fill('#password', user.password);
    await page.click('#login-button');

    // Assert error message and URL stays the same
    await expect(page.locator('[data-test="error"]')).toContainText(user.expectedError);
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });
});

// Edge case: Empty credentials
test('Login with empty fields', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.click('#login-button');
  
  await expect(page.locator('[data-test="error"]'))
    .toContainText('Epic sadface: Username is required');
  await expect(page).toHaveURL('https://www.saucedemo.com/');
});