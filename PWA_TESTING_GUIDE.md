# PWA Testing Guide - Rise Habit Tracker

## How to Test PWA Features

This guide will help you verify that all PWA features are working correctly.

---

## Prerequisites

Before testing, ensure you have:
- ✅ Chrome browser (desktop or Android)
- ✅ HTTPS hosting OR localhost development server
- ✅ Internet connection (for initial load)

---

## Test 1: PWA Loads Correctly ✅

### Steps:
1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open browser and navigate to:
   ```
   http://localhost:5173
   ```

3. Open Developer Tools (F12)

4. Check Console tab for PWA messages:
   ```
   [PWA] Service Worker registered successfully: /
   [Service Worker] Loaded successfully
   [Service Worker] Installing...
   [Service Worker] Precaching assets
   [Service Worker] Activating...
   ```

### Expected Result:
- ✅ App loads without errors
- ✅ Console shows service worker registration messages
- ✅ No red errors in console
- ✅ App displays correctly

### Troubleshooting:
If service worker doesn't register:
- Ensure you're on localhost or HTTPS
- Clear browser cache (Ctrl+Shift+Delete)
- Check if `public/sw.js` exists
- Reload page (Ctrl+R)

---

## Test 2: Icon Works ✅

### Steps:
1. Open Developer Tools (F12)

2. Go to **Application** tab

3. Click **Manifest** in left sidebar

4. Check the manifest details:
   - Name: "Rise – Habit Tracker & Smart Sleep"
   - Short name: "Rise"
   - Start URL: "/"
   - Display: "standalone"
   - Theme color: "#5E5CE6"

5. Scroll down to **Icons** section

6. Verify icons are listed:
   - 192x192 (any)
   - 512x512 (any)
   - 192x192 (maskable)
   - 512x512 (maskable)

7. Click on each icon to preview

### Expected Result:
- ✅ All icons display correctly
- ✅ Icons are not blank or broken
- ✅ Icon shows Rise branding

### Troubleshooting:
If icons don't display:
- Check `public/favicon.png` exists
- Verify icon paths in `public/manifest.json`
- Clear cache and reload
- Check browser console for 404 errors

---

## Test 3: "Add to Home Screen" Prompt Appears ✅

### Desktop (Chrome/Edge):

#### Steps:
1. Open app in Chrome/Edge

2. Look for install icon in address bar (⊕ or computer icon)

3. Click the install icon

4. Click "Install" in popup

5. App should install as desktop application

#### Expected Result:
- ✅ Install icon appears in address bar
- ✅ Install popup shows app name and icon
- ✅ App installs successfully
- ✅ App appears in applications list

### Android (Chrome):

#### Steps:
1. Open app in Chrome on Android

2. Visit the app 2-3 times (Chrome requires engagement)

3. Wait for "Add to Home Screen" banner to appear

4. OR tap menu (⋮) → "Add to Home screen"

5. Tap "Add" or "Install"

6. Check home screen for app icon

7. Tap icon to open app

#### Expected Result:
- ✅ Install prompt appears automatically OR
- ✅ "Add to Home screen" option in menu
- ✅ App icon appears on home screen
- ✅ App opens in fullscreen (no browser UI)

### iOS (Safari):

#### Steps:
1. Open app in Safari on iOS

2. Tap Share button (square with arrow)

3. Scroll down and tap "Add to Home Screen"

4. Edit name if desired

5. Tap "Add"

6. Check home screen for app icon

7. Tap icon to open app

#### Expected Result:
- ✅ "Add to Home Screen" option available
- ✅ App icon appears on home screen
- ✅ App opens in fullscreen

### Troubleshooting:
If install prompt doesn't appear:

**Desktop:**
- Visit app multiple times
- Check DevTools → Application → Manifest (should show no errors)
- Ensure service worker is registered
- Try manual install from browser menu

**Android:**
- Visit app at least 3 times
- Wait 5 minutes between visits
- Check if app is already installed
- Try manual install from menu (⋮)

**iOS:**
- Ensure you're using Safari (not Chrome)
- Check if app is already on home screen
- Try clearing Safari cache

---

## Test 4: Offline Mode Works ✅

### Method 1: Using DevTools (Desktop)

#### Steps:
1. Open app in browser

2. Open Developer Tools (F12)

3. Go to **Application** tab

4. Click **Service Workers** in left sidebar

5. Verify service worker is "activated and running"

6. Go to **Network** tab

7. Check "Offline" checkbox at top

8. Refresh page (Ctrl+R)

9. App should load from cache

