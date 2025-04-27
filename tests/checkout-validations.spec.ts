import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { InventoryPage } from '../pages/inventory.page';
import { CheckoutPage } from '../pages/checkout.page';
import { getValidUsers, getCustomerInfo } from '../utils/user-helpers';

const validUsers = getValidUsers();
const customerInfo = getCustomerInfo();

for (const user of validUsers) {
  test.describe(`Strict Checkout Validation for ${user.type} User`, () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;
    let checkoutPage: CheckoutPage;

    test.beforeEach(async ({ page }) => {
      loginPage = new LoginPage(page);
      inventoryPage = new InventoryPage(page);
      checkoutPage = new CheckoutPage(page);

      await loginPage.navigate();
      await loginPage.login(user.username, user.password);
      await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
      
      await inventoryPage.addProductToCart(inventoryPage.itemDetails[0].name);
      await inventoryPage.openCart();
      await page.locator('[data-test="checkout"]').click();
      await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');
    });

    test(`Strict field validation prevents progression for ${user.type}`, async ({ page }) => {
      // 1. Verify initial state prevents progression
      await checkoutPage.clickContinue();
      await expect(page).not.toHaveURL('https://www.saucedemo.com/checkout-step-two.html');
      await checkoutPage.verifyFirstNameRequiredError();

      // 2. Test partial completion scenarios
      const testScenarios = [
        {
          description: 'Only First Name filled',
          actions: async () => {
            await checkoutPage.fillFirstName(customerInfo.firstName);
            await checkoutPage.fillLastName('');
            await checkoutPage.fillPostalCode('');
          },
          expectedError: 'Last Name is required'
        },
        {
          description: 'Only Last Name filled',
          actions: async () => {
            await checkoutPage.fillFirstName('');
            await checkoutPage.fillLastName(customerInfo.lastName);
            await checkoutPage.fillPostalCode('');
          },
          expectedError: 'First Name is required'
        },
        {
          description: 'Only Postal Code filled',
          actions: async () => {
            await checkoutPage.fillFirstName('');
            await checkoutPage.fillLastName('');
            await checkoutPage.fillPostalCode(customerInfo.zipCode);
          },
          expectedError: 'First Name is required'
        },
        {
          description: 'Missing First Name',
          actions: async () => {
            await checkoutPage.fillFirstName('');
            await checkoutPage.fillLastName(customerInfo.lastName);
            await checkoutPage.fillPostalCode(customerInfo.zipCode);
          },
          expectedError: 'First Name is required'
        },
        {
          description: 'Missing Last Name',
          actions: async () => {
            await checkoutPage.fillFirstName(customerInfo.firstName);
            await checkoutPage.fillLastName('');
            await checkoutPage.fillPostalCode(customerInfo.zipCode);
          },
          expectedError: 'Last Name is required'
        },
        {
          description: 'Missing Postal Code',
          actions: async () => {
            await checkoutPage.fillFirstName(customerInfo.firstName);
            await checkoutPage.fillLastName(customerInfo.lastName);
            await checkoutPage.fillPostalCode('');
          },
          expectedError: 'Postal Code is required'
        }
      ];

      for (const scenario of testScenarios) {
        console.log(`Testing scenario: ${scenario.description}`);
        await scenario.actions();
        await checkoutPage.clickContinue();
        
        // Verify URL didn't change and error appears
        await expect(page).not.toHaveURL('https://www.saucedemo.com/checkout-step-two.html');
        await expect(checkoutPage.errorContainer()).toContainText(scenario.expectedError);
        
        // Reset form for next test
        await checkoutPage.clearAllFields();
      }

      // 3. Verify successful submission only works with all fields
      await checkoutPage.fillFirstName(customerInfo.firstName);
      await checkoutPage.fillLastName(customerInfo.lastName);
      await checkoutPage.fillPostalCode(customerInfo.zipCode);
      await checkoutPage.clickContinue();
      await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html');
    });

    test(`Field editability remains consistent for ${user.type}`, async ({ page }) => {
      // Verify initial editability
      await checkoutPage.verifyCheckoutFieldsAreEditable();

      // Test editability after failed submissions
      const invalidSubmissions = [
        { field: 'firstName', value: '' },
        { field: 'lastName', value: '' },
        { field: 'postalCode', value: '' }
      ];

      for (const submission of invalidSubmissions) {
        await checkoutPage.fillFirstName(submission.field === 'firstName' ? submission.value : customerInfo.firstName);
        await checkoutPage.fillLastName(submission.field === 'lastName' ? submission.value : customerInfo.lastName);
        await checkoutPage.fillPostalCode(submission.field === 'postalCode' ? submission.value : customerInfo.zipCode);
        
        await checkoutPage.clickContinue();
        await checkoutPage.verifyCheckoutFieldsAreEditable();
        await checkoutPage.clearAllFields();
      }

      // Additional verification that fields remain editable after successful submission
      await checkoutPage.fillFirstName(customerInfo.firstName);
      await checkoutPage.fillLastName(customerInfo.lastName);
      await checkoutPage.fillPostalCode(customerInfo.zipCode);
      await checkoutPage.clickContinue();
      await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html');
      
      // Go back to verify fields are still editable (if applicable)
      await page.goBack();
      await checkoutPage.verifyCheckoutFieldsAreEditable();
    });
  });
}