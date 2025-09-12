import {
  ElementHandle,
  Locator,
  Page,
  Request,
  Response,
} from "@playwright/test";
import fs from "fs";
import path from "path";
import { ValuesOverrides } from "../types/stepType";
import { MOCKS } from "./Mock";

export enum WAIT {
  SCREENSHOT = 300,
  SHORT = 500,
  MID = 1500,
  DEFAULT = 2000,
  LONG = 4000,
}
export const STEP_TO_SKIP = [];

export async function addScriptInit(page: Page, script: string): Promise<void> {
  await page.addInitScript({ content: script });
}

export async function addScriptRuntime(
  page: Page,
  script: any | string | Function
): Promise<void> {
  await page.evaluate(script);
}
export async function clearScreenshots(
  path: string,
  createFolder: boolean = true
) {
  const exists = await fs.promises
    .access(path)
    .then(() => true)
    .catch(() => false);
  if (!exists && createFolder) {
    console.log("Create Screenshots Folder", path);
    await fs.promises.mkdir(path, { recursive: true });
  }
  if (exists) {
    const files = await fs.promises.readdir(path);
    for (const file of files) {
      await fs.promises.unlink(`${path}/${file}`);
    }
  }
}

export function countScreenshots(path: string): number {
  return fs.readdirSync(path).filter((file) => file.endsWith(".png")).length;
}

export async function screenShot(page, path: string, screenName: string) {
  const exists = await fs.promises
    .access(path)
    .then(() => true)
    .catch(() => false);
  if (!exists) {
    await fs.promises.mkdir(path, { recursive: true });
  }

  const index = 1 + (await countScreenshots(path));
  const screenFileName = `${path}/${screenName}${index}.png`;
  const currentWidth = await page.evaluate(() => window.innerWidth);
  const currentHeight = await page.evaluate(
    () => window.innerHeight || document.body.clientHeight
  );

  const fullHeight = await page.evaluate(() => {
    return Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    );
  });

  await page.setViewportSize({ width: currentWidth, height: fullHeight });
  await page.waitForTimeout(WAIT.SCREENSHOT);

  const completedSceen = await page.screenshot({
    fullPage: true,
    path: screenFileName,
  });

  await page.setViewportSize({ width: currentWidth, height: currentHeight });

  return completedSceen;
}

export async function pageHasStep(page, stepName: string | string[] | false) {
  await page.waitForTimeout(WAIT.MID);

  // Skip controllo se stepName = false
  if (stepName === false) return true;

  // Verifica che <body data-meta-step="stepName"> = stepName
  const body = await page.$("body");
  let metaStep = await body.getAttribute("data-meta-step");
  if (!metaStep) {
    failedError("data-meta-step non trovato");
    return false;
  }
  metaStep = metaStep.toLowerCase();
  if (!Array.isArray(stepName)) {
    stepName = [stepName];
  }
  stepName = stepName.map((s) => s.toLowerCase());
  console.log(
    "metaStep " + metaStep + " vs stepName [" + stepName.join(",") + "]"
  );
  return stepName.includes(metaStep);
}

export async function pageHasTitle(page, title: string[] | false) {
  // Skip controllo titolo pagina se tile false
  if (title === false) return true;

  // Se la pagina non ha un form dentro al main allora non è una pagina compilabile, quindi skip
  const hasMain = (await page.locator("main").count()) > 0;
  const hasForm = hasMain && (await page.locator("main form").count()) > 0;
  if (!hasForm) {
    return true;
  }

  //altrimenti controlla il titolo in h1 o h2 in clausola OR
  let hasTitle: boolean[] = [];
  for (const t of title) {
    const formLocator = await page.locator("h1, h2").filter({ hasText: t });
    //.locator("xpath=ancestor::form[1]");
    hasTitle.push(!!formLocator && (await formLocator.isVisible()));
  }
  return hasTitle.some((v) => v);
}

export async function pressTab(page: Page, locator: Locator) {
  const handle = await locator.elementHandle();
  if (handle) {
    await page.evaluate((el) => {
      el.focus();
      el.blur();
    }, handle);
  }
  await locator.press("Tab");
}

