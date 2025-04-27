import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { InventoryPage } from '../pages/inventory.page';
import { getValidUsers } from '../utils/user-helpers';

const validUsers = getValidUsers();

for (const user of validUsers) {
  test.describe(`Inventory Sorting for ${user.type} User`, () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;

    test.beforeEach(async ({ page }) => {
      loginPage = new LoginPage(page);
      inventoryPage = new InventoryPage(page);

      // Login with current user type
      await loginPage.navigate();
      await loginPage.login(user.username, user.password);
      await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
      
      // Wait for inventory to load
      await page.waitForSelector('[data-test="inventory-container"]');
    });

    test('Verify all sorting options work correctly', async ({ page }) => {
      // Get initial product order for reference
      const initialNames = await inventoryPage.productNames().allTextContents();
      const initialPrices = await inventoryPage.productPrices().allTextContents();

      // Locator for the sort dropdown
      const sortDropdown = page.locator('[data-test="product-sort-container"]');
      
      // --- Test A-Z Sorting ---
      await test.step('Test A-Z sorting', async () => {
        await sortDropdown.selectOption('az');
        await page.waitForTimeout(500); // Small delay for UI update
        
        const names = await inventoryPage.productNames().allTextContents();
        const sortedNames = [...initialNames].sort((a, b) => a.localeCompare(b));
        expect(names).toEqual(sortedNames);
        
        // Verify active option display
        await expect(page.locator('[data-test="active-option"]')).toHaveText('Name (A to Z)');
      });

      // --- Test Z-A Sorting ---
      await test.step('Test Z-A sorting', async () => {
        await sortDropdown.selectOption('za');
        await page.waitForTimeout(500);
        
        const names = await inventoryPage.productNames().allTextContents();
        const sortedNames = [...initialNames].sort((a, b) => b.localeCompare(a));
        expect(names).toEqual(sortedNames);
        await expect(page.locator('[data-test="active-option"]')).toHaveText('Name (Z to A)');
      });

      // --- Test Price Low-High Sorting ---
      await test.step('Test Price Low-High sorting', async () => {
        await sortDropdown.selectOption('lohi');
        await page.waitForTimeout(500);
        
        const prices = await inventoryPage.productPrices().allTextContents();
        const sortedPrices = [...initialPrices].sort((a, b) => {
          const priceA = parseFloat(a.replace('$', ''));
          const priceB = parseFloat(b.replace('$', ''));
          return priceA - priceB;
        });
        expect(prices).toEqual(sortedPrices);
        await expect(page.locator('[data-test="active-option"]')).toHaveText('Price (low to high)');
      });

      // --- Test Price High-Low Sorting ---
      await test.step('Test Price High-Low sorting', async () => {
        await sortDropdown.selectOption('hilo');
        await page.waitForTimeout(500);
        
        const prices = await inventoryPage.productPrices().allTextContents();
        const sortedPrices = [...initialPrices].sort((a, b) => {
          const priceA = parseFloat(a.replace('$', ''));
          const priceB = parseFloat(b.replace('$', ''));
          return priceB - priceA;
        });
        expect(prices).toEqual(sortedPrices);
        await expect(page.locator('[data-test="active-option"]')).toHaveText('Price (high to low)');
      });
    });
  });
}