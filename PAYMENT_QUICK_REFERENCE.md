# Quick Reference: Dual Payment System

## 🚀 Quick Start

### **Check if Premium is Unlocked**
```typescript
import { isPremiumUnlocked } from '@/utils/googlePlayBilling';

// Async check (recommended)
const hasPremium = await isPremiumUnlocked();

// Sync check (for immediate UI rendering)
import { getPremiumStatusSync } from '@/utils/googlePlayBilling';
const hasPremium = getPremiumStatusSync();
```

### **Detect Platform**
```typescript
import { isAndroid, isTWAWithBilling } from '@/utils/googlePlayBilling';

if (isAndroid()) {
  if (isTWAWithBilling()) {
    // Show Google Play payment button
  } else {
    // Show "Download from Play Store" message
  }
} else {
  // Show Paystack payment button
}
```

### **Trigger Payment**

#### **Google Play (Android TWA)**
```typescript
import { purchasePremium } from '@/utils/googlePlayBilling';

try {
  const success = await purchasePremium();
  if (success) {
    toast.success('Premium unlocked!');
  }
} catch (error) {
  toast.error(error.message);
}
```

#### **Paystack (Web)**
```tsx
import { PaystackPayment } from '@/components/PaystackPayment';

<PaystackPayment
  email="user@example.com"
  amount={800000} // ₦8,000 in kobo
  publicKey={import.meta.env.VITE_PAYSTACK_PUBLIC_KEY}
  text="Get Premium - ₦8,000"
  onSuccess={(transaction) => {
    unlockPremium(transaction.reference);
    toast.success('Premium unlocked!');
  }}
  onClose={() => {
    toast.info('Payment cancelled');
  }}
/>
```

### **Restore Purchases**

#### **Android TWA**
```typescript
import { restorePurchases } from '@/utils/googlePlayBilling';

try {
  const restored = await restorePurchases();
  if (restored) {
    toast.success('Premium restored!');
  } else {
    toast.info('No purchase found');
  }
} catch (error) {
  toast.error(error.message);
}
```

#### **Web (Email-Based)**
```typescript
// Check localStorage for transaction with matching email
const premiumData = localStorage.getItem('rise_premium');
if (premiumData) {
  const data = JSON.parse(premiumData);
  if (data.unlocked) {
    toast.success('Premium restored!');
  }
}
```

---

## 📁 File Structure

```
src/
├── utils/
│   ├── googlePlayBilling.ts    # Google Play Billing API
│   └── paystack.ts             # Paystack utilities
├── components/
│   ├── PaystackPayment.tsx     # Paystack payment component
│   └── RestorePremiumWeb.tsx   # Web restore component
├── pages/
│   └── Stats.tsx               # Main payment UI
└── App.tsx                     # Auto-restore on startup
```

---

## 🔑 Environment Variables

```bash
# .env file
VITE_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxx  # Required for web payments
VITE_APP_URL=https://your-app.com              # Optional: for metadata
```

---

## 🎯 Key Functions Reference

### **googlePlayBilling.ts**

| Function | Purpose | Returns |
|----------|---------|---------|
| `isAndroid()` | Detect Android device | `boolean` |
| `isTWAWithBilling()` | Check if TWA with billing | `boolean` |
| `isPremiumUnlocked()` | Check premium status | `Promise<boolean>` |
| `getPremiumStatusSync()` | Sync premium check | `boolean` |
| `purchasePremium()` | Trigger Google Play purchase | `Promise<boolean>` |
| `restorePurchases()` | Restore from Google Play | `Promise<boolean>` |
| `debugUnlockPremium()` | Unlock for testing | `void` |
| `isDebugUnlockAvailable()` | Check if debug mode | `boolean` |

### **paystack.ts**

| Function | Purpose | Returns |
|----------|---------|---------|
| `unlockPremium(txId)` | Unlock premium with transaction | `void` |
| `getPremiumStatus()` | Check premium status | `boolean` |
| `getPremiumData()` | Get premium details | `object \| null` |
| `clearPremium()` | Clear premium (testing) | `void` |
| `createPaymentReference()` | Generate unique ref | `string` |
| `formatAmount(kobo)` | Format kobo to Naira | `string` |
| `isValidEmail(email)` | Validate email | `boolean` |
| `getUserEmail()` | Get stored email | `string` |
| `setUserEmail(email)` | Save email | `void` |

---

## 🧪 Testing Commands

### **Enable Debug Mode**
```javascript
// In browser console
localStorage.setItem('force_android_mode', 'true');
window.location.reload();
```

### **Unlock Premium (Testing)**
```javascript
// In browser console
localStorage.setItem('streak_ads_removed', 'true');
localStorage.setItem('rise_premium', 'true');
window.location.reload();
```

