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

const subFolder = "DEV_FIBRA_STANDALONE_ADDRESS";
const path = `tests/screens/${subFolder}`;
const screenName = subFolder.toLowerCase() + "_";
const startUrl =
  "http://localhost:4200/configura-offerta?codiceProdotto=BASE_BB_BS07&codiceCanale=CWEB3EGP&codiceTpCanale=WB&direct-debit=true&bill-type=digitale&salesProcess=BROADBAND&fiber=&egonid=380100013650019&mocks&dev";

test("DEV - Fibra standalone standard + Address", async ({ page }) => {
  await clearScreenshots(path);

  await page.goto(startUrl);
  console.log("✅ Navigato all’URL iniziale");
  await page.waitForTimeout(WAIT.LONG);

  const steps: {
    title: string[];
    action: (page) => Promise<void>;
  }[] = [
    {
      title: ["Fibra"],
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
        await page.waitForTimeout(WAIT.SHORT);

        const alertLocation = await page.locator(
          "div[class*='_typography_*']",
          { hasText: /ottimo! il tuo indirizzo è coperto dalla fibra/i }
        );

        if (!alertLocation) {
          failedError(`❌ Errore: Indirizzo inserito non coperto da Fibra`);
        } else await nextStepButton(page, true, path, screenName);
      },
    },
    {
      title: ["Fibra"],
      action: async (page) => {
        console.log("🔍 Step: Fibra 2");

        await autoFillForm(page, path, screenName, {
          hasInternet: "NO",
        });
        await page.waitForTimeout(WAIT.LONG);
        await nextStepButton(page, true, path, screenName);
      },
    },
    {
      title: ["Fibra"],
      action: async (page) => {
        console.log("🔍 Step: Riepilogo");
        await page.waitForTimeout(WAIT.LONG);
        await nextStepButton(page, true, path, screenName);
      },
    },
    {
      title: ["I tuoi dati anagrafici"],
      action: async (page) => {
        console.log("🔍 Step: Anagrafica");
        await page.waitForTimeout(WAIT.LONG);
        await autoFillForm(page, path, screenName);
        await nextStepButton(page, true, path, screenName);
      },
    },
    {
      title: ["Scegli il tipo di documento"],
      action: async (page) => {
        console.log("🔍 Step: Tipo di documento");
        await page.waitForTimeout(WAIT.LONG);
        await autoFillForm(page, path, screenName);
        await nextStepButton(page, true, path, screenName);
      },
    },
    {
      title: ["Indirizzo da collegare"],
      action: async (page) => {
        console.log("🔍 Step: Indirizzo da collegare (DISABLED)");
        await page.waitForTimeout(WAIT.LONG);
        await autoFillForm(page, path, screenName);
        await nextStepButton(page, true, path, screenName);
      },
    },
    {
      title: [
        "Hai scelto la modalità di pagamento con addebito diretto sul conto corrente",
      ],
      action: async (page) => {
        console.log("🔍 Step: IBAN");
        await page.waitForTimeout(WAIT.LONG);
        await autoFillForm(page, path, screenName);
        await nextStepButton(page, true, path, screenName);
      },
    },
    {
      title: ["Accetta le condizioni contrattuali"],
      action: async (page) => {
        console.log("🔍 Step: Contratto");
        await page.waitForTimeout(WAIT.LONG);
        await autoFillForm(page, path, screenName);
        await nextStepButton(page, true, path, screenName);
      },
    },
    {
      title: ["Diritto di ripensamento Fibra"],
      action: async (page) => {
        console.log("🔍 Step: Diritto di ripensamento Fibra");
        await page.waitForTimeout(WAIT.LONG);
        await autoFillForm(page, path, screenName);
        await nextStepButton(page, true, path, screenName);
      },
    },
    {
      title: ["Consensi al trattamento dei dati personali"],
      action: async (page) => {
        console.log("🔍 Step: Privacy");
        await page.waitForTimeout(WAIT.LONG);
        await autoFillForm(page, path, screenName);
        await nextStepButton(page, true, path, screenName);
      },
    },
    {
      title: ["Verifica Finale"],
      action: async (page) => {
        console.log("🔍 Step: Riepilogo");
        await page.waitForTimeout(WAIT.LONG);
        await nextStepButton(page, true, path, screenName);
      },
    },
  ];

  for (const step of steps) {
    if (!(await pageHasTitle(page, step.title))) {
      failedError(
        `❌ Errore: Titolo ["${step.title.join(
          " || "
        )}"] non trovato o invisibile`
      );
    }

    await step.action(page);
  }
});
