# 🚨 URGENT: Google Play Billing Fix - TODO

## ❌ CRITICAL ISSUE

The app is showing **Paystack payment** on Google Play Store, which violates Google's policies!

**Screenshot Evidence:**
- User testing on Google Play Store closed testing
- App shows "Secure payment via Paystack" text
- Email input for Paystack receipt
- This will cause **IMMEDIATE REJECTION** from Google Play

## 🎯 ROOT CAUSE

The `isTWAWithBilling()` function is not detecting the Android environment correctly.

**Current Detection Logic:**
```typescript
export function isTWAWithBilling(): boolean {
  return typeof window !== 'undefined' && typeof window.AndroidBilling !== 'undefined';
}
```

**Problem:** The TWA wrapper is not injecting `window.AndroidBilling` interface, so the app thinks it's running on web and shows Paystack.

## ✅ SOLUTION PLAN

### Step 1: Improve Android Detection
- Add multiple detection methods:
  1. Check for `window.AndroidBilling` (current)
  2. Check User-Agent for Android
  3. Check for TWA-specific features
  4. Check for `navigator.standalone` or TWA indicators
  5. Add localStorage flag for manual override

### Step 2: Remove Paystack from Android Build
- Completely remove Paystack payment UI when on Android
- Show only Google Play Billing button
- Add clear error messages if billing not available

### Step 3: Implement Proper Google Play Billing
- Ensure `window.AndroidBilling` interface is properly defined
- Add proper error handling for billing failures
- Implement purchase restoration for device changes
- Add purchase verification

### Step 4: Add Restore Purchase Feature
- Prominent "Restore Purchase" button on Android
- Automatic restoration on app start
- Sync with Google Play purchases
- Handle edge cases (no internet, billing unavailable)

### Step 5: Testing & Verification
- Test on actual Android device
- Test on Google Play closed testing
- Verify Paystack is completely hidden
- Verify Google Play Billing works
- Verify purchase restoration works

## 📋 IMPLEMENTATION CHECKLIST

- [ ] Step 1: Improve Android detection logic
- [ ] Step 2: Update Stats.tsx to hide Paystack on Android
- [ ] Step 3: Add fallback detection methods
- [ ] Step 4: Implement purchase restoration UI
- [ ] Step 5: Add automatic restoration on app start
- [ ] Step 6: Test on Android device
- [ ] Step 7: Verify Google Play compliance
- [ ] Step 8: Update documentation

## 🔧 FILES TO MODIFY

1. `src/utils/googlePlayBilling.ts` - Improve detection
2. `src/pages/Stats.tsx` - Remove Paystack on Android
3. `src/App.tsx` - Add automatic restoration on start
4. `src/components/RestorePremiumWeb.tsx` - Check if needed

## ⚠️ CRITICAL REQUIREMENTS

1. **NEVER show Paystack on Android** - This violates Google Play policies
2. **ALWAYS use Google Play Billing on Android** - This is mandatory
3. **Implement purchase restoration** - Required for device changes
4. **Test on actual device** - Emulator may not have billing
5. **Verify with Google Play closed testing** - Final verification

## 🎯 SUCCESS CRITERIA

- ✅ No Paystack UI visible on Android
- ✅ Google Play Billing button shows on Android
- ✅ Restore Purchase button visible and functional
- ✅ Purchase restoration works on device change
- ✅ Premium status syncs with Google Play
- ✅ App passes Google Play review

## 📝 NOTES

- The TWA wrapper must inject `window.AndroidBilling` interface
- If not injected, we need fallback detection methods
- User-Agent detection is reliable for Android
- localStorage can be used for manual override during testing
