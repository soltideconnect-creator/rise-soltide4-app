# 🔧 PWA Builder - Regenerate .aab with Microphone Permission

**Date:** 2025-11-23  
**Status:** 🔴 **URGENT - REQUIRED FOR CLOSED TESTING**  
**Issue:** Android TWA shows "No permissions requested" in app settings

---

## 🐛 PROBLEM

**Issue:** The Android TWA app shows "No permissions requested" in Android Settings → Apps → Rise → Permissions

**Root Cause:** The RECORD_AUDIO permission was not enabled in PWA Builder when generating the .aab file

**Impact:** 
- Users cannot grant microphone permission
- Sleep Tracker feature cannot work
- Closed testing blocked

---

## ✅ SOLUTION

Regenerate the .aab file in PWA Builder with microphone permission enabled.

---

## 📋 STEP-BY-STEP INSTRUCTIONS

### Step 1: Access PWA Builder

1. Go to: https://www.pwabuilder.com/
2. Enter your app URL: `https://rise-soltide-app.netlify.app/`
3. Click "Start"
4. Wait for PWA analysis to complete

### Step 2: Navigate to Android Package Settings

1. Click "Package for Stores"
2. Select "Android"
3. You'll see the Android package configuration screen

### Step 3: Configure Basic Settings

```
Package ID: com.soltide.rise
App Name: Rise – Habit Tracker & Smart Sleep
Version: 1.0.1  (increment from 1.0.0)
Version Code: 2  (increment from 1)

Display Mode: standalone
Orientation: portrait-primary
Theme Color: #5E5CE6
Background Color: #ffffff
```

**IMPORTANT:** Increment version code to 2 (was 1) for the update

### Step 4: Enable Microphone Permission ⚠️ CRITICAL

1. Scroll down to **"Permissions"** section
2. Find **"Microphone"** in the permissions list
3. ✅ **CHECK the "Microphone" checkbox**
4. Verify the checkbox is ticked (should show a checkmark)

**This is the critical step that was missing!**

### Step 5: Configure Google Play Billing

```
Enable Google Play Billing: ✅ YES
Billing SKU: premium_unlock
Billing Price: $4.99
```

### Step 6: Review All Settings

Before generating, verify:

```
✅ Package ID: com.soltide.rise
✅ Version Code: 2 (incremented)
✅ Microphone Permission: CHECKED
✅ Google Play Billing: Enabled
✅ Billing SKU: premium_unlock
✅ Billing Price: $4.99
```

### Step 7: Generate Package

1. Click "Generate Package"
2. Wait for PWA Builder to generate the .aab file (1-2 minutes)
3. Download the new `.aab` file
4. Download the signing key (if not already saved)

### Step 8: Verify Generated Package

Before uploading to Play Store, verify the package includes microphone permission:

```bash
# Extract manifest from .aab (requires bundletool)
bundletool dump manifest --bundle=app-release.aab

# Look for this line in the output:
<uses-permission android:name="android.permission.RECORD_AUDIO"/>
```

**Expected Output:**
```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.soltide.rise"
    android:versionCode="2"
    android:versionName="1.0.1">
    
    <uses-permission android:name="android.permission.INTERNET"/>
    <uses-permission android:name="android.permission.RECORD_AUDIO"/>  <!-- ✅ THIS MUST BE PRESENT -->
    <uses-permission android:name="android.permission.VIBRATE"/>
    
    ...
</manifest>
```

---

## 🚀 UPLOAD TO PLAY CONSOLE

### Step 1: Create New Release

1. Go to: https://play.google.com/console
2. Navigate to: Rise app → Production → Create new release
3. Or: Testing → Closed testing → Create new release

### Step 2: Upload New .aab

1. Click "Upload" and select the new `.aab` file
2. Wait for upload to complete
3. Play Console will analyze the package

### Step 3: Verify Permissions in Play Console

After upload, Play Console will show:

```
Permissions declared:
✅ Microphone (android.permission.RECORD_AUDIO)
✅ Internet (android.permission.INTERNET)
✅ Vibrate (android.permission.VIBRATE)
```

**If you don't see "Microphone" in the list, the .aab was not generated correctly. Go back to Step 4.**

### Step 4: Update Release Notes

```
Release name: 1.0.1
Release notes:

🔧 Bug Fixes:
• Fixed microphone permission for Sleep Tracker
• Added proper permission declarations
• Improved permission request flow

🎯 What's New:
• Sleep Tracker now properly requests microphone access
• Enhanced error messages for permission denials
• Better privacy messaging

📱 How to Use Sleep Tracker:
1. Navigate to Sleep Tracker tab
2. Tap "Start Sleep Tracking"
3. Allow microphone permission when prompted
4. Sleep tracking will begin

Note: Microphone access is local only - no data leaves your device.
```

### Step 5: Submit for Review

1. Click "Save"
2. Click "Review release"
3. Verify all details are correct
4. Click "Start rollout to Closed testing" (or Production)

---

## 🧪 TESTING AFTER DEPLOYMENT

### Test 1: Verify Permission in Android Settings

1. Install the updated app from Play Store (closed testing)
2. Go to: Android Settings → Apps → Rise → Permissions
3. **VERIFY:** "Microphone" permission is listed
4. **VERIFY:** Permission status shows "Not allowed" (default)

**Expected Result:**
```
Rise
Permissions

Microphone          Not allowed  >
```

**If "Microphone" is not listed, the .aab was not generated correctly.**

### Test 2: Grant Permission via App

1. Open Rise app
2. Navigate to Sleep Tracker tab
3. Tap "Start Sleep Tracking"
4. **VERIFY:** Microphone permission prompt appears
5. Tap "Allow"
6. **VERIFY:** Green success card shows
7. **VERIFY:** Toast shows "Sleep tracking started. Good night! 🌙"
8. **VERIFY:** Tracking starts successfully

### Test 3: Verify Permission in Settings After Grant

1. Go to: Android Settings → Apps → Rise → Permissions
2. **VERIFY:** "Microphone" permission status shows "Allowed"

**Expected Result:**
```
Rise
Permissions

Microphone          Allowed  >
```

### Test 4: Revoke and Re-grant Permission

1. In Android Settings → Apps → Rise → Permissions → Microphone
2. Select "Don't allow"
3. Open Rise app
4. Navigate to Sleep Tracker
5. Tap "Start Sleep Tracking"
6. **VERIFY:** Red error card shows with instructions
7. Follow instructions to re-enable permission
8. Try again
9. **VERIFY:** Tracking starts successfully

---

## 📝 MANIFEST.JSON UPDATE

The `public/manifest.json` file has been updated to include permission hints:

```json
{
  "id": "com.soltide.rise",
  "name": "Rise – Habit Tracker & Smart Sleep",
  "permissions": [
    "microphone"
  ],
  ...
}
```

This helps PWA Builder understand what permissions are needed, but **you must still manually check the "Microphone" checkbox in PWA Builder**.

---

## ⚠️ COMMON MISTAKES TO AVOID

### Mistake 1: Forgetting to Check Microphone Permission
**Problem:** Generated .aab doesn't include RECORD_AUDIO permission  
**Solution:** Always verify the "Microphone" checkbox is ticked in PWA Builder

### Mistake 2: Not Incrementing Version Code
**Problem:** Play Console rejects upload (duplicate version)  
**Solution:** Always increment version code (1 → 2 → 3...)

### Mistake 3: Not Verifying Package Before Upload
**Problem:** Upload .aab without microphone permission, waste time  
**Solution:** Use bundletool to verify manifest before uploading

### Mistake 4: Using Same Signing Key
**Problem:** If you lost the original signing key, you cannot update the app  
**Solution:** Always use the SAME signing key for updates (keep it secure!)

---

## 🔐 SIGNING KEY MANAGEMENT

### If You Have the Original Signing Key

1. Use the same `.keystore` file from the first release
2. Use the same key password
3. PWA Builder will use this key to sign the new .aab

### If You Lost the Signing Key

⚠️ **CRITICAL ISSUE:** You cannot update the app without the original signing key

**Options:**
1. **Best:** Find the original signing key (check backups, secure storage)
2. **Last Resort:** Create a new app with a different package ID (e.g., `com.soltide.rise2`)
   - Users will need to uninstall old app and install new one
   - You'll lose all reviews and ratings
   - Not recommended

**Prevention:** Always backup signing keys in multiple secure locations!

---

## 📊 VERIFICATION CHECKLIST

Before submitting to Play Store:

### PWA Builder Configuration
- [ ] Package ID: `com.soltide.rise`
- [ ] Version Code: `2` (incremented)
- [ ] Version Name: `1.0.1`
- [ ] Microphone Permission: ✅ CHECKED
- [ ] Google Play Billing: Enabled
- [ ] Billing SKU: `premium_unlock`
- [ ] Billing Price: `$4.99`

### Package Verification
- [ ] Downloaded new `.aab` file
- [ ] Verified manifest includes `RECORD_AUDIO` permission (using bundletool)
- [ ] File size reasonable (~15-20 MB)
- [ ] Signing key used (same as original)

### Play Console Upload
- [ ] Uploaded new `.aab` to closed testing track
- [ ] Play Console shows "Microphone" in permissions list
- [ ] Release notes updated
- [ ] Version code incremented

### Testing
- [ ] Installed updated app from Play Store
- [ ] Verified "Microphone" permission in Android Settings
- [ ] Tested permission grant flow
- [ ] Tested Sleep Tracker functionality
- [ ] Verified permission denial flow
- [ ] Verified error messages

---

## 🎯 SUCCESS CRITERIA

After completing all steps, you should have:

✅ New `.aab` file with version code 2  
✅ RECORD_AUDIO permission included in manifest  
✅ Uploaded to Play Store closed testing  
✅ "Microphone" permission visible in Android Settings  
✅ Sleep Tracker working correctly  
✅ Permission grant/deny flows working  
✅ Error messages displaying correctly  

---

## 🚨 TROUBLESHOOTING

### Issue: PWA Builder doesn't show "Microphone" checkbox

**Solution:**
1. Clear browser cache
2. Try a different browser (Chrome recommended)
3. Ensure manifest.json includes `"permissions": ["microphone"]`
4. Re-analyze the PWA

### Issue: Generated .aab doesn't include RECORD_AUDIO

**Cause:** Microphone checkbox was not checked in PWA Builder

**Solution:**
1. Go back to PWA Builder
2. Verify "Microphone" checkbox is ticked
3. Generate package again
4. Verify manifest using bundletool

### Issue: Play Console rejects upload

**Possible Causes:**
1. Version code not incremented
2. Signing key mismatch
3. Package ID mismatch

**Solution:**
1. Verify version code is incremented (2, not 1)
2. Use the same signing key as original release
3. Verify package ID is `com.soltide.rise`

### Issue: "Microphone" not showing in Android Settings after install

**Cause:** The .aab doesn't include RECORD_AUDIO permission

**Solution:**
1. Verify the uploaded .aab using bundletool
2. If permission is missing, regenerate .aab with microphone checkbox ticked
3. Upload new .aab to Play Store

---

## 📞 SUPPORT

### Resources

- **PWA Builder Docs:** https://docs.pwabuilder.com/
- **Play Console Help:** https://support.google.com/googleplay/android-developer
- **Bundletool:** https://github.com/google/bundletool

### Quick Links

- **PWA Builder:** https://www.pwabuilder.com/
- **Play Console:** https://play.google.com/console
- **App URL:** https://rise-soltide-app.netlify.app/

---

## ✅ FINAL CHECKLIST

Before closing this task:

- [ ] Manifest.json updated with permissions field
- [ ] Changes committed to Git
- [ ] Changes pushed to GitHub
- [ ] Netlify deployed (for PWA Builder to analyze)
- [ ] New .aab generated in PWA Builder with microphone permission
- [ ] .aab verified using bundletool
- [ ] .aab uploaded to Play Store closed testing
- [ ] App installed from Play Store
- [ ] "Microphone" permission visible in Android Settings
- [ ] Sleep Tracker tested and working
- [ ] Permission flows tested (grant, deny, re-grant)
- [ ] Closed testing ready to proceed

---

## 🎉 COMPLETION

Once all steps are complete:

✅ Android TWA will show "Microphone" permission in settings  
✅ Users can grant microphone permission  
✅ Sleep Tracker will work correctly  
✅ Closed testing can proceed  
✅ App ready for production launch  

---

**Status:** 🔴 **ACTION REQUIRED**  
**Priority:** 🔴 **CRITICAL (Closed Testing Blocker)**  
**Next Step:** Regenerate .aab in PWA Builder with microphone permission checked  

---

*Last Updated: 2025-11-23*  
*Version: 1.0.1 (with RECORD_AUDIO permission)*
