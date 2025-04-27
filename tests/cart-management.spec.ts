import { test, expect } from '@playwright/test';
import { LoginPage } from "../pages/login.page";
import { InventoryPage } from "../pages/inventory.page";
import { CartPage } from "../pages/cart.page"; 
import { getValidUsers } from '../utils/user-helpers';

const validUsers = getValidUsers();

for (const user of validUsers) {
  test(`Shopping Cart Validation for '${user.type}' user @${user.type}`, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    // Login
    await loginPage.navigate();
    await loginPage.login(user.username, user.password);
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

    // Test parameters - use first 3 products
    const testProducts = inventoryPage.itemDetails.slice(0, 3);
    const cartBadge = page.locator('.shopping_cart_badge');

    // --- Phase 1: Add items to cart ---
    for (const [index, product] of testProducts.entries()) {
      const expectedCount = index + 1;
      
      // Add product using data-test attribute for reliability
      await page.locator(product.addToCartSelector).click();
      
      // Verify cart badge updates
      await expect(cartBadge).toHaveText(expectedCount.toString());
      console.log(`Added ${product.name}. Cart shows ${expectedCount} items`);
      
      // Verify button state changed to "Remove"
      await expect(page.locator(product.removeFromCartSelector)).toBeVisible();
    }

    // --- Phase 2: Remove items from cart ---
    for (const [index, product] of testProducts.entries()) {
      const expectedCount = testProducts.length - index - 1;
      
      // Remove product
      await page.locator(product.removeFromCartSelector).click();
      
      // Verify cart badge updates
      if (expectedCount > 0) {
        await expect(cartBadge).toHaveText(expectedCount.toString());
      } else {
        await expect(cartBadge).not.toBeVisible();
      }
      console.log(`Removed ${product.name}. Cart shows ${expectedCount} items`);
      
      // Verify button state changed back to "Add to cart"
      await expect(page.locator(product.addToCartSelector)).toBeVisible();
    }

    // --- Phase 3: Final cart validation ---
    // Add all test products again
    for (const product of testProducts) {
      await page.locator(product.addToCartSelector).click();
    }

    // Open cart and verify contents
    await cartPage.navigate();
    
    // Get all cart items
    const cartItems = await cartPage.getCartContents();
    
    // Verify item count matches
    expect(cartItems.length).toBe(testProducts.length);
    
    // Verify each product is present in cart with exact matching
    for (const product of testProducts) {
      // More specific locator using data-test attributes
      await expect(cartPage.page.locator(`[data-test="inventory-item-name"]:text-is("${product.name}")`))
        .toBeVisible();
      await expect(cartPage.page.locator(`[data-test="inventory-item-price"]:text-is("${product.price}")`))
        .toBeVisible();
    }
    
    console.log(`\nFinal Verification: Cart contains ${cartItems.length} items:`);
    console.log(cartItems.map(item => `- ${item.name} (${item.price})`).join('\n'));
  });
}