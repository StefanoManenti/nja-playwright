import { StepType } from './types/stepType';
import { test } from './utils/loggedTest';
import {
  addScriptRuntime,
  autoFillForm,
  checkCookie,
  clearScreenshots,
  enableTestConsole,
  failedError,
  loginArea,
  nextStepButton,
  pageHasStep,
  screenShot,
  WAIT,
} from './utils/utility';

// Test in PP | DESKTOP --> OK   (fino a mercoledì andava, ora servizio non disponibile per OFFERTA NON TROVATA)
const localTest = true;
const baseUrl = !localTest ?`https://pp.eniplenitude.com/configura-offerta?dev&` : `http://localhost:4200/configura-offerta?mocks&dev&`;
const startUrl = `${baseUrl}codiceProdotto=BASE_BB&codiceCanale=CWEB3EGP&codiceTpCanale=WB&direct-debit=true&bill-type=digitale&salesProcess=BROADBAND&fiber=BASE_BB&egonid=380100013650019`

test(`FIBRA STANDALONE MIGRAZIONE`, async ({ page }) => {
  // Lista Step
  const stepList: StepType[] = [
  {
    "step": [
      "must-have-step",
      "must-have-mobile-step"
    ]
  },
  {
    "step": [
      "broadband-options-step"
    ],
    "data": {
      "migrationCode": "KQG029989270011M"
    }
  },
  {
    "step": [
      "broadband-phone-step"
    ]
  },
  {
    "step": [
      "customer-step"
    ]
  },
  {
    "step": [
      "customer-identity-residential-step"
    ]
  },
  {
    "step": [
      "activation-address-step"
    ]
  },
  {
    "step": [
      "iban-residential-step"
    ]
  },
  {
    "step": [
      "contract-step"
    ]
  },
  {
    "step": [
      "activation-date-dual-step"
    ]
  },
  {
    "step": [
      "privacy-step"
    ]
  },
  {
    "step": [
      "recap-step"
    ]
  },
  {
    "step": [
      "typ-step"
    ]
  }
];
  const prefix = localTest ? "LOCAL_" : "PP_";
  const subFolder = prefix +'FIBRA_STANDALONE_MIGRAZIONE';
  const path = `tests/screens/${subFolder}`;
  const screenName = subFolder.toLowerCase() + '_';

  await page.goto(startUrl);
  await page.waitForTimeout(WAIT.LONG);
  await clearScreenshots(path);
  await checkCookie(page);
  await loginArea(page, path, screenName);
  
  for (const [index, s] of stepList.entries()) {
    if(index === 0){
      await addScriptRuntime(
        page,
        `window.collaudo(); window.bypassChecks = true;`
      );
      await enableTestConsole(page);
    }
    const isStep = await pageHasStep(page, s.step,path,screenName);
    if (!isStep) {
      await screenShot(page, path,  screenName + `ERROR_STEP_${s.step}_`);     
      failedError(`❌ Errore: Step ["${String(s.step)}"] non raggiungibile`);
    }

    await page.waitForTimeout(WAIT.SCREENSHOT);
    await autoFillForm(page, path, screenName, (s as any).data);
    if (index !== stepList.length - 1) {
      await page.waitForTimeout(WAIT.SHORT);
      await nextStepButton(page, true, path, screenName);
    }
  }
  console.log("✅ TEST COMPLETATO CON SUCCESSO");
});
