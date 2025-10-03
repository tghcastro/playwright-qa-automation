import { defineConfig, devices } from '@playwright/test';
import { Time } from "./src/helpers/consts";


export default defineConfig({
  testDir: './src/tests',

  timeout: Time.THIRTY_SECONDS ,

  expect: {
    timeout:  Time.TEN_SECONDS ,
  },

  reporter: "html",

  use: {
    headless: true
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
});
