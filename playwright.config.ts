import { defineConfig, devices } from '@playwright/test';
import { Time } from './src/helpers/consts';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import * as os from "node:os";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envTarget = process.env.ENV_TARGET || 'dev';
dotenv.config({ path: path.resolve(__dirname, `.env.${envTarget}`) });

export default defineConfig({
  testDir: './src/tests',

  timeout: Time.THIRTY_SECONDS,

  expect: {
    timeout: Time.TEN_SECONDS,
  },
  reporter: [
    ['html'],
    ['line'],
    [
      'allure-playwright',
      {
        detail: false,
        environmentInfo: {
          os_platform: os.platform(),
          os_release: os.release(),
          os_version: os.version(),
          node_version: process.version,
        },
      },
    ],
  ],
  use: {
    baseURL: process.env.BASE_URL,
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    video: 'on-first-retry',
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
