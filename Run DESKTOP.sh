#!/bin/bash

echo "==========================================="
echo " Preparazione dei test..."
echo "==========================================="
rm -f tests/*.spec.ts
cp -R all-tests/desktop/* tests/

echo "==========================================="
echo " Avvio test Playwright UI..."
echo "==========================================="
npx playwright test --ui

read -p "Premi INVIO per uscire..."
