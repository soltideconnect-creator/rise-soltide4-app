# 🧪 GOOGLE PLAY BILLING - COMPREHENSIVE TESTING GUIDE

## 📋 OVERVIEW

This guide provides step-by-step instructions for testing the Google Play Billing integration on both web preview and Netlify deployment.

---

## 🎯 WHAT WE'RE TESTING

### 1. Android Detection
- ✅ Detects Android devices correctly
- ✅ Detects web browsers correctly
- ✅ Force Android mode works for testing

### 2. UI Behavior
- ✅ Paystack shows on web
- ✅ Paystack hidden on Android
- ✅ Google Play button shows on Android
- ✅ Restore Purchase button shows on Android

### 3. Purchase Flow
- ✅ Purchase button works on Android
- ✅ Restore button works on Android
- ✅ Error messages are clear
- ✅ Premium status syncs correctly

### 4. Automatic Restoration
- ✅ Restores on app start (Android)
- ✅ Works across device changes
- ✅ Non-blocking initialization

---

## 🧪 TEST 1: WEB ENVIRONMENT (DEFAULT)

### Access the Billing Test Page:

1. **Open the app in your browser**
   - Local: `http://localhost:5173` (if running dev server)
   - Or wait for Netlify deployment

2. **Navigate to Billing Test Page:**
   - Go to Settings tab (bottom navigation)
   - Scroll down to "About" section
   - Click "🧪 Billing Test (Dev)"

3. **Verify Environment Detection:**
   ```
   Expected Results:
   ✅ Android Detected: ❌ (should be false)
   ✅ TWA Billing Available: ❌ (should be false)
   ✅ Premium Status: ❌ (unless previously unlocked)
   ✅ Force Android Mode: ❌ (should be false)
   ✅ AndroidBilling Interface: ❌ (should be false)
   ✅ Display Mode: browser
   ✅ User Agent: Should NOT contain "Android"
   ```

4. **Run Comprehensive Tests:**
   - Click "Run All Tests" button
   - Verify all tests pass
   - Check test results section

5. **Verify Stats Page:**
   - Go to Stats tab
   - Scroll to premium section
   - **Expected:**
     - ✅ Email input visible
     - ✅ "Unlock Premium - ₦8,000" button visible
     - ✅ "Secure payment via Paystack" text visible
     - ❌ NO "Get Premium (Google Play)" button
     - ❌ NO "Restore Purchase" button

### ✅ TEST 1 CHECKLIST:
- [ ] Billing Test page loads without errors
- [ ] Android Detected shows ❌
- [ ] TWA Billing Available shows ❌
- [ ] All comprehensive tests pass
- [ ] Stats page shows Paystack UI
- [ ] No Google Play buttons visible

---

## 🧪 TEST 2: ANDROID SIMULATION (FORCE MODE)

### Enable Android Mode:

1. **On Billing Test Page:**
   - Click "Enable Android Mode" button
   - Wait for success toast
   - Page will reload automatically

2. **Verify Environment Detection After Reload:**
   ```
   Expected Results:
   ✅ Android Detected: ✅ (should be true)
   ✅ TWA Billing Available: ✅ (should be true)
   ✅ Premium Status: ❌ (unless previously unlocked)
   ✅ Force Android Mode: ✅ (should be true)
   ✅ AndroidBilling Interface: ❌ (still false on web)
   ✅ Display Mode: browser (still browser on web)
   ✅ User Agent: Same as before (but force mode overrides)
   ```

3. **Run Comprehensive Tests:**
   - Click "Run All Tests" button
   - Verify all tests pass
   - Check that Android detection is now true

4. **Verify Stats Page:**
   - Go to Stats tab
   - Scroll to premium section
   - **Expected:**
     - ✅ "Get Premium - $4.99 (Google Play)" button visible
     - ✅ "Restore Purchase" button visible
     - ❌ NO email input
     - ❌ NO Paystack button
     - ❌ NO "Secure payment via Paystack" text

5. **Test Purchase Flow:**
   - On Billing Test page, click "Test Purchase"
   - **Expected:** Error message: "Google Play Billing is not available. Please make sure you downloaded the app from Google Play Store."
   - This is correct behavior (AndroidBilling interface not available on web)

6. **Test Restore Flow:**
   - On Billing Test page, click "Test Restore"
   - **Expected:** Same error message as above
   - This is correct behavior

### ✅ TEST 2 CHECKLIST:
- [ ] Force Android mode enables successfully
- [ ] Android Detected shows ✅
- [ ] TWA Billing Available shows ✅
- [ ] Stats page hides Paystack completely
- [ ] Stats page shows Google Play buttons
- [ ] Test Purchase shows appropriate error
- [ ] Test Restore shows appropriate error

---

## 🧪 TEST 3: DISABLE ANDROID MODE

### Return to Web Mode:

1. **On Billing Test Page:**
   - Click "Disable Android Mode" button
   - Wait for success toast
   - Page will reload automatically

2. **Verify Environment Detection:**
   ```
   Expected Results:
   ✅ Android Detected: ❌ (back to false)
   ✅ TWA Billing Available: ❌ (back to false)
   ✅ Force Android Mode: ❌ (back to false)
   ```

3. **Verify Stats Page:**
   - Go to Stats tab
   - **Expected:** Paystack UI visible again

### ✅ TEST 3 CHECKLIST:
- [ ] Disable Android mode works
- [ ] Android Detected shows ❌
- [ ] Stats page shows Paystack again
- [ ] Everything back to normal web mode

---

## 🧪 TEST 4: PREMIUM UNLOCK FLOW (WEB)

### Test Paystack Payment:

1. **Ensure Android mode is disabled**

2. **Go to Stats tab**

3. **Enter email address:**
   - Enter a valid email
   - Click "Save Email"

4. **Click "Unlock Premium" button:**
   - Paystack popup should open
   - **Note:** Use Paystack test card for testing:
     - Card: 4084 0840 8408 4081
     - CVV: 408
     - Expiry: Any future date
     - PIN: 0000
     - OTP: 123456

5. **Complete payment:**
   - Premium should unlock immediately
   - Toast notification should appear
   - Stats page should show "Premium Active! 🎉"

6. **Verify Premium Status:**
   - Go to Billing Test page
   - Premium Status should show ✅
   - Go to Sleep tab - should be accessible

### ✅ TEST 4 CHECKLIST:
- [ ] Email input works
- [ ] Paystack popup opens
- [ ] Payment completes successfully
- [ ] Premium unlocks immediately
- [ ] Premium status persists after refresh
- [ ] Sleep tab becomes accessible

---

## 🧪 TEST 5: PREMIUM PERSISTENCE

### Test LocalStorage Persistence:

1. **After unlocking premium (Test 4):**
   - Refresh the page
   - Premium should still be active

2. **Open in new tab:**
   - Open app in new browser tab
   - Premium should be active

3. **Close and reopen browser:**
   - Close all tabs
   - Reopen app
   - Premium should still be active

4. **Clear Premium (Testing):**
   - Go to Billing Test page
   - Click "Clear Premium" button
   - Premium status should reset to ❌

### ✅ TEST 5 CHECKLIST:
- [ ] Premium persists after page refresh
- [ ] Premium persists in new tabs
- [ ] Premium persists after browser restart
- [ ] Clear Premium button works

---

## 🧪 TEST 6: AUTOMATIC RESTORATION (ANDROID SIMULATION)

### Test Automatic Restoration on App Start:

1. **Unlock premium first (if not already):**
   - Follow Test 4 to unlock premium

2. **Enable Android mode:**
   - Go to Billing Test page
   - Click "Enable Android Mode"
   - Page reloads

3. **Check console logs:**
   - Open browser DevTools (F12)
   - Go to Console tab
   - Look for: "Android detected - attempting automatic purchase restoration..."
   - Should see: "Could not restore purchases automatically" (expected on web)

4. **Verify premium status maintained:**
   - Premium should still be active
   - Sleep tab should still be accessible

### ✅ TEST 6 CHECKLIST:
- [ ] Console shows automatic restoration attempt
- [ ] Premium status maintained
- [ ] No errors in console
- [ ] App loads normally

---

## 🧪 TEST 7: EDGE CASES

### Test Various Edge Cases:

1. **Multiple Tab Sync:**
   - Open app in two tabs
   - Unlock premium in one tab
   - Refresh other tab
   - Premium should sync

2. **Network Failure Simulation:**
   - Open DevTools
   - Go to Network tab
   - Set throttling to "Offline"
   - Try to unlock premium
   - Should show appropriate error

3. **Invalid Email:**
   - Try to save invalid email
   - Should show validation error

4. **Rapid Toggle:**
   - Enable/disable Android mode rapidly
   - Should handle gracefully

### ✅ TEST 7 CHECKLIST:
- [ ] Multi-tab sync works
- [ ] Network errors handled gracefully
- [ ] Email validation works
- [ ] Rapid toggles don't break app

---

## 🚀 NETLIFY DEPLOYMENT TESTING

### After Pushing to GitHub:

1. **Wait for Netlify deployment:**
   - Push changes to GitHub
   - Netlify auto-deploys (2-3 minutes)
   - Check Netlify dashboard for deployment status

2. **Test on Netlify URL:**
   - Visit: https://rise-soltide-app.netlify.app/
   - Repeat ALL tests above (Test 1-7)
   - Verify everything works on production

3. **Test on Mobile Browser:**
   - Open Netlify URL on mobile device
   - Should detect as web (not Android app)
   - Paystack should be visible
   - Test payment flow on mobile