### **Clear Premium**
```javascript
// In browser console
localStorage.removeItem('streak_ads_removed');
localStorage.removeItem('rise_premium');
window.location.reload();
```

### **Check Current Status**
```javascript
// In browser console
console.log('Premium:', localStorage.getItem('streak_ads_removed'));
console.log('Data:', localStorage.getItem('rise_premium'));
console.log('Email:', localStorage.getItem('rise_user_email'));
```

---

## 🎨 UI Components

### **Payment Button (Conditional)**
```tsx
import { isAndroid, isTWAWithBilling } from '@/utils/googlePlayBilling';

{isAndroid() ? (
  isTWAWithBilling() ? (
    <Button onClick={handleGooglePlayPurchase}>
      Get Premium - $4.99 (Google Play)
    </Button>
  ) : (
    <Button onClick={() => window.open('https://play.google.com/store/...')}>
      Download from Google Play
    </Button>
  )
) : (
  <PaystackPayment
    email={userEmail}
    amount={800000}
    publicKey={import.meta.env.VITE_PAYSTACK_PUBLIC_KEY}
    text="Get Premium - ₦8,000"
    onSuccess={handlePaystackSuccess}
    onClose={handlePaystackClose}
  />
)}
```

### **Restore Button (Conditional)**
```tsx
{isAndroid() && isTWAWithBilling() && (
  <Button onClick={handleRestorePurchases} variant="outline">
    Restore Purchase
  </Button>
)}

{!isAndroid() && (
  <RestorePremiumWeb />
)}
```

### **Debug Unlock Button (Test Mode Only)**
```tsx
import { isDebugUnlockAvailable, debugUnlockPremium } from '@/utils/googlePlayBilling';

{isDebugUnlockAvailable() && (
  <Button
    onClick={() => {
      debugUnlockPremium();
      toast.success('Debug unlock activated!');
      setTimeout(() => window.location.reload(), 1000);
    }}
    variant="secondary"
  >
    <Bug className="w-4 h-4 mr-2" />
    Unlock for Testing
  </Button>
)}
```

---

## 🔄 Premium Status Flow

```
App Start
    │
    ▼
isAndroid()?
    │
    ├─ YES → restorePurchases() → Sync localStorage
    │
    └─ NO  → Check localStorage only
    │
    ▼
isPremiumUnlocked()
    │
    ├─ TRUE  → Show premium features
    │
    └─ FALSE → Show upgrade prompt
```

---

## 🐛 Common Issues & Solutions

### **Issue: "Google Play Billing is not available"**
**Solution**: User is in mobile browser, not TWA. Show "Download from Play Store" message.

### **Issue: "Paystack script not loaded"**
**Solution**: Check internet connection. Script loads from `https://js.paystack.co/v1/inline.js`

### **Issue: Premium not restored after reinstall**
**Solution**: 
- Android: Call `restorePurchases()` manually
- Web: Use "Restore Premium" with email

### **Issue: Payment successful but premium not unlocked**
**Solution**: Check localStorage keys are set correctly:
```javascript
localStorage.setItem('streak_ads_removed', 'true');
localStorage.setItem('rise_premium', 'true');
```

---

## 📊 Payment Pricing

| Platform | Currency | Amount | Kobo/Cents |
|----------|----------|--------|------------|
| Google Play | USD | $4.99 | 499 |
| Paystack | NGN | ₦8,000 | 800,000 |

**Note**: Paystack amount is in kobo (1 Naira = 100 kobo)

---

## 🔐 Security Notes

1. **Never expose secret keys** in frontend code
2. **Only use public keys** for Paystack
3. **Google Play handles all verification** - no backend needed
4. **localStorage is acceptable** for PWA premium status
5. **Always validate on payment provider side** (Google/Paystack)

---

## 📱 Platform Detection Logic

```typescript
// User-Agent check
const isAndroidUA = /android/i.test(navigator.userAgent);

// TWA check
const isTWA = window.matchMedia('(display-mode: standalone)').matches;

// WebView check
const isWebView = /wv|WebView/i.test(navigator.userAgent);

// Final result
const isAndroid = isAndroidUA || isTWA || isWebView;
```

---

## 🎉 Success Messages

### **Google Play**
```typescript
toast.success('Premium unlocked! Sleep Tracker is now available! 🎉', {
  duration: 5000,
});
```

### **Paystack**
```typescript
toast.success('🎉 Premium Unlocked Forever!', {
  description: `Receipt sent to ${userEmail}. All premium features are now available!`,
  duration: 5000,
});
```

---

## 📞 Support

For payment issues:
- **Google Play**: Contact Google Play Support
- **Paystack**: Contact Paystack Support
- **App Issues**: soltidewellness@gmail.com

---

**Last Updated**: 2025-11-23  
**Version**: 1.0.0  
**Status**: Production-Ready
