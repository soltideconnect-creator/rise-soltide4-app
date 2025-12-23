# Google Play Billing Troubleshooting Guide

## Error: "Payment permissions policy not granted"

### What You're Seeing

**Screenshot 1**: Toast message shows "Purchase failed: Payment permissions policy not granted"  
**Screenshot 2**: Toast message shows "Opening Google Play purchase..." (stuck in loading state)

### Root Cause

This error occurs when the **Payment Request API is blocked by browser security policy**. This is a PWABuilder TWA configuration issue, NOT a Google Play approval issue.

## Why This Happens

The Digital Goods API exists in your TWA, but the Payment Request API is being blocked because:

1. **Missing Feature-Policy headers** - Your PWA needs to explicitly allow payment features
2. **PWABuilder configuration** - The "Enable Google Play Billing" option may not have been properly configured
3. **Asset Links verification** - Digital Asset Links between your domain and the app may not be verified

## Important: This is NOT About

❌ App being in production vs testing  
❌ Google Play approval status  
❌ Product ID configuration  
❌ Your code implementation  

✅ **It's about PWA/TWA configuration**

## Solution 1: Add Feature-Policy Headers (RECOMMENDED)

Your PWA needs to serve the correct HTTP headers to allow payment features.

### Add to Your Server Configuration

**For Nginx:**
```nginx
add_header Feature-Policy "payment 'self' https://play.google.com";
add_header Permissions-Policy "payment=(self \"https://play.google.com\")";
```

**For Apache (.htaccess):**
```apache
Header set Feature-Policy "payment 'self' https://play.google.com"
Header set Permissions-Policy "payment=(self \"https://play.google.com\")"
```

**For Node.js/Express:**
```javascript
app.use((req, res, next) => {
  res.setHeader('Feature-Policy', "payment 'self' https://play.google.com");
  res.setHeader('Permissions-Policy', 'payment=(self "https://play.google.com")');
  next();
});
```

**For Cloudflare Workers/Pages:**
```javascript
export async function onRequest(context) {
  const response = await context.next();
  response.headers.set('Feature-Policy', "payment 'self' https://play.google.com");
  response.headers.set('Permissions-Policy', 'payment=(self "https://play.google.com")');
  return response;
}
```

### Add to Your HTML (Alternative)

If you can't modify server headers, add this to your `index.html`:

```html
<head>
  <meta http-equiv="Feature-Policy" content="payment 'self' https://play.google.com">
  <meta http-equiv="Permissions-Policy" content="payment=(self 'https://play.google.com')">
</head>
```

## Solution 2: Regenerate TWA with PWABuilder

If adding headers doesn't work, regenerate your TWA:

### Step-by-Step:

1. **Go to PWABuilder.com**
   - Visit https://www.pwabuilder.com/

2. **Enter Your PWA URL**
   - Input: `https://medo.dev/project/...` (your full PWA URL)

3. **Generate Android Package**
   - Click "Package for Stores"
   - Select "Android"

4. **CRITICAL: Enable Billing**
   - ✅ **Check "Enable Google Play Billing"**
   - ✅ **Check "Digital Goods API"**
   - Enter Product ID: `premium_unlock`

5. **Configure Asset Links**
   - Make sure your domain is verified
   - SHA-256 fingerprint must match your signing key

6. **Download New .aab**
   - Download the generated Android App Bundle

7. **Upload to Google Play Console**
   - Go to your app in Google Play Console
   - Upload new .aab to closed testing track
   - Wait for processing (5-10 minutes)

8. **Test Again**
   - Install from closed testing track
   - Try purchasing again

## Solution 3: Verify Digital Asset Links

### Check Your Asset Links File

Your website needs a `.well-known/assetlinks.json` file:

**URL**: `https://medo.dev/.well-known/assetlinks.json`

**Content** (example):
```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.yourapp.package",
    "sha256_cert_fingerprints": [
      "YOUR_SHA256_FINGERPRINT_HERE"
    ]
  }
}]
```

### Get Your SHA-256 Fingerprint

**From Google Play Console:**
1. Go to your app in Google Play Console
2. Navigate to "Setup" → "App integrity"
3. Copy the SHA-256 certificate fingerprint

**From your keystore:**
```bash
keytool -list -v -keystore your-keystore.jks -alias your-alias
```

### Verify Asset Links

Test your asset links:
```
https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://medo.dev&relation=delegate_permission/common.handle_all_urls
```

## Solution 4: Use Paystack Fallback (IMMEDIATE FIX)

While you fix the Google Play billing configuration, users can still purchase using Paystack:

### Current Implementation

Your app already has Paystack integration! When Google Play billing fails, users can:

1. **Scroll down** on the Stats page
2. **Enter their email** in the Paystack section
3. **Click "Get Premium - ₦8,000 (Paystack)"**
4. **Complete payment** via Paystack (card, bank transfer, USSD)

### Updated Error Message

