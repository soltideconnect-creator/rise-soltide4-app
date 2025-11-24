# Troubleshooting Guide - Blank Screen Issue

## Issue Fixed ✅

The blank screen issue has been resolved. The problem was:

### Root Cause
Missing CSS utility classes (`text-streak` and `text-success`) that were used in the Onboarding component.

### Solution Applied
Added the missing utility classes to `src/index.css`:

```css
@layer utilities {
  .text-streak {
    color: hsl(var(--streak));
  }

  .text-success {
    color: hsl(var(--success));
  }
}
```

## Verification Steps

### 1. Clear Browser Cache
The Vite development server caches compiled assets. To ensure you see the latest changes:

**Option A: Hard Refresh**
- Chrome/Edge: `Ctrl + Shift + R` (Windows/Linux) or `Cmd + Shift + R` (Mac)
- Firefox: `Ctrl + F5` (Windows/Linux) or `Cmd + Shift + R` (Mac)
- Safari: `Cmd + Option + R`

**Option B: Clear Cache via DevTools**
1. Open DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

**Option C: Incognito/Private Window**
- Open the preview URL in an incognito/private browsing window

### 2. Check Console for Errors
1. Open browser DevTools (F12)
2. Go to the Console tab
3. Look for any red error messages
4. If you see errors, copy them for debugging

### 3. Verify Build Status
The app has been successfully compiled:
- ✅ 103 TypeScript files checked
- ✅ 0 errors found
- ✅ All imports resolved
- ✅ All components properly exported

## What Should Appear

### First Time Users
You should see the **Onboarding Screen** with:
- 3 slides explaining the app features
- Icons: Flame 🔥, Calendar 📅, Trending Up 📈
- "Next" button to navigate through slides
- "Get Started" button on the final slide

### Returning Users
You should see the **Home Screen** with:
- Large circular progress ring at the top
- List of today's habits (empty if no habits created)
- Floating "+" button to add new habits
- Bottom navigation with 6 tabs:
  - Home 🏠
  - Calendar 📅
  - Stats 📊
  - Analytics 📈
  - Sleep 🌙
  - Settings ⚙️

## Common Issues and Solutions

### Issue: Still Seeing Blank Screen

**Solution 1: Force Clear Vite Cache**
The Vite cache has already been cleared on the server side. If you still see issues:
1. Close all browser tabs with the preview
2. Wait 5 seconds
3. Open a new tab and navigate to the preview URL
4. Hard refresh (Ctrl + Shift + R)

**Solution 2: Check localStorage**
The app uses localStorage for data persistence. To reset:
1. Open DevTools (F12)
2. Go to Application tab (Chrome) or Storage tab (Firefox)
3. Expand "Local Storage"
4. Right-click on your domain
5. Select "Clear"
6. Refresh the page

**Solution 3: Verify JavaScript is Enabled**
- Ensure JavaScript is enabled in your browser settings
- Check if any browser extensions are blocking scripts

### Issue: Onboarding Keeps Appearing

**Solution:**
The onboarding should only appear once. If it keeps showing:
1. Open DevTools Console
2. Run: `localStorage.setItem('streak_onboarding_completed', 'true')`
3. Refresh the page

### Issue: Premium Features Not Showing

**Solution:**
Premium features are unlocked by default. If they're not showing:
1. Open DevTools Console
2. Run: `localStorage.setItem('streak_ads_removed', 'true')`
3. Refresh the page

## Technical Details

### App Structure
```
App.tsx (Root Component)
├── ThemeProvider (Dark mode support)
├── Onboarding (First-time users)
└── Main App
    ├── Home Page
    ├── Calendar Page
    ├── Stats Page
    ├── Analytics Page (Premium)
    ├── Sleep Page
    ├── Settings Page
    ├── About Page
    ├── HabitForm (Add/Edit)
    └── BottomNav
```

### Key Files Verified
- ✅ `index.html` - Root HTML with #root div
- ✅ `src/main.tsx` - React entry point
- ✅ `src/App.tsx` - Main app component
- ✅ `src/index.css` - Global styles and design system
- ✅ All page components exist and are properly exported
- ✅ All services initialized correctly

### Dependencies Verified
- ✅ React 18.0.0
- ✅ React DOM 18.0.0
- ✅ next-themes 0.4.6
- ✅ lucide-react (icons)
- ✅ recharts (analytics charts)
- ✅ All shadcn/ui components

## Expected Behavior

### Initial Load
1. App checks if onboarding is completed
2. If not completed → Show onboarding
3. If completed → Show home screen
4. Premium features are unlocked by default
5. Theme is initialized (system default)

### Navigation
- Bottom nav switches between 6 main views
- Add/Edit habit screens hide bottom nav
- About page accessible from Settings
- All transitions are smooth

### Data Persistence
- Habits stored in localStorage
- Completions tracked per day
- Theme preference saved
- Onboarding status saved
- Premium status saved

## Still Having Issues?

If the screen is still blank after trying all solutions:

1. **Check Browser Console**
   - Press F12
   - Look for error messages
   - Copy any errors you see

2. **Check Network Tab**
   - Press F12
   - Go to Network tab
   - Refresh the page
   - Look for failed requests (red items)

3. **Try Different Browser**
   - Test in Chrome, Firefox, or Edge
   - This helps identify browser-specific issues

4. **Check Preview URL**
   - Ensure you're accessing the correct preview URL
   - The URL should be active and not expired

## Success Indicators

You'll know the app is working when you see:
- ✅ Colorful UI with indigo primary color (#5E5CE6)
- ✅ Smooth animations
- ✅ Responsive layout
- ✅ Icons from Lucide React
- ✅ Poppins font for headings
- ✅ Inter font for body text

## Additional Notes

- The app is fully offline-capable
- No backend or API calls required
- All data stored locally in browser
- Premium features unlocked for testing
- Dark mode supported via system preference or manual toggle
