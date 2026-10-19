const { expect } = require('@playwright/test');

class CheckoutPage {
  constructor(page) {
    this.page = page;

    // form checkout
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.finishButton = page.locator('[data-test="finish"]');

    // add to cart some product
    this.productBackPack = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
    this.productBikeLight =page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]');
    this.productTShirt = page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]');
    this.productOnesie = page.locator('[data-test="add-to-cart-sauce-labs-onesie"]');

    // success message
    this.successMessage = page.locator('[data-test="complete-header"]');
  }

  async goto() {
    await this.page.goto('/cart.html');
  }
}

module.exports = { CheckoutPage };