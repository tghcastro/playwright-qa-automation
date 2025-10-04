import { test as base } from '@playwright/test';
import LogInPage from '../page-objects/login.page'

export const extendedTest = base.extend({
  authenticatedPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: 'authenticatedUser.json',
      baseURL: process.env.BASE_URL,
    });
    const page = await context.newPage();
    const loginPage = new LogInPage(page);
    await loginPage.open()

    await use(page);
    await context.close();
  },

  unauthenticatedPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: '',
      baseURL: process.env.BASE_URL,
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
});