export async function clearErrors(page: Page) {
  const warningConsoleElements = await page.$$("div.warning-console");
  if (warningConsoleElements.length) {
    for (const el of warningConsoleElements) {
      await el.evaluate((el) => el.remove());
    }
  }
  const errorConsoleElements = await page.$$("div.error-console");
  if (errorConsoleElements.length) {
    for (const el of errorConsoleElements) {
      await el.evaluate((el) => el.remove());
    }
  }

  await page.evaluate(() => {
    document.body.style.height = "auto";
  });
}
export async function forceBlur(
  page: Page,
  handle?: ElementHandle<unknown> | null
) {
  // prova a inviare blur/focusout al nodo specifico, senza ipotesi di tipo
  if (handle) {
    try {
      await handle.evaluate((el: any) => {
        el.dispatchEvent(
          new FocusEvent("blur", { bubbles: true, cancelable: true })
        );
        el.dispatchEvent(
          new FocusEvent("focusout", { bubbles: true, cancelable: true })
        );
        el.blur?.();
      });
    } catch {}
  }

  // defocalizza l'activeElement se ancora focussato
  try {
    await page.evaluate(() => {
      const a = document.activeElement as any;
      if (a && a !== document.body) a.blur?.();
    });
  } catch {}

  // fallback robusto (desktop + mobile/WebKit)
  try {
    await page.evaluate(() => {
      let trap = document.getElementById(
        "__blur_trap__"
      ) as HTMLInputElement | null;
      if (!trap) {
        trap = document.createElement("input");
        trap.type = "text";
        trap.id = "__blur_trap__";
        Object.assign(trap.style, {
          position: "fixed",
          left: "-99999px",
          top: "0",
          opacity: "0",
          width: "1px",
          height: "1px",
          zIndex: "-1",
        } as CSSStyleDeclaration);
        document.body.appendChild(trap);
      }
      trap.focus();
    });
  } catch {}

  await page.waitForTimeout(10);
}

export async function addCss(page: Page) {
  await page.evaluate(() => {
    const style = document.createElement("style");
    style.innerHTML = `
    .error-console {
      display:block;
      font-weight: bold;
      font-size:16px;
      line-height:20px;
      padding: 10px;
      border: 4px solid #f00;
      position: relative;
      bottom: 0px;
      z-index: 10;
      min-height:20px;
    }
    .warning-console {
      display:block;
      font-weight: bold;
      font-size:16px;
      line-height:20px;
      padding: 10px;
      border: 4px solid #fb0;
      position: relative;
      bottom: 0px;
      z-index: 10;
      min-height:20px;
    }`;
    document.head.appendChild(style);
  });
}

