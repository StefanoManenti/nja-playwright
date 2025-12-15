import { IS_LOCAL_TEST } from './config';
import { StepType } from './types/stepType';
import { test } from './utils/loggedTest';
import { spawn } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
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

const localTest = IS_LOCAL_TEST;
const baseUrl = !localTest
  ? `https://pp.eniplenitude.com/configura-offerta?dev&` // Remote URL - update with your actual remote URL
  : `http://localhost:4200/configura-offerta?mocks&dev&`; // Local URL - update with your local development URL

const queryString = `codiceProdotto=BASE_LTCASAV-GTCASAV&codiceCanale=CWEB3EGP&codiceTpCanale=WB&direct-debit=true&bill-type=digitale&commodity=gaseluce&salesProcess=CHANGE_OFFER`;
const startUrl = `${baseUrl}${queryString}`;

// Logging setup
const logs: string[] = [];
const logFolder = path.join(process.cwd(), 'tests', 'logs');
const testId = 45;
let runId = Date.now(); // Timestamp as unique run ID
const logFileName = `test_${testId}_run_${runId}_${new Date().toISOString().replace(/[:.]/g, '-')}.log`;

// Save logs to file function
async function saveLogsToFile(logs: string[], folder: string, fileName: string) {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
  const filePath = path.join(folder, fileName);
  const content = logs.join('\\n') + '\\n';
  fs.writeFileSync(filePath, content, { encoding: 'utf-8' });
  return filePath;
}

test(`PP - CAMBIO PRODOTTO DUAL - iPhone`, async ({ page }) => {
  const startTime = new Date().toISOString();
  logs.push(`[test-start] ${startTime} – PP - CAMBIO PRODOTTO DUAL - iPhone`);

  try {
  // Lista Step
  const stepList: StepType[] = [
  {
    "step": [
      "selectAccount",
      "select-account-step"
    ]
  },
  {
    "step": [
      "must-have-step"
    ]
  },
  {
    "step": [
      "changeOfferRecap"
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
  const subFolder = 'PP_CAMBIO_PRODOTTO_DUAL_IPHONE';
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

    const isStep = await pageHasStep(page, s.step, path, screenName);
    if (!isStep) { failedError(`❌ Errore: Step [${s.step}] non raggiungibile`); }

    await page.waitForTimeout(WAIT.SCREENSHOT);
    await autoFillForm(page, path, screenName, (s as any).data);
    if (index !== stepList.length - 1) {
      await page.waitForTimeout(WAIT.SHORT);
      await nextStepButton(page, true, path, screenName);
    }
    }

    // Test completed successfully
    const endTime = new Date().toISOString();
    logs.push(`[test-success] ${endTime} – OK`);
    logs.push('✅ TEST COMPLETATO CON SUCCESSO');
    console.log('✅ TEST COMPLETATO CON SUCCESSO');

  } catch (error) {
    // Test failed - save error logs and generate Excel
    const endTime = new Date().toISOString();
    const errorMsg = (error as any)?.message || String(error);
    logs.push(`[test-error] ${endTime} – ${errorMsg}`);
    logs.push(`❌ Error: ${errorMsg}`);

    throw error; // Re-throw to mark test as failed
  }
});