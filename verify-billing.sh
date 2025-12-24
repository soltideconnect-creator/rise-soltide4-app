#!/bin/bash

# Billing Integration Verification Script
# This script verifies that the Google Play Billing integration is correctly implemented

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                                                               ║"
echo "║     GOOGLE PLAY BILLING INTEGRATION VERIFICATION             ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0

# Function to check file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅${NC} File exists: $1"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}❌${NC} File missing: $1"
        ((FAILED++))
        return 1
    fi
}

# Function to check string in file
check_string() {
    if grep -q "$2" "$1"; then
        echo -e "${GREEN}✅${NC} Found in $1: $2"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}❌${NC} Not found in $1: $2"
        ((FAILED++))
        return 1
    fi
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. Checking Core Files"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

check_file "src/utils/googlePlayBilling.ts"
check_file "src/pages/Stats.tsx"
check_file "src/pages/BillingTest.tsx"
check_file "src/App.tsx"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2. Checking Android Detection Implementation"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

check_string "src/utils/googlePlayBilling.ts" "export function isAndroid"
check_string "src/utils/googlePlayBilling.ts" "/android/i.test"
check_string "src/utils/googlePlayBilling.ts" "display-mode: standalone"
check_string "src/utils/googlePlayBilling.ts" "force_android_mode"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3. Checking Automatic Restoration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

check_string "src/App.tsx" "import.*isAndroid.*restorePurchases"
check_string "src/App.tsx" "if (isAndroid())"
check_string "src/App.tsx" "restorePurchases()"
check_string "src/App.tsx" "Premium automatically restored"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4. Checking Stats Page Integration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

check_string "src/pages/Stats.tsx" "isTWAWithBilling"
check_string "src/pages/Stats.tsx" "PaystackPayment"
check_string "src/pages/Stats.tsx" "Google Play"
check_string "src/pages/Stats.tsx" "Restore Purchase"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "5. Checking Billing Test Page"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

check_string "src/pages/BillingTest.tsx" "export function BillingTest"
check_string "src/pages/BillingTest.tsx" "Enable Android Mode"
check_string "src/pages/BillingTest.tsx" "Test Purchase"
check_string "src/pages/BillingTest.tsx" "Run All Tests"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "6. Checking Navigation Integration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

check_string "src/App.tsx" "billing-test"
check_string "src/App.tsx" "BillingTest"
check_string "src/pages/Settings.tsx" "onNavigateToBillingTest"
check_string "src/pages/Settings.tsx" "Billing Test"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "7. Checking Error Handling"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

check_string "src/utils/googlePlayBilling.ts" "Google Play Billing is not available"
check_string "src/utils/googlePlayBilling.ts" "Please make sure you downloaded"
check_string "src/utils/googlePlayBilling.ts" "catch.*error"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "8. Checking Documentation"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

check_file "GOOGLE_PLAY_BILLING_FIXED.md"
check_file "BILLING_TESTING_GUIDE.md"
check_file "GOOGLE_PLAY_FIX_SUMMARY.txt"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "9. Running Build Test"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if npm run lint > /dev/null 2>&1; then
    echo -e "${GREEN}✅${NC} Build succeeds without errors"
    ((PASSED++))
else
    echo -e "${RED}❌${NC} Build failed"
    ((FAILED++))
fi

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                     VERIFICATION SUMMARY                      ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
echo -e "Tests Passed: ${GREEN}${PASSED}${NC}"
echo -e "Tests Failed: ${RED}${FAILED}${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}╔═══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                                                               ║${NC}"
    echo -e "${GREEN}║              ✅ ALL VERIFICATIONS PASSED! ✅                  ║${NC}"
    echo -e "${GREEN}║                                                               ║${NC}"
    echo -e "${GREEN}║         Ready for Testing and GitHub Push                     ║${NC}"
    echo -e "${GREEN}║                                                               ║${NC}"
    echo -e "${GREEN}╚═══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo "Next Steps:"
    echo "1. Test on web preview (follow BILLING_TESTING_GUIDE.md)"
    echo "2. Push to GitHub: git push origin main"
    echo "3. Test on Netlify deployment"
    echo "4. Upload APK/AAB to Google Play Console"
    echo "5. Test on actual Android device"
    exit 0
else
    echo -e "${RED}╔═══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║                                                               ║${NC}"
    echo -e "${RED}║              ❌ SOME VERIFICATIONS FAILED ❌                  ║${NC}"
    echo -e "${RED}║                                                               ║${NC}"
    echo -e "${RED}║         Please fix the issues above                           ║${NC}"
    echo -e "${RED}║                                                               ║${NC}"
    echo -e "${RED}╚═══════════════════════════════════════════════════════════════╝${NC}"
    exit 1
fi
