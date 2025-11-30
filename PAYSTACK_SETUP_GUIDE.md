# 🔐 Paystack Payment Setup Guide

## ✅ Current Status
- ✅ Paystack Live Public Key configured: `pk_live_000ac40050b8af5c5ee87edb8976d88d6eb6e315`
- ✅ Payment amount: ₦8,000 (800,000 kobo)
- ✅ Payment email: `soltideapps@gmail.com`
- ⚠️ **Callback URL not configured** (Required!)

---

## 🔧 Required Configuration Steps

### 1. Configure Callback URL (CRITICAL)

Go to your Paystack Dashboard → **API Keys & Webhooks** → **Live Callback URL**

**Set this URL:**
```
https://rise-soltide-app.netlify.app/
```

**Why this is needed:**
- Paystack redirects users back to this URL after payment
- Without it, users may see errors after successful payment
- This is your main app URL where users return after checkout

---

### 2. Configure Webhook URL (Optional - For Advanced Verification)

**Live Webhook URL:**
```
https://rise-soltide-app.netlify.app/api/paystack-webhook
```

**Note:** This requires a backend endpoint to verify payments server-side. Since Rise is a client-side PWA, we're using **instant unlock on success** instead. You can skip this for now.

---

### 3. IP Whitelist (Optional)

**Recommendation:** Leave empty for now

- IP Whitelist restricts which IP addresses can use your API keys
- Only enable this if you need extra security
- For a PWA accessed from anywhere, leave it empty

---

## 🧪 Testing the Payment Flow

### Test Mode (Before Going Live)
1. Switch Paystack to **Test Mode** in dashboard
2. Update `Stats.tsx` to use test key: `pk_test_45f8180c1605cf28339ec`
3. Use test cards from [Paystack Test Cards](https://paystack.com/docs/payments/test-payments/)

**Test Card:**
```
Card Number: 4084 0840 8408 4081
CVV: 408
Expiry: Any future date
PIN: 0000
OTP: 123456
```

### Live Mode (Production)
1. Ensure Paystack account is verified and activated
2. Set **Live Callback URL** (see step 1 above)
3. Current live key is already configured in code
4. Test with real card (small amount first!)

---

## 🔍 Troubleshooting

### Error: "Payment system not loaded"
**Cause:** Paystack script didn't load in time

**Solutions:**
1. ✅ **Fixed in latest code** - Added automatic retry logic
2. Button now shows "Loading Payment System..." until ready
3. Script loads asynchronously to prevent blocking

### Error: "Payment successful but premium not unlocked"
**Cause:** Browser cleared localStorage or incognito mode

**Solution:**
- Premium status is stored in `localStorage` with two keys:
  - `rise_premium`
  - `streak_ads_removed`
- In incognito mode, this is cleared when browser closes
- For persistent storage, users should use normal browser mode

### Payment Successful but User Redirected to Wrong Page
**Cause:** Callback URL not configured

**Solution:**
- Set callback URL in Paystack dashboard (see step 1)

---

## 💰 Payment Flow Diagram

```
User clicks "Unlock Premium ₦8,000"
         ↓
Check if PaystackPop loaded
         ↓
Open Paystack payment popup
         ↓
User enters card details
         ↓
Paystack processes payment
         ↓
[SUCCESS] → onSuccess callback
         ↓
Set localStorage flags:
  - rise_premium = 'true'
  - streak_ads_removed = 'true'
         ↓
Show success toast
         ↓
Premium features unlocked!
```

---

## 🔐 Security Notes

### What's Secure:
✅ Public key is safe to expose in client-side code
✅ Paystack handles all card data (PCI compliant)
✅ No sensitive data stored in localStorage
✅ Payment processing happens on Paystack servers

### What to Protect:
🔒 **Secret Key** - NEVER expose in client code
🔒 Keep secret key in Paystack dashboard only
🔒 Only use secret key in backend/server code

---

## 📊 Monitoring Payments

### View Transactions:
1. Go to Paystack Dashboard
2. Navigate to **Transactions**
3. Filter by:
   - Status: Success/Failed
   - Date range
   - Amount

### Key Metrics to Track:
- Total successful payments
- Failed payment reasons
- Average transaction value
- Payment completion rate

---

## 🚀 Next Steps After Configuration

1. ✅ Set Live Callback URL in Paystack dashboard
2. ✅ Test payment with small amount (₦100)
3. ✅ Verify premium unlock works
4. ✅ Test in incognito mode
5. ✅ Test on mobile device
6. ✅ Monitor first real transactions

---

## 📞 Support

**Paystack Support:**
- Email: support@paystack.com
- Docs: https://paystack.com/docs
- Test Cards: https://paystack.com/docs/payments/test-payments/

**Rise App Issues:**
- Check browser console for errors
- Verify localStorage is enabled
- Test in non-incognito mode first

---

## ✅ Configuration Checklist

- [ ] Live Callback URL set to: `https://rise-soltide-app.netlify.app/`
- [ ] Paystack account verified and activated
- [ ] Test payment completed successfully
- [ ] Premium unlock verified after payment
- [ ] Mobile browser tested
- [ ] Incognito mode tested (note: localStorage clears on close)
- [ ] First real transaction monitored

---

**Last Updated:** 2025-11-30
**Paystack Mode:** Live
**App URL:** https://rise-soltide-app.netlify.app/
