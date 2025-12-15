const fs = require("fs");
const path = require("path");

// Check if exceljs is available
let ExcelJS;
try {
  ExcelJS = require("exceljs");
} catch (error) {
  console.error("⚠️ ExcelJS non installato. Installa con: npm install exceljs");
  console.error("La generazione dell'Excel è stata saltata.");
  process.exit(0); // Exit gracefully without failing the test
}

const REPORT_DIR = path.join(process.cwd(), "public", "report");

// REGEX per il parsing dei log
const reStart = /^\[test-start]\s+(\S+)\s+–\s+(.+)$/;
const reSuccess = /^\[test-success]\s+(\S+)\s+–\s+OK$/;
const reError = /^\[test-error]\s+(\S+)\s+–\s+(.+)$/;

const rePageError = /^\[page-error]\s+(.+)$/;
const rePageException = /^\[pageexception]\s+(.+)$/;
const reApiFailed = /^\[api-failed.*]\s+(.+)$/;
const reApiRespError = /^\[api-response-error]\s+(.+)$/;
const reWarning = /^⚠|warning/i;
// es: [api-response #12] GET ... -> 500 Internal Server Error in 123ms
const reApiResp = /^\[api-response.*->\s+(\d{3})\b(.*)$/;

// determina il device dal nome test o dal nome file
// Ritorna solo: "Desktop", "Tablet", "Phone"
function detectDeviceFromName(name) {
  if (!name || typeof name !== 'string') return "Desktop";
  const lower = name.toLowerCase();
  if (lower.includes("tablet") || lower.includes("ipad")) return "Tablet";
  if (lower.includes("mobile") || lower.includes("phone") || lower.includes("iphone") || lower.includes("android")) return "Phone";
  return "Desktop";
}

// Normalizza il device a uno dei tre valori standard
function normalizeDevice(device) {
  if (!device || typeof device !== 'string') return "Desktop";
  const lower = device.toLowerCase();
  if (lower.includes("tablet") || lower.includes("ipad")) return "Tablet";
  if (lower.includes("mobile") || lower.includes("phone") || lower.includes("iphone") || lower.includes("android")) return "Phone";
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
  const warnings = [];

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

    // Check for warnings
    if (reWarning.test(line)) {
      warnings.push(line.replace(/^⚠️?\s*/u, "").trim());
      continue;
    }
  }

  if (!endedAt && startedAt) {
    endedAt = startedAt;
  }

  const durationMs =
    startedAt && endedAt ? endedAt.getTime() - startedAt.getTime() : null;

  // Calculate duration in minutes and seconds
  let durationFormatted = "";
  if (durationMs != null) {
    const totalSeconds = Math.floor(durationMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    durationFormatted = `${minutes}m ${seconds}s`;
  }

  const device = detectDeviceFromName(testName);

  return {
    testName,
    device,
    startedAt,
    endedAt,
    durationMs,
    durationFormatted,
    status,
    errors,
    warnings,
    logFile: path.basename(filePath),
  };
}

async function generateSingleTestExcelReport(
  logFilePath,
  testName = null,
  device = null,
  isLocal = null
) {
  console.log(`🔍 Generating Excel report for: ${logFilePath}`);
  console.log(`📝 Input params - testName: "${testName}", device: "${device}", isLocal: "${isLocal}"`);

  if (!fs.existsSync(logFilePath)) {
    throw new Error(`Log file non trovato: ${logFilePath}`);
  }

  const parsedData = parseLogFile(logFilePath);
  console.log(`📊 Parsed data - testName: "${parsedData.testName}", device: "${parsedData.device}", status: "${parsedData.status}"`);

  // Use provided test data or fallback to parsed data
  const finalTestName = testName || parsedData.testName;

  // Normalize device to "Desktop", "Tablet", or "Phone"
  const deviceToNormalize = device || parsedData.device;
  const finalDevice = normalizeDevice(deviceToNormalize);

  // Convert string "true"/"false" to boolean
  let isLocalBool = isLocal;
  if (typeof isLocal === 'string') {
    isLocalBool = isLocal === 'true';
  }
  const testType = isLocalBool !== null ? (isLocalBool ? "Locale" : "Remoto") : "Unknown";

  // Map status: OK -> success, ERROR -> error
  let finalStatus = "unknown";
  if (parsedData.status === "OK") {
    finalStatus = "success";
  } else if (parsedData.status === "ERROR") {
    finalStatus = "error";
  }

  console.log(`✅ Final values - testName: "${finalTestName}", device: "${finalDevice}", type: "${testType}", status: "${finalStatus}"`);

  // assicura che la cartella /report esista
  if (!fs.existsSync(REPORT_DIR)) {
    fs.mkdirSync(REPORT_DIR, { recursive: true });
  }

  // costruisci nome file: nome-test - device - tipo - gg-mm-aaaa H:mm.xlsx
  const nowDate = new Date();
  const dd = String(nowDate.getDate()).padStart(2, "0");
  const mm = String(nowDate.getMonth() + 1).padStart(2, "0");
  const yyyy = String(nowDate.getFullYear());
  const hh = String(nowDate.getHours()).padStart(2, "0");
  const minutes = String(nowDate.getMinutes()).padStart(2, "0");

  // Sanitize filename parts
  const sanitize = (str) => {
    if (!str || typeof str !== 'string') return '';
    return str.replace(/[\\/:*?"<>|]/g, "-").trim();
  };
  
  const filenameParts = [
    sanitize(finalTestName),
    sanitize(finalDevice),
    testType,
    `${dd}-${mm}-${yyyy} ${hh}-${minutes}`
  ].filter(part => part && part !== '');

  const filename = filenameParts.join(" - ") + ".xlsx";
  const OUTPUT_XLSX = path.join(REPORT_DIR, filename);

  console.log(`📄 Generated filename: ${filename}`);

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Test Report");

  sheet.columns = [
    { header: "Nome test", key: "testName", width: 50 },
    { header: "Log", key: "logPath", width: 50 },
    { header: "Device", key: "device", width: 15 },
    { header: "Tipo", key: "testType", width: 10 },
    { header: "Stato", key: "status", width: 10 },
    { header: "Inizio", key: "startedAt", width: 20 },
    { header: "Fine", key: "endedAt", width: 20 },
    { header: "Durata", key: "duration", width: 12 },
    { header: "Errori", key: "errors", width: 80 },
    { header: "Warning", key: "warnings", width: 80 },
  ];

  // Add data row
  const dataRow = sheet.addRow({
    testName: finalTestName,
    logPath: logFilePath,
    device: finalDevice,
    testType: testType,
    status: finalStatus,
    startedAt: parsedData.startedAt
      ? parsedData.startedAt.toLocaleString("it-IT", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        })
      : "",
    endedAt: parsedData.endedAt
      ? parsedData.endedAt.toLocaleString("it-IT", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        })
      : "",
    duration: parsedData.durationFormatted,
    errors: parsedData.errors.join("\n"),
    warnings: parsedData.warnings.join("\n"),
  });

  // Header: sfondo verde, testo nero, grassetto
  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: "FF000000" } };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF00B050" },
  };
  headerRow.alignment = {
    vertical: "middle",
    horizontal: "center",
    wrapText: true,
  };

  // Allineamento celle: tutte top-left con wrap text
  sheet.columns.forEach((col) => {
    if (col.key) {
      col.alignment = {
        vertical: "top",
        horizontal: "left",
        wrapText: true,
      };
    }
  });

  // Apply alignment to data row explicitly
  dataRow.eachCell((cell) => {
    cell.alignment = {
      vertical: "top",
      horizontal: "left",
      wrapText: true,
    };
  });

  // Abilita filtro sulle intestazioni
  sheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: sheet.columnCount },
  };

  try {
    await workbook.xlsx.writeFile(OUTPUT_XLSX);
    console.log(`✅ Excel file written: ${OUTPUT_XLSX}`);

    // Verify the file was created and has content
    const stats = fs.statSync(OUTPUT_XLSX);
    console.log(`📊 File size: ${stats.size} bytes`);

    if (stats.size === 0) {
      console.error("⚠️ Warning: Excel file is 0 bytes!");
    }
  } catch (writeError) {
    console.error(`❌ Error writing Excel file: ${writeError}`);
    throw writeError;
  }

  // Ritorna il path relativo per il client
  return `/report/${path.basename(OUTPUT_XLSX)}`;
}

// CLI usage (se chiamato direttamente da command line)
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length < 3) {
    console.error(
      "Usage: node server/export-single-test.cjs <logFilePath> <testId> <runId>"
    );
    process.exit(1);
  }

  const [logFilePath] = args;

  // Try to parse additional params (testName, device, isLocal) from argv
  const testNameArg = args[3] || null;
  const deviceArg = args[4] || null;
  const isLocalArg = args[5] !== undefined ? args[5] : null;

  generateSingleTestExcelReport(logFilePath, testNameArg, deviceArg, isLocalArg)
    .then((outputPath) => {
      console.log("✅ Report Excel generato:", outputPath);
    })
    .catch((e) => {
      console.error("Errore nella generazione del report:", e);
      process.exit(1);
    });
}

module.exports = { generateSingleTestExcelReport };
