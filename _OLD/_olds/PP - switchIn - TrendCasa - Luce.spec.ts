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

const subFolder = "PP_SWITCH_IN_LUCE";
const path = `tests/screens/${subFolder}`;
const screenName = subFolder.toLowerCase() + "_";

//SW -> trend casa > luce
const startUrl ="https://pp.eniplenitude.com/configura-offerta?codiceOfferta=BASE_LTCASAV&codiceProdotto=BASE_LTCASAV&commodity=luce&opzione=monoraria&codiceCanale=CWEB3EGP&codiceConvenzione=CWEB3EGP&codiceTpCanale=WB&bill-type=digitale&direct-debit=true&dev=true";

test("PP - Switch In / Trend Casa / Luce", async ({ page }) => {
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
      title: ["Trend Casa Luce"],
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
      title: ["Trend Casa Luce"],
      action: async (page) => {    
        await nextStepButton(page, true, path, screenName);
      },
    },
    {
      title: ["Modalità di inserimento dei dati contrattuali"],
      action: async (page) => {
        await page.waitForTimeout(WAIT.SCREENSHOT);
        await autoFillForm(page, path, screenName,{
          mode:"MANUAL"
        });
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
      title: ["Scegli il tipo di documento"],
      action: async (page) => {
        console.log("🔍 Step: Tipo di documento");
        await page.waitForTimeout(WAIT.LONG);
        await autoFillForm(page, path, screenName);
        await nextStepButton(page, true, path, screenName);
      },
    },*/
    {
      title: ["Dove vuoi attivare la fornitura"],
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
      title: ["Vuoi accorciare i tempi di attivazione? Scegli l’esecuzione anticipata!"],
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
