# 🧪 POST-DEPLOYMENT TESTING GUIDE

**Quick reference for testing after Netlify deployment**

---

## 🚀 IMMEDIATE TESTS (Do These First)

### 1. Basic Site Functionality ⏱️ 2 minutes

```bash
# Check if site is live
curl -I https://your-app.netlify.app

# Expected: HTTP 200 OK
```

**Manual Check:**
- [ ] Site loads without errors
- [ ] No console errors
- [ ] All pages accessible
- [ ] Navigation works

---

### 2. Netlify Preview Card ⏱️ 5 minutes

**Test on Social Media Platforms:**

#### Facebook
1. Go to: https://developers.facebook.com/tools/debug/
2. Enter your Netlify URL
3. Click "Scrape Again"
4. **Expected Results:**
   - ✅ Image shows: Rise app preview (1344x768)
   - ✅ Title: "Rise – Habit Tracker & Smart Sleep"
   - ✅ Description: "Unbreakable streaks meet perfect mornings..."

#### Twitter
1. Go to: https://cards-dev.twitter.com/validator
2. Enter your Netlify URL
3. Click "Preview card"
4. **Expected Results:**
   - ✅ Large image card
   - ✅ Image shows correctly
   - ✅ Title and description present

#### LinkedIn
1. Go to: https://www.linkedin.com/post-inspector/
2. Enter your Netlify URL
3. Click "Inspect"
4. **Expected Results:**
   - ✅ Preview card shows
   - ✅ Image displays
   - ✅ Text correct

#### WhatsApp (Quick Test)
1. Send your URL to yourself
2. **Expected Results:**
   - ✅ Preview card appears
   - ✅ Image shows
   - ✅ Title visible

---

### 3. Paystack Payment Flow ⏱️ 3 minutes

#### Test Page Method (Easiest)

1. **Access Test Page:**
   ```
   https://your-app.netlify.app/paystack-test.html
   ```

2. **Click "Pay ₦8,000"**

3. **Expected Results:**
   - ✅ Popup opens immediately
   - ✅ No "Content blocked" error
   - ✅ Payment form displays

4. **Use Test Card:**
   ```
   Card: 4084 0840 8408 4081
   Expiry: 12/25
   CVV: 408
   PIN: 0000
   OTP: 123456
   ```

5. **Complete Payment:**
   - ✅ Payment processes
   - ✅ Success message shows
   - ✅ Console logs transaction

#### Main App Method

1. **Go to Stats Page:**
   ```
   https://your-app.netlify.app/stats
   ```

2. **Click "Unlock Premium"**

3. **Expected Results:**
   - ✅ Popup opens
   - ✅ Payment form displays
   - ✅ Can complete test payment

---

## 🔍 DETAILED TESTS (Do These Next)

### 4. CSP Headers ⏱️ 1 minute

```bash
# Check CSP headers
curl -I https://your-app.netlify.app | grep -i "content-security-policy"

# Expected: Headers include Paystack domains
```

**Should Include:**
- ✅ `https://js.paystack.co`
- ✅ `https://api.paystack.co`
- ✅ `https://checkout.paystack.co`

---

### 5. OG Image Loading ⏱️ 1 minute

```bash
# Check OG image
curl -I https://your-app.netlify.app/og-image.png

# Expected: HTTP 200 OK
# Expected: Content-Type: image/png
# Expected: Content-Length: ~1500000 (1.5MB)
```

**Manual Check:**
1. Open: `https://your-app.netlify.app/og-image.png`
2. **Expected Results:**
   - ✅ Image loads
   - ✅ Shows Rise app preview
   - ✅ Dimensions: 1344x768

---

### 6. Paystack Script Loading ⏱️ 1 minute

**Browser Console Test:**

1. Open browser console (F12)
2. Go to: `https://your-app.netlify.app`
3. Type:
   ```javascript
   window.PaystackPop
   ```
4. **Expected Results:**
   - ✅ Returns object (not undefined)
   - ✅ Has `setup` method

**Network Tab Test:**

1. Open Network tab (F12)
2. Filter: "paystack"
3. **Expected Results:**
   - ✅ `inline.js` loads (HTTP 200)
   - ✅ No CSP errors
   - ✅ Script executes

---

### 7. Browser Compatibility ⏱️ 5 minutes

**Test on Multiple Browsers:**

#### Chrome Desktop
- [ ] Site loads
- [ ] Payment popup works
- [ ] No console errors

#### Firefox Desktop
- [ ] Site loads
- [ ] Payment popup works
- [ ] No console errors

#### Safari Desktop
- [ ] Site loads
- [ ] Payment popup works
- [ ] No console errors

#### Chrome Mobile
- [ ] Site loads
- [ ] Responsive design works
- [ ] Payment popup works

#### Safari Mobile (iOS)
- [ ] Site loads
- [ ] Responsive design works
- [ ] Payment popup works

---

### 8. PWA Functionality ⏱️ 3 minutes

#### Install PWA

1. **Chrome Desktop:**
   - Click install icon in address bar
   - Click "Install"

2. **Chrome Mobile:**
   - Menu → "Add to Home Screen"

3. **Expected Results:**
   - ✅ Install prompt appears
   - ✅ App installs successfully
   - ✅ Icon appears on desktop/home screen

#### Test Offline

1. Open installed PWA
2. Open DevTools → Application → Service Workers
3. Check "Offline"
4. Refresh page
5. **Expected Results:**
   - ✅ App still works
   - ✅ Cached content displays
   - ✅ No network errors

---

## 🚨 CRITICAL ISSUES TO WATCH FOR

### Issue 1: Preview Card Not Showing

**Symptoms:**
- No image in social media preview
- Generic preview instead

