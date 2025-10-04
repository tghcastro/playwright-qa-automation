import { expect } from '@playwright/test';
import BasePage from './base.page';

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
    return await this.page.$$eval("//*[@id='dataTable']/tbody/tr", (rows) => {
      if (rows.length === 0) {
        return [];
      }

      const headers = Array.from(rows[0].closest('table').querySelectorAll('thead th')).map((th) =>
        th.innerText.trim()
      );

      return rows.map((tableRow) => {
        const cells = Array.from(tableRow.querySelectorAll('td'));
        const convertedUserObject = {};

        headers.forEach((header, i) => {
          let value = cells[i]?.innerText.trim() || null;

          if (header.toLowerCase() === 'age' && value) {
            value = parseInt(value, 10);
          }
          if (header.toLowerCase() === 'salary' && value) {
            value = parseFloat(value.replace(/[^0-9.-]+/g, ''));
          }

          convertedUserObject[header] = value;
        });

        return convertedUserObject;
      });
    });
  }
}