The app now shows:
> "Google Play billing is not available. Please use Paystack payment below."

This guides users to the working payment method.

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

### 4. Test Payment Request

```javascript
const request = new PaymentRequest(
  [{ supportedMethods: 'https://play.google.com/billing' }],
  { total: { label: 'Test', amount: { currency: 'USD', value: '1.00' } } }
);

request.canMakePayment().then(result => {
  console.log('Can make payment:', result);
});
```

**Expected**: Should return `true`

## Common Issues and Fixes

### Issue 1: Headers Not Applied

**Symptom**: Added headers but still getting error

**Fix**:
- Clear browser cache
- Hard refresh (Ctrl+Shift+R)
- Uninstall and reinstall app
- Check headers in DevTools Network tab

### Issue 2: Asset Links Not Verified

**Symptom**: "Digital Goods Service not available"

**Fix**:
- Verify `.well-known/assetlinks.json` is accessible
- Check SHA-256 fingerprint matches
- Wait 24-48 hours for Google to verify
- Use Google's verification tool

### Issue 3: Product Not Found

**Symptom**: "Product not found"

**Fix**:
- Verify product ID in Google Play Console: `premium_unlock`
- Make sure product is "Active"
- Check product is available in your country
- Wait 24 hours after creating product

### Issue 4: App Not Downloaded from Play Store

**Symptom**: Billing API not available

**Fix**:
- Make sure app is installed from Google Play (not sideloaded)
- Use closed testing track (internal/alpha/beta)
- Don't use APK from PWABuilder (use .aab uploaded to Play Store)

## Testing Checklist

Before testing billing:

- [ ] App installed from Google Play (closed testing track)
- [ ] Feature-Policy headers added to PWA
- [ ] Asset Links file exists and is verified
- [ ] Product `premium_unlock` is active in Play Console
- [ ] Product price is set ($4.99 or equivalent)
- [ ] App is signed with correct keystore
- [ ] SHA-256 fingerprint matches Asset Links
- [ ] PWABuilder "Enable Google Play Billing" was checked
- [ ] Waited 24 hours after configuration changes

## Expected Behavior

### When Working Correctly:

1. User clicks "Get Premium - $4.99 (Google Play)"
2. Toast shows "Opening Google Play purchase..."
3. **Google Play billing overlay appears** (in-app, not external)
4. User completes purchase with Google Play payment method
5. Toast shows "Premium unlocked! Sleep Tracker is now available! 🎉"
6. Premium features are unlocked

### Current Behavior (Error):

1. User clicks "Get Premium - $4.99 (Google Play)"
2. Toast shows "Opening Google Play purchase..."
3. **Error**: "Payment permissions policy not granted"
4. **OR**: Spinning indefinitely (15-second timeout)
5. Toast shows "Google Play billing is not available. Please use Paystack payment below."

## Recommended Action Plan

### Immediate (Today):

1. ✅ **Add Feature-Policy headers** to your PWA (Solution 1)
2. ✅ **Verify Asset Links** file exists (Solution 3)
3. ✅ **Test with Paystack** to ensure users can still purchase

### Short-term (This Week):

1. **Regenerate TWA** with PWABuilder if headers don't work (Solution 2)
2. **Upload new .aab** to Google Play Console
3. **Test on closed testing track**
4. **Verify billing works** before production release

### Long-term (Before Production):

1. **Test on multiple devices** (different Android versions)
2. **Test in different countries** (if applicable)
3. **Monitor error logs** in Google Play Console
4. **Have Paystack as backup** payment method

## Support Resources

### Google Documentation:
- [Digital Goods API](https://developer.chrome.com/docs/android/trusted-web-activity/receive-payments-play-billing/)
- [Payment Request API](https://developer.mozilla.org/en-US/docs/Web/API/Payment_Request_API)
- [Feature Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy)

### PWABuilder:
- [PWABuilder Documentation](https://docs.pwabuilder.com/)
- [Android Package Options](https://docs.pwabuilder.com/#/builder/android)

### Google Play Console:
- [In-app Products](https://support.google.com/googleplay/android-developer/answer/1153481)
- [Testing In-app Billing](https://developer.android.com/google/play/billing/test)

### Contact Support:
- **App Support**: soltidewellness@gmail.com
- **PWABuilder Issues**: https://github.com/pwa-builder/PWABuilder/issues

## Conclusion

The error you're experiencing is a **configuration issue**, not a code issue. The most likely fix is adding Feature-Policy headers to your PWA.

**Quick Fix**: Use Paystack payment (already working)  
**Proper Fix**: Add Feature-Policy headers and regenerate TWA  
**Timeline**: Should be fixed within 1-2 days after applying headers  

Your code implementation is correct. The issue is with the PWA/TWA wrapper configuration.

---

**Last Updated**: 2025-12-23  
**Status**: Troubleshooting in progress  
**Recommended Action**: Add Feature-Policy headers (Solution 1)
