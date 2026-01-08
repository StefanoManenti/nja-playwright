#!/bin/bash
chmod -R +x ./
echo "==========================================="
echo "  Avvio test Playwright UI..."
echo "==========================================="

npx playwright test --ui
