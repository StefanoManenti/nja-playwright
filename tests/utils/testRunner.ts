import { Page } from '@playwright/test';
import { test } from './loggedTest';
import { DEFAULT_DEVICE_PHONE, DEFAULT_DEVICE_TABLET, StepType } from '../types/stepType';
import {
  addScriptRuntime,
  autoFillForm,
  checkCookie,
  clearScreenshots,
  dialogStep,
  enableTestConsole,
  failedError,
  loginArea,
  nextStepButton,
  pageHasStep,
  screenShot,
  WAIT,
} from './utility';

interface TestConfig {
  testName: string;
  startUrl: string;
  stepsDesktop: StepType[];
  stepsTablet: StepType[];
  stepsPhone: StepType[];
  prefix: string;
  subFolder: string;
  useLoginArea?: boolean;
}

interface RunTestConfig extends Omit<TestConfig, 'stepsDesktop' | 'stepsTablet' | 'stepsPhone'> {
  stepList: StepType[];
  deviceType: 'desktop' | 'tablet' | 'mobile';
}

async function runTestFlow(
  page: Page,
  config: RunTestConfig
): Promise<void> {
  const { stepList, startUrl, prefix, subFolder, useLoginArea = true } = config;

  const deviceSuffix = `_${config.deviceType.toUpperCase()}`;
  const finalSubFolder = subFolder + deviceSuffix;
  const path = `tests/screens/${finalSubFolder}`;
  const screenName = finalSubFolder.toLowerCase() + '_';

  await page.goto(startUrl);
  await page.waitForTimeout(WAIT.LONG);
  await clearScreenshots(path);

  if (useLoginArea) {
    await checkCookie(page);
    await loginArea(page, path, screenName);
  }

  for (const [index, s] of stepList.entries()) {
    if (index === 0) {
      await addScriptRuntime(
        page,
        `window.collaudo(); window.bypassChecks = true; window.bypassChecks.current = true;`
      );
      await enableTestConsole(page);
    }

    const isStep = await pageHasStep(page, s.step, path, screenName);
    if (!isStep) {
      await screenShot(page, path, screenName + `ERROR_STEP_${s.step}_`);
      failedError(`❌ Errore: Step ["${String(s.step)}"] non raggiungibile`);
    }

    await page.waitForTimeout(WAIT.SCREENSHOT);
    await autoFillForm(page, path, screenName, (s as any).data);
    if (index !== stepList.length - 1) {
      await page.waitForTimeout(WAIT.SHORT);
      await nextStepButton(page, true, path, screenName);
    }
  }

  console.log('✅ TEST COMPLETATO CON SUCCESSO');
}

export function createDeviceTests(config: TestConfig) {
  // Desktop version
  test(`${config.testName}`, async ({ page }) => {
    await runTestFlow(page, {
      ...config,
      stepList: config.stepsDesktop,
      deviceType: 'desktop'
    });
  });

  // Tablet version
  test(`${config.testName} - Tablet`, async ({ page }) => {
    await runTestFlow(page, {
      ...config,
      stepList: config.stepsTablet,
      deviceType: 'tablet'
    });
  }, { mobileTest: true, device: DEFAULT_DEVICE_TABLET });

  // Mobile version
  test(`${config.testName} - Mobile`, async ({ page }) => {
    await runTestFlow(page, {
      ...config,
      stepList: config.stepsPhone,
      deviceType: 'mobile'
    });
  }, { mobileTest: true, device: DEFAULT_DEVICE_PHONE });
}
