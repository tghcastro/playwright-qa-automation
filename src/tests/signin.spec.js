import { expect, test } from '@playwright/test';
import LogInOrchestration from '../orchestration/login.orchestration';
import * as allure from 'allure-js-commons';
import LogInPage from '../page-objects/login.page';

test.beforeEach(async () => {
  await allure.suite('Critical Path Features');
  await allure.subSuite('Authentication');
  await allure.label('Test Type', 'E2E');
});

test('Valid user credentials can access Admin Page after login', async ({ page }) => {
  const realUsername = 'user';
  const realPassword = 'pass';

  const logInOrchestration = new LogInOrchestration(page);
  const adminPage = await logInOrchestration.logInWithCredentials(realUsername, realPassword);

  await expect(await adminPage.isOpen()).toBe(true);
});

const invalidCredentialsTestCases = [
  {
    name: 'Invalid username should display an appropriate error message',
    username: 'invalid-user-name',
    password: 'pass',
    expectedErrorMessage: 'User "invalid-user-name" does not exist',
  },
  {
    name: 'Invalid password should display an appropriate error message',
    username: 'user',
    password: 'invalid-pass',
    expectedErrorMessage: 'Wrong Password',
  },
];

test.describe('Authentication - Invalid Login attempts validation', () => {
  invalidCredentialsTestCases.forEach(({ name, username, password, expectedErrorMessage }) => {
    test(name, async ({ page }) => {
      const logInOrchestration = new LogInOrchestration(page);
      await logInOrchestration.logInWithCredentials(username, password);

      const logInPage = new LogInPage(page);

      expect(await logInPage.isOpen()).toBe(true);

      await expect(logInPage.errorMessageCard).toHaveText(expectedErrorMessage);
    });
  });

  test('Blank username should display a browser native validation message', async ({ page }) => {
    const username = '';
    const password = 'some-pass';

    const logInOrchestration = new LogInOrchestration(page);
    await logInOrchestration.logInWithCredentials(username, password);

    const logInPage = new LogInPage(page);
    expect(await logInPage.isOpen()).toBe(true);

    await expect(logInPage.errorMessageCard).not.toBeVisible();

    const validationMessage = await logInPage.usernameField.evaluate((element) => {
      return element.validationMessage;
    });

    const expectedErrorMessage = 'Please fill out this field.';
    expect(validationMessage).toBe(expectedErrorMessage);
  });

  test('Blank password should display a browser native validation message', async ({ page }) => {
    const username = 'some-user';
    const password = '';

    const logInOrchestration = new LogInOrchestration(page);
    await logInOrchestration.logInWithCredentials(username, password);

    const logInPage = new LogInPage(page);
    expect(await logInPage.isOpen()).toBe(true);

    await expect(logInPage.errorMessageCard).not.toBeVisible();

    const validationMessage = await logInPage.passwordField.evaluate((element) => {
      return element.validationMessage;
    });

    const expectedErrorMessage = 'Please fill out this field.';
    expect(validationMessage).toBe(expectedErrorMessage);
  });
});
