import { defineConfig, devices } from '@playwright/test';
import { Time } from "./src/helpers/consts";
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envTarget = process.env.ENV_TARGET || 'dev';
dotenv.config({ path: path.resolve(__dirname, `.env.${envTarget}`) });

export default defineConfig({
  testDir: './src/tests',

  timeout: Time.THIRTY_SECONDS ,

  expect: {
    timeout:  Time.TEN_SECONDS ,
  },

  reporter: "html",

  use: {
    baseURL: process.env.BASE_URL,
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
