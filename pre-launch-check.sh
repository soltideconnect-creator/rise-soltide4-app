#!/bin/bash

# Rise - Pre-Launch Verification Script
# Comprehensive check before deployment

set -e

echo "╔═══════════════════════════════════════════════════════════════════╗"
echo "║                                                                   ║"
echo "║           🔍 Pre-Launch Verification 🔍                           ║"
echo "║                                                                   ║"
echo "╚═══════════════════════════════════════════════════════════════════╝"
echo ""

PASS=0
FAIL=0
WARN=0

# Function to check and report
check() {
    local name="$1"
    local command="$2"
    
    echo -n "Checking $name... "
    if eval "$command" > /dev/null 2>&1; then
        echo "✅ PASS"
        ((PASS++))
        return 0
    else
        echo "❌ FAIL"
        ((FAIL++))
        return 1
    fi
}

check_warn() {
    local name="$1"
    local command="$2"
    
    echo -n "Checking $name... "
    if eval "$command" > /dev/null 2>&1; then
        echo "✅ PASS"
        ((PASS++))
        return 0
    else
        echo "⚠️  WARN"
        ((WARN++))
        return 1
    fi
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 DEPENDENCY CHECKS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

check "Node.js installed" "command -v node"
check "npm installed" "command -v npm"
check "package.json exists" "test -f package.json"
check "node_modules exists" "test -d node_modules"
check "pnpm-lock.yaml exists" "test -f pnpm-lock.yaml"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔒 DEPENDENCY VALIDATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if npm run check-deps 2>&1 | grep -q "ALL CHECKS PASSED"; then
    echo "✅ No duplicate dependencies"
    echo "✅ Lockfile matches package.json"
    echo "✅ All versions valid"
    ((PASS+=3))
else
    echo "❌ Dependency validation failed"
    ((FAIL+=3))
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📁 FILE STRUCTURE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

check "index.html exists" "test -f index.html"
check "src/ directory exists" "test -d src"
check "public/ directory exists" "test -d public"
check "vite.config.ts exists" "test -f vite.config.ts"
check "tsconfig.json exists" "test -f tsconfig.json"
check "tailwind.config.js exists" "test -f tailwind.config.js"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎨 PWA ASSETS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

check "manifest.json exists" "test -f public/manifest.json"
check "service worker exists" "test -f public/sw.js"
check "app icon exists" "test -f public/rise-icon.png"
check "favicon exists" "test -f public/favicon.png"
check "OG image exists" "test -f public/og-image.png"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⚙️  CONFIGURATION FILES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

check "netlify.toml exists" "test -f netlify.toml"
check "_redirects exists" "test -f public/_redirects"
check "biome.json exists" "test -f biome.json"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🏗️  BUILD TEST"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo -n "Building application... "
if npm run build > /tmp/build.log 2>&1; then
    echo "✅ PASS"
    ((PASS++))
    
    # Check build output
    if [ -d "dist" ]; then
        echo "✅ dist/ directory created"
        ((PASS++))
        
        if [ -f "dist/index.html" ]; then
            echo "✅ dist/index.html exists"
            ((PASS++))
        else
            echo "❌ dist/index.html missing"
            ((FAIL++))
        fi
        
        if [ -d "dist/assets" ]; then
            echo "✅ dist/assets/ directory exists"
            ((PASS++))
        else
            echo "❌ dist/assets/ missing"
            ((FAIL++))
        fi
    else
        echo "❌ dist/ directory not created"
        ((FAIL++))
    fi
else
    echo "❌ FAIL"
    ((FAIL++))
    echo "Build errors:"
    tail -20 /tmp/build.log
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📝 GIT STATUS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

check ".git directory exists" "test -d .git"

if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Uncommitted changes detected"
    ((WARN++))
    git status --short | head -10
else
    echo "✅ No uncommitted changes"
    ((PASS++))
fi

COMMITS=$(git rev-list --count HEAD ^origin/master 2>/dev/null || echo "unknown")
echo "📊 Commits ready to push: $COMMITS"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo ""
echo "✅ Passed: $PASS"
echo "❌ Failed: $FAIL"
echo "⚠️  Warnings: $WARN"
echo ""

if [ $FAIL -eq 0 ]; then
    echo "╔═══════════════════════════════════════════════════════════════════╗"
    echo "║                                                                   ║"
    echo "║              ✅ ALL CHECKS PASSED! ✅                             ║"
    echo "║                                                                   ║"
    echo "║         Your app is ready for launch! 🚀                         ║"
    echo "║                                                                   ║"
    echo "║         Run: ./launch.sh                                         ║"
    echo "║         Or:  git push origin master                              ║"
    echo "║                                                                   ║"
    echo "╚═══════════════════════════════════════════════════════════════════╝"
    exit 0
else
    echo "╔═══════════════════════════════════════════════════════════════════╗"
    echo "║                                                                   ║"
    echo "║              ⚠️  ISSUES DETECTED ⚠️                               ║"
    echo "║                                                                   ║"
    echo "║         Please fix the failed checks above                       ║"
    echo "║                                                                   ║"
    echo "╚═══════════════════════════════════════════════════════════════════╝"
    exit 1
fi
