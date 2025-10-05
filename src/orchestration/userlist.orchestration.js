import { expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import AdminPage from '../page-objects/admin.page';

export default class UserListOrchestration {
  constructor(page) {
    this.page = page;
  }

  async searchFor(searchContent) {
    return await allure.step('Executing Search', async () => {
      console.log(`[Search] Executing Search [Content:${searchContent}]`);

      const adminPage = new AdminPage(this.page);

      await adminPage.fillSearch(searchContent);
      await adminPage.clickOnSearch();

      const expectedSearchDetailsDescription = `Search results for: ${searchContent}`;
      expect(adminPage.searchDetailsDescription).toHaveText(expectedSearchDetailsDescription);
      await expect(adminPage.usersTable).toBeVisible();
    });
  }
}
