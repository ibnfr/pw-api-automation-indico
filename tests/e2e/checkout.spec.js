const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { CheckoutPage } = require('../../pages/CheckoutPage');

const VALID = {
  username: process.env.STANDARD_USERNAME ?? 'standard_user',
  password: process.env.USER_PASSWORD ?? 'secret_sauce',
};

test.describe('TS-UI-CHECKOUT-001 — Melakukan checkout product', () => {

  let checkoutPage;

  test.beforeEach(async ({ page }) => {
    test.setTimeout(180000);
    const loginPage = new LoginPage(page);
    checkoutPage = new CheckoutPage(page);

    await loginPage.loginAs(VALID);
    await expect(page.locator('[data-test="secondary-header"]')).toHaveText('ProductsName (A to Z)Name (A to Z)Name (Z to A)Price (low to high)Price (high to low)');
  });

  test('TC-UI-CHECKOUT-001-1 — Success Checkout Product Sauce Labs Onesie', async ({ page }) => {
    await checkoutPage.productOnesie.click();
    await checkoutPage.goto();
    await checkoutPage.checkoutButton.waitFor({ state: 'visible', timeout: 30000 });
    await checkoutPage.checkoutButton.click();
    await checkoutPage.firstNameInput.fill('Ibnu');
    await checkoutPage.lastNameInput.fill('Farhan');
    await checkoutPage.postalCodeInput.fill('12345');
    await checkoutPage.continueButton.click();
    await checkoutPage.finishButton.click();
    await expect(checkoutPage.successMessage).toHaveText('Thank you for your order!');
  });

  test('TC-UI-CHECKOUT-001-2 — Success Checkout Beberapa Product (Backpack, Bike Light, T-Shirt, dan Onesie)', async ({ page }) => {
    await checkoutPage.productBackPack.click();
    await checkoutPage.productBikeLight.click();
    await checkoutPage.productTShirt.click();
    await checkoutPage.productOnesie.click();
    await checkoutPage.goto();
    await checkoutPage.checkoutButton.waitFor({ state: 'visible', timeout: 30000 });
    await checkoutPage.checkoutButton.click();
    await checkoutPage.firstNameInput.fill('Ibnu');
    await checkoutPage.lastNameInput.fill('Farhan');
    await checkoutPage.postalCodeInput.fill('12345');
    await checkoutPage.continueButton.click();
    await checkoutPage.finishButton.click();
    await expect(checkoutPage.successMessage).toHaveText('Thank you for your order!');
  });
});