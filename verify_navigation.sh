#!/bin/bash

echo "=========================================="
echo "NAVIGATION VERIFICATION SCRIPT"
echo "=========================================="
echo ""

echo "1. Checking for hash-based navigation..."
HASH_NAV=$(grep -rn "window.location.href.*#\|location.hash.*=\|href=\"#/" src/ --include="*.tsx" --include="*.ts" 2>/dev/null || true)
if [ -z "$HASH_NAV" ]; then
  echo "   ✅ No hash-based navigation found"
else
  echo "   ❌ FOUND HASH-BASED NAVIGATION:"
  echo "$HASH_NAV"
fi
echo ""

echo "2. Checking for 'Upgrade to Premium' buttons..."
UPGRADE_BUTTONS=$(grep -rn "Upgrade to Premium" src/ --include="*.tsx" 2>/dev/null || true)
echo "$UPGRADE_BUTTONS"
echo ""

echo "3. Verifying Sleep component has navigation prop..."
SLEEP_PROP=$(grep -n "onNavigateToStats" src/pages/Sleep.tsx 2>/dev/null || true)
if [ -z "$SLEEP_PROP" ]; then
  echo "   ❌ Sleep component missing navigation prop"
else
  echo "   ✅ Sleep component has navigation prop"
fi
echo ""

echo "4. Verifying App.tsx passes navigation callback..."
APP_CALLBACK=$(grep -n "onNavigateToStats.*setCurrentView" src/App.tsx 2>/dev/null || true)
if [ -z "$APP_CALLBACK" ]; then
  echo "   ❌ App.tsx not passing navigation callback"
else
  echo "   ✅ App.tsx passes navigation callback"
fi
echo ""

echo "5. Checking for documentation..."
DOC_CHECK=$(grep -n "NAVIGATION SYSTEM" src/App.tsx 2>/dev/null || true)
if [ -z "$DOC_CHECK" ]; then
  echo "   ❌ Navigation documentation missing"
else
  echo "   ✅ Navigation documentation present"
fi
echo ""

echo "=========================================="
echo "VERIFICATION COMPLETE"
echo "=========================================="
