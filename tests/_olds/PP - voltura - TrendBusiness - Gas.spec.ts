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

const subFolder = "PP_VOLTURA_GAS";
const path = `tests/screens/${subFolder}`;
const screenName = subFolder.toLowerCase()+"_";

//Voltura -> trend businness > luce
const startUrl ="https://pp.eniplenitude.com/configura-offerta?codiceProdotto=BASE_LTCASAV-GTCASAV&codiceCanale=CWEB3EGP&codiceTpCanale=WB&direct-debit=true&bill-type=digitale&commodity=gas&salesProcess=TRANSFER&dev=true"

test("PP - Voltura / Trend Business / Gas", async ({ page }) => {
  await clearScreenshots(path);

  await page.goto(startUrl);
  await page.waitForTimeout(WAIT.LONG);

  const steps: {
    title: string[] | false;
    action: (page) => Promise<void>;
  }[] = [
    /*//Step Login ENI
    {
      title: false,
      action: async (page) => {
        await autoFillForm(page, path, screenName);
        await nextStepButton(page, true, path, screenName);
        await page.waitForTimeout(WAIT.LONG);
        await nextStepButton(page, true, path, screenName);
        await page.waitForTimeout(WAIT.LONG);
      },
    },
    //End Step Login ENI
    */
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
        
        await nextStepButton(page, true, path, screenName);
      },
    },
    {
      title: ["Tipologia Voltura"],
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
    /*{
      title: ["A chi verrà intestata la fornitura"],
      action: async (page) => {
        await page.waitForTimeout(WAIT.SCREENSHOT);
        await autoFillForm(page, path, screenName);
        await nextStepButton(page, true, path, screenName);
      },
    },*/
    {
      title: ["Scegli il tipo di documento"],
      action: async (page) => {
        console.log("🔍 Step: Tipo di documento");
        await page.waitForTimeout(WAIT.LONG);
        await autoFillForm(page, path, screenName);
        await nextStepButton(page, true, path, screenName);
      },
    },
    /*{
      title: ["Inserisci l’indirizzo della sede legale"],
      action: async (page) => {
        await page.waitForTimeout(WAIT.SCREENSHOT);
        await autoFillForm(page, path, screenName);
        await nextStepButton(page, true, path, screenName);
      },
    },*/
    {
      title: ["Inserisci il punto di fornitura"],
      action: async (page) => {
        await page.waitForTimeout(WAIT.SCREENSHOT);
        await autoFillForm(page, path, screenName);
        await nextStepButton(page, true, path, screenName);
      },
    },
    {
      title: ["Inserisci il tuo codice pdr"],
      action: async (page) => {
        await page.waitForTimeout(WAIT.SCREENSHOT);
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
