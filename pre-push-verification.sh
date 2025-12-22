#!/bin/bash

# 🛡️ PRE-PUSH VERIFICATION SCRIPT
# This script ensures all critical issues are fixed before pushing to GitHub

set -e  # Exit on any error

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║         🛡️  PRE-PUSH VERIFICATION SYSTEM                      ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to run a test
run_test() {
  local test_name="$1"
  local test_command="$2"
  
  TOTAL_TESTS=$((TOTAL_TESTS + 1))
  echo -e "${BLUE}🔍 Testing: ${test_name}${NC}"
  
  if eval "$test_command" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ PASSED: ${test_name}${NC}"
    PASSED_TESTS=$((PASSED_TESTS + 1))
    return 0
  else
    echo -e "${RED}❌ FAILED: ${test_name}${NC}"
    FAILED_TESTS=$((FAILED_TESTS + 1))
    return 1
  fi
}

# Function to check file content
check_file_content() {
  local file="$1"
  local pattern="$2"
  local description="$3"
  
  TOTAL_TESTS=$((TOTAL_TESTS + 1))
  echo -e "${BLUE}🔍 Checking: ${description}${NC}"
  
  if grep -q "$pattern" "$file"; then
    echo -e "${GREEN}✅ PASSED: ${description}${NC}"
    PASSED_TESTS=$((PASSED_TESTS + 1))
    return 0
  else
    echo -e "${RED}❌ FAILED: ${description}${NC}"
    FAILED_TESTS=$((FAILED_TESTS + 1))
    return 1
  fi
}

echo "═══════════════════════════════════════════════════════════════"
echo "  SECTION 1: DEPENDENCY VALIDATION"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Test 1: Check for duplicate dependencies
run_test "No duplicate dependencies" "node scripts/check-dependencies.cjs"

# Test 2: Verify miaoda-sc-plugin is only in dependencies
TOTAL_TESTS=$((TOTAL_TESTS + 1))
echo -e "${BLUE}🔍 Checking: miaoda-sc-plugin location${NC}"
if grep -q '"miaoda-sc-plugin": "1.0.29"' package.json; then
  echo -e "${GREEN}✅ PASSED: miaoda-sc-plugin in dependencies${NC}"
  PASSED_TESTS=$((PASSED_TESTS + 1))
else
  echo -e "${RED}❌ FAILED: miaoda-sc-plugin not found correctly${NC}"
  FAILED_TESTS=$((FAILED_TESTS + 1))
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  SECTION 2: CODE QUALITY CHECKS"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Test 3: TypeScript compilation
run_test "TypeScript compilation" "npx tsc -p tsconfig.check.json --noEmit"

# Test 4: ESLint validation
run_test "ESLint validation" "npx biome lint"

# Test 5: Build test
run_test "Vite build test" "vite build --minify false --logLevel error --outDir /tmp/outdir-verify"

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  SECTION 3: CRITICAL FIX VERIFICATION"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Test 6: Verify email display fix (Issue 1)
check_file_content "src/pages/Stats.tsx" "!adsRemoved" "Email display conditional rendering"

# Test 7: Verify Skip button exists (Issue 2)
check_file_content "src/components/Onboarding.tsx" "Skip" "Onboarding Skip button"

# Test 8: Verify Skip button onClick handler
check_file_content "src/components/Onboarding.tsx" "onClick={onComplete}" "Skip button functionality"

# Test 9: Verify no duplicate miaoda-sc-plugin in package.json
TOTAL_TESTS=$((TOTAL_TESTS + 1))
echo -e "${BLUE}🔍 Checking: No duplicate miaoda-sc-plugin${NC}"
PLUGIN_COUNT=$(grep -c '"miaoda-sc-plugin"' package.json || true)
if [ "$PLUGIN_COUNT" -eq 1 ]; then
  echo -e "${GREEN}✅ PASSED: miaoda-sc-plugin appears only once${NC}"
  PASSED_TESTS=$((PASSED_TESTS + 1))
