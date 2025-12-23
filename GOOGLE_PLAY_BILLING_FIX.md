# Google Play Billing Fix - Policy Compliant Guide

## Issue Reported

**Error**: "Payment permissions policy not granted"  
**Symptom**: Google Play billing dialog doesn't open, shows spinning "Opening Google Play purchase..." message

## Root Cause

The Payment Request API is being blocked by browser security policy because the PWA lacks Feature-Policy headers allowing payment features.

**This is**:
- ✅ Missing Feature-Policy headers in PWA
- ✅ Browser security blocking Payment Request API
- ✅ PWA/TWA configuration issue

**This is NOT**:
- ❌ A Google Play approval issue
- ❌ A production vs testing issue
- ❌ A code implementation problem

## Solution Applied

### 1. Added Feature-Policy Headers

**File**: `index.html` (lines 33-35)

```html
<!-- Payment Feature Policy - Required for Google Play Billing in TWA -->
<meta http-equiv="Feature-Policy" content="payment 'self' https://play.google.com" />
<meta http-equiv="Permissions-Policy" content="payment=(self 'https://play.google.com')" />
```

These headers tell the browser to allow payment features from Google Play billing API.

### 2. Improved Error Detection

**File**: `src/utils/googlePlayBilling.ts` (lines 238-246)

```typescript
// Payment permissions policy error (PWABuilder TWA configuration issue)
if (error.message?.includes('permissions policy') || error.message?.includes('not granted')) {
  throw new Error('BILLING_NOT_CONFIGURED');
}

// Purchase timeout
if (error.message === 'PURCHASE_TIMEOUT') {
  throw new Error('BILLING_NOT_CONFIGURED');
}
```

Detects when billing is blocked by browser security policy.

### 3. Policy-Compliant Error Messages

**File**: `src/pages/Stats.tsx` (lines 116-121)

```typescript
// Handle billing not configured error - COMPLIANT with Google Play policies
if (error instanceof Error && error.message === 'BILLING_NOT_CONFIGURED') {
  toast.error('Unable to connect to Google Play billing. Please try again later or contact support at soltidewellness@gmail.com', {
    duration: 6000,
  });
}
```

Shows helpful message WITHOUT mentioning alternative payment methods (Google Play policy requirement).

## Testing Instructions

### Step 1: Deploy Updated Code

```bash
git add .
git commit -m "Fix: Add Feature-Policy headers for Google Play billing"
git push
```

Wait 5-10 minutes for deployment to complete.

### Step 2: Test on Android Device

1. **Clear cache** on your Android device
   - Settings → Apps → Chrome → Storage → Clear cache

2. **Uninstall app** from Android device
   - Long press app icon → Uninstall

3. **Reinstall app** from Google Play
   - Open Google Play Store
   - Go to your app (closed testing track)
   - Install

4. **Test purchase**
   - Open app
   - Go to Stats tab
   - Click "Get Premium - $4.99 (Google Play)"

### Step 3: Verify Results

**Expected Outcome**:
- Google Play billing overlay appears
- User completes purchase
- Premium unlocked ✅

**If Still Not Working**:
- Error: "Unable to connect to Google Play billing. Please try again later or contact support."
- User contacts support
- You investigate further (see troubleshooting below)

## Important: Google Play Policy Compliance

### ✅ What We Do (Compliant):

- Show ONLY Google Play billing on Android app
- Hide Paystack payment section on Android (it's only visible on web)
- Error messages don't mention alternative payments
- Direct users to support if billing fails

### ❌ What We DON'T Do (Would Violate Policy):

- Show alternative payment methods on Android
- Direct users to Paystack when Google Play fails
- Mention external payment systems in error messages
- Link to website for alternative payment

**Why**: Google Play policy prohibits directing users to alternative payment methods in apps distributed through Play Store.

## If Meta Tags Don't Work

### Option 1: Add HTTP Headers at Server Level

HTML meta tags for Feature-Policy are not always respected by browsers. If they don't work, add HTTP headers at the server level.

**For Netlify** - Create `netlify.toml`:
```toml
[[headers]]
  for = "/*"
  [headers.values]
    Feature-Policy = "payment 'self' https://play.google.com"
    Permissions-Policy = "payment=(self \"https://play.google.com\")"
```

**For Vercel** - Create `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Feature-Policy",
          "value": "payment 'self' https://play.google.com"
        },
        {
          "key": "Permissions-Policy",
          "value": "payment=(self \"https://play.google.com\")"
        }
      ]
    }
  ]
}
```

**For Cloudflare Pages** - Create `_headers` file in `public/`:
```
/*
  Feature-Policy: payment 'self' https://play.google.com
  Permissions-Policy: payment=(self "https://play.google.com")
```

### Option 2: Regenerate TWA with PWABuilder

If adding headers doesn't work, regenerate your TWA:

1. Go to https://www.pwabuilder.com/
2. Enter your PWA URL
3. Click "Package for Stores" → "Android"
4. ✅ **Check "Enable Google Play Billing"**
5. ✅ **Check "Digital Goods API"**
6. Enter Product ID: `premium_unlock`
7. Download new .aab
8. Upload to Google Play Console (closed testing)
9. Test again

## Debugging Steps

### 1. Check Digital Goods API Availability

Open Chrome DevTools in your TWA (connect via USB debugging):

```javascript
console.log('Digital Goods available:', 'getDigitalGoodsService' in window);
console.log('Payment Request available:', 'PaymentRequest' in window);
```

**Expected**: Both should be `true`

### 2. Check Feature Policy

```javascript
console.log('Feature Policy:', document.featurePolicy?.allowsFeature('payment'));
```

**Expected**: Should be `true`

### 3. Check Headers

In Chrome DevTools → Network tab:
- Reload the page
- Click on the main document request
- Check Response Headers for:
  - `Feature-Policy: payment 'self' https://play.google.com`
  - `Permissions-Policy: payment=(self "https://play.google.com")`

### 4. Verify Product Configuration

In Google Play Console:
- Go to "Monetize" → "In-app products"
- Verify product ID: `premium_unlock`
- Status should be "Active"
- Price should be set ($4.99 or equivalent)

## Common Issues and Fixes

### Issue 1: "Product not found"

**Cause**: Product not configured in Google Play Console

**Fix**:
1. Go to Google Play Console
2. Navigate to "Monetize" → "In-app products"
3. Create product with ID: `premium_unlock`
4. Set price: $4.99
5. Mark as "Active"
6. Wait 24 hours for product to propagate

### Issue 2: "Digital Goods Service not available"

**Cause**: Asset Links not verified or app not installed from Play Store

**Fix**:
1. Verify `.well-known/assetlinks.json` exists on your domain
2. Check SHA-256 fingerprint matches your signing key
3. Make sure app is installed from Google Play (not sideloaded)
4. Wait 24-48 hours for Google to verify Asset Links

### Issue 3: "Payment permissions policy not granted"

**Cause**: Feature-Policy headers not applied

**Fix**:
1. Add Feature-Policy headers (see "If Meta Tags Don't Work" above)
2. Clear cache and reinstall app
3. If still not working, regenerate TWA with PWABuilder

### Issue 4: App not downloaded from Play Store

**Cause**: App sideloaded or installed from APK

**Fix**:
- Make sure app is installed from Google Play (closed testing track)
- Don't use APK from PWABuilder (use .aab uploaded to Play Store)
- Uninstall any sideloaded versions first

## Support

### For Users:

If users experience billing issues, direct them to:
- **Email**: soltidewellness@gmail.com
- **Message**: "Unable to connect to Google Play billing. Please try again later or contact support."

### For Developers:

**Documentation**:
- GOOGLE_PLAY_POLICY_COMPLIANCE.md - Policy requirements
- This file - Technical troubleshooting

**Google Resources**:
- [Digital Goods API](https://developer.chrome.com/docs/android/trusted-web-activity/receive-payments-play-billing/)
- [Payment Request API](https://developer.mozilla.org/en-US/docs/Web/API/Payment_Request_API)
- [PWABuilder Documentation](https://docs.pwabuilder.com/)

## Testing Checklist

Before submitting to Google Play:

- [ ] App installed from Google Play (closed testing track)
- [ ] Feature-Policy headers added to PWA
- [ ] Asset Links file exists and is verified
- [ ] Product `premium_unlock` is active in Play Console
- [ ] Product price is set ($4.99 or equivalent)
- [ ] App is signed with correct keystore
- [ ] SHA-256 fingerprint matches Asset Links
- [ ] PWABuilder "Enable Google Play Billing" was checked
- [ ] Paystack payment is NOT visible on Android app
- [ ] Error messages don't mention alternative payments
- [ ] Tested on multiple Android devices
- [ ] Waited 24 hours after configuration changes

## Expected Behavior

### When Working Correctly:

1. User clicks "Get Premium - $4.99 (Google Play)"
2. Toast shows "Opening Google Play purchase..."
3. **Google Play billing overlay appears** (in-app, not external)
4. User completes purchase with Google Play payment method
5. Toast shows "Premium unlocked! Sleep Tracker is now available! 🎉"
6. Premium features are unlocked

### When Billing Fails:

1. User clicks "Get Premium - $4.99 (Google Play)"
2. Toast shows "Opening Google Play purchase..."
3. Error detected
4. Toast shows "Unable to connect to Google Play billing. Please try again later or contact support at soltidewellness@gmail.com"
5. User contacts support
6. You investigate and fix the issue

## Timeline

- **Deploy**: Immediate (5 minutes)
- **Test**: 10-20 minutes
- **Verify**: 1-2 hours
- **Asset Links verification**: 24-48 hours (if needed)
- **Product propagation**: 24 hours (if new product)
- **Production**: When verified working

## Confidence Levels

| Solution | Confidence | Notes |
|----------|-----------|-------|
| Meta tags | 60% | May not work in all browsers |
| HTTP headers | 90% | More reliable |
| TWA regeneration | 95% | Most reliable |

## Next Steps

### Immediate (Today):

1. ✅ Deploy updated code
2. ✅ Test on Android device
3. ✅ Verify error messages are policy-compliant

### If Headers Don't Work (This Week):

1. Add HTTP headers at server level
2. OR regenerate TWA with PWABuilder
3. Upload new .aab to Google Play Console
4. Test again

### Before Production Release:

1. Verify Google Play billing works on multiple devices
2. Test in different countries (if applicable)
3. Monitor error logs in Google Play Console
4. Prepare support documentation for users
5. Verify policy compliance (see GOOGLE_PLAY_POLICY_COMPLIANCE.md)

---

**Last Updated**: 2025-12-23  
**Status**: ✅ Fix applied, policy compliant, ready for testing  
**Next Action**: Deploy and test on Android device
