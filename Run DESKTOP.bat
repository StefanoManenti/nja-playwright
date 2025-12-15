@echo off
echo ===========================================
echo  Avvio test Playwright UI...
echo ===========================================

for /f "delims=" %%f in ('dir /b /a-d "tests\*.spec.ts"') do del "tests\%%f"
xcopy /y /e /i all-tests\desktop\*.* tests\

echo ===========================================
echo  Avvio test Playwright UI...
echo ===========================================
npx playwright test --ui

pause
