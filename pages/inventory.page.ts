import { Page, expect } from '@playwright/test';

export class InventoryPage {
  constructor(public page: Page) {}

  // Elements
  productItems = () => this.page.locator('.inventory_item');
  productNames = () => this.page.locator('.inventory_item_name');
  productPrices = () => this.page.locator('.inventory_item_price');
  sortDropdown = () => this.page.locator('product_sort_container');
  cartBadge = () => this.page.locator('.shopping_cart_badge');
  menuButton = () => this.page.locator('#react-burger-menu-btn');
  cartLink = () => this.page.locator('[data-test="shopping-cart-link"]');
  addToCart = () => this.page.locator('#add-to-cart');

  // Item Details
  itemDetails = [
    {
      name: 'Sauce Labs Backpack',
      description: 'carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.',
      price: '$29.99',
      addToCartXPath: '//*[@id="add-to-cart-sauce-labs-backpack"]',
      removeFromCartXPath: '//*[@id="remove-sauce-labs-backpack"]',
      addToCartSelector: '[data-test="add-to-cart-sauce-labs-backpack"]',
      removeFromCartSelector: '[data-test="remove-sauce-labs-backpack"]',
      expectedImageSrc: 'sauce-backpack-1200x1500'
    },
    {
      name: 'Sauce Labs Bike Light',
      description: "A red light isn't the desired state in testing but it sure helps when riding your bike at night. Water-resistant with 3 lighting modes, 1 AAA battery included.",
      price: '$9.99',
      addToCartXPath: '//*[@id="add-to-cart-sauce-labs-bike-light"]',
      removeFromCartXPath: '//*[@id="remove-sauce-labs-bike-light"]',
      addToCartSelector: '[data-test="add-to-cart-sauce-labs-bike-light"]',
      removeFromCartSelector: '[data-test="remove-sauce-labs-bike-light"]',
      expectedImageSrc: 'bike-light-1200x1500'
    },
    {
      name: 'Sauce Labs Bolt T-Shirt',
      description: 'Get your testing superhero on with the Sauce Labs bolt T-shirt. From American Apparel, 100% ringspun combed cotton, heather gray with red bolt.',
      price: '$15.99',
      addToCartXPath: '//*[@id="add-to-cart-sauce-labs-bolt-t-shirt"]',
      removeFromCartXPath: '//*[@id="remove-sauce-labs-bolt-t-shirt"]',
      addToCartSelector: '[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]',
      removeFromCartSelector: '[data-test="remove-sauce-labs-bolt-t-shirt"]',
      expectedImageSrc: 'bolt-shirt-1200x1500'
    },
    {
      name: 'Sauce Labs Fleece Jacket',
      description: "It's not every day that you come across a midweight quarter-zip fleece jacket capable of handling everything from a relaxing day outdoors to a busy day at the office.",
      price: '$49.99',
      addToCartXPath: '//*[@id="add-to-cart-sauce-labs-fleece-jacket"]',
      removeFromCartXPath: '//*[@id="remove-sauce-labs-fleece-jacket"]',
      addToCartSelector: '[data-test="add-to-cart-sauce-labs-fleece-jacket"]',
      removeFromCartSelector: '[data-test="remove-sauce-labs-fleece-jacket"]',
      expectedImageSrc: 'sauce-pullover-1200x1500'
    },
    {
      name: 'Sauce Labs Onesie',
      description: "Rib snap infant onesie for the junior automation engineer in development. Reinforced 3-snap bottom closure, two-needle hemmed sleeved and bottom won't unravel.",
      price: '$7.99',
      addToCartXPath: '//*[@id="add-to-cart-sauce-labs-onesie"]',
      removeFromCartXPath: '//*[@id="remove-sauce-labs-onesie"]',
      addToCartSelector: '[data-test="add-to-cart-sauce-labs-onesie"]',
      removeFromCartSelector: '[data-test="remove-sauce-labs-onesie"]',
      expectedImageSrc: 'onesie-1200x1500'
    },
    {
      name: 'Test.allTheThings() T-Shirt (Red)',
      description: 'This classic Sauce Labs t-shirt is perfect to wear when cozying up to your keyboard to automate a few tests. Super-soft and comfy ringspun combed cotton.',
      price: '$15.99',
      addToCartXPath: '//*[@id="add-to-cart-test.allthethings()-t-shirt-(red)"]',
      removeFromCartXPath: '//*[@id="remove-test.allthethings()-t-shirt-(red)"]',
      addToCartSelector: '[data-test="add-to-cart-test.allthethings()-t-shirt-(red)"]',
      removeFromCartSelector: '[data-test="remove-test.allthethings()-t-shirt-(red)"]',
      expectedImageSrc: 'red-tatt-1200x1500'
    },
  ];

  // Actions
  async getProductByName(name: string) {
    return this.page.locator(`.inventory_item:has-text("${name}")`);
  }

  async addProductToCart(name: string) {
    const product = await this.getProductByName(name);
    await product.locator('button:text("Add to cart")').click();
  }

  async removeProduct(name: string) {
    const product = await this.getProductByName(name);
    await product.locator('button:text("Remove")').click();
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.sortDropdown().waitFor({ state: 'visible' });
    await this.sortDropdown().selectOption(option); 
  }

  async openMenu() {
    await this.menuButton().click();
  }

  async openProductDetails(name: string) {
    const product = await this.getProductByName(name);
    await product.locator('.inventory_item_name').click();
  }

  async openCart() {
    await this.cartLink().click();
  }

  async addAllItemsToCart() {
    const buttons = await this.page.locator('[data-test^="add-to-cart-"]').all();
    for (const button of buttons) {
      await button.click();
      await this.page.waitForTimeout(1500); // 1500ms delay
    }
  }

  async getCartCount(): Promise<number> {
    const countText = await this.cartLink().textContent();
    return countText ? parseInt(countText) : 0;
  }
} 