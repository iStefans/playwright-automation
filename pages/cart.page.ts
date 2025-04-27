import { Page, expect } from '@playwright/test';

// Define interface for cart items
interface CartItem {
  name: string;
  price: string;
}

export class CartPage {
  constructor(public page: Page) {}

  // Existing checkout elements
  checkoutButton = () => this.page.locator('[data-test="checkout"]');

  // New cart validation elements
  cartItems = () => this.page.locator('.cart_item');
  cartItemName = (index: number) => this.cartItems().nth(index).locator('.inventory_item_name');
  cartItemPrice = (index: number) => this.cartItems().nth(index).locator('.inventory_item_price');
  continueShoppingButton = () => this.page.locator('[data-test="continue-shopping"]');

  // Existing method
  async proceedToCheckout() {
    await this.checkoutButton().click();
  }

  // New methods for cart validation
  async navigate() {
    await this.page.locator('.shopping_cart_link').click();
    await expect(this.page).toHaveURL(/cart.html/);
  }

  async getCartItemCount(): Promise<number> {
    return await this.cartItems().count();
  }

  async getCartContents(): Promise<CartItem[]> {
    const items: CartItem[] = [];
    const count = await this.getCartItemCount();
    
    for (let i = 0; i < count; i++) {
      items.push({
        name: (await this.cartItemName(i).textContent()) || '',
        price: (await this.cartItemPrice(i).textContent()) || ''
      });
    }
    return items;
  }

  async verifyCartContainsItems(expectedItems: CartItem[]) {
    const actualItems = await this.getCartContents();
    
    expect(actualItems.length).toBe(expectedItems.length);
    
    for (const expectedItem of expectedItems) {
      const foundItem = actualItems.find(item => 
        item.name === expectedItem.name && 
        item.price === expectedItem.price
      );
      expect(foundItem, `Item ${expectedItem.name} not found in cart`).toBeDefined();
    }
  }

  async continueShopping() {
    await this.continueShoppingButton().click();
  }
}