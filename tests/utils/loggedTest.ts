// utils/loggedTest.ts
import { test as baseTest, Page } from "@playwright/test";
import path from "path";
import { setupPageLogging, flushLogsToFile } from "./utility";

export const test = ((
  title: string,
  fn: (ctx: { page: Page }) => Promise<void>,
) => {
  baseTest(title, async ({ page }, testInfo) => {
    // 1) Buffer dei log
    const logs: string[] = [];
    const erroPage = setupPageLogging(page, logs);
    
    logs.push(`[test-start] ${new Date().toISOString()} – ${testInfo.title}`);

    try {
      // 2) Esegui il test “puro”
      await fn({ page });
      logs.push(`[test-success] ${new Date().toISOString()} – OK`);
    } catch (err: any) {
      logs.push(`[test-error]   ${new Date().toISOString()} – ${err.message}`);
      /*if (err.response && err.response.json) {
        const response = await err.response.json();
        // TODO!!! "code_error" rappresenta il codice errore BE da codificare
        if (response.code_error) {
          console.error(`ERROR: ${decodeCodeErrore(response.code_error)}`);
          //alert(`Errore: ${response.code_error}`);
        }
      }*/
      throw err;
    } finally {
      // 3) Flush su file
      const folder = path.join("tests", "logs");
      const fileName = testInfo.title.replace(/\W+/g, "_") + ".log";
      await flushLogsToFile(logs, folder, fileName);
    }
  });
}) as typeof baseTest;
