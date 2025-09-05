import { DEFAULT_DEVICE_PHONE, DEFAULT_DEVICE_TABLET, StepType } from "./types/stepType";
import { test } from "./utils/loggedTest";
import {
  enableTestConsole,
  addScriptRuntime,
  autoFillForm,
  clearScreenshots,
  failedError,
  nextStepButton,
  pageHasStep,
  WAIT,
} from "./utils/utility";

//SWITCH IN -> trendcasa > gas
test("DEV - Switch In / Trend Casa / Gas ", async ({ page }) => {
  const startUrl =
    "http://localhost:4200/configura-offerta?codiceProdotto=BASE_LTCASAV-GTCASAV&codiceCanale=CWEB3EGP&codiceTpCanale=WB&direct-debit=true&bill-type=digitale&commodity=gas&salesProcess=SWITCH_IN&mocks&dev";
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
      await enableTestConsole(page);
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
test("DEV PHONE - Switch In / Trend Casa / Gas ", async ({ page }) => {
  const startUrl =
    "http://localhost:4200/configura-offerta?codiceProdotto=BASE_LTCASAV-GTCASAV&codiceCanale=CWEB3EGP&codiceTpCanale=WB&direct-debit=true&bill-type=digitale&commodity=gas&salesProcess=SWITCH_IN&mocks&dev";
  // Lista Step
  const stepList: StepType[] = [
    { step: ["must-have-step", "must-have-mobile-step"] },
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

  const subFolder = "DEV_PHONE_SWITCH_IN_GAS";
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
}, { mobileTest: true, device: DEFAULT_DEVICE_PHONE });
test("DEV TABLET - Switch In / Trend Casa / Gas ", async ({ page }) => {
  const startUrl =
    "http://localhost:4200/configura-offerta?codiceProdotto=BASE_LTCASAV-GTCASAV&codiceCanale=CWEB3EGP&codiceTpCanale=WB&direct-debit=true&bill-type=digitale&commodity=gas&salesProcess=SWITCH_IN&mocks&dev";
  // Lista Step
  const stepList: StepType[] = [
    { step: ["must-have-step", "must-have-mobile-step"] },
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

  const subFolder = "DEV_TABLET_SWITCH_IN_GAS";
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
}, { mobileTest: true, device: DEFAULT_DEVICE_TABLET });

//SWITCH IN -> trendcasa > luce
test("DEV - Switch In / Trend Casa / Luce ", async ({ page }) => {
  const startUrl =
    "http://localhost:4200/configura-offerta?codiceProdotto=BASE_LTCASAV-GTCASAV&codiceCanale=CWEB3EGP&codiceTpCanale=WB&direct-debit=true&bill-type=digitale&commodity=luce&salesProcess=SWITCH_IN&mocks&dev";

  // Lista Step
  const stepList: StepType[] = [
    { step: ["must-have-step", "must-have-mobile-step"] },
    { step: "ocr-step", data: { mode: "MANUAL" } },
    { step: "customer-step" },
    { step: "activation-address-step" },
    { step: "pod-step" },
    { step: "iban-residential-step" },
    { step: "contract-step" },
    { step: "commodity-dates-step" },
    { step: "privacy-step" },
    { step: "recap-step" },
    { step: "typ-step" },
  ];

  const subFolder = "DEV_SWITCH_IN_LUCE";
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