10. Test all features:
    - View habits
    - Add new habit
    - Edit habit
    - Delete habit
    - Mark habit complete
    - View calendar
    - View stats
    - Change settings

11. Uncheck "Offline" to go back online

#### Expected Result:
- ✅ App loads while offline
- ✅ All features work offline
- ✅ Data persists
- ✅ No network errors

### Method 2: Using Airplane Mode (Mobile)

#### Steps:
1. Open app in browser while online

2. Wait for app to fully load

3. Enable Airplane Mode on device

4. Close and reopen browser

5. Navigate to app URL

6. App should load from cache

7. Test all features

8. Disable Airplane Mode

#### Expected Result:
- ✅ App loads in airplane mode
- ✅ All features work
- ✅ Data persists
- ✅ Changes sync when back online

### Method 3: Cache Verification

#### Steps:
1. Open Developer Tools (F12)

2. Go to **Application** tab

3. Click **Cache Storage** in left sidebar

4. Expand cache entries

5. Verify cached files:
   - `rise-v1.0.0` cache
   - `rise-runtime` cache

6. Click on each cache to see cached files

7. Should see:
   - / (root)
   - /index.html
   - /manifest.json
   - /favicon.png
   - Other runtime assets

#### Expected Result:
- ✅ Cache storage exists
- ✅ Essential files are cached
- ✅ Runtime cache grows as you use app

### Troubleshooting:
If offline mode doesn't work:

1. **Service Worker Not Registered:**
   - Check console for registration errors
   - Ensure you're on localhost or HTTPS
   - Clear cache and reload

2. **Cache Empty:**
   - Visit app while online first
   - Wait for service worker to install
   - Check DevTools → Application → Cache Storage

3. **App Doesn't Load Offline:**
   - Verify service worker is activated
   - Check cache contains essential files
   - Clear cache and visit app online again

4. **Features Don't Work Offline:**
   - This is expected - app uses localStorage
   - All data is stored locally
   - No server connection needed

---

## Complete Testing Checklist

### ✅ Pre-Testing Setup
- [ ] Development server running (`npm run dev`)
- [ ] Browser open to `http://localhost:5173`
- [ ] Developer Tools open (F12)
- [ ] No console errors

### ✅ Test 1: PWA Loads Correctly
- [ ] App loads without errors
- [ ] Service worker registers successfully
- [ ] Console shows PWA messages
- [ ] No red errors in console

### ✅ Test 2: Icon Works
- [ ] Manifest loads correctly
- [ ] All icon sizes present (192x192, 512x512)
- [ ] Icons display correctly (not blank)
- [ ] Icon shows Rise branding

### ✅ Test 3: Add to Home Screen
- [ ] Install prompt appears (desktop)
- [ ] Install icon in address bar (desktop)
- [ ] "Add to Home screen" in menu (mobile)
- [ ] App installs successfully
- [ ] Icon appears on home screen
- [ ] App opens in standalone mode

### ✅ Test 4: Offline Mode
- [ ] Service worker activated
- [ ] Cache storage populated
- [ ] App loads offline (DevTools offline mode)
- [ ] App loads offline (airplane mode)
- [ ] All features work offline
- [ ] Data persists offline

### ✅ Additional Checks
- [ ] No console errors
- [ ] No 404 errors
- [ ] Manifest valid
- [ ] Service worker active
- [ ] Cache contains essential files

---

## Quick Verification Commands

Run these commands to verify files are in place:

```bash
# Check all PWA files exist
ls -lh public/sw.js public/manifest.json public/favicon.png

# Verify service worker has event listeners
grep -c "addEventListener" public/sw.js

# Verify manifest contains Rise
grep "Rise" public/manifest.json

# Check PWA registration in main.tsx
grep "serviceWorker" src/main.tsx

# Run lint check
npm run lint

# Build for production
npm run build
```

---

## Production Testing (After Deployment)

### Deploy to HTTPS Hosting

1. **Build for production:**
   ```bash
   npm run build
   ```

2. **Deploy to hosting:**
   - Netlify: `netlify deploy --prod`
   - Vercel: `vercel --prod`
   - Firebase: `firebase deploy`

3. **Test on production URL:**
   - Open `https://your-domain.com`
   - Repeat all tests above
   - Verify HTTPS is working
   - Check service worker registers

### Run Lighthouse Audit

1. Open production URL in Chrome

2. Open Developer Tools (F12)

3. Go to **Lighthouse** tab

4. Select:
   - ✅ Progressive Web App
   - ✅ Performance
   - ✅ Accessibility
   - ✅ Best Practices
   - ✅ SEO

5. Click "Generate report"

