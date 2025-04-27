import { test, expect } from '@playwright/test';
import { LoginPage } from "../pages/login.page";
import { InventoryPage } from "../pages/inventory.page";
import { getValidUsers } from '../utils/user-helpers';

const validUsers = getValidUsers();

for (const user of validUsers) {
  test(`Product verification for '${user.type}' user @${user.type}`, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    // Login
    await loginPage.navigate();
    await loginPage.login(user.username, user.password);
    await expect(page).toHaveURL(/inventory.html/);

    // Verify all products match expected data
    for (const [i, expectedItem] of inventoryPage.itemDetails.entries()) {
      const itemContainer = page.locator('.inventory_item').nth(i);
      const actualItem = {
        name: await itemContainer.locator('.inventory_item_name').textContent(),
        description: await itemContainer.locator('.inventory_item_desc').textContent(),
        price: await itemContainer.locator('.inventory_item_price').textContent(),
        imageSrc: await itemContainer.locator('img.inventory_item_img').getAttribute('src')
      };

      console.log(`\n Verifying product ${i + 1}: ${expectedItem.name}`);
      
      expect(actualItem.name).toBe(expectedItem.name);
      expect(actualItem.description).toBe(expectedItem.description);
      expect(actualItem.price).toBe(expectedItem.price);
      expect(actualItem.imageSrc).toContain(expectedItem.expectedImageSrc);
    }
  });
}