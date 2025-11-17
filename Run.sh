#!/bin/bash

echo "==========================================="
echo "  Avvio test Playwright UI..."
echo "==========================================="

npx playwright test --ui
if [ $? -ne 0 ]; then
  echo "❌ Errore durante l'esecuzione dei test."
  exit 1
fi

echo "==========================================="
echo "  Generazione report..."
echo "==========================================="

node ./scripts/generate-report.js

echo "==========================================="
echo "  Operazione completata. Report in /report"
echo "==========================================="
