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
//OK
const localTest = true;
const baseUrl = !localTest ?`https://pp.eniplenitude.com/configura-offerta?dev&` : `http://localhost:4200/configura-offerta?mocks&dev&`;
const startUrl = `${baseUrl}codiceProdotto=BASE_LFIXATIV-GFIXATIV&codiceCanale=CWEB3EGP&codiceTpCanale=WB&direct-debit=true&bill-type=digitale&commodity=gaseluce&salesProcess=SWITCH_IN`

test(`SWITCH IN FIXA DUAL`, async ({ page }) => {
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
      "ocr-step"
    ],
    "data": {
      "mode": "MANUAL"
    }
  },
  {
    "step": [
      "customer-step"
    ]
  },
  {
    "step": [
      "activation-address-step"
    ]
  },
  {
    "step": [
      "pod-step"
    ]
  },
  {
    "step": [
      "gas-goal-step"
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
  const subFolder = prefix +'SWITCH_IN_FIXA_DUAL';
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
