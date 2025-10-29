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

const startUrl = `http://localhost:4200/configura-offerta?codiceProdotto=BASE_LFIXATIV-GFIXATIV&codiceCanale=CWEB3EGP&codiceTpCanale=WB&direct-debit=true&bill-type=digitale&commodity=gas&salesProcess=NEW_ACTIVATION&mocks&dev`

test(`NUOVA ATTIVAZIONE GAS FIXA (subentro)`, async ({ page }) => {
  // Lista Step
  const stepList: StepType[] = [
  {
    "step": [
      "activation-gas-step"
    ],
    "data": {
      "aperto": "no"
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
      "GasAppointment",
      "gas-appointment-step"
    ]
  },
  {
    "step": [
      "LocationMeter",
      "location-meter-step"
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
  const subFolder = 'NUOVA_ATTIVAZIONE_GAS_FIXA_SUBENTRO';
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
    if (!isStep) { failedError(`❌ Errore: Step ["${String('${s.step}')}"] non raggiungibile`); }

    await page.waitForTimeout(WAIT.SCREENSHOT);
    await autoFillForm(page, path, screenName, (s as any).data);
    if (index !== stepList.length - 1) {
      await page.waitForTimeout(WAIT.SHORT);
      await nextStepButton(page, true, path, screenName);
    }
  }
  console.log('✅ TEST COMPLETATO CON SUCCESSO');
});