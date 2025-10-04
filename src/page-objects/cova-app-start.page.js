import BasePage from "./base.page"
import LogInPage from "./login.page";
import { test } from '@playwright/test';

export default class CovaAppStart extends BasePage {

    constructor(pageToSet) {
        super()
        this.page = pageToSet
        this.loginWithCredentialsOption = this.page.locator("#link-login")
        this.loginWith2faOption = this.page.locator("#link-login-2fa")
    }

    async open() {
        await this.page.goto("/");
    }

    async navigateToLogin() {
        await this.loginWithCredentialsOption.click()
        return new LogInPage(this.page)
    }

    async navigateToLoginWith2FA() {
        test.fail("This automation needs to be implemented")
    }
}
