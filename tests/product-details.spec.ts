import { test, expect } from '@playwright/test';
import { InventoryPage } from '../pages/inventory.page';
import { LoginPage } from '../pages/login.page';
import { getValidUsers } from '../utils/user-helpers';

const validUsers = getValidUsers();

for (const user of validUsers) {
  test.describe(`Product Details for ${user.type} User`, () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;

    test.beforeEach(async ({ page }) => {
      loginPage = new LoginPage(page);
      inventoryPage = new InventoryPage(page);
      
      // Login with current user type
      await loginPage.navigate();
      await loginPage.login(user.username, user.password);
      await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    });

    test('Verify all product details match expected values', async ({ page }) => {
      // Test each product in the inventory
      for (const product of inventoryPage.itemDetails) {
        await test.step(`Verify details for ${product.name}`, async () => {
          // Open product details page
          await inventoryPage.openProductDetails(product.name);
          
          // Verify URL contains inventory-item
          await expect(page).toHaveURL(/inventory-item\.html/);
          
          // Verify product details match expected values
          await expect(page.locator('.inventory_details_name')).toHaveText(product.name);
          await expect(page.locator('.inventory_details_price')).toHaveText(product.price);
          await expect(page.locator('.inventory_details_desc')).toHaveText(product.description);
          
          // Verify product image contains expected src
          const image = page.locator('.inventory_details_img');
          await expect(image).toHaveAttribute('src', new RegExp(product.expectedImageSrc));
          
          // Verify add to cart button is visible
          await expect(page.locator('#add-to-cart')).toBeVisible();
          
          // Go back to inventory page
          await page.goBack();
          await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
        });
      }
    });

    test('Verify product details page navigation', async ({ page }) => {
      // Test navigation for each product
      for (const product of inventoryPage.itemDetails) {
        await test.step(`Test navigation for ${product.name}`, async () => {
          // Find product on inventory page
          const productElement = await inventoryPage.getProductByName(product.name);
          
          // Verify product is visible on inventory page
          await expect(productElement).toBeVisible();
          
          // Click on product name to open details
          await productElement.locator('.inventory_item_name').click();
          await expect(page).toHaveURL(/inventory-item\.html/);
          
          // Verify basic details
          await expect(page.locator('.inventory_details_name')).toHaveText(product.name);
          await expect(page.locator('.inventory_details_price')).toHaveText(product.price);
          
          // Go back to inventory
          await page.goBack();
        });
      }
    });
  });
}