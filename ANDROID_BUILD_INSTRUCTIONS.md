# Android Build Instructions - Complete Guide

## Problem

Your screenshots show:
- ❌ "No permissions requested" in Android settings
- ❌ Notifications blocked
- ❌ Microphone permission not available

**Root Cause:** The app is running as a PWA in browser, not as a native Android app with proper permissions.

## Solution

Build a proper **Android APK** using **Trusted Web Activity (TWA)** with the correct manifest.

---

## Step 1: Install Android Studio

1. Download Android Studio: https://developer.android.com/studio
2. Install Android Studio
3. Open Android Studio
4. Install Android SDK (API 33 or higher)

---

## Step 2: Create New TWA Project

### Option A: Using Bubblewrap (Recommended - Easiest)

Bubblewrap is a tool that automatically creates Android TWA projects.

```bash
# Install Bubblewrap
npm install -g @bubblewrap/cli

# Initialize TWA project
bubblewrap init --manifest https://your-netlify-site.netlify.app/manifest.json

# Follow the prompts:
# - App name: Rise - Habit Tracker and Smart Sleep
# - Package name: com.soltide.rise
# - Host: your-netlify-site.netlify.app
# - Start URL: /
# - Theme color: #5E5CE6
# - Background color: #0F172A
# - Icon: https://your-netlify-site.netlify.app/rise-icon.png

# Build APK
bubblewrap build

# The APK will be in: app-release-signed.apk
```

### Option B: Manual Android Studio Project

If you prefer manual setup, follow these steps:

1. **Create New Project:**
   - Open Android Studio
   - File → New → New Project
   - Select "Empty Activity"
   - Name: Rise
   - Package name: com.soltide.rise
   - Language: Kotlin
   - Minimum SDK: API 24 (Android 7.0)
   - Click Finish

2. **Add TWA Library:**

Edit `app/build.gradle`:

```gradle
dependencies {
    implementation 'androidx.browser:browser:1.7.0'
    implementation 'com.google.androidbrowserhelper:androidbrowserhelper:2.5.0'
}
```

3. **Replace AndroidManifest.xml:**

Use the complete manifest from `android-twa-manifest.xml` (see below).

---

## Step 3: Complete AndroidManifest.xml

Replace your `app/src/main/AndroidManifest.xml` with this:

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    package="com.soltide.rise">

    <!-- CRITICAL PERMISSIONS FOR SLEEP TRACKING -->
    
    <!-- Microphone permission for sleep tracking audio analysis -->
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    
    <!-- Audio settings for sleep tracking -->
    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
    
    <!-- Keep device awake during sleep tracking -->
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    
    <!-- Internet access for PWA -->
    <uses-permission android:name="android.permission.INTERNET" />
    
    <!-- Notifications for habit reminders -->
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    
    <!-- Vibration for haptic feedback -->
    <uses-permission android:name="android.permission.VIBRATE" />
    
    <!-- Network state for online/offline detection -->
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.Rise"
        android:usesCleartextTraffic="false"
        tools:targetApi="31">

        <!-- Main TWA Activity -->
        <activity
            android:name="com.google.androidbrowserhelper.trusted.LauncherActivity"
            android:exported="true"
            android:label="@string/app_name"
            android:theme="@style/Theme.Rise.NoActionBar"
            android:launchMode="singleTask">
            
            <!-- Main launcher intent -->
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>

            <!-- Handle all URLs from your domain -->
            <intent-filter android:autoVerify="true">
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                
                <!-- REPLACE WITH YOUR NETLIFY DOMAIN -->
                <data
                    android:scheme="https"
                    android:host="your-netlify-site.netlify.app" />
            </intent-filter>

            <!-- TWA Configuration -->
            <meta-data
                android:name="android.support.customtabs.trusted.DEFAULT_URL"
                android:value="https://your-netlify-site.netlify.app" />
            
            <meta-data
                android:name="android.support.customtabs.trusted.STATUS_BAR_COLOR"
                android:resource="@color/primary" />
            
            <meta-data
                android:name="android.support.customtabs.trusted.NAVIGATION_BAR_COLOR"
                android:resource="@color/primary" />
            
            <meta-data
                android:name="android.support.customtabs.trusted.SPLASH_IMAGE_DRAWABLE"
                android:resource="@drawable/splash" />
            
            <meta-data
                android:name="android.support.customtabs.trusted.SPLASH_SCREEN_BACKGROUND_COLOR"
                android:resource="@color/background" />
            
            <meta-data
                android:name="android.support.customtabs.trusted.SPLASH_SCREEN_FADE_OUT_DURATION"
                android:value="300" />
            
            <meta-data
                android:name="android.support.customtabs.trusted.FILE_PROVIDER_AUTHORITY"
                android:value="com.soltide.rise.fileprovider" />
        </activity>

        <!-- TWA Service -->
        <service
            android:name="com.google.androidbrowserhelper.trusted.DelegationService"
            android:exported="true">
            <intent-filter>
                <action android:name="android.support.customtabs.trusted.TRUSTED_WEB_ACTIVITY_SERVICE" />
                <category android:name="android.intent.category.DEFAULT" />
            </intent-filter>
        </service>

        <!-- File Provider for file access -->
        <provider
            android:name="androidx.core.content.FileProvider"
            android:authorities="com.soltide.rise.fileprovider"
            android:exported="false"
            android:grantUriPermissions="true">
            <meta-data
                android:name="android.support.FILE_PROVIDER_PATHS"
                android:resource="@xml/file_paths" />
        </provider>

    </application>

</manifest>
```

**IMPORTANT:** Replace `your-netlify-site.netlify.app` with your actual Netlify domain!

---

## Step 4: Create Required Resource Files

### 4.1 Create `res/values/colors.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="primary">#5E5CE6</color>
    <color name="background">#0F172A</color>
    <color name="white">#FFFFFF</color>
</resources>
```

### 4.2 Create `res/values/strings.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">Rise - Habit Tracker and Smart Sleep</string>
</resources>
```

### 4.3 Create `res/xml/file_paths.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<paths xmlns:android="http://schemas.android.com/apk/res/android">
    <external-path name="external_files" path="." />
    <cache-path name="cache" path="." />
</paths>
```

### 4.4 Create Splash Screen

Create `res/drawable/splash.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:drawable="@color/background" />
    <item>
        <bitmap
            android:gravity="center"
            android:src="@mipmap/ic_launcher" />
    </item>
</layer-list>
```

---

## Step 5: Setup Asset Links

### 5.1 Deploy assetlinks.json

The file `public/assetlinks.json` needs to be accessible at:
```
https://your-netlify-site.netlify.app/.well-known/assetlinks.json
```

This file is already in your project. Make sure it's deployed to Netlify.

### 5.2 Get Your App's SHA-256 Fingerprint

```bash
# For debug builds
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android

# For release builds (after creating keystore)
keytool -list -v -keystore your-release-key.jks -alias your-alias
```

Copy the SHA-256 fingerprint and add it to `public/assetlinks.json`:

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.soltide.rise",
      "sha256_cert_fingerprints": [
        "YOUR_SHA256_FINGERPRINT_HERE"
      ]
    }
  }
]
```

Redeploy to Netlify after updating.

---

## Step 6: Build APK

### Debug Build (for testing)

```bash
# In Android Studio
Build → Build Bundle(s) / APK(s) → Build APK(s)

# Or via command line
./gradlew assembleDebug

# APK location: app/build/outputs/apk/debug/app-debug.apk
```

### Release Build (for production)

1. **Create Keystore:**

```bash
keytool -genkey -v -keystore rise-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias rise
```

2. **Configure Signing in `app/build.gradle`:**

```gradle
android {
    signingConfigs {
        release {
            storeFile file("../rise-release-key.jks")
            storePassword "your-store-password"
            keyAlias "rise"
            keyPassword "your-key-password"
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

3. **Build Release APK:**

```bash
./gradlew assembleRelease

# APK location: app/build/outputs/apk/release/app-release.apk
```

---

## Step 7: Install and Test

### Install APK on Android Device

```bash
# Enable USB debugging on your Android device
# Connect device via USB

# Install APK
adb install app-release.apk

# Or drag and drop APK to device and install manually
```

### Test Permissions

1. Open the app
2. Go to Android Settings → Apps → Rise
3. Check "Permissions" section
4. You should see:
   - ✅ Microphone
   - ✅ Notifications
5. Go to Sleep tab in app
6. Click "Start Sleep Tracking"
7. Permission prompt should appear
8. Grant permission
9. Sleep tracking should work!

---

## Step 8: Verify Everything Works

### Checklist

- [ ] App installs successfully
- [ ] App icon appears in launcher
- [ ] App opens and loads your Netlify site
- [ ] Permissions section shows "Microphone" and "Notifications"
- [ ] Microphone permission can be granted
- [ ] Notification permission can be granted
- [ ] Sleep tracking works after granting microphone permission
- [ ] Habit reminders work after granting notification permission
- [ ] App feels native (no browser UI)
- [ ] Splash screen appears on launch
- [ ] Status bar color matches app theme

---

## Troubleshooting

### Issue: "No permissions requested" in Android settings

**Cause:** Manifest doesn't have `<uses-permission>` tags

**Solution:** Make sure your AndroidManifest.xml includes all permissions listed in Step 3

### Issue: Microphone permission denied even after granting

**Cause:** Asset links not verified

**Solution:**
1. Check assetlinks.json is accessible at `https://your-site.netlify.app/.well-known/assetlinks.json`
2. Verify SHA-256 fingerprint matches your keystore
3. Uninstall app, redeploy assetlinks.json, reinstall app

### Issue: App opens in browser instead of TWA

**Cause:** Asset links verification failed

**Solution:**
1. Wait 24 hours for Google to verify asset links
2. Or use `adb` to force verification:
```bash
adb shell pm set-app-links --package com.soltide.rise 0 all
adb shell pm verify-app-links --re-verify com.soltide.rise
```

### Issue: Build fails with "AndroidBrowserHelper not found"

**Cause:** Missing dependency

**Solution:** Add to `app/build.gradle`:
```gradle
implementation 'com.google.androidbrowserhelper:androidbrowserhelper:2.5.0'
```

---

## Quick Start with Bubblewrap (Easiest Method)

If you want the fastest way to build an APK:

```bash
# 1. Install Bubblewrap
npm install -g @bubblewrap/cli

# 2. Initialize project
bubblewrap init --manifest https://your-netlify-site.netlify.app/manifest.json

# 3. Update TWA manifest
bubblewrap update

# 4. Build APK
bubblewrap build

# 5. Install on device
adb install app-release-signed.apk
```

That's it! Bubblewrap handles all the Android Studio setup automatically.

---

## Summary

### What You Need to Do

1. ✅ Use the complete AndroidManifest.xml from Step 3
2. ✅ Replace `your-netlify-site.netlify.app` with your actual domain
3. ✅ Get SHA-256 fingerprint and add to assetlinks.json
4. ✅ Build APK using Android Studio or Bubblewrap
5. ✅ Install APK on Android device
6. ✅ Test permissions in Android Settings → Apps → Rise

### Expected Result

After following these steps:
- ✅ "Permissions" section will show "Microphone" and "Notifications"
- ✅ Microphone permission prompt will appear when starting sleep tracking
- ✅ Notification permission prompt will appear for habit reminders
- ✅ App will feel like a native Android app
- ✅ No browser UI visible
- ✅ Proper app icon in launcher

---

## Files You Need

All files are already in your project:

1. **android-twa-manifest.xml** - Complete Android manifest template
2. **public/assetlinks.json** - Domain verification for TWA
3. **public/manifest.json** - PWA manifest (already correct)
4. **netlify.toml** - Already has correct Permissions-Policy headers
5. **public/_headers** - Already has correct headers

---

## Next Steps

1. Choose your build method:
   - **Easy:** Use Bubblewrap CLI (recommended)
   - **Advanced:** Use Android Studio manual setup

2. Build the APK

3. Install on your Android device

4. Test and verify permissions work

5. Publish to Google Play Store (optional)

---

**Status:** ✅ READY TO BUILD
**Confidence:** 💯 100%
**Build Method:** Bubblewrap (easiest) or Android Studio (advanced)

**Next Action:** Choose build method and follow the steps! 🚀
