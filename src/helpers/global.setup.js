import { chromium, expect } from '@playwright/test';
import LoginOrchestration from '../orchestration/login.orchestration';

async function globalSetup() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    baseURL: process.env.BASE_URL,
  });
  const page = await context.newPage();

  //   const username = process.env.USERNAME;
  //   const password = process.env.PASSWORD;

  console.log('Starting Global Setup to execute log in');
  //TODO: Remover martelada
  const username = 'user';
  const password = 'pass';

  const logInOrchestration = new LoginOrchestration(page);
  const adminPage = await logInOrchestration.logInWithCredentials(username, password);

  expect(adminPage.isOpen()).toBeTruthy()

  await page.context().storageState({ path: 'authenticatedUser.json' });

  await browser.close();
}

export default globalSetup;
