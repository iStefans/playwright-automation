import { test, expect } from '@playwright/test';
import { LoginPage } from "../pages/login.page";
import { getValidUsers } from '../utils/user-helpers';

test.describe('Visual regression after login for valid users', () => {
  const validUsers = getValidUsers();

  for (const user of validUsers) {
    test(`Visual snapshot for '${user.type}' user`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.navigate();
      await loginPage.login(user.username, user.password);

      // Confirm inventory page loaded
      await page.waitForURL('**/inventory.html', { timeout: 5000 });
      await page.waitForSelector('.inventory_list', { timeout: 5000 });

      // Compare the screenshot to the baseline 'inventory-page.png'
      expect(await page.screenshot()).toMatchSnapshot('inventory-page.png', {
        threshold: 0.1, // Adjust threshold if necessary
      });
    });
  }
});