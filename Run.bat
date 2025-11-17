@echo off
echo ===========================================
echo  Avvio test Playwright UI...
echo ===========================================

npx playwright test --ui
if %errorlevel% neq 0 (
    echo ❌ Errore durante l'esecuzione dei test.
    pause
    exit /b %errorlevel%
)

echo ===========================================
echo  Generazione report...
echo ===========================================

node ./scripts/generate-report.js

echo ===========================================
echo  Operazione completata. Report in /report
echo ===========================================

pause
