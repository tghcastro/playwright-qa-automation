import { expect } from '@playwright/test';
import BasePage from './base.page';

export default class AdminPage extends BasePage {
      #URL_PAGE_PATH = "/admin.php"

  constructor(pageToSet) {
    super();
    this.page = pageToSet;
    this.loggedInUserInformation = this.page.locator('.img-profile.rounded-circle');
  }

  async isOpen() {
    // Use try/catch with toBeVisible() to avoid flakiness compared to isVisible()
    try {
      await expect(this.loggedInUserInformation).toBeVisible();
      expect(await this.page.url()).toContain(this.#URL_PAGE_PATH)
      return true;
    } catch (ex) {
      return false;
    }
  }
}