4. **Test on Android Device (Browser):**
   - Open Netlify URL in Chrome on Android
   - Should still show Paystack (it's a browser, not TWA)
   - Force Android mode should work
   - Verify UI switches correctly

### ✅ NETLIFY TESTING CHECKLIST:
- [ ] Deployment succeeds
- [ ] All tests pass on Netlify
- [ ] Mobile browser works correctly
- [ ] Android browser shows Paystack
- [ ] Force mode works on all devices

---

## 📊 FINAL VERIFICATION CHECKLIST

### Before Pushing to GitHub:

#### Code Quality:
- [x] Build succeeds without errors
- [x] All TypeScript types correct
- [x] No console errors
- [x] All imports resolve

#### Web Environment:
- [ ] Detects as web correctly
- [ ] Shows Paystack payment UI
- [ ] Email input works
- [ ] Payment flow completes
- [ ] Premium unlocks correctly

#### Android Simulation:
- [ ] Force Android mode works
- [ ] Hides Paystack completely
- [ ] Shows Google Play buttons
- [ ] Error messages are clear
- [ ] Automatic restoration attempts

#### Premium Features:
- [ ] Premium persists after refresh
- [ ] Premium syncs across tabs
- [ ] Sleep tab unlocks with premium
- [ ] Clear premium works

#### Edge Cases:
- [ ] Multi-tab sync works
- [ ] Network errors handled
- [ ] Email validation works
- [ ] Rapid toggles handled

#### Documentation:
- [x] Testing guide complete
- [x] All steps documented
- [x] Expected results clear
- [x] Troubleshooting included

---

## 🐛 TROUBLESHOOTING

### Issue: Billing Test page not accessible

**Solution:**
- Make sure you're on Settings tab
- Scroll down to "About" section
- Look for "🧪 Billing Test (Dev)" button
- If not visible, check App.tsx for navigation handler

### Issue: Force Android mode doesn't work

**Solution:**
- Check browser console for errors
- Verify localStorage is enabled
- Try clearing browser cache
- Reload page after enabling

### Issue: Paystack still shows on Android mode

**Solution:**
- Verify Force Android mode is enabled (check Billing Test page)
- Reload the page after enabling
- Check console for "Android detected" log
- Clear browser cache if needed

### Issue: Premium doesn't persist

**Solution:**
- Check localStorage is enabled in browser
- Verify no browser extensions blocking storage
- Check console for errors
- Try different browser

### Issue: Tests fail on Netlify

**Solution:**
- Check Netlify build logs for errors
- Verify environment variables are set
- Test locally first
- Check browser console on Netlify

---

## 📝 TEST RESULTS TEMPLATE

Use this template to document your test results:

```
# Billing Integration Test Results

Date: _______________
Tester: _______________
Environment: [ ] Local [ ] Netlify

## Test 1: Web Environment
- Android Detection: [ ] PASS [ ] FAIL
- Paystack Visible: [ ] PASS [ ] FAIL
- Comprehensive Tests: [ ] PASS [ ] FAIL
Notes: _______________

## Test 2: Android Simulation
- Force Mode Works: [ ] PASS [ ] FAIL
- Paystack Hidden: [ ] PASS [ ] FAIL
- Google Play Buttons: [ ] PASS [ ] FAIL
Notes: _______________

## Test 3: Disable Android Mode
- Returns to Web: [ ] PASS [ ] FAIL
- Paystack Visible Again: [ ] PASS [ ] FAIL
Notes: _______________

## Test 4: Premium Unlock
- Email Input: [ ] PASS [ ] FAIL
- Paystack Payment: [ ] PASS [ ] FAIL
- Premium Unlocks: [ ] PASS [ ] FAIL
Notes: _______________

## Test 5: Premium Persistence
- After Refresh: [ ] PASS [ ] FAIL
- New Tab: [ ] PASS [ ] FAIL
- Browser Restart: [ ] PASS [ ] FAIL
Notes: _______________

## Test 6: Automatic Restoration
- Console Logs: [ ] PASS [ ] FAIL
- Premium Maintained: [ ] PASS [ ] FAIL
Notes: _______________

## Test 7: Edge Cases
- Multi-tab Sync: [ ] PASS [ ] FAIL
- Network Errors: [ ] PASS [ ] FAIL
- Email Validation: [ ] PASS [ ] FAIL
Notes: _______________

## Overall Result: [ ] PASS [ ] FAIL

Additional Notes:
_______________
```

---

## ✅ READY FOR PRODUCTION

Once all tests pass:

1. **Document test results**
2. **Commit all changes**
3. **Push to GitHub**
4. **Deploy to Netlify**
5. **Test on production**
6. **Upload APK/AAB to Google Play**
7. **Test on actual Android device**
8. **Submit for review**

---

*Last Updated: 2025-12-18*  
*Version: 1.0*  
*Status: Ready for Testing*
