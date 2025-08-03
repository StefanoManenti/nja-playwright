/*
export function checkRadio(
  page,
  fieldsetLocator,
  checkIndex: number,
  path: string,
  screenName: string,
  index: number
): Promise<boolean> {
  return new Promise(async (resolve) => {
    const label = await fieldsetLocator.locator("label").nth(checkIndex);
    if (!label) return resolve(false);

    const labelStyle = await page.evaluate(
      (el) => el ? getComputedStyle(el).backgroundColor : "",
      await label.elementHandle()
    );

    if (labelStyle !== "rgb(255, 255, 255)") {
      console.log(
        `Radio ${checkIndex} già spuntato: ${await label.textContent()}`
      );
      resolve(true);
    } else {
      await label.click();
      await page.waitForTimeout(WAIT.SHORT);

      const dialogLocator = await page.locator("div[class*='_dialog_']");
      if (await dialogLocator.isVisible()) {
        await screenShot(page, path, screenName);
        const button = await dialogLocator
          .locator("button[type='button'].primary")
          .first();
        if (await button.isVisible()) {
          await page.waitForTimeout(WAIT.SHORT);
          await button.click();
        }
      }

      console.log(`✅ Radio button selezionato: ${await label.textContent()}`);
      await page.waitForTimeout(WAIT.SHORT);
      await screenShot(page, path, screenName);
      resolve(true);
    }
  });
}

export function checkAllFields(
  page,
  fieldsetLocator,
  path: string,
  screenName: string,
  index: number
) {
  return new Promise(async (resolve) => {
    const labels = await fieldsetLocator.locator("label");
    const labelCount = await labels.count();

    for (let i = 0; i < labelCount; i++) {
      const label = labels.nth(i);
      const labelStyle = await page.evaluate(
        (el) => getComputedStyle(el).backgroundColor,
        await label.elementHandle()
      );

      if (labelStyle !== "rgb(255, 255, 255)") {
        console.log(`Checkbox ${i} già spuntato: ${await label.textContent()}`);
      } else {
        await page.waitForTimeout(WAIT.SHORT);
        await label.click();
        await page.waitForTimeout(WAIT.SHORT);

        const dialogLocator = await page.locator("div[class*='_dialog_']");
        if (await dialogLocator.isVisible()) {
          await screenShot(page, path, screenName);
          const button = await dialogLocator
            .locator("button[type='button'].primary")
            .first();
          if (await button.isVisible()) {
            //await page.waitForTimeout(WAIT.SHORT);
            await button.click();
            await page.waitForTimeout(WAIT.SHORT);
            await screenShot(page, path, screenName);
          }
        }
      }
    }

    await page.waitForTimeout(WAIT.SHORT);
    await screenShot(page, path, screenName);
    console.log("✅ Tutti i checkbox sono stati spuntati correttamente");
    resolve(true);
  });
}
*/