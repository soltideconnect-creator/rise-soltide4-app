# Blank Screen Debug Guide

## 🚨 Current Status

**URL:** https://app-7qtp23c0l8u9.appmedo.com  
**Issue:** Blank screen on laptop  
**Android:** Works fine  

## ✅ Debug Version Deployed

I've deployed a debug version with:
1. **Global error handlers** - catches all JavaScript errors
2. **Error display** - shows errors on screen instead of blank
3. **Detailed logging** - console logs every step
4. **Service worker disabled** - temporarily disabled to test if it's the cause

---

## 🔍 How to Debug

### Step 1: Push to Deploy

```bash
git push origin master
```

Wait 1-2 minutes for Netlify to deploy.

### Step 2: Clear Browser Cache COMPLETELY

**CRITICAL:** You must clear the old service worker first!

Open DevTools Console (F12 → Console) and paste this:

```javascript
// NUCLEAR OPTION - Clear everything
(async function() {
  console.log('🚀 Clearing all caches...');
  
  // Unregister ALL service workers
  const registrations = await navigator.serviceWorker.getRegistrations();
  for (let registration of registrations) {
    await registration.unregister();
    console.log('✅ Unregistered:', registration.scope);
  }
  
  // Delete ALL caches
  const cacheNames = await caches.keys();
  for (let cacheName of cacheNames) {
    await caches.delete(cacheName);
    console.log('✅ Deleted cache:', cacheName);
  }
  
  // Clear storage
  localStorage.clear();
  sessionStorage.clear();
  
  console.log('🎉 All caches cleared! Reloading...');
  setTimeout(() => location.reload(true), 2000);
})();
```

### Step 3: Check What Happens

After the page reloads, one of three things will happen:

#### Scenario A: App Loads Successfully ✅

**What this means:** The service worker was the problem!

**Console will show:**
```
[App] Starting Rise app...
[App] Environment: production
[App] Base URL: /
[App] Root element found, rendering app...
[App] App rendered successfully
```

**Next steps:**
1. Service worker needs to be fixed
2. Re-enable service worker with better error handling
3. Deploy fixed version

#### Scenario B: Error Message Shows on Screen ❌

**What this means:** JavaScript error preventing app from loading

**You'll see:**
```
App Failed to Load
Error: [error message]
Stack: [stack trace]
```

**Next steps:**
1. Read the error message
2. Check the stack trace
3. Fix the specific error
4. Redeploy

#### Scenario C: Still Blank Screen ⚠️

**What this means:** Error happening before our error handlers load

**Possible causes:**
1. HTML file not loading
2. JavaScript file not loading
3. Network error
4. CORS issue

**Next steps:**
1. Check browser console for errors
2. Check Network tab in DevTools
3. Look for failed requests (red)
4. Check if index.html loads
5. Check if JS/CSS bundles load

---

## 🔍 Detailed Debugging Steps

### Check 1: Open Browser Console

1. Go to https://app-7qtp23c0l8u9.appmedo.com
2. Press `F12` to open DevTools
3. Go to **Console** tab
4. Look for messages starting with `[App]`

**Expected (if working):**
```
[App] Starting Rise app...
[App] Environment: production
[App] Base URL: /
[App] Root element found, rendering app...
[App] App rendered successfully
```

**If you see errors:**
- Red error messages = JavaScript error
- Copy the full error message
- Copy the stack trace
- This tells us exactly what's wrong

### Check 2: Network Tab

1. Open DevTools (F12)
2. Go to **Network** tab
3. Reload the page (`Ctrl + R`)
4. Look for failed requests (red)

**Check these files:**
- `index.html` - should be 200 OK
- `index-iRQmsoxh.js` - should be 200 OK
- `index-DVnYAXMK.css` - should be 200 OK

**If any file fails:**
- Status 404 = File not found
- Status 500 = Server error
- Status 0 = Network error or CORS

### Check 3: Application Tab

1. Open DevTools (F12)
2. Go to **Application** tab
3. Check **Service Workers**

