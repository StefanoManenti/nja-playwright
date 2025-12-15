@echo off
echo ===========================================
echo  Preparazione dei test...
echo ===========================================

for /f "delims=" %%f in ('dir /b /a-d "tests\*.spec.ts"') do del "tests\%%f"
xcopy /y /e /i all-tests\phone\*.* tests\

echo ===========================================
echo  Avvio test Playwright UI...
echo ===========================================
npx playwright test --ui

pause
