const fs = require("fs");
const path = require("path");
const ExcelJS = require("exceljs");

const LOG_DIR = path.join(process.cwd(), "tests", "logs");
const REPORT_DIR = path.join(process.cwd(), "report");

// costruisci nome file: report-dd-mm-yyyy.xlsx
const nowDate = new Date();
const dd = String(nowDate.getDate()).padStart(2, "0");
const mm = String(nowDate.getMonth() + 1).padStart(2, "0");
const yyyy = String(nowDate.getFullYear());
const minutes = String(nowDate.getMinutes()).padStart(2, "0");
const seconds = String(nowDate.getSeconds()).padStart(2, "0");
const OUTPUT_XLSX = path.join(REPORT_DIR, `report-${dd}-${mm}-${yyyy}_${minutes}-${seconds}.xlsx`);

// REGEX per il parsing dei log
const reStart = /^\[test-start]\s+(\S+)\s+–\s+(.+)$/;
const reSuccess = /^\[test-success]\s+(\S+)\s+–\s+OK$/;
const reError = /^\[test-error]\s+(\S+)\s+–\s+(.+)$/;

const rePageError = /^\[page-error]\s+(.+)$/;
const rePageException = /^\[pageexception]\s+(.+)$/;
const reApiFailed = /^\[api-failed.*]\s+(.+)$/;
const reApiRespError = /^\[api-response-error]\s+(.+)$/;
// es: [api-response #12] GET ... -> 500 Internal Server Error in 123ms
const reApiResp = /^\[api-response.*->\s+(\d{3})\b(.*)$/;

// determina il device dal nome test o dal nome file
function detectDeviceFromName(name) {
  const lower = name.toLowerCase();
  if (lower.includes(" - tablet") || lower.endsWith("tablet")) return "Tablet";
  if (lower.includes(" - mobile") || lower.endsWith("mobile")) return "Mobile";
  return "Desktop";
}

function parseLogFile(filePath) {
  const text = fs.readFileSync(filePath, "utf8");
  const lines = text.split(/\r?\n/);

  let testName = path.basename(filePath, ".log");
  let startedAt = null;
  let endedAt = null;
  let status = "UNKNOWN";
  const errors = [];

  for (const line of lines) {
    if (!line.trim()) continue;

    let m = line.match(reStart);
    if (m) {
      startedAt = new Date(m[1]);
      testName = m[2].trim();
      continue;
    }

    m = line.match(reSuccess);
    if (m) {
      endedAt = new Date(m[1]);
      status = "OK";
      continue;
    }

    m = line.match(reError);
    if (m) {
      endedAt = new Date(m[1]);
      status = "ERROR";
      errors.push(`• Errore di test: ${m[2].trim()}`);
      continue;
    }

    m = line.match(rePageError);
    if (m) {
      errors.push(`• Errore in pagina (console.error): ${m[1].trim()}`);
      continue;
    }

    m = line.match(rePageException);
    if (m) {
      errors.push(`• Eccezione JavaScript non gestita: ${m[1].trim()}`);
      continue;
    }

    m = line.match(reApiFailed);
    if (m) {
      errors.push(`• Chiamata API fallita (network): ${m[1].trim()}`);
      continue;
    }

    m = line.match(reApiRespError);
    if (m) {
      errors.push(
        `• Errore durante la lettura della risposta API: ${m[1].trim()}`
      );
      continue;
    }

    m = line.match(reApiResp);
    if (m) {
      const code = parseInt(m[1], 10);
      if (code >= 400) {
        errors.push(`• Risposta API ${code}: ${m[2].trim()}`);
      }
      continue;
    }
  }

  if (!endedAt && startedAt) {
    endedAt = startedAt;
  }

  const durationMs =
    startedAt && endedAt ? endedAt.getTime() - startedAt.getTime() : null;
  const durationMin = durationMs != null ? durationMs / 60000 : null; // minuti

  const device = detectDeviceFromName(testName);

  return {
    testName,
    device,
    startedAt,
    endedAt,
    durationMin,
    status,
    errors,
    logFile: path.basename(filePath),
  };
}

async function generateExcelReport() {
  if (!fs.existsSync(LOG_DIR)) {
    console.error("Directory logs non trovata:", LOG_DIR);
    return;
  }

  const files = fs
    .readdirSync(LOG_DIR)
    .filter((f) => f.endsWith(".log"));

  if (!files.length) {
    console.log("Nessun log trovato in", LOG_DIR);
    return;
  }

  const rows = files.map((file) =>
    parseLogFile(path.join(LOG_DIR, file))
  );

  // assicura che la cartella /report esista
  if (!fs.existsSync(REPORT_DIR)) {
    fs.mkdirSync(REPORT_DIR, { recursive: true });
  }

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Test Report");

  sheet.columns = [
    { header: "Log file", key: "logFile", width: 35 },
    { header: "Nome test", key: "testName", width: 60 },
    { header: "Device", key: "device", width: 12 }, // nuova colonna
    { header: "Stato", key: "status", width: 10 },
    { header: "Inizio", key: "startedAt", width: 25 },
    { header: "Fine", key: "endedAt", width: 25 },
    { header: "Durata (min)", key: "durationMin", width: 15 },
    { header: "Errori", key: "errors", width: 100 },
  ];

  // formato numerico per la durata in minuti
  sheet.getColumn("durationMin").numFmt = "0.00";

  rows.forEach((r) => {
    sheet.addRow({
      logFile: r.logFile,
      testName: r.testName,
      device: r.device,
      status: r.status,
      startedAt: r.startedAt ? r.startedAt.toISOString() : "",
      endedAt: r.endedAt ? r.endedAt.toISOString() : "",
      durationMin:
        r.durationMin != null ? Number(r.durationMin.toFixed(2)) : "",
      errors: r.errors.join("\n"), // newline tra un errore e l'altro
    });
  });

  // Header: sfondo verde, testo nero, grassetto
  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: "FF000000" } };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF00B050" }, // verde
  };
  headerRow.alignment = {
    vertical: "middle",
    horizontal: "center",
    wrapText: true,
  };

  // Allineamento celle: top + left, con wrap per nome test ed errori
  sheet.columns.forEach((col) => {
    col.alignment = {
      vertical: "top",
      horizontal: "left",
      wrapText: col.key === "errors" || col.key === "testName",
    };
  });

  // 🔽 Abilita filtro sulle intestazioni
  sheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: sheet.columnCount },
  };

  await workbook.xlsx.writeFile(OUTPUT_XLSX);
  console.log("✅ Report Excel generato:", OUTPUT_XLSX);
}

generateExcelReport().catch((e) => {
  console.error("Errore nella generazione del report:", e);
  process.exit(1);
});