**Expected:**
- No service workers (we disabled it)
- If you see old service workers, unregister them

### Check 4: Sources Tab

1. Open DevTools (F12)
2. Go to **Sources** tab
3. Check if files are loaded

**Expected files:**
- index.html
- index-iRQmsoxh.js
- index-DVnYAXMK.css

**If files missing:**
- Build issue
- Deployment issue
- Network issue

---

## 🆘 Common Issues and Solutions

### Issue 1: Old Service Worker Still Active

**Symptoms:**
- Console shows old service worker logs
- App still blank
- Service worker version is old

**Solution:**

Run this in console:
```javascript
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(reg => {
    reg.unregister();
    console.log('Unregistered:', reg.scope);
  });
  setTimeout(() => location.reload(), 1000);
});
```

### Issue 2: JavaScript Error

**Symptoms:**
- Error message shows on screen
- Console shows red errors
- Stack trace visible

**Solution:**
1. Read the error message
2. Identify the failing component
3. Fix the code
4. Redeploy

**Common errors:**
- `Cannot read property 'X' of undefined` - null/undefined check needed
- `X is not defined` - missing import or variable
- `Failed to fetch` - network or CORS issue

### Issue 3: Network Error

**Symptoms:**
- Network tab shows failed requests
- Status 0 or 404
- Files not loading

**Solution:**
1. Check Netlify deployment status
2. Verify build succeeded
3. Check if files exist in dist folder
4. Check CORS headers

### Issue 4: CORS Error

**Symptoms:**
- Console shows CORS error
- Network requests blocked
- Cross-origin error message

**Solution:**
1. Check Netlify headers configuration
2. Add proper CORS headers
3. Verify domain configuration

### Issue 5: Build Issue

**Symptoms:**
- Files missing in Network tab
- 404 errors
- Broken imports

**Solution:**
1. Check build log in Netlify
2. Verify build succeeded
3. Check for build errors
4. Rebuild and redeploy

---

## 📊 Debugging Checklist

- [ ] Pushed debug version to master
- [ ] Waited for Netlify deploy (1-2 minutes)
- [ ] Cleared all browser caches and service workers
- [ ] Hard refreshed the page
- [ ] Opened DevTools Console
- [ ] Checked for `[App]` log messages
- [ ] Checked for error messages
- [ ] Checked Network tab for failed requests
- [ ] Checked if index.html loads
- [ ] Checked if JS/CSS bundles load
- [ ] Checked Application tab for service workers
- [ ] Unregistered any old service workers
- [ ] Tried incognito mode
- [ ] Tried different browser

---

## 📝 What to Report

After following the debugging steps, please report:

### 1. Console Logs

Copy all messages from Console tab, especially:
- `[App]` messages
- Error messages (red)
- Warning messages (yellow)

### 2. Network Tab

Screenshot or list of:
- All requests
- Failed requests (red)
- Status codes

### 3. Error Message

If error shows on screen:
- Full error message
- Stack trace

### 4. Browser Info

- Browser name and version
- Operating system
- Device type (laptop/desktop)

---

## 🎯 Expected Outcome

After deploying the debug version and clearing cache:

**Best case:**
- App loads successfully
- Console shows `[App] App rendered successfully`
- No errors
- Service worker was the problem

**Worst case:**
- Error message shows on screen
- Console shows specific error
- We know exactly what to fix

**Either way, we'll know the root cause!**

---

## 🚀 Next Steps After Debugging

### If App Loads (Service Worker Was the Issue)

1. Fix service worker with better error handling
2. Re-enable service worker registration
3. Test locally
4. Deploy fixed version

### If Error Shows (JavaScript Error)

1. Fix the specific error
2. Test locally
3. Deploy fixed version

### If Still Blank (Network/Build Issue)

1. Check Netlify deployment
2. Verify build succeeded
3. Check file paths
4. Fix configuration
5. Redeploy

---

**Status:** 🔍 DEBUG VERSION READY  
**Action:** Push to master and follow debugging steps  
**Expected:** Clear error message or working app  

**Next Command:** `git push origin master` 🚀
