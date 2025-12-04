import { StepType } from './types/stepType';
import { test } from './utils/loggedTest';
import {
  addScriptRuntime,
  autoFillForm,
  clearScreenshots,
  enableTestConsole,
  failedError,
  nextStepButton,
  pageHasStep,
  WAIT,
} from './utils/utility';

const startUrl = `http://localhost:4200/configura-offerta?mocks&dev&codiceProdotto=BASE_LTCASAV-GTCASAV&codiceCanale=CWEB3EGP&codiceTpCanale=WB&direct-debit=true&bill-type=digitale&commodity=luce&salesProcess=NEW_ACTIVATION`

test(`SUBENTRO LUCE TREND - Desktop`, async ({ page }) => {
  // Lista Step
  const stepList: StepType[] = [
  {
    "step": [
      "activationPower",
      "activation-power-step"
    ],
    "data": {
      "contatorePresente": "yes",
      "aperto": "past"
    }
  },
  {
    "step": [
      "must-have-step",
      "must-have-mobile-step"
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
      "upload-document"
    ]
  },
  {
    "step": [
      "activation-address-step"
    ]
  },
  {
    "step": [
      "UnitaAbitative",
      "unita-abitative-step"
    ]
  },
  {
    "step": [
      "pod-step"
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
      "forniture-dates-step"
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
  const subFolder = 'SUBENTRO_LUCE_TREND_DESKTOP';
  const path = `tests/screens/${subFolder}`;
  const screenName = subFolder.toLowerCase() + '_';

  await page.goto(startUrl);
  await page.waitForTimeout(WAIT.LONG);

  for (const [index, s] of stepList.entries()) {
    if (index === 0) {
      await clearScreenshots(path);
      await addScriptRuntime(page, `window.collaudo(); bypassChecks.current = true;`);
      await enableTestConsole(page);
    }

    const isStep = await pageHasStep(page, s.step);
    if (!isStep) { failedError(`❌ Errore: Step [${s.step}] non raggiungibile`); }

    await page.waitForTimeout(WAIT.SCREENSHOT);
    await autoFillForm(page, path, screenName, (s as any).data);
    if (index !== stepList.length - 1) {
      await page.waitForTimeout(WAIT.SHORT);
      await nextStepButton(page, true, path, screenName);
    }
  }
  console.log('✅ TEST COMPLETATO CON SUCCESSO');
});