//import { test } from "@playwright/test";
import { test } from "./utils/loggedTest";
import {
  WAIT,
  addScriptRuntime,
  autoFillForm,
  clearScreenshots,
  failedError,
  nextStepButton,
  pageHasTitle,
} from "./utils/utility";


const startUrl =  "http://localhost:4200/configura-offerta?codiceProdotto=BASE_TNDVL-TNDVG&codiceCanale=CWEB3EGP&codiceTpCanale=WB&direct-debit=true&bill-type=digitale&commodity=gas&mocks&dev";

test("Trend Business / Gas / Cambio fornitore", async ({ page }) => {
  const subFolder = "DEVB3_TB_GAS_CAMBIO_FORNITORE";
  const path = `tests/screens/${subFolder}`;
  const screenName = subFolder.toLowerCase()+"_";

  await clearScreenshots(path);

  await page.goto(startUrl);
  await page.waitForTimeout(WAIT.LONG);

  const steps: {
    title: string[] | false;
    action: (page) => Promise<void>;
  }[] = [
    {
      title: ["Trend Business Gas"],
      action: async (page) => {
        
        // ing Modalità collaudo
        await addScriptRuntime(page, `
          window.collaudo();
          bypassChecks.current = true;
        `);
        await page.waitForTimeout(WAIT.SHORT);
        //End ing Modalità collaudo
  

        await autoFillForm(page, path, screenName, { operativeMode: "SWITCH_IN" });
        await nextStepButton(page, true, path, screenName);
      },
    },
    {
      title: ["Trend Business Gas", "Prossimi passi"],
      action: async (page) => {
        await nextStepButton(page, true, path, screenName);
      },
    },
    {
      title: ["A chi verrà intestata la fornitura?"],
      action: async (page) => {
        await autoFillForm(page, path, screenName);
        await nextStepButton(page, true, path, screenName);
      },
    },
    {
      title: ["Inserisci l’indirizzo della sede legale", "Dove vuoi attivare la fornitura?"],
      action: async (page) => {
        await page.waitForTimeout(WAIT.SCREENSHOT);
        await autoFillForm(page, path, screenName);
        await nextStepButton(page, true, path, screenName);
      },
    },
    {
      title: ["Inserisci il punto di fornitura"],
      action: async (page) => {
        await page.waitForTimeout(WAIT.SCREENSHOT);
        await autoFillForm(page, path, screenName);
        await nextStepButton(page, true, path, screenName);
      },
    },
    {
      title: ["A chi appartiene l’immobile?"],
      action: async (page) => {
        await page.waitForTimeout(WAIT.SCREENSHOT);
        await autoFillForm(page, path, screenName);
        await nextStepButton(page, true, path, screenName);
      },
    },
    {
      title: ["Inserisci il codice ATECO"],
      action: async (page) => {
        await page.waitForTimeout(WAIT.SCREENSHOT);
        await autoFillForm(page, path, screenName);
        await nextStepButton(page, true, path, screenName);
      },
    },
    {
      title: ["Chi è il rappresentante legale dell’azienda?"],
      action: async (page) => {
        await page.waitForTimeout(WAIT.SCREENSHOT);
        await autoFillForm(page, path, screenName);
        await nextStepButton(page, true, path, screenName);
      },
    },
    {
      title: [
        "Inserisci l’IBAN per l’addebito diretto", "Inserisci l'IBAN per l'addebito diretto",
      ],
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



test("Trend Business / Gas / Cambio intestatario", async ({ page }) => {
  const subFolder = "DEVB3_TB_GAS_CAMBIO_INTESTATARIO";
  const path = `tests/screens/${subFolder}`;
  const screenName = subFolder.toLowerCase()+"_";

  await clearScreenshots(path);

  await page.goto(startUrl);
  await page.waitForTimeout(WAIT.LONG);

  const steps: {
    title: string[] | false;
    action: (page) => Promise<void>;
  }[] = [
    {
      title: ["Trend Business Gas"],
      action: async (page) => {
        
        // ing Modalità collaudo
        await addScriptRuntime(page, `
          window.collaudo();
          bypassChecks.current = true;
        `);
        await page.waitForTimeout(WAIT.SHORT);
        //End ing Modalità collaudo
  

        await autoFillForm(page, path, screenName, { operativeMode: "TRANSFER" });
        await nextStepButton(page, true, path, screenName);
      },
    },
    {
      title: ["Trend Business Gas", "Prossimi passi"],
      action: async (page) => {
        await nextStepButton(page, true, path, screenName);
      },
    },
    {
      title: ["A chi verrà intestata la fornitura?"],
      action: async (page) => {
        await page.waitForTimeout(WAIT.SCREENSHOT);
        await autoFillForm(page, path, screenName);
        await nextStepButton(page, true, path, screenName);
      },
    },
    {
      title: ["Inserisci il punto di fornitura"],
      action: async (page) => {
        await page.waitForTimeout(WAIT.SCREENSHOT);
        await autoFillForm(page, path, screenName);
        await nextStepButton(page, true, path, screenName);
      },
    },
    {
      title: ["Punto di fornitura"],
      action: async (page) => {
        await nextStepButton(page, true, path, screenName);
      },
    },
    {
      title: ["Per quali scopi usi il gas?"],
      action: async (page) => {
        await page.waitForTimeout(WAIT.SCREENSHOT);
        await autoFillForm(page, path, screenName);
        await nextStepButton(page, true, path, screenName);
      },
    },
    {
      title: ["A chi appartiene l’immobile?"],
      action: async (page) => {
        await page.waitForTimeout(WAIT.SCREENSHOT);
        await autoFillForm(page, path, screenName);
        await nextStepButton(page, true, path, screenName);
      },
    },
    {
      title: ["Inserisci il codice ATECO"],
      action: async (page) => {
        await page.waitForTimeout(WAIT.SCREENSHOT);
        await autoFillForm(page, path, screenName);
        await nextStepButton(page, true, path, screenName);
      },
    },
    {
      title: ["Chi è il rappresentante legale dell’azienda?"],
      action: async (page) => {
        await page.waitForTimeout(WAIT.SCREENSHOT);
        await autoFillForm(page, path, screenName);
        await nextStepButton(page, true, path, screenName);
      },
    },
    {
      title: [
        "Inserisci l’IBAN per l’addebito diretto", "Inserisci l'IBAN per l'addebito diretto",
      ],
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
