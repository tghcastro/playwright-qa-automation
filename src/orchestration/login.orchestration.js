import { expect } from '@playwright/test';
import * as allure from "allure-js-commons";
import CovaAppStart from '../page-objects/cova-app-start.page';

export default class LoginOrchestration {
  constructor(page) {
    this.page = page;
  }

  async logInWithCredentials(username, password) {
    return await allure.step('Executing Log In', async () => {
      const expectedCovaAppPageTitle = 'cova-dev';
      const expectedLogInPageTitle = 'cova-dev';

      console.log(
        `[LogIn] Authentication attempt [Username:${username.substring(0, 3)}****] [Password provided:${password !== ''}]`
      );

      const covaAppStartPage = new CovaAppStart(this.page)
      await covaAppStartPage.open()

      await expect(this.page).toHaveTitle(expectedCovaAppPageTitle);

      const logInPage = await covaAppStartPage.navigateToLogin();

      await expect(this.page).toHaveTitle(expectedLogInPageTitle);

      await logInPage.fillUsername(username);
      await logInPage.fillPassword(password);
      const adminPage = await logInPage.clickOnLogIn();

      return adminPage
    });
  }
}
