import { Page, expect } from '@playwright/test';

export class CheckoutPage {
  constructor(public page: Page) {}

  // Elements (Locators)
  firstNameField = () => this.page.locator('//*[@id="first-name"]');
  lastNameField = () => this.page.locator('//*[@id="last-name"]');
  postalCodeField = () => this.page.locator('//*[@id="postal-code"]');
  continueButton = () => this.page.locator('//*[@id="continue"]');
  cancelButton = () => this.page.locator('//*[@id="cancel"]');

  // Error Messages
  errorMessage = () => this.page.locator('//*[@id="checkout_info_container"]/div/form/div[1]/div[4]/h3');
  errorMessagePostalCode = () => this.page.locator('//*[@id="checkout_info_container"]/div/form/div[1]/div[4]');

  // Actions
  async fillFirstName(firstName: string) {
    await this.firstNameField().fill(firstName);
  }

  async fillLastName(lastName: string) {
    await this.lastNameField().fill(lastName);
  }

  async fillPostalCode(postalCode: string) {
    await this.postalCodeField().fill(postalCode);
  }

  async clickContinue() {
    await this.continueButton().click();
  }

  async clickCancel() {
    await this.cancelButton().click();
  }


  // Validation/Asserts
  async verifyFirstNameRequiredError() {
    await expect(this.errorMessage()).toHaveText('Error: First Name is required');
  }

  async verifyLastNameRequiredError() {
    await expect(this.errorMessage()).toHaveText('Error: Last Name is required');
  }

  async verifyPostalCodeRequiredError() {
    await expect(this.errorMessagePostalCode()).toHaveText('Error: Postal Code is required');
  }

  async verifyCheckoutFieldsAreEditable() {
    await expect(this.firstNameField()).toBeEditable();
    await expect(this.lastNameField()).toBeEditable();
    await expect(this.postalCodeField()).toBeEditable();
  }


  // Combined Actions (for test readability)
  async fillCheckoutForm(firstName: string, lastName: string, postalCode: string) {
    await this.fillFirstName(firstName);
    await this.fillLastName(lastName);
    await this.fillPostalCode(postalCode);
  }

  async completeCheckout(firstName: string, lastName: string, postalCode: string) {
    await this.fillCheckoutForm(firstName, lastName, postalCode);
    await this.clickContinue();
  }

  errorContainer = () => this.page.locator('[data-test="error"]');
clearAllFields = async () => {
  await this.firstNameField().clear();
  await this.lastNameField().clear();
  await this.postalCodeField().clear();
};
}