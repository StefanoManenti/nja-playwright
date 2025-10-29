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

const subFolder = "PP_NA_TRENDCASA_LUCE";
const path = `tests/screens/${subFolder}`;
const screenName = subFolder.toLowerCase()+"_";

//NA -> trendcasa > luce
const startUrl ="https://pp.eniplenitude.com/configura-offerta?codiceProdotto=BASE_LTCASAV-GTCASAV&codiceCanale=CWEB3EGP&codiceTpCanale=WB&direct-debit=true&bill-type=digitale&commodity=luce&salesProcess=NEW_ACTIVATION&dev=true"

test("PP - Nuova Attivazione / Trend Casa / Luce", async ({ page }) => {
  await clearScreenshots(path);

  await page.goto(startUrl);
  await page.waitForTimeout(WAIT.LONG);

  const steps: {
    title: string[] | false;
    action: (page) => Promise<void>;
  }[] = [
    {
      title: ["Trend Casa Attivazione Luce"],
      action: async (page) => {
        // ing Modalità collaudo
        await addScriptRuntime(page, `
          window.collaudo();
          bypassChecks.current = true;
        `);
        await page.waitForTimeout(WAIT.SHORT);
        //End ing Modalità collaudo

        await autoFillForm(page, path, screenName);
        await nextStepButton(page, true, path, screenName);
      },
    },
    {
      title: ["Riepilogo"],
      action: async (page) => {
        console.log("🔍 Step: Riepilogo");
        await nextStepButton(page, true, path, screenName);
      },
    },
    {
      title: false,
      action: async (page) => {
        await page.waitForTimeout(WAIT.SCREENSHOT);
        await autoFillForm(page, path, screenName);
        await nextStepButton(page, true, path, screenName);
      },
    },
    {
      title: ["I tuoi dati anagrafici"],
      action: async (page) => {
        await page.waitForTimeout(WAIT.SCREENSHOT);
        await autoFillForm(page, path, screenName);
        await nextStepButton(page, true, path, screenName);
      },
    },
    {
      title: ["Scegli il tipo di documento"],
      action: async (page) => {
        await page.waitForTimeout(WAIT.SCREENSHOT);
        await autoFillForm(page, path,  screenName);
        await nextStepButton(page, true, path,  screenName);
      },
    },
    {
      title: ["Inserisci il punto di fornitura"],
      action: async (page) => {
        await page.waitForTimeout(WAIT.SCREENSHOT);
        await autoFillForm(page, path,  screenName);
        await nextStepButton(page, true, path,  screenName);
      },
    },
    {
      title: ["Dove vuoi attivare la fornitura"],
      action: async (page) => {
        await page.waitForTimeout(WAIT.SCREENSHOT);
        await autoFillForm(page, path,  screenName);
        await nextStepButton(page, true, path,  screenName);
      },
    },
    {
      title: ["Inserisci il tuo codice pod"],
      action: async (page) => {
        await page.waitForTimeout(WAIT.SCREENSHOT);
        await autoFillForm(page, path,  screenName);
        await nextStepButton(page, true, path,  screenName);
      },
    },
    {
      title: [
        "Hai scelto la modalità di pagamento con addebito diretto sul conto corrente",
      ],
      action: async (page) => {
        await page.waitForTimeout(WAIT.SCREENSHOT);
        await autoFillForm(page, path,  screenName);
        await nextStepButton(page, true, path,  screenName);
      },
    },
    {
      title: ["Accetta le condizioni contrattuali"],
      action: async (page) => {
        await page.waitForTimeout(WAIT.SCREENSHOT);
        await autoFillForm(page, path,  screenName);
        await nextStepButton(page, true, path,  screenName);
      },
    },
    {
      title: ["Consensi al trattamento dei dati personali"],
      action: async (page) => {
        await page.waitForTimeout(WAIT.SCREENSHOT);
        await autoFillForm(page, path,  screenName);
        await nextStepButton(page, true, path,  screenName);
      },
    },
    {
      title: ["Verifica Finale"],
      action: async (page) => {
        await page.waitForTimeout(WAIT.SCREENSHOT);
        await nextStepButton(page, true, path,  screenName);
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