**Quick Fix:**
1. Clear cache on social media platform
2. Use platform's debugger tool
3. Wait 5-10 minutes for cache to clear

---

### Issue 2: Paystack Popup Blocked

**Symptoms:**
- "Content blocked" error
- Popup doesn't open
- CSP error in console

**Quick Fix:**
1. Check CSP headers:
   ```bash
   curl -I https://your-app.netlify.app | grep -i "content-security-policy"
   ```
2. Verify Paystack domains included
3. Clear browser cache
4. Try incognito mode

---

### Issue 3: Build Failed

**Symptoms:**
- Netlify deploy failed
- Dependency errors
- TypeScript errors

**Quick Fix:**
1. Check Netlify build logs
2. Verify Node version (should be 18)
3. Clear Netlify build cache
4. Retry deploy

---

## ✅ SUCCESS CHECKLIST

### All Tests Passed

- [ ] ✅ Site loads without errors
- [ ] ✅ Preview card shows on Facebook
- [ ] ✅ Preview card shows on Twitter
- [ ] ✅ Preview card shows on LinkedIn
- [ ] ✅ Paystack test page works
- [ ] ✅ Payment popup opens
- [ ] ✅ Test payment completes
- [ ] ✅ CSP headers correct
- [ ] ✅ OG image loads
- [ ] ✅ Paystack script loads
- [ ] ✅ Chrome works
- [ ] ✅ Firefox works
- [ ] ✅ Safari works
- [ ] ✅ Mobile works
- [ ] ✅ PWA installs

---

## 📊 EXPECTED RESULTS SUMMARY

### Netlify Preview Card

**Facebook:**
```
✅ Image: 1344x768 PNG
✅ Title: Rise – Habit Tracker & Smart Sleep
✅ Description: Unbreakable streaks meet perfect mornings...
✅ Type: Website
```

**Twitter:**
```
✅ Card: summary_large_image
✅ Image: Shows correctly
✅ Title: Rise – Habit Tracker & Smart Sleep
✅ Description: Unbreakable streaks meet perfect mornings...
```

**LinkedIn:**
```
✅ Preview: Shows correctly
✅ Image: Displays
✅ Title: Rise – Habit Tracker & Smart Sleep
✅ Description: Unbreakable streaks meet perfect mornings...
```

### Paystack Payment

**Test Page:**
```
✅ URL: /paystack-test.html
✅ Button: "Pay ₦8,000"
✅ Popup: Opens immediately
✅ Form: Displays correctly
✅ Payment: Processes successfully
```

**Main App:**
```
✅ Page: /stats
✅ Button: "Unlock Premium"
✅ Popup: Opens immediately
✅ Form: Displays correctly
✅ Payment: Processes successfully
```

### Performance

**Lighthouse Scores:**
```
✅ Performance: 90+
✅ Accessibility: 95+
✅ Best Practices: 95+
✅ SEO: 100
✅ PWA: 100
```

**Load Times:**
```
✅ First Contentful Paint: < 1.5s
✅ Time to Interactive: < 3.5s
✅ Largest Contentful Paint: < 2.5s
```

---

## 🎯 QUICK TEST SCRIPT

**Run this after deployment (5 minutes):**

```bash
#!/bin/bash

# Set your Netlify URL
URL="https://your-app.netlify.app"

echo "🧪 Testing Netlify Deployment..."
echo ""

# Test 1: Site is live
echo "1️⃣ Testing site availability..."
if curl -s -o /dev/null -w "%{http_code}" "$URL" | grep -q "200"; then
  echo "✅ Site is live"
else
  echo "❌ Site is not accessible"
fi

# Test 2: OG image exists
echo ""
echo "2️⃣ Testing OG image..."
if curl -s -o /dev/null -w "%{http_code}" "$URL/og-image.png" | grep -q "200"; then
  echo "✅ OG image loads"
else
  echo "❌ OG image not found"
fi

# Test 3: CSP headers
echo ""
echo "3️⃣ Testing CSP headers..."
if curl -I "$URL" 2>/dev/null | grep -i "content-security-policy" | grep -q "paystack"; then
  echo "✅ CSP headers include Paystack"
else
  echo "❌ CSP headers missing or incorrect"
fi

# Test 4: Paystack test page
echo ""
echo "4️⃣ Testing Paystack test page..."
if curl -s -o /dev/null -w "%{http_code}" "$URL/paystack-test.html" | grep -q "200"; then
  echo "✅ Paystack test page exists"
else
  echo "❌ Paystack test page not found"
fi

echo ""
echo "🎉 Automated tests complete!"
echo ""
echo "📋 Manual tests required:"
echo "   - Test preview card on social media"
echo "   - Test payment flow in browser"
echo "   - Test on multiple browsers"
echo ""
```

**Usage:**
```bash
# Save as test-deployment.sh
chmod +x test-deployment.sh
./test-deployment.sh
```

---

## 📞 NEED HELP?

### Common Issues

1. **Preview card not showing:**
   - Wait 10 minutes for cache
   - Use platform debugger tools
   - Check OG image URL

2. **Payment popup blocked:**
   - Check CSP headers
   - Clear browser cache
   - Try incognito mode

3. **Build failed:**
   - Check Netlify logs
   - Verify dependencies
   - Clear build cache

### Resources

**Netlify:** https://docs.netlify.com  
**Paystack:** https://paystack.com/docs  
**Facebook Debugger:** https://developers.facebook.com/tools/debug/  
**Twitter Validator:** https://cards-dev.twitter.com/validator

---

**Status:** 📋 **READY FOR TESTING**  
**Estimated Time:** ⏱️ **15-20 minutes**  
**Difficulty:** 🟢 **Easy**

---

*Last Updated: 2025-11-23*  
*Testing Guide Version: 1.0*
