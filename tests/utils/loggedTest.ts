// utils/loggedTest.ts
import { test as baseTest, Page, devices } from "@playwright/test";
import path from "path";
import { setupPageLogging, flushLogsToFile, generateExcelReport } from "./utility";
import { IS_LOCAL_TEST } from "../config";

type TestFn = (ctx: { page: Page }) => Promise<void>;

interface TestOptions {
  mobileTest?: boolean;
  device?: keyof typeof devices;
}

export function test(title: string, fn: TestFn, options: TestOptions = {}) {
  const { mobileTest = false, device = "iPhone 6" } = options;
  let context = null as any;
  const localTest = IS_LOCAL_TEST;

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
      logs.push(`[test-error]   ${new Date().toISOString()} – ${err.message}`);
      throw err;
    } finally {
      if (context) {
        await context.close();
      }
      testInfo
      const prefix = localTest ? "LOCAL_" : "PP_";
      const folder = path.join("tests", "logs");
      const fileName = prefix + testInfo.title.replace(/\W+/g, "_") + ".log";
      const logFileName = await flushLogsToFile(logs, folder, fileName);

      let tmp= fileName.split("_");
      const logDevice=tmp[tmp.length-1].split(".")[0];
      await generateExcelReport(logFileName, localTest, testInfo.title, logDevice);
 
    }
  });
}
