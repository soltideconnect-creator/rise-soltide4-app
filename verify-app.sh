#!/bin/bash

echo "🔍 Verifying Streak App Structure..."
echo ""

# Check critical files
files=(
  "index.html"
  "src/main.tsx"
  "src/App.tsx"
  "src/index.css"
  "src/components/Onboarding.tsx"
  "src/components/BottomNav.tsx"
  "src/pages/Home.tsx"
  "src/pages/Calendar.tsx"
  "src/pages/Stats.tsx"
  "src/pages/Analytics.tsx"
  "src/pages/Sleep.tsx"
  "src/pages/Settings.tsx"
  "src/pages/HabitForm.tsx"
  "src/services/habitStorage.ts"
  "src/services/analyticsService.ts"
  "src/services/templateService.ts"
  "src/services/themeService.ts"
  "src/services/pdfExportService.ts"
)

missing=0
for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ $file (MISSING)"
    missing=$((missing + 1))
  fi
done

echo ""
if [ $missing -eq 0 ]; then
  echo "✅ All critical files present!"
else
  echo "❌ $missing files missing"
  exit 1
fi

# Check if CSS has required classes
echo ""
echo "🎨 Checking CSS utilities..."
if grep -q "text-streak" src/index.css && grep -q "text-success" src/index.css; then
  echo "✅ CSS utility classes present"
else
  echo "❌ CSS utility classes missing"
  exit 1
fi

# Check package.json dependencies
echo ""
echo "📦 Checking key dependencies..."
deps=("react" "react-dom" "next-themes" "lucide-react" "recharts")
for dep in "${deps[@]}"; do
  if grep -q "\"$dep\"" package.json; then
    echo "✅ $dep"
  else
    echo "❌ $dep (MISSING)"
    missing=$((missing + 1))
  fi
done

echo ""
echo "✅ App structure verification complete!"
echo ""
echo "🚀 The app should now display correctly."
echo "   If you still see a blank screen:"
echo "   1. Hard refresh your browser (Ctrl+Shift+R)"
echo "   2. Clear browser cache"
echo "   3. Try incognito/private mode"
echo "   4. Check browser console for errors (F12)"
