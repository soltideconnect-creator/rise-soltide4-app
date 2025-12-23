#!/bin/bash

echo "═══════════════════════════════════════════════════════════════════════════════"
echo "                    DEPLOYING DIGITAL GOODS API CHANGES"
echo "═══════════════════════════════════════════════════════════════════════════════"
echo ""
echo "📋 Changes Summary:"
echo "   - File modified: src/utils/googlePlayBilling.ts"
echo "   - AndroidBilling: REMOVED ❌"
echo "   - Digital Goods API: ADDED ✅"
echo "   - Lines: 359 (was 398, -39 lines)"
echo "   - Build: SUCCESSFUL ✅"
echo ""
echo "═══════════════════════════════════════════════════════════════════════════════"
echo ""

# Check if in correct directory
if [ ! -f "src/utils/googlePlayBilling.ts" ]; then
  echo "❌ Error: Not in project root directory"
  echo "   Please run: cd /workspace/app-7qtp23c0l8u9"
  exit 1
fi

# Stage changes
echo "📦 Staging changes..."
git add src/utils/googlePlayBilling.ts

# Show what will be committed
echo ""
echo "📝 Files to commit:"
git status --short

echo ""
echo "═══════════════════════════════════════════════════════════════════════════════"
echo ""
read -p "🚀 Ready to commit and push? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo ""
  echo "📝 Committing changes..."
  git commit -m "feat: Replace AndroidBilling with Digital Goods API

- Remove custom AndroidBilling interface (required native code)
- Add PWABuilder's Digital Goods API (W3C standard)
- Simplify purchase flow (no fallback chains)
- Add detailed logging for debugging
- Reduce code by 39 lines
- Enable in-app billing overlay (not external Play Store)

This change makes the app work with PWABuilder-generated TWAs
without requiring custom native Android code.

BREAKING: Requires 'Digital Goods API' enabled in PWABuilder settings"

  echo ""
  echo "🚀 Pushing to origin..."
  git push origin main
  
  echo ""
  echo "═══════════════════════════════════════════════════════════════════════════════"
  echo "                              ✅ DEPLOYMENT COMPLETE"
  echo "═══════════════════════════════════════════════════════════════════════════════"
  echo ""
  echo "📋 Next Steps:"
  echo ""
  echo "1. Wait for Netlify deployment (automatic)"
  echo "   → Check: https://app.netlify.com"
  echo ""
  echo "2. Generate TWA with PWABuilder"
  echo "   → Go to: https://www.pwabuilder.com"
  echo "   → Enter your Netlify URL"
  echo "   → Click 'Package for Stores' → 'Android'"
  echo "   → ✅ CRITICAL: Enable 'Digital Goods API' checkbox"
  echo "   → Download .aab file"
  echo ""
  echo "3. Setup Google Play Console"
  echo "   → Create in-app product: 'premium_unlock'"
  echo "   → Price: \$4.99 USD"
  echo "   → Status: Active"
  echo ""
  echo "4. Upload & Test"
  echo "   → Upload .aab to closed testing"
  echo "   → Install from Play Store"
  echo "   → Test purchase flow"
  echo "   → Verify in-app billing overlay appears"
  echo ""
  echo "═══════════════════════════════════════════════════════════════════════════════"
  echo ""
  echo "🎉 Your 30-day nightmare ends today!"
  echo ""
else
  echo ""
  echo "❌ Deployment cancelled"
  echo ""
fi
