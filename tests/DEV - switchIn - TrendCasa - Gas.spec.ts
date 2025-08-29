import { StepType } from "./types/stepType";
import { test } from "./utils/loggedTest";
import {
  addScriptRuntime,
  autoFillForm,
  clearScreenshots,
  failedError,
  nextStepButton,
  pageHasStep,
  WAIT,
} from "./utils/utility";

//SWITCH IN -> trendcasa > gas
const startUrl =
  "http://localhost:4200/configura-offerta?codiceProdotto=BASE_LTCASAV-GTCASAV&codiceCanale=CWEB3EGP&codiceTpCanale=WB&direct-debit=true&bill-type=digitale&commodity=gas&salesProcess=SWITCH_IN&mocks&dev";

test("DEV - Switch In / Trend Casa / Gas ", async ({ page }) => {
  // Lista Step
  const stepList: StepType[] = [
    { step: ["must-have-step", "must-have-mobile-step"] },
    { step: "ocr-step", data: { mode: "MANUAL" } },
    { step: "customer-step" },
    { step: "activation-address-step" },
    { step: "gas-goal-step" },
    { step: "iban-residential-step" },
    { step: "contract-step" },
    { step: "commodity-dates-step" },
    { step: "privacy-step" },
    { step: "recap-step" },
    { step: "typ-step" },
  ];

  const subFolder = "DEV_SWITCH_IN_GAS";
  const path = `tests/screens/${subFolder}`;
  const screenName = subFolder.toLowerCase() + "_";

  await page.goto(startUrl);
  await page.waitForTimeout(WAIT.LONG);

  for (const [index, s] of stepList.entries()) {
    if (index === 0) {
      await clearScreenshots(path);
      await addScriptRuntime(
        page,
        `window.collaudo(); bypassChecks.current = true;`
      );
    }

    const isStep = await pageHasStep(page, s.step);
    if (!isStep) {
      failedError(`❌ Errore: Step ["${s.step}"] non trovato`);
    }

    await page.waitForTimeout(WAIT.SCREENSHOT);
    await autoFillForm(page, path, screenName, s.data);
    if (index !== stepList.length - 1) {
      await page.waitForTimeout(WAIT.SHORT);
      await nextStepButton(page, true, path, screenName);
    }
  }
  console.log("✅ TEST COMPLETATO CON SUCCESSO");
});

/*
test("DEV - Nuova Attivazione / Trend Casa / Gas / Posa", async ({ page }) => {
  const subFolder = "DEV_NA_TRENDCASA_GAS_POSA";
  const path = `tests/screens/${subFolder}`;
  const screenName = subFolder.toLowerCase() + "_";

  await clearScreenshots(path);

  await page.goto(startUrl);
  await page.waitForTimeout(WAIT.LONG);

  const listSteps = [];

  const compileForm = async (page, path, screenName) => {
    await autoFillForm(page, path, screenName);
    await nextStepButton(page, true, path, screenName);
  };

  const steps: {
    title: string[] | false;
    action: (page) => Promise<void>;
  }[] = [
    {
      title: ["Trend Casa Attivazione Gas"],
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

        await autoFillForm(page, path, screenName, {
          contatorePresente: "no",
        });
        await nextStepButton(page, true, path, screenName);
      },
    },
    {
      title: ["Riepilogo"],
      action: async (page) => {
        await page.waitForTimeout(WAIT.SCREENSHOT);
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
        await autoFillForm(page, path, screenName);
        await nextStepButton(page, true, path, screenName);
      },
    },
    {
      title: ["Dove vuoi attivare la fornitura"],
      action: async (page) => {
        await page.waitForTimeout(WAIT.SCREENSHOT);
        await autoFillForm(page, path, screenName);
        await nextStepButton(page, true, path, screenName);
      },
    },
    {
      title: ["Quante unità abitative alimenta il contatore?"],
      action: async (page) => {
        await page.waitForTimeout(WAIT.SCREENSHOT);
        await autoFillForm(page, path, screenName);
        await nextStepButton(page, true, path, screenName);
      },
    },
    {
      title: ["Inserisci il punto di fornitura", "Per quali scopi usi il gas?"],
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
      title: ["Quando possiamo attivare la fornitura?"],
      action: async (page) => {
        await page.waitForTimeout(WAIT.SCREENSHOT);
        await autoFillForm(page, path, screenName);
        await nextStepButton(page, true, path, screenName);
      },
    },
    {
      title: ["Organizziamo l’appuntamento", "Organizziamo l'appuntamento"],
      action: async (page) => {
        await page.waitForTimeout(WAIT.SCREENSHOT);
        await autoFillForm(page, path, screenName);
        await nextStepButton(page, true, path, screenName);
      },
    },
    {
      title: ["Il contatore è facilmente accessibile?"],
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
*/
