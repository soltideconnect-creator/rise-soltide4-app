# 🔍 Paystack Payment Debugging Guide

## Issue: Button Stuck on "Loading Payment System..."

### ✅ What Was Fixed

The latest update adds comprehensive debugging and error handling:

1. **Retry Limit**: Maximum 10 seconds (20 attempts × 500ms)
2. **Script Load Tracking**: Detects if Paystack script loads or fails
3. **Error Detection**: Identifies ad blockers, privacy extensions, network issues
4. **User Feedback**: Shows clear error messages and refresh button
5. **Console Logging**: Detailed logs for debugging

---

## 🧪 How to Debug

### Step 1: Open Browser Console

**Chrome/Edge:**
- Press `F12` or `Ctrl+Shift+I` (Windows/Linux)
- Press `Cmd+Option+I` (Mac)

**Firefox:**
- Press `F12` or `Ctrl+Shift+K`

**Safari:**
- Enable Developer Menu: Safari → Preferences → Advanced → Show Develop menu
- Press `Cmd+Option+C`

### Step 2: Navigate to Stats Page

Go to the Stats tab and watch the console output.

### Step 3: Check Console Messages

You should see one of these patterns:

#### ✅ SUCCESS Pattern:
```
🚀 Starting Paystack initialization check...
Is TWA with billing? false
🔍 Checking Paystack... Attempt 1/20
window.PaystackPop exists? true
window.paystackLoadAttempted? true
window.paystackLoadFailed? false
✅ Paystack payment system loaded successfully!
```

#### ❌ BLOCKED Pattern (Ad Blocker):
```
🚀 Starting Paystack initialization check...
Is TWA with billing? false
🔍 Checking Paystack... Attempt 1/20
window.PaystackPop exists? false
window.paystackLoadAttempted? true
window.paystackLoadFailed? true
❌ Paystack script failed to load (network error or blocked)
```

#### ⏳ TIMEOUT Pattern (Network Issue):
```
🚀 Starting Paystack initialization check...
Is TWA with billing? false
🔍 Checking Paystack... Attempt 1/20
window.PaystackPop exists? false
⚠️ Paystack not loaded yet, retrying in 500ms... (1/20)
🔍 Checking Paystack... Attempt 2/20
...
🔍 Checking Paystack... Attempt 20/20
❌ Paystack failed to load after 10 seconds
```

---

## 🔧 Common Issues & Solutions

### Issue 1: Ad Blocker Blocking Paystack

**Symptoms:**
- `window.paystackLoadFailed? true`
- Button shows "Refresh Page to Load Payment"
- Error: "Payment system blocked"

**Solutions:**
1. **Disable ad blocker** for your site:
   - uBlock Origin: Click icon → Click power button
   - AdBlock Plus: Click icon → "Don't run on pages on this domain"
   - Brave: Click shield icon → "Shields Down"

2. **Whitelist Paystack domain**:
   - Add `js.paystack.co` to ad blocker whitelist

3. **Use different browser**:
   - Try Chrome without extensions
   - Try Firefox in normal mode

### Issue 2: Incognito/Private Mode Restrictions

**Symptoms:**
- Script loads but localStorage doesn't persist
- Premium unlocks but resets after closing browser

**Solutions:**
1. **Use normal browser mode** (recommended)
2. **Allow cookies in incognito**:
   - Chrome: Settings → Privacy → Cookies → Allow all cookies
   - Firefox: Settings → Privacy → Custom → Cookies → Allow

### Issue 3: Network Connectivity Issues

**Symptoms:**
- Timeout after 10 seconds
- No `paystackLoadAttempted` flag set
- Network errors in console

**Solutions:**
1. **Check internet connection**
2. **Disable VPN** temporarily
3. **Try different network** (mobile data vs WiFi)
4. **Check firewall settings**

### Issue 4: Content Security Policy (CSP) Blocking

**Symptoms:**
- CSP errors in console
- Script blocked by browser policy

**Solutions:**
1. **Check Netlify headers** (if self-hosting)
2. **Verify no browser extensions** blocking scripts
3. **Test in clean browser profile**

---

## 🧪 Testing Checklist

Test the payment flow in these scenarios:

- [ ] **Normal Chrome** (no extensions)
- [ ] **Chrome Incognito** (with cookies allowed)
- [ ] **Firefox** (normal mode)
- [ ] **Safari** (if on Mac/iOS)
- [ ] **Mobile Chrome** (Android)
- [ ] **Mobile Safari** (iOS)
- [ ] **With ad blocker disabled**
- [ ] **On different network** (WiFi vs mobile data)

---

## 📊 Expected Console Output (Success)

When everything works correctly, you should see:

```
🚀 Starting Paystack initialization check...
Is TWA with billing? false
🔍 Checking Paystack... Attempt 1/20
window.PaystackPop exists? true
window.paystackLoadAttempted? true
window.paystackLoadFailed? false
✅ Paystack payment system loaded successfully!
```

Then when you click the button:

```
[Paystack popup opens]
[User completes payment]
Payment successful: {reference: "rise_premium_1234567890", ...}
```

---

## 🔐 Paystack Configuration Required

**CRITICAL**: You must set the **Callback URL** in Paystack Dashboard:

1. Go to: https://dashboard.paystack.com/settings/developer
2. Click: **API Keys & Webhooks**
3. Set **Live Callback URL** to:
   ```
   https://rise-soltide-app.netlify.app/
   ```
4. Click **Save changes**

Without this, payments may fail or users may not be redirected properly.

---

## 📞 Still Having Issues?

### Collect Debug Information:

1. **Browser**: Chrome 120, Firefox 121, etc.
2. **Mode**: Normal, Incognito, Private
3. **Extensions**: List active extensions
4. **Console Output**: Copy all console messages
5. **Network Tab**: Check if `inline.js` loads (Network tab in DevTools)

### Check Network Tab:

1. Open DevTools → Network tab
2. Reload page
3. Filter by "inline.js"
4. Check status:
   - ✅ **200 OK**: Script loaded successfully
   - ❌ **Failed**: Network error or blocked
   - ❌ **Blocked**: Ad blocker or CSP

### Verify Script Loading:

In console, type:
```javascript
window.PaystackPop
```

Expected output:
- ✅ `{setup: ƒ}` - Script loaded
- ❌ `undefined` - Script not loaded

---

## 🚀 Quick Fix Commands

### Force Reload (Clear Cache):
- **Chrome/Edge**: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- **Firefox**: `Ctrl+F5` or `Cmd+Shift+R`
- **Safari**: `Cmd+Option+R`

### Test in Clean Profile:
```bash
# Chrome (Windows)
chrome.exe --user-data-dir="C:\temp\chrome-test" --disable-extensions

# Chrome (Mac)
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --user-data-dir=/tmp/chrome-test --disable-extensions

# Firefox
firefox -profile /tmp/firefox-test -safe-mode
```

---

## ✅ Success Indicators

You know it's working when:

1. ✅ Button changes from "Loading..." to "Unlock Premium ₦8,000"
2. ✅ Button is clickable (not disabled)
3. ✅ Console shows "✅ Paystack payment system loaded successfully!"
4. ✅ Clicking button opens Paystack payment popup
5. ✅ No error toasts appear

---

**Last Updated:** 2025-11-30  
**Version:** 2.0 (Enhanced Debugging)
