import { test, expect } from '@playwright/test';
import { LoginPage } from "../pages/login.page";
import { InventoryPage } from "../pages/inventory.page";
import { getValidUsers } from '../utils/user-helpers';
import { getCustomerInfo } from '../utils/user-helpers';

const customerInfo = getCustomerInfo();
const validUsers = getValidUsers();

for (const user of validUsers) {
  test(`Complete purchase flow with item verification and cart logic for '${user.type}' user @${user.type}`, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    // Login
    await loginPage.navigate();
    await loginPage.login(user.username, user.password);

    // Verify inventory page loaded
    await expect(page).toHaveURL(/inventory.html/);
    console.log(`\nStarting verification for '${user.type}' user`);

    // Add all items to cart with validation
    let expectedCartCount = 0;

    for (const [i, item] of inventoryPage.itemDetails.entries()) {
      const itemContainer = page.locator('.inventory_item').nth(i);
      const currentItemName = await itemContainer.locator('.inventory_item_name').textContent();
      
      console.log(`\nVerifying item ${i + 1}: ${item.name}`);
      
      // Product details verification
      await expect(itemContainer.locator('.inventory_item_name')).toHaveText(item.name);
      await expect(itemContainer.locator('.inventory_item_desc')).toHaveText(item.description);
      await expect(itemContainer.locator('.inventory_item_price')).toHaveText(item.price);
      
      const image = itemContainer.locator('img.inventory_item_img');
      await expect(image).toHaveAttribute('src', new RegExp(item.expectedImageSrc));

      // Add to cart
      const addButton = page.locator(`xpath=${item.addToCartXPath}`);
      await addButton.click();
      
      // Verify button changed to Remove
      const removeButton = page.locator(`xpath=${item.removeFromCartXPath}`);
      await expect(removeButton).toBeVisible({ timeout: 5000 });
      
      // Verify cart count
      expectedCartCount++;
      const cartBadge = page.locator('.shopping_cart_badge');
      await expect(cartBadge).toHaveText(expectedCartCount.toString());
      console.log(`${item.name} added to cart. Cart count: ${expectedCartCount}`);
    }

    // Proceed to checkout
    await inventoryPage.openCart();
    await page.locator('[data-test="checkout"]').click();

    // Fill customer info
    await page.locator('[data-test="firstName"]').fill(customerInfo.firstName);
    await page.locator('[data-test="lastName"]').fill(customerInfo.lastName);
    await page.locator('[data-test="postalCode"]').fill(customerInfo.zipCode);
    await page.locator('[data-test="continue"]').click();

    // Verify order summary
    const subtotalText = await page.locator('[data-test="subtotal-label"]').textContent();
    const taxText = await page.locator('[data-test="tax-label"]').textContent();
    const totalText = await page.locator('[data-test="total-label"]').textContent();

    console.log(`\nOrder Summary for '${user.type}' user:`);
    console.log(`Subtotal: ${subtotalText}`);
    console.log(`Tax: ${taxText}`);
    console.log(`Total: ${totalText}`);

    await expect(page.locator('[data-test="subtotal-label"]')).toBeVisible();
    await expect(page.locator('[data-test="total-label"]')).toBeVisible();

    // Complete order
    await page.locator('[data-test="finish"]').click();
    await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
    console.log(`\nOrder completed successfully for '${user.type}' user!`);
  });
}