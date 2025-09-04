// utils/loggedTest.ts
import { test as baseTest, Page, devices } from "@playwright/test";
import path from "path";
import { setupPageLogging, flushLogsToFile } from "./utility";

type TestFn = (ctx: { page: Page }) => Promise<void>;

interface TestOptions {
  mobileTest?: boolean;
  device?: keyof typeof devices;
}

export function test(
  title: string,
  fn: TestFn,
  options: TestOptions = {}
) {
  const { mobileTest = false, device = "iPhone 6" } = options;
  let context = null as any;

  baseTest(title, async ({ page, browser }, testInfo) => {
    const logs: string[] = [];
    logs.push(`[test-start] ${new Date().toISOString()} – ${testInfo.title}`);

    let usedPage: Page = page;

    if (mobileTest) {
      // crea contesto mobile
      const mobileDevice = devices[device];
      if (!mobileDevice) {
        throw new Error(`Device "${device}" non trovato in Playwright devices`);
      }

      context = await browser.newContext({
      ...mobileDevice,
      });

      usedPage = await context.newPage();
    }

    setupPageLogging(usedPage, logs);

    try {
      await fn({ page: usedPage });
      logs.push(`[test-success] ${new Date().toISOString()} – OK`);
    } catch (err: any) {
      logs.push(
        `[test-error]   ${new Date().toISOString()} – ${err.message}`
      );
      throw err;
    } finally {
      if (context) {
        await context.close();
      }
      const folder = path.join("tests", "logs");
      const fileName = testInfo.title.replace(/\W+/g, "_") + ".log";
      await flushLogsToFile(logs, folder, fileName);
    }
  });
}
