//import { test } from "@playwright/test";
import { test } from "./utils/loggedTest";import fs from "fs";
const url = `http://localhost:4200/configura-offerta?codiceProdotto=BASE_LTCASAV-GTCASAV&codiceCanale=CWEB3EGP&codiceTpCanale=WB&direct-debit=true&bill-type=digitale&commodity=gaseluce&opzione=bioraria&salesProcess=SWITCH_IN`;

const listCoupon = [
  "ENERGIADUAL",
  "FORK24",
  "LS005",
  "LS006",
  "GS001",
  "GS004",
  "GS009",
  "GS007",
  "GS003",
  "LS009",
  "LS010",
  "GS005",
  "GS006",
  "LS007",
  "LS008",
  "LS002A",
  "GS002A",
];
let testResults = <any>[];

const basePath = "tests/screens/COUPON";

// Creazione della cartella principale
if (!fs.existsSync(basePath)) {
  fs.mkdirSync(basePath);
}

// Describe per garantire un test alla volta
test.describe.serial("Coupons", () => {
  listCoupon.forEach((code) => {
    let hasConfirmModal = false;

    test(`Test for Copon ${code}`, async ({ page }) => {
      // Apri la pagina
      await page.goto(url);
      // Determina la cartella di destinazione
      const couponPath = `${basePath}/${code}`;
      if (!fs.existsSync(couponPath)) {
        fs.mkdirSync(couponPath);
      }

      // Nascondi l'header e la pulsantiera fissata in basso per screenshot migliori
      await page.addStyleTag({
        content: "header { display: none !important; }",
      });
      await page.addStyleTag({
        content: "div[class*='_stickyBottom'] { display: none !important; }",
      });

      // Trova il primo div genitore di un h3 contenente "Codice promozionale e sconti"
      let sectionParent = await page
        .locator("h3")
        .filter({ hasText: "Codice promozionale e sconti" })
        .locator("xpath=ancestor::div[1]");

      // Identifica l'input e immetti il coupon
      const input = await sectionParent.locator(
        'input[placeholder="Inserisci codice"]'
      );
      await input.fill(code);

      // Screenshot inputazione del codice coupon
      await page.screenshot({
        fullPage: true,
        path: `${couponPath}/1_input_coupon.png`,
      });

      // Aspetta
      await page.waitForTimeout(500);

      // Verifica la comparsa del pulsante applica
      const applyButton = await sectionParent.locator(
        'button:has-text("Applica")'
      );
      if (await applyButton.isVisible()) {
        // Clicca su Applica
        await applyButton.click();

        // Aspetta
        await page.waitForTimeout(2000);

        // Verifica se compare un modale
        const modal = await page.locator("div[class*='_dialog']");
        if (await modal.isVisible()) {
          // Controllo se è un modale di errore in base al titolo
          let modalTitle = await modal
            .locator("h1")
            .filter({ hasText: "Servizio non disponibile" });

          // Se lo è --> Errore
          if (await modalTitle.isVisible()) {
            // Screenshot modal error
            await page.screenshot({
              fullPage: true,
              path: `${couponPath}/2_error.png`,
            });

            // Test KO
            testResults.push({
              coupon: code,
              status: "error",
            });

            // Aspetta
            await page.waitForTimeout(500);

            // Intercessa pulsante di chiusura del modale e cliccaci su
            const closeModal = await modal.locator(
              "button[class*='_closeButton']"
            );
            if (await closeModal.isVisible()) {
              closeModal.click();
              await page.waitForTimeout(500);
            }
          }
          // Se non lo è
          else {
            //allora controlla che sia il modale di conferma
            modalTitle = await modal
              .locator("h1")
              .filter({ hasText: "Accetta dichiarazione su dati e requisiti" });

            if (await modalTitle.isVisible()) {
              hasConfirmModal = true;

              // Intercetta e clicca sul checkbox di conferma
              const checkBoxArea = await modal.locator(
                "div[class*='_formFieldCheckboxContainer']"
              );
              if (await checkBoxArea.isVisible()) {
                checkBoxArea.click();

                // Aspetta
                await page.waitForTimeout(1000);

                // Screenshot modal confirm con checkbox spuntato
                await page.screenshot({
                  fullPage: true,
                  path: `${couponPath}/2_dialog_confirm.png`,
                });

                // Intercetta e clicca sul bottone di conferma
                const submitModal = await modal.locator(
                  "button[class*='primary']"
                );
                if (await submitModal.isVisible()) {
                  submitModal.click();

                  controlResetButtonCoupon(
                    page,
                    sectionParent,
                    code,
                    couponPath,
                    hasConfirmModal
                  );
                } else {
                  throw new Error(`Modal confirm button non trovato`);
                }
              }
            }
          }
        }

        // SUCCESS --> Il Coupon è valido
        else {
          controlResetButtonCoupon(
            page,
            sectionParent,
            code,
            couponPath,
            hasConfirmModal
          );
        }
      }
    });
  });

  // Logga i risultati dei test
  test.afterAll(() => {
    console.log("Test Results:", testResults);
  });
});

async function controlResetButtonCoupon(
  page,
  sectionParent,
  code,
  couponPath,
  hasConfirmModal
) {
  // Aspetta
  await page.waitForTimeout(1000);

  // Indentifica il Reset button coupon
  const resetButton = await sectionParent.locator(
    "button[class*='resetButton']"
  );
  if (await resetButton.isVisible()) {
    // Screenshot finale
    const screenName = hasConfirmModal ? "3_success.png" : "2_success.png";
    await page.screenshot({
      fullPage: true,
      path: `${couponPath}/${screenName}`,
    });

    // Test OK
    testResults.push({
      coupon: code,
      status: "success",
    });

    // Click su Reset button coupon
    await resetButton.click();
  } else {
    throw new Error(`Reset button non trovato`);
  }
}
