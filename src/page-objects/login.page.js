import { expect } from '@playwright/test';

import AdminPage from './admin.page';
import BasePage from './base.page';

export default class LogInPage extends BasePage {
  #URL_PAGE_PATH = '/login.php';

  constructor(pageToSet) {
    super();
    this.page = pageToSet;
    this.logInButton = this.page.getByRole('button', { name: 'Login' });
    this.usernameField = this.page.locator('#username');
    this.passwordField = this.page.locator("//input[@id='password']");
    this.errorMessageCard = this.page.locator("//div[@class='card-body']");
  }

  async open() {
    await this.page.goto(this.#URL_PAGE_PATH);
  }

  async isOpen() {
    // Use try/catch with toBeVisible() to avoid flakiness compared to isVisible()
    try {
      await expect(this.logInButton).toBeVisible();
      expect(await this.page.url()).toContain(this.#URL_PAGE_PATH);
      return true;
    } catch (ex) {
      console.log(ex);
      return false;
    }
  }

  async fillUsername(usernameToSet) {
    await this.usernameField.fill(usernameToSet);
  }

  async fillPassword(passwordToSet) {
    await this.passwordField.fill(passwordToSet);
  }

  async clickOnLogIn() {
    await this.logInButton.click();
    return new AdminPage(this.page);
  }
}