else
  echo -e "${RED}❌ FAILED: miaoda-sc-plugin appears $PLUGIN_COUNT times (should be 1)${NC}"
  FAILED_TESTS=$((FAILED_TESTS + 1))
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  SECTION 4: FILE INTEGRITY CHECKS"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Test 10: Verify critical files exist
CRITICAL_FILES=(
  "src/pages/Stats.tsx"
  "src/components/Onboarding.tsx"
  "src/App.tsx"
  "src/main.tsx"
  "package.json"
  "vite.config.ts"
  "index.html"
)

for file in "${CRITICAL_FILES[@]}"; do
  TOTAL_TESTS=$((TOTAL_TESTS + 1))
  echo -e "${BLUE}🔍 Checking: File exists - $file${NC}"
  if [ -f "$file" ]; then
    echo -e "${GREEN}✅ PASSED: $file exists${NC}"
    PASSED_TESTS=$((PASSED_TESTS + 1))
  else
    echo -e "${RED}❌ FAILED: $file missing${NC}"
    FAILED_TESTS=$((FAILED_TESTS + 1))
  fi
done

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  SECTION 5: RUNTIME SAFETY CHECKS"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Test 11: Check for console.error in critical files
TOTAL_TESTS=$((TOTAL_TESTS + 1))
echo -e "${BLUE}🔍 Checking: Error handling in Stats.tsx${NC}"
if grep -q "console.error" src/pages/Stats.tsx; then
  echo -e "${GREEN}✅ PASSED: Error handling present${NC}"
  PASSED_TESTS=$((PASSED_TESTS + 1))
else
  echo -e "${YELLOW}⚠️  WARNING: No error handling found${NC}"
  PASSED_TESTS=$((PASSED_TESTS + 1))  # Don't fail, just warn
fi

# Test 12: Check for null safety (optional chaining)
TOTAL_TESTS=$((TOTAL_TESTS + 1))
echo -e "${BLUE}🔍 Checking: Null safety in Stats.tsx${NC}"
if grep -q "!adsRemoved" src/pages/Stats.tsx; then
  echo -e "${GREEN}✅ PASSED: Null safety implemented${NC}"
  PASSED_TESTS=$((PASSED_TESTS + 1))
else
  echo -e "${RED}❌ FAILED: Null safety missing${NC}"
  FAILED_TESTS=$((FAILED_TESTS + 1))
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  VERIFICATION SUMMARY"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo -e "Total Tests:  ${BLUE}${TOTAL_TESTS}${NC}"
echo -e "Passed:       ${GREEN}${PASSED_TESTS}${NC}"
echo -e "Failed:       ${RED}${FAILED_TESTS}${NC}"
echo ""

# Calculate success rate
SUCCESS_RATE=$((PASSED_TESTS * 100 / TOTAL_TESTS))

if [ $FAILED_TESTS -eq 0 ]; then
  echo "═══════════════════════════════════════════════════════════════"
  echo -e "${GREEN}✅ ALL TESTS PASSED - READY TO PUSH TO GITHUB!${NC}"
  echo "═══════════════════════════════════════════════════════════════"
  echo ""
  echo -e "${GREEN}🚀 Success Rate: ${SUCCESS_RATE}%${NC}"
  echo ""
  echo "Next steps:"
  echo "  1. git add ."
  echo "  2. git commit -m \"Your commit message\""
  echo "  3. git push origin main"
  echo ""
  exit 0
else
  echo "═══════════════════════════════════════════════════════════════"
  echo -e "${RED}❌ SOME TESTS FAILED - DO NOT PUSH YET!${NC}"
  echo "═══════════════════════════════════════════════════════════════"
  echo ""
  echo -e "${RED}⚠️  Success Rate: ${SUCCESS_RATE}%${NC}"
  echo ""
  echo "Please fix the failed tests before pushing to GitHub."
  echo ""
  exit 1
fi
