import { expect } from '@playwright/test';
import BasePage from './base.page';
import convertTableToJson from '../helpers/convertTableToJson';
export default class AdminPage extends BasePage {
  #URL_PAGE_PATH = '/admin.php';

  constructor(pageToSet) {
    super();
    this.page = pageToSet;
    this.loggedInUserInformation = this.page.locator('.img-profile.rounded-circle');
    this.searchField = this.page.getByRole('textbox', { name: 'search' });
    this.searchButton = this.page.getByRole('button', { class: 'btn btn-primary' }).locator('//i');
    this.usersTable = this.page.locator('#dataTable');
    this.usersTableRows = this.usersTable.locator('//tbody/tr');
    this.searchDetailsDescription = this.page.getByText('Search results for: ');
  }

  async isOpen() {
    // Use try/catch with toBeVisible() to avoid flakiness compared to isVisible()
    try {
      await expect(this.loggedInUserInformation).toBeVisible();
      expect(await this.page.url()).toContain(this.#URL_PAGE_PATH);
      return true;
    } catch (ex) {
      return false;
    }
  }

  async fillSearch(contentToSearchFor) {
    await this.searchField.fill(contentToSearchFor);
  }

  async clickOnSearch() {
    await this.searchButton.click();
  }

  // Returns the list of displayed users in the table as a JSON array of objects
  async getDisplayedUsers() {
    return await convertTableToJson(this.page, "//*[@id='dataTable']/tbody/tr");
  }
}