const seenConsoleErrors = new Set<string>();
function normalizeConsoleMessage(raw: string): string {
  return (
    raw
      .toLowerCase()
      // rimuovi linee di stack
      .split("\n")
      .filter((l) => !/^\s*at\s+/i.test(l))
      .join(" ")
      // rimuovi url e path
      .replace(/\bhttps?:\/\/\S+/g, "")
      .replace(/[a-z]:[\\/][\w\-./\\]+/gi, "") // C:\path\file.js:123:45
      .replace(/\/[\w\-./]+/g, "") // /path/file.js:123:45
      // normalizza numeri, hex, uuid
      .replace(/\b0x[0-9a-f]+\b/gi, "")
      .replace(
        /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi,
        ""
      )
      .replace(/\b\d+\b/g, "")
      // togli punteggiatura/duplicati spazi
      .replace(/[^\w\s]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}
type PageWithFlag = Page & { _consoleListenerAttached?: boolean };

export function attachConsoleOverlay(page: PageWithFlag) {
  if (page._consoleListenerAttached) return;
  page._consoleListenerAttached = true;

  page.on("console", async (msg) => {
    if (msg.type() !== "error") return;

    const msgText = msg.text(); // sync
    const classErrorConsole = msgText.includes("Warning:")
      ? "warning-console"
      : "error-console";

    const key = normalizeConsoleMessage(msgText);
    if (seenConsoleErrors.has(key)) return;

    seenConsoleErrors.add(key);

    // (facoltativo) escape per sicurezza XSS
    const safeHTML = msgText
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

    await page.evaluate(
      ({ classErrorConsole, safeHTML }) => {
        const el = document.createElement("div");
        el.className = classErrorConsole;
        el.innerHTML = safeHTML; // ora è safe
        const footer = document.querySelector("footer");
        if (footer) {
          footer.insertAdjacentElement("afterend", el);
        } else {
          document.body.appendChild(el);
        }
      },
      { classErrorConsole, safeHTML }
    );
  });
}
export function enableTestConsole(page: PageWithFlag) {
  attachConsoleOverlay(page);
  addCss(page);
}
export function resetTestConsole() {
  seenConsoleErrors.clear();
}

export async function nextStepButton(
  page,
  screenOnLoaded: boolean,
  path: string,
  screenName: string,
  errorActions?: any
) {
  // ✅ Abilita overlay e stile (idempotente)
  enableTestConsole(page);

  // Eventuali dialog al caricamento della pagina
  await dialogStep(page, path, screenName);

  const submitButton = await page.locator(
    'button[type="submit"], input[type="submit"]'
  );

  // Trigger di controllo per forzare onTouch su useForm
  const inputs = await page.locator("form input");
  const lastInput = inputs.last();
  if (await lastInput.isVisible()) {
    await forceBlur(page, lastInput);
    await page.waitForTimeout(WAIT.SHORT);
  }

  if (await submitButton.isVisible()) {
    if ((await submitButton.getAttribute("disabled")) !== null) {
      failedError(
        "Pulsante di invio disabilitato, cliccato prima di completare tutto il form"
      );
    }

    resetTestConsole();

    await submitButton.click();

    await page.waitForTimeout(WAIT.MID);
    await dialogStep(page, path, screenName);

    if (screenOnLoaded) {
      await screenShot(page, path, screenName);
      await clearErrors(page); // rimuove i banner visivi dalla pagina
    }
  } else {
    const proseguiButton = page.locator(
      'button:has-text("Prosegui"), a:has-text("Prosegui")'
    );
    if (await proseguiButton.isVisible()) {
      resetTestConsole();

      await proseguiButton.click();

      await page.waitForTimeout(WAIT.MID);
      await dialogStep(page, path, screenName);

      if (screenOnLoaded) {
        await screenShot(page, path, screenName);
      }
    } else {
      failedError("Pulsante di prosegui non trovato");
    }
  }

  await clearErrors(page); // pulizia banner prima di uscire
}

export async function dialogStep(page, path: string, screenName: string) {
  await page.waitForTimeout(WAIT.LONG);

  // Cookie banner
  const cookieButton = await page.locator("button#footer_tc_privacy_button_3");
  if (await cookieButton.isVisible()) {
    console.log("Trovato Cookie banner");
    await cookieButton.click();
    console.log("Click Accettata tutti Cookie banner");
    await page.waitForTimeout(WAIT.SHORT);
  } else {
    console.log("Cookie banner NON trovato --> Continue");
  }

  let dialogLocator = await page.locator("div[class*='_dialog_']");
  let dialogCount = await dialogLocator.count();
  while (dialogCount > 0) {
    const visibleDialog = await dialogLocator.first();
    if (!(await visibleDialog.isVisible())) break;

    const dialogText = await visibleDialog.locator("h1").first().textContent();

    if (dialogText) console.log("➡️  Dialog Title: " + dialogText);

    // dialog OTP
    if (
      dialogText &&
      dialogText.includes("Conferma il tuo numero di telefono")
    ) {
      const otpInput = await visibleDialog.locator('input[type="text"]');
      if (await otpInput.isVisible()) {
        await otpInput.fill(MOCKS.otp);
        await screenShot(page, path, screenName);
        await page.waitForTimeout(WAIT.SHORT);
      }
    }

    // dialog Scrollable
    const scrollableBox = await visibleDialog.locator(
      "[class*='_scrollable_']"
    );
    if (await scrollableBox.isVisible()) {
      await scrollableBox.evaluate((el) => {
        el.scrollTo(0, el.scrollHeight);
      });
      await page.waitForTimeout(WAIT.SHORT);
      await screenShot(page, path, screenName);
    }

    //TODO altri modali con input

    const button = await visibleDialog.locator("button.primary").first();
    if (await button.isVisible()) {
      await button.click();
    }

    await page.waitForTimeout(WAIT.LONG);
    dialogCount = await dialogLocator.count();
  }
}

export function failedError(errorMsg?: string) {
  throw new Error(errorMsg ?? "Step non trovato");
}
export function getToday() {
  const today = new Date();
  const day = today.getDate().toString().padStart(2, "0");
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const year = today.getFullYear().toString().padStart(4, "0");
  return `${day}/${month}/${year}`;
}
export function getTomorrow() {
  const today = new Date();
  const tomorrow = new Date(today.setDate(today.getDate() + 1));
  const day = tomorrow.getDate().toString().padStart(2, "0");
  const month = (tomorrow.getMonth() + 1).toString().padStart(2, "0");
  const year = tomorrow.getFullYear().toString().padStart(4, "0");
  return `${day}/${month}/${year}`;
}

// Assicura che la cartella esista
export async function ensureFolderExists(folder: string) {
  if (
    !(await fs.promises
      .access(folder)
      .then(() => true)
      .catch(() => false))
  ) {
    await fs.promises.mkdir(folder, { recursive: true });
  }
}

type LoggingOptions = {
  logBodies?: boolean; // abilita logging body request/response | default: false
  prettyJson?: boolean; // JSON formattato | default: true
  bodyMaxLen?: number; // default: 10000 chars
  filterUrl?: (url: string) => boolean; // default: (url)=>true
  redact?: (s: string) => string; // default: built-in redactor
};

const DEFAULT_OPTS: LoggingOptions = {
  logBodies: false,
  prettyJson: true,
  bodyMaxLen: 10000,
  filterUrl: () => true,
  redact: defaultRedact,
};

// semplice redactor: nasconde token/authorization e query sensibili
function defaultRedact(s: string): string {
  if (!s) return s;
  let out = s
    .replace(/(authorization:\s*bearer\s+)[^\s\r\n]+/gi, "$1***")
    .replace(/(x-api-key:\s*)[^\s\r\n]+/gi, "$1***")
    .replace(
      /([?&](?:token|apikey|api_key|auth|access_token)=)[^&\s]+/gi,
      "$1***"
    );
  // taglia payload troppo lunghi
  if (out.length > 100000) out = out.slice(0, 100000) + "…";
  return out;
}

export function setupPageLogging(
  page: Page,
  buffer: string[],
  options: Partial<LoggingOptions> = {}
) {
  // evita doppio attach
  if ((page as any).__loggingAttached) return true;
  (page as any).__loggingAttached = true;

  const opts: LoggingOptions = { ...DEFAULT_OPTS, ...options };

  // Correlazione e durata
  let reqSeq = 0;
  const startTimes = new Map<Request, number>();
  const ids = new Map<Request, string>();

  const now = () => Date.now();
  const ms = (t: number) => `${t}ms`;

  // Console browser con location
  page.on("console", (msg) => {
    const loc = msg.location();
    const locStr = loc?.url
      ? ` @ ${loc.url}:${loc.lineNumber ?? 0}:${loc.columnNumber ?? 0}`
      : "";
    if (msg.type() === "error") {
      buffer.push(`[page-error] ${msg.text()}${locStr}`);
    } else {
      buffer.push(`[browser-console] ${msg.type()}: ${msg.text()}${locStr}`);
    }
  });

  // Uncaught errors in pagina
  page.on("pageerror", (err) => {
    buffer.push(`[pageexception] ${err.name}: ${err.message}`);
  });

  // REQUEST
  page.on("request", async (request) => {
    const url = request.url();
    if (!opts.filterUrl!(url)) return;

    const id = `#${++reqSeq}`;
    ids.set(request, id);
    startTimes.set(request, now());

    const method = request.method();
    const rt = request.resourceType();
    let line = `[api-request ${id}] ${method} ${opts.redact!(url)} (${rt})`;

    // opzionale: log body della request (JSON) senza bloccare
    if (opts.logBodies) {
      try {
        const post = request.postData();
        if (post) {
          const trimmed = trimAndMaybePretty(post, opts);
          line += ` | req-body: ${trimmed}`;
        }
      } catch {}
    }
    buffer.push(line);
  });

  // RESPONSE (success)
  page.on("response", async (response: Response) => {
    try {
      const req = response.request();
      const url = response.url();
      if (!opts.filterUrl!(url)) return;

      const id = ids.get(req) ?? "?";
      const status = response.status();
      const statusText = response.statusText?.() ?? "";
      const started = startTimes.get(req) ?? now();
      const dur = ms(now() - started);

      // redirect chain (se presente)
      const from = req.redirectedFrom();
      const chain = from ? " redirected" : "";

      let line = `[api-response ${id}] ${req.method()} ${opts.redact!(
        url
      )} -> ${status} ${statusText}${chain} in ${dur}`;

      // opzionale: log JSON response body
      if (opts.logBodies) {
        const ct = (response.headers()["content-type"] || "").toLowerCase();
        if (ct.includes("application/json")) {
          try {
            const bodyObj = await response.json();
            const pretty = formatJson(bodyObj, opts);
            line += ` | res-body: ${pretty}`;
          } catch (err: any) {
            line += ` | res-body-read-error: ${
              err?.message || "unknown error"
            }`;
          }
        } else {
          // prova a leggere testo breve (evita binari)
          if (ct.startsWith("text/") || ct.includes("json")) {
            try {
              const text = await response.text();
              line += ` | res-text: ${trimAndMaybePretty(text, opts)}`;
            } catch {}
          }
        }
      }

      buffer.push(line);
    } catch (err: any) {
      // Se fallisce la lettura di response/request/url
      try {
        buffer.push(
          `[api-response-error] ${response.url()} -> ${
            err?.message || "unknown error"
          }`
        );
      } catch {
        buffer.push(
          `[api-response-error] <unavailable-url> -> ${
            err?.message || "unknown error"
          }`
        );
      }
    }
  });

  // FAIL (reti/timeout/abort)
  page.on("requestfailed", (request) => {
    const url = request.url();
    if (!opts.filterUrl!(url)) return;
    const id = ids.get(request) ?? "?";
    const started = startTimes.get(request) ?? now();
    const dur = ms(now() - started);
    buffer.push(
      `[api-failed ${id}] ${request.method()} ${opts.redact!(url)} -> ${
        request.failure()?.errorText || "failed"
      } in ${dur}`
    );
  });

  // FINISH (chiusura request; utile se vuoi pulire mappe)
  page.on("requestfinished", (request) => {
    startTimes.delete(request);
    ids.delete(request);
  });

  return true;
}

// Helpers

function trimAndMaybePretty(s: string, opts: LoggingOptions): string {
  const redacted = opts.redact!(s);
  const limited =
    redacted.length > (opts.bodyMaxLen || 0)
      ? redacted.slice(0, opts.bodyMaxLen) + "…"
      : redacted;
  // prova a pretty-print se è JSON
  if (opts.prettyJson) {
    try {
      return JSON.stringify(JSON.parse(limited), null, 2);
    } catch {
      return limited;
    }
  }
  return limited;
}

function formatJson(obj: any, opts: LoggingOptions): string {
  const raw = opts.prettyJson
    ? JSON.stringify(obj, null, 2)
    : JSON.stringify(obj);
  const red = opts.redact!(raw);
  return red.length > (opts.bodyMaxLen || 0)
    ? red.slice(0, opts.bodyMaxLen) + "…"
    : red;
}

// Scrive il buffer su file
export async function flushLogsToFile(
  buffer: string[],
  folder: string,
  fileName: string
) {
  await ensureFolderExists(folder);
  const filePath = path.join(folder, fileName);
  const content = buffer.join("\n") + "\n";
  await fs.promises.writeFile(filePath, content, { encoding: "utf-8" });
}
// Cerca ricorsivamente una classe nei genitori, partendo da un elemento

export const notSelectedStyle = "rgb(255, 255, 255)";

export async function autoFillForm(
  page: Page,
  path: string,
  screenName: string,
  valuesOverrides: ValuesOverrides = {}
): Promise<void> {
  const form = page.locator("form").first();
  if (!(await form.isVisible())) {
    return;
    //throw new Error("❌ Nessun form visibile trovato nella pagina.");
  }

  const processed = new Set<string>();
  let didFill: boolean;

  // Aggiungi un oggetto per tenere traccia dei radio già processati per nome
  const radioProcessed = new Set<string>();

  do {
    didFill = false;

    // 1) Recupera tutti i campi potenzialmente compilabili
    const formFields = await form
      .locator(
        [
          "input:not([type='hidden']):not([disabled]):not([readonly])",
          "textarea:not([disabled]):not([readonly])",
          "select:not([disabled]):not([readonly])",
          "button[role='combobox']:not([disabled]):not([readonly])",
        ].join(", ")
      )
      .elementHandles();

    console.log(`🔍 Trovati ${formFields.length} campi.`);

    // 2) Cicla ciascun campo non ancora processato
    for (const handle of formFields) {
      let indexSelect = 0;

      let isCalendar = false;
      isCalendar = await handle.evaluate((el: any) => {
        if (el.closest('[class*="calendarWrapper"]')) return true;
        else return false;
      });
      //if (isCalendar) console.log("CALENDAR FIELD TROVATO");
      //else console.log("CALENDAR FIELD NON TROVATO");

      const isSelect = await handle.evaluate((el: any) =>
        el.classList.contains("base-Select-root")
      );
      if (isSelect) {
        const handles = await page.$$("button[role='combobox']");
        indexSelect = await page.evaluate(
          (args) => {
            const [handles, el] = args;
            if (Array.isArray(handles)) {
              return handles.indexOf(el as any);
            }
            return -1;
          },
          [handles, handle]
        );
      }

      let fillValue: string | undefined;
      const tag = await handle.evaluate((el: any) => el.tagName.toLowerCase());
      const type = (await handle.getAttribute("type")) || tag;
      let name =
        (await handle.getAttribute("name")) ||
        (await handle.getAttribute("formcontrolname")) ||
        (await handle.getAttribute("id")) ||
        "";

      if (isSelect) {
        const parentField = await handle.evaluateHandle((el: any) =>
          el.closest("fieldset, div")
        );
        if (parentField) {
          const parentElement = parentField.asElement();
          if (parentElement) {
            const ariaHiddenInput = await parentElement.$(
              "input[aria-hidden='true']"
            );
            if (ariaHiddenInput) {
              fillValue = await page.evaluate(
                (el) => (el as HTMLInputElement).value,
                ariaHiddenInput
              );
            }

            const label = await parentElement.$("label");
            console.log("isSelect: " + label);

            if (label) {
              const labelText = await label.textContent();
              name = (labelText ?? "").toLowerCase().replace(/\s/g, "_");
            }
          }
        }
      }
      const valueAttr = (await handle.getAttribute("value")) || "";

      // Genera una chiave univoca per evitare doppia compilazione
      const key = `${tag}::${name}::${valueAttr}`;
      if (!name) {
        console.log(`⚠️ Campo senza name (${tag}), skip.`);
        continue;
      }
      if (processed.has(key)) continue;
      if (!(await handle.isVisible())) {
        console.log(`⚠️ Campo ${name} non visibile, skip.`);
        processed.add(key);
        continue;
      }

      // Segnalo che sto per processarlo
      processed.add(key);
      didFill = true;

      // Determina il valore override / mock
      const override = valuesOverrides[name];

      if (isCalendar) {
        handle.focus();
        await page.waitForTimeout(WAIT.SHORT);
        const calendarElement = await page.$("div[class*='react-calendar']");
        if (calendarElement) {
          const dayButtons = await calendarElement.$$(
            "button:not([disabled])[class*='react-calendar__tile'][class*='react-calendar__month-view__days__day']"
          );
          if (dayButtons.length) {
            await dayButtons[0].click();
          }
        }
      } else {
        if (!isSelect) {
          switch (type) {
            case "text":
            case "email":
            case "tel":
            case "password":
              {
                const aria =
                  (await handle.getAttribute("aria-describedby")) || "";
                const isAddress =
                  aria.includes("address") ||
                  name.toLowerCase().includes("address");

                const isFirstName =
                  name.toLowerCase().includes("givenname") ||
                  name.toLowerCase().includes("firstname");

                const isLastName =
                  name.toLowerCase().includes("familyname") ||
                  name.toLowerCase().includes("lastname");

                const isCodiceFiscale =
                  name.toLowerCase().includes("taxcode") ||
                  name.toLowerCase().includes("taxid") ||
                  name.toLowerCase().includes("codice fiscale");
                name.toLowerCase().includes("codicefiscale");

                const isPartitaIva =
                  name.toLowerCase().includes("vatnumber") ||
                  name.toLowerCase().includes("partita iva");

                const isSdi = name.toLowerCase().includes("businesssdi");

                const isPrefixPhone =
                  name.toLowerCase().includes("businessphoneprefix") ||
                  name.toLowerCase().includes("telephonecountrycode") ||
                  name.toLowerCase().includes("contactphonecountrycode");

                const isPhone =
                  !isPrefixPhone &&
                  (aria.includes("phone") ||
                    name.toLowerCase().includes("phone"));

                const isDateField =
                  (await handle.getAttribute("placeholder")) === "gg/mm/aaaa";

                const isIban =
                  aria.includes("iban") || name.toLowerCase().includes("iban");

                const isSmc =
                  aria.includes("annualconsumption") ||
                  name.toLowerCase().includes("annualconsumption");

                const isAteco =
                  aria.includes("atecorecord") ||
                  name.toLowerCase().includes("atecorecord") ||
                  aria.includes("ateco") ||
                  name.toLowerCase().includes("ateco");

                const isPod =
                  aria.includes("pod") || name.toLowerCase().includes("pod");

                const isPdr =
                  aria.includes("pdr") || name.toLowerCase().includes("pdr");

                switch (true) {
                  case typeof override === "string":
                    fillValue = override;
                    break;
                  case isFirstName:
                    fillValue = MOCKS.firstname;
                    break;
                  case isLastName:
                    fillValue = MOCKS.lastname;
                    break;
                  case isAddress:
                    fillValue = MOCKS.address;
                    break;
                  case isPrefixPhone:
                    fillValue = MOCKS.prefixTel;
                    break;
                  case isPhone:
                    fillValue = MOCKS.tel;
                    break;
                  case isCodiceFiscale:
                    fillValue = MOCKS.codiceFiscale;
                    break;
                  case isPartitaIva:
                    fillValue = MOCKS.partitaIva;
                    break;
                  case isSdi:
                    fillValue = MOCKS.sdi;
                    break;
                  case isIban:
                    fillValue = MOCKS.iban;
                    break;
                  case isAteco:
                    fillValue = MOCKS.ateco;
                    break;
                  case isPod:
                    fillValue = MOCKS.pod;
                    break;
                  case isPdr:
                    fillValue = MOCKS.pdr;
                    break;
                  case isDateField:
                    fillValue = getToday();
                    break;
                  case isSmc:
                    fillValue = MOCKS.smc;
                    break;
                  default:
                    fillValue = MOCKS[type] ?? MOCKS.text;
                }

                console.log(`✏️ [${type}] ${name}: "${fillValue}"`);
                if (!valueAttr) {
                  await handle.fill(fillValue!);
                } else {
                  // Forza reinserimento valore di default
                  await handle.fill(valueAttr!);
                  console.log(
                    `⚠️ Campo ${name} già valorizzato con "${valueAttr}", skip.`
                  );
                }

                if (isAddress) {
                  // se è address, seleziono il primo suggerimento
                  const addressId = await handle.getAttribute("id");
                  await page.waitForTimeout(WAIT.MID);
                  const firstSug = page
                    .locator(`#${addressId}-listbox li`)
                    .first();
                  if (await firstSug.isVisible()) {
                    console.log("📍 Seleziono suggerimento indirizzo");
                    await firstSug.click();
                  } else {
                    console.log("⚠️ Suggerimento indirizzo non trovato");
                  }
                }
              }
              break;

            case "textarea":
              {
                if (typeof override === "string") {
                  fillValue = override;
                } else {
                  fillValue = MOCKS.textarea;
                }
                console.log(`📝 [textarea] ${name}: "${fillValue}"`);
                await handle.fill(fillValue!);
              }
              break;

            case "checkbox":
              {
                let shouldCheck = false;
                if (override === undefined) {
                  shouldCheck = true;
                } else if (Array.isArray(override)) {
                  shouldCheck = override.includes(valueAttr);
                }
                if (shouldCheck) {
                  const id = await handle.getAttribute("id")!;
                  const label = page.locator(`label[for="${id}"]`).first();
                  if (await label.count()) {
                    //Controllo che non sia già spuntata in base al colore di sfondo della card (da raffinare)
                    const labelHandle = await label.elementHandle();
                    let labelBackgroundStyle: string | undefined = undefined;
                    if (labelHandle) {
                      labelBackgroundStyle = await page.evaluate(
                        (el) => getComputedStyle(el).backgroundColor,
                        labelHandle
                      );
                      console.log(
                        `labelBackgroundStyle: ${labelBackgroundStyle}`
                      );
                    }
                    if (!labelBackgroundStyle) {
                      await label.click();
                      await dialogStep(page, path, screenName);
                    } else if (
                      labelBackgroundStyle &&
                      labelBackgroundStyle !== notSelectedStyle
                    ) {
                      console.log(`☑️ [checkbox] ${name} label già spuntato`);
                    } else {
                      console.log(`☑️ [checkbox] ${name} label`);
                      await label.click();
                      await dialogStep(page, path, screenName);
                      continue;
                    }
                  } else {
                    console.log(`☑️ [checkbox] ${name} input`);
                    await handle.check();
                    await dialogStep(page, path, screenName);
                  }
                } else {
                  console.log(
                    `☐ [checkbox] ${name} skip (override non include "${valueAttr}")`
                  );
                }
              }
              break;

            case "radio":
              {
                // Se l'override è presente, seleziona il radio corrispondente
                if (typeof override === "string") {
                  const isMatch =
                    valueAttr.toLowerCase() === override.toLowerCase();

                  if (isMatch && !radioProcessed.has(name)) {
                    // Segna questo gruppo di radio come già processato
                    radioProcessed.add(name);

                    const id = await handle.getAttribute("id")!;
                    const label = page.locator(`label[for="${id}"]`).first();
                    console.log(`🔘 [radio] ${name} => "${valueAttr}"`);
                    if (await label.count()) {
                      // await label.click();
                      // await dialogStep(page, path, screenName);
                      //Controllo che non sia già spuntata in base al colore di sfondo della card (da raffinare)
                      const labelHandle = await label.elementHandle();
                      let labelBackgroundStyle: string | undefined = undefined;
                      if (labelHandle) {
                        labelBackgroundStyle = await page.evaluate(
                          (el) => getComputedStyle(el).backgroundColor,
                          labelHandle
                        );
                        console.log(
                          `labelBackgroundStyle: ${labelBackgroundStyle}`
                        );
                      }
                      if (!labelBackgroundStyle) {
                        await label.click();
                        await dialogStep(page, path, screenName);
                      } else if (
                        labelBackgroundStyle &&
                        labelBackgroundStyle !== notSelectedStyle
                      ) {
                        console.log(`☑️ [radio] ${name} label già spuntato`);
                      } else {
                        console.log(`☑️ [radop] ${name} label`);
                        await label.click();
                        await dialogStep(page, path, screenName);
                        continue;
                      }
                    } else {
                      await handle.check();
                      await dialogStep(page, path, screenName);
                    }
                  }
                } else {
                  // Se non ci sono override, seleziona solo il primo radio per ogni nome
                  if (!radioProcessed.has(name)) {
                    radioProcessed.add(name);

                    const id = await handle.getAttribute("id")!;
                    const label = page.locator(`label[for="${id}"]`).first();
                    console.log(`🔘 [radio] ${name} => "${valueAttr}"`);
                    if (await label.count()) {
                      await label.click();
                      await dialogStep(page, path, screenName);
                    } else {
                      await handle.check();
                      await dialogStep(page, path, screenName);
                    }
                  }
                }
              }

              break;

            case "select": //da testare
              {
                const isMultiple = await handle.evaluate(
                  (el: any) => el.multiple
                );
                if (isMultiple) {
                  if (Array.isArray(override)) {
                    console.log(
                      `⬇️ [select multiple] ${name}: ${override.join(", ")}`
                    );
                    await handle.selectOption(
                      override.map((v) => ({ value: v }))
                    );
                  } else {
                    console.log(
                      `⚠️ [select multiple] ${name} no override array, skip`
                    );
                  }
                } else {
                  if (typeof override === "string") {
                    console.log(`⬇️ [select] ${name} => "${override}"`);
                    await handle.selectOption({ value: override });
                  } else {
                    console.log(`⬇️ [select] ${name} => prima opzione`);
                    await handle.selectOption({ index: 0 });
                  }
                }
              }
              break;

            default:
              console.log(
                `⚠️ Tipo non gestito (${tag}/${type}) name="${name}"`
              );
              break;
          }
        } else {
          handle.click();
          await page.waitForTimeout(WAIT.SHORT);
          const listbox = page
            .locator("ul[class*='_listbox']")
            .nth(indexSelect);
          if (await listbox.count()) {
            let foundOverride = false;
            if (override) {
              const optionToSelect = listbox.locator(
                `li:has-text("${override}")`
              );
              if (await optionToSelect.isVisible()) {
                await optionToSelect.click();
                await page.waitForTimeout(WAIT.SHORT);
                foundOverride = true;
              }
            }
            if (!foundOverride) {
              const firstOption = listbox.locator("li").first();
              if (await firstOption.count()) {
                await firstOption.click();
                await page.waitForTimeout(WAIT.SHORT);
              }
            }
          }
        }
      }

      await forceBlur(page, handle);
    }
    // Screenshot a fine step
    await screenShot(page, path, screenName);
    await page.waitForTimeout(WAIT.SHORT);
  } while (didFill);

  console.log("✅ Compilazione ricorsiva completata.");
}
