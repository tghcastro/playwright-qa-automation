import { expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { extendedTest } from '../helpers/custom.fixture';
import AdminPage from '../page-objects/admin.page';

extendedTest.beforeEach(async () => {
  await allure.suite('Critical Path Features');
  await allure.subSuite('User Management');
  await allure.label('Test Type', 'E2E');
});

// WARNING: This scenario is failing because the user list is not displayed immediately after signing in.
// CovaApp only displays the users list after performing a search
extendedTest('Users list is displayed after successful login', async ({ authenticatedPage }) => {
  const adminPage = new AdminPage(authenticatedPage);
  expect(await adminPage.isOpen()).toBe(true);

  await expect(adminPage.usersTable).toBeVisible();
});

extendedTest(
  'Search a user by full name should display only users with the given name',
  async ({ authenticatedPage }) => {
    const adminPage = new AdminPage(authenticatedPage);
    expect(await adminPage.isOpen()).toBe(true);

    const nameToSearchFor = 'Connie Delgado';

    await adminPage.fillSearch(nameToSearchFor);
    await adminPage.clickOnSearch();

    const expectedSearchDetailsDescription = `Search results for: ${nameToSearchFor}`;
    expect(adminPage.searchDetailsDescription).toHaveText(expectedSearchDetailsDescription);
    await expect(adminPage.usersTable).toBeVisible();

    await allure.step('Validating displayed user data', async () => {
      const pageDisplayedUsers = await adminPage.getDisplayedUsers();
      expect(pageDisplayedUsers.length).toBe(1);
      const displayedUser = pageDisplayedUsers[0];
      expect(displayedUser.Name).toBe(nameToSearchFor);
      expect(displayedUser.Age).toEqual(expect.any(Number));
      expect(displayedUser.Salary).toEqual(expect.any(Number));
      expect(displayedUser['Start date']).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  }
);

extendedTest(
  'Search users by partial input should display only users with the given input',
  async ({ authenticatedPage }) => {
    const adminPage = new AdminPage(authenticatedPage);
    expect(await adminPage.isOpen()).toBe(true);

    const nameToSearchFor = 'Lisa';

    await allure.step('Searching for users', async () => {
      await adminPage.fillSearch(nameToSearchFor);
      await adminPage.clickOnSearch();
      const expectedSearchDetailsDescription = `Search results for: ${nameToSearchFor}`;
      expect(adminPage.searchDetailsDescription).toHaveText(expectedSearchDetailsDescription);
      await expect(adminPage.usersTable).toBeVisible();
    });

    await allure.step('Validating displayed user data', async () => {
      const pageDisplayedUsers = await adminPage.getDisplayedUsers();
      expect(pageDisplayedUsers.length).toBe(4);
      const displayedUser = pageDisplayedUsers[0];

      for (const element of pageDisplayedUsers) {
        expect(element.Name).toContain(nameToSearchFor);
      }
    });
  }
);

extendedTest(
  'Searching for a non-existent user should display an empty table',
  async ({ authenticatedPage }) => {
    const adminPage = new AdminPage(authenticatedPage);
    expect(await adminPage.isOpen()).toBe(true);

    const nameToSearchFor = 'not existent user';

    await allure.step('Searching for users', async () => {
      await adminPage.fillSearch(nameToSearchFor);
      await adminPage.clickOnSearch();
      const expectedSearchDetailsDescription = `Search results for: ${nameToSearchFor}`;
      expect(adminPage.searchDetailsDescription).toHaveText(expectedSearchDetailsDescription);
      await expect(adminPage.usersTable).toBeVisible();
    });

    await allure.step('Validating that the users table is empty', async () => {
      const pageDisplayedUsers = await adminPage.getDisplayedUsers();
      expect(pageDisplayedUsers.length).toBe(0);
    });
  }
);
