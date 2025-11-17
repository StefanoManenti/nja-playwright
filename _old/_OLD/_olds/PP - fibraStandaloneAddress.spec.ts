//import { test } from "@playwright/test";
import { Page } from "@playwright/test";
import { test } from "./utils/loggedTest";
import {
  WAIT,
  addScriptInit,
  addScriptRuntime,
  autoFillForm,
  clearScreenshots,
  failedError,
  nextStepButton,
  pageHasTitle,
} from "./utils/utility";

const subFolder = "PP_FIBRA_STANDALONE_ADDRESS";
const path = `tests/screens/${subFolder}`;
const screenName = subFolder.toLowerCase()+"_";
const startUrl ="https://pp.eniplenitude.com/configura-offerta?codiceProdotto=BASE_BB&codiceCanale=CWEB3EGP&codiceTpCanale=WB&direct-debit=true&bill-type=digitale&salesProcess=BROADBAND&fiber=&DSXCNY=ITA&CDPCIV=380100031738405&dev=true";

test("PP - Fibra standalone + Address", async ({ page }) => {
  
  await clearScreenshots(path);

  await page.goto(startUrl);
  await page.waitForTimeout(WAIT.LONG);

  
  const steps: {
    title: string[] | false;
    action: (page) => Promise<void>;
  }[] = [
    //Step Login ENI
    {
      title:  false,
      action: async (page) => {
        await autoFillForm(page, path, screenName);
        await nextStepButton(page, true, path,  screenName);
        await page.waitForTimeout(WAIT.LONG);
        await nextStepButton(page, true, path,  screenName);
        await page.waitForTimeout(WAIT.LONG);
      },
    },
    //End Step Login ENI
    {
      title: ["Fibra"],
      action: async (page) => {

        // ing Modalità collaudo
        await addScriptRuntime(page, `
          window.collaudo();
          bypassChecks.current = true;
        `);
        await page.waitForTimeout(WAIT.SHORT);
        //End ing Modalità collaudo
  
        await autoFillForm(page, path,  screenName);

        await nextStepButton(page, true, path,  screenName);
        await page.waitForTimeout(WAIT.SHORT);

        const alertLocation = await page.locator(
          "div[class*='_typography_*']",
          { hasText: /ottimo! il tuo indirizzo è coperto dalla fibra/i }
        );

        if (!alertLocation) {
          failedError(`❌ Errore: Indirizzo inserito non coperto da Fibra`);
        } else await nextStepButton(page, true, path,  screenName);
      },
    },
    {
      title: ["Fibra"],
      action: async (page) => {
        await autoFillForm(page, path, screenName, {
          hasInternet: "NO",
        });
        await page.waitForTimeout(WAIT.LONG);
        await nextStepButton(page, true, path,  screenName);
      },
    },
    {
      title: ["Fibra"],
      action: async (page) => {
        await page.waitForTimeout(WAIT.LONG);
        await nextStepButton(page, true, path,  screenName);
      },
    },
    {
      title: ["I tuoi dati anagrafici"],
      action: async (page) => {
        await page.waitForTimeout(WAIT.LONG);
        await autoFillForm(page, path,  screenName);
        await nextStepButton(page, true, path,  screenName);
      },
    },
    {
      title: ["Scegli il tipo di documento"],
      action: async (page) => {
        await page.waitForTimeout(WAIT.LONG);
        await autoFillForm(page, path,  screenName);
        await nextStepButton(page, true, path,  screenName);
      },
    },
    {
      title: ["Indirizzo da collegare"],
      action: async (page) => {
        await page.waitForTimeout(WAIT.LONG);
        await autoFillForm(page, path,  screenName);
        await nextStepButton(page, true, path,  screenName);
      },
    },
    {
      title: [
        "Hai scelto la modalità di pagamento con addebito diretto sul conto corrente",
      ],
      action: async (page) => {
        await page.waitForTimeout(WAIT.LONG);
        await autoFillForm(page, path,  screenName);
        await nextStepButton(page, true, path,  screenName);
      },
    },
    {
      title: ["Accetta le condizioni contrattuali"],
      action: async (page) => {
        await page.waitForTimeout(WAIT.LONG);
        await autoFillForm(page, path,  screenName);
        await nextStepButton(page, true, path,  screenName);
      },
    },
    {
      title: ["Diritto di ripensamento Fibra"],
      action: async (page) => {
        await page.waitForTimeout(WAIT.LONG);
        await autoFillForm(page, path,  screenName);
        await nextStepButton(page, true, path,  screenName);
      },
    },
    {
      title: ["Consensi al trattamento dei dati personali"],
      action: async (page) => {
        await page.waitForTimeout(WAIT.LONG);
        await autoFillForm(page, path,  screenName);
        await nextStepButton(page, true, path,  screenName);
      },
    },
    {
      title: ["Verifica Finale"],
      action: async (page) => {
        await page.waitForTimeout(WAIT.LONG);
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

function injectInitScript(page: Page, arg1: string) {
  throw new Error("Function not implemented.");
}

