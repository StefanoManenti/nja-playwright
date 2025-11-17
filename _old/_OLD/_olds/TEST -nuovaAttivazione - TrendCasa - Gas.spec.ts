import { StepType } from "./types/stepType";
import { test } from "./utils/loggedTest";
import {
  addScriptRuntime,
  autoFillForm,
  clearScreenshots,
  enableTestConsole,
  failedError,
  nextStepButton,
  pageHasStep,
  WAIT,
} from "./utils/utility";

//NA -> trendcasa > gas
//const startUrl ="http://localhost:4200/configura-offerta?codiceProdotto=BASE_LTCASAV-GTCASAV&codiceCanale=CWEB3EGP&codiceTpCanale=WB&direct-debit=true&bill-type=digitale&commodity=gas&salesProcess=NEW_ACTIVATION&mocks&dev"; //&aba
const startUrl ="http://localhost:4200/configura-offerta?codiceProdotto=BASE_LTCASAV-GTCASAV&codiceCanale=CWEB3EGP&codiceTpCanale=WB&direct-debit=true&bill-type=digitale&commodity=gas&salesProcess=TRANSFER&mocks=&dev=&segment=res"

test("DEV - Nuova Attivazione / Trend Casa / Gas / Voltura", async ({
  page,
}) => {
  // Lista Step
  const stepList: StepType[] = [
    //{ step: "activation-gas-step" },
    { step: ["must-have-step", "must-have-mobile-step"] },
    { step: "transfer-type-step" },
    { step: "customer-step" },
    { step: "customer-identity-residential-step" },
    { step: "pdr-transfer-step" },
    { step: "activation-address-step" },
    { step: "gas-purpose-step" },
    { step: "iban-residential-step" },
    { step: "contract-step" },
    { step: "privacy-step" },
    { step: "recap-step" },
    { step: "typ-step" },
  ];

  const subFolder = "DEV_NA_TRENDCASA_GAS_VOLTURA";
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
        await enableTestConsole(page);
      }
  
      const isStep = await pageHasStep(page, s.step);
      if (!isStep) {
        failedError(`❌ Errore: Step ["${s.step}"] non raggiungibile`);
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
