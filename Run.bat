@echo off
echo ===========================================
echo  Avvio test Playwright UI...
echo ===========================================

npx playwright test --ui

echo ===========================================
echo  Operazione completata. Report in /report
echo ===========================================

pause
