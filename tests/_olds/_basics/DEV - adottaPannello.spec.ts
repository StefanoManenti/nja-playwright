//import { test } from "@playwright/test";
import { test } from "../utils/loggedTest";
import {
  WAIT,
  addScriptRuntime,
  autoFillForm,
  clearScreenshots,
  failedError,
  nextStepButton,
  pageHasTitle,
} from "../utils/utility";

const subFolder = "DEV_ADOTTA_PANNELLO";
const path = `tests/screens/${subFolder}`;
const screenName = subFolder.toLowerCase() + "_";

//Adotta un pannello standalone
const startUrl =
  "http://localhost:4200/configura-offerta?codiceProdotto=BASE_PANNELLO&codiceCanale=CWEB3EGP&codiceTpCanale=WB&direct-debit=true&bill-type=digitale&salesProcess=AGGIUNGI_PANNELLO&panel=&mocks&dev";

test("DEV - Adotta pannello", async ({ page }) => {
  await clearScreenshots(path);

  await page.goto(startUrl);
  await page.waitForTimeout(WAIT.LONG);

  const steps: {
    title: string[] | false;
    action: (page) => Promise<void>;
  }[] = [
    {
      title: ["Seleziona punto di fornitura"],
      action: async (page) => {
        
        // ing Modalità collaudo
        await addScriptRuntime(
          page,
          `
                  window.collaudo();
                  bypassChecks.current = true;
                `
        );
        await page.waitForTimeout(WAIT.SHORT);
        //End ing Modalità collaudo

        await autoFillForm(page, path, screenName);
        await nextStepButton(page, true, path, screenName);
      },
    },
    {
      title: ["Scegli il pannello più adatto a te"],
      action: async (page) => {
        await page.waitForTimeout(WAIT.SCREENSHOT);
        await autoFillForm(page, path, screenName);
        await nextStepButton(page, true, path, screenName);
      },
    },
    {
      title: ["Accetta le condizioni contrattuali"],
      action: async (page) => {
        await page.waitForTimeout(WAIT.SCREENSHOT);
        await autoFillForm(page, path, screenName);
        await nextStepButton(page, true, path, screenName);
      },
    },
    {
      title: ["Scegli i tempi di attivazione"],
      action: async (page) => {
        await page.waitForTimeout(WAIT.SCREENSHOT);
        await autoFillForm(page, path, screenName);
        await nextStepButton(page, true, path, screenName);
      },
    },
    {
      title: ["Consensi al trattamento dei dati personali"],
      action: async (page) => {
        await page.waitForTimeout(WAIT.SCREENSHOT);
        await autoFillForm(page, path, screenName);
        await nextStepButton(page, true, path, screenName);
      },
    },
    {
      title: ["Verifica Finale"],
      action: async (page) => {
        await page.waitForTimeout(WAIT.SCREENSHOT);
        await nextStepButton(page, true, path, screenName);
      },
    },
  ];

  for (const step of steps) {
    if (!(await pageHasTitle(page, step.title))) {
      step.title &&
        failedError(
          `❌ Errore: Titolo ["${step.title.join(
            " || "
          )}"] non trovato o invisibile`
        );
    }

    await step.action(page);
  }
});