6. Wait for audit to complete

7. Check scores:
   - PWA: Should be 100
   - Performance: Should be 90+
   - Accessibility: Should be 95+
   - Best Practices: Should be 95+
   - SEO: Should be 100

### Expected Lighthouse Results:

#### PWA Checklist (Should all be ✅):
- ✅ Installable
- ✅ PWA optimized
- ✅ Works offline
- ✅ Configured for a custom splash screen
- ✅ Sets a theme color
- ✅ Content sized correctly for viewport
- ✅ Has a `<meta name="viewport">` tag
- ✅ Provides a valid `apple-touch-icon`
- ✅ Provides a valid manifest

---

## Common Issues & Solutions

### Issue 1: Service Worker Not Registering

**Symptoms:**
- No console message about service worker
- DevTools shows no service worker

**Solutions:**
1. Ensure app is on HTTPS or localhost
2. Check `public/sw.js` exists
3. Clear browser cache (Ctrl+Shift+Delete)
4. Reload page (Ctrl+R)
5. Check browser console for errors

### Issue 2: Install Prompt Not Appearing

**Symptoms:**
- No install icon in address bar
- No "Add to Home Screen" option

**Solutions:**
1. Visit app multiple times (2-3 visits)
2. Wait 5 minutes between visits
3. Check manifest is valid (DevTools → Application → Manifest)
4. Ensure service worker is registered
5. Try manual install from browser menu

### Issue 3: Offline Mode Not Working

**Symptoms:**
- App doesn't load when offline
- White screen when offline

**Solutions:**
1. Visit app while online first (to cache assets)
2. Check service worker is activated
3. Verify cache storage has files
4. Clear cache and visit app online again
5. Check console for errors

### Issue 4: Icons Not Displaying

**Symptoms:**
- Blank icon on home screen
- Default browser icon

**Solutions:**
1. Verify `public/favicon.png` exists
2. Check icon paths in manifest.json
3. Clear cache and reinstall app
4. Check icon format is PNG
5. Verify icon sizes are correct

---

## Testing on Different Browsers

### Chrome (Desktop)
- ✅ Full PWA support
- ✅ Install from address bar
- ✅ Service worker support
- ✅ Offline mode

### Edge (Desktop)
- ✅ Full PWA support
- ✅ Install from address bar
- ✅ Service worker support
- ✅ Offline mode

### Firefox (Desktop)
- ⚠️ Service worker support
- ❌ Limited install support
- ✅ Offline mode

### Safari (Desktop)
- ⚠️ Limited PWA support
- ❌ No install support
- ⚠️ Limited service worker

### Chrome (Android)
- ✅ Full PWA support
- ✅ Install prompt
- ✅ Add to Home Screen
- ✅ Standalone mode
- ✅ Offline mode

### Safari (iOS)
- ⚠️ Add to Home Screen only
- ❌ No install prompt
- ✅ Standalone mode
- ⚠️ Limited service worker

---

## Success Criteria

### ✅ All Tests Pass
- Service worker registers successfully
- Manifest loads correctly
- Icons display properly
- Install prompt appears
- App installs successfully
- Offline mode works
- Data persists

### ✅ No Errors
- No console errors
- No 404 errors
- No manifest errors
- No service worker errors

### ✅ Production Ready
- Lighthouse PWA score: 100
- All features work offline
- App installs on all platforms
- Icons display correctly

---

## Next Steps After Testing

Once all tests pass:

1. ✅ **Deploy to Production**
   - Deploy to HTTPS hosting
   - Verify all tests pass on production

2. ✅ **Run Lighthouse Audit**
   - Ensure PWA score is 100
   - Fix any issues found

3. ✅ **Create TWA Package**
   - Use Bubblewrap CLI
   - Generate Android APK

4. ✅ **Submit to Google Play Store**
   - Upload signed APK
   - Fill in store listing
   - Submit for review

---

## Support Resources

### Documentation
- [MDN PWA Guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Google PWA Guide](https://web.dev/progressive-web-apps/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

### Testing Tools
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [PWA Builder](https://www.pwabuilder.com/)
- [Manifest Validator](https://manifest-validator.appspot.com/)

### Troubleshooting
- [PWA Checklist](https://web.dev/pwa-checklist/)
- [Service Worker Debugging](https://developers.google.com/web/fundamentals/primers/service-workers/debugging)

---

## Conclusion

Follow this guide to verify all PWA features are working correctly. If all tests pass, your app is ready for Google Play Store submission via Trusted Web Activity (TWA).

**Status:** Ready for Testing ✅

**Last Updated:** 2025-11-23
