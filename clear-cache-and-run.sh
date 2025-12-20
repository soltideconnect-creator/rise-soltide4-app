#!/bin/bash

echo "🔧 Fixing React useState Error - Complete Cache Clear"
echo "=================================================="
echo ""

# Kill any running Vite processes
echo "1️⃣ Stopping any running dev servers..."
pkill -f vite 2>/dev/null || true
sleep 1

# Clear all caches
echo "2️⃣ Clearing all caches..."
rm -rf node_modules/.vite dist .vite 2>/dev/null || true

# Verify dependencies
echo "3️⃣ Verifying dependencies..."
if [ ! -d "node_modules" ]; then
    echo "   Installing dependencies..."
    pnpm install
fi

# Check for duplicates
echo "4️⃣ Checking for duplicate React..."
REACT_COUNT=$(find node_modules -name "react" -type d -path "*/node_modules/react" 2>/dev/null | wc -l)
if [ "$REACT_COUNT" -eq 1 ]; then
    echo "   ✅ Only one React instance found"
else
    echo "   ⚠️  Multiple React instances found: $REACT_COUNT"
    echo "   Running clean install..."
    rm -rf node_modules pnpm-lock.yaml
    pnpm install
fi

# Build
echo "5️⃣ Building application..."
pnpm run build

echo ""
echo "✅ All caches cleared and app rebuilt!"
echo ""
echo "=================================================="
echo "🎯 NEXT STEPS:"
echo "=================================================="
echo ""
echo "1. Start the dev server:"
echo "   pnpm run dev"
echo ""
echo "2. In your browser, do a HARD REFRESH:"
echo "   • Windows/Linux: Ctrl + Shift + R"
echo "   • Mac: Cmd + Shift + R"
echo ""
echo "3. The error should be gone! 🎉"
echo ""
echo "=================================================="
