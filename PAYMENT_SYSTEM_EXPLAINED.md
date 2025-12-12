# 💳 Payment System Explained

## How Payments Work in Your App

---

## 🎯 Two Payment Methods, One App

Your app automatically detects the platform and shows the appropriate payment method:

### 1. **Web Browser** (Chrome, Firefox, Safari, etc.)
- **Payment Method**: Paystack
- **Price**: ₦8,000
- **Detection**: `isTWAWithBilling()` returns `false`
- **User sees**: Email input + Paystack payment button

### 2. **Android TWA App** (Installed from Play Store)
- **Payment Method**: Google Play Billing
- **Price**: $4.99
- **Detection**: `isTWAWithBilling()` returns `true` (checks for `window.AndroidBilling`)
- **User sees**: Google Play payment button

---

## 📱 Platform Detection Logic

```typescript
// File: src/utils/googlePlayBilling.ts

export function isTWAWithBilling(): boolean {
  return typeof window !== 'undefined' && 
         typeof window.AndroidBilling !== 'undefined';
}
```

**How it works:**
- Android TWA app injects `window.AndroidBilling` object
- Web browsers don't have this object
- App checks for this object to determine payment method

---

## 🔄 User Experience Flow

### Web Users (Paystack):
```
1. User opens https://rise-soltide-app.netlify.app/ in browser
2. Navigate to Sleep tab → See lock screen
3. Click "Upgrade to Premium - $4.99"
4. Navigate to Stats tab
5. See: "Upgrade to Premium"
6. See: "Unlock Sleep Tracker and premium features forever!"
7. Enter email address
8. Click "⚡ Unlock Premium - ₦8,000"
9. Paystack checkout opens (Zap, Card, Transfer, Bank, USSD, OPay)
10. Complete payment
11. Premium unlocked! ✅
```

### Android TWA Users (Google Play):
```
1. User opens installed Android app from Play Store
2. Navigate to Sleep tab → See lock screen
3. Click "Upgrade to Premium - $4.99"
4. Navigate to Stats tab
5. See: "Upgrade to Premium"
6. See: "Unlock Sleep Tracker and premium features forever!"
7. Click "Get Premium - $4.99 (Google Play)"
8. Google Play billing dialog opens
9. Complete purchase via Google Play
10. Premium unlocked! ✅
```

---

## 🛠️ Technical Implementation

### Stats.tsx Payment Section:

```typescript
{/* Upgrade to Premium Section */}
{!adsRemoved && (
  <Card>
    <CardContent>
      <div className="text-center space-y-6">
        {/* Header - Same for all platforms */}
        <div className="space-y-3">
          <Trophy className="w-8 h-8 text-primary" />
          <h3 className="text-2xl font-bold">Upgrade to Premium</h3>
          <p className="text-sm text-muted-foreground">
            Unlock Sleep Tracker and premium features forever!
          </p>
        </div>

        {/* Buttons - Platform-specific */}
        <div className="space-y-3 max-w-sm mx-auto">
          
          {/* Google Play Button - Only on Android TWA */}
          {isTWAWithBilling() && (
            <>
              <Button onClick={handleRemoveAds}>
                Get Premium - $4.99 (Google Play)
              </Button>
              <Button onClick={handleRestorePurchases}>
                Restore Purchase
              </Button>
            </>
          )}

          {/* Paystack Payment - Only on Web */}
          {!isTWAWithBilling() && (
            <div className="space-y-4">
              {/* Email Input */}
              {!userEmail || isEditingEmail ? (
                <Card>
                  <Input 
                    type="email"
                    placeholder="your@email.com"
                    value={tempEmail}
                    onChange={(e) => setTempEmail(e.target.value)}
                  />
                  <Button onClick={handleSaveEmail}>
                    Continue to Payment
                  </Button>
                </Card>
              ) : (
                <div>
                  <p>Receipt will be sent to: {userEmail}</p>
                  <Button onClick={handleEditEmail}>Change</Button>
                  
                  <PaystackPayment
                    email={userEmail}
                    amount={800000} // ₦8,000 in kobo
                    publicKey="pk_live_000ac40050b8af5c5ee87edb8976d88d6eb6e315"
                    text="⚡ Unlock Premium - ₦8,000"
                    onSuccess={handlePaystackSuccess}
                    onClose={handlePaystackClose}
                  />
                </div>
              )}
              
              <p className="text-xs text-center text-muted-foreground">
                Secure payment via Paystack • Instant access • Lifetime premium
              </p>
            </div>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
)}
```

---

## 🔐 Premium Status Storage

Both payment methods store premium status in localStorage:

```typescript
// Keys used:
const PREMIUM_STORAGE_KEY = 'streak_ads_removed';
const PREMIUM_STORAGE_KEY_ALT = 'rise_premium';

// After successful payment:
localStorage.setItem('streak_ads_removed', 'true');
localStorage.setItem('rise_premium', 'true');
```

**Why two keys?**
- Backward compatibility
- Different parts of the app check different keys
- Both are set to ensure premium works everywhere

---

## 💰 Price Comparison

| Platform | Payment Method | Price | Currency |
|----------|---------------|-------|----------|
| Web Browser | Paystack | ₦8,000 | Nigerian Naira |
| Android TWA | Google Play | $4.99 | US Dollars |

**Note:** Prices are different because:
- Google Play uses USD
- Paystack uses NGN
- ₦8,000 ≈ $5 (approximate exchange rate)

---

## 🧪 Testing Guide

### Test Web Payment (Paystack):
1. Open https://rise-soltide-app.netlify.app/ in Chrome
2. Open DevTools Console (F12)
3. Type: `window.AndroidBilling`
4. Should see: `undefined` ✅
5. Navigate to Stats tab
6. Should see: Paystack payment option ✅

### Test Android TWA Payment (Google Play):
1. Install app from Play Store
2. Open app
3. Open Chrome DevTools (if debugging)
4. Type: `window.AndroidBilling`
5. Should see: `{getPurchases: ƒ, buy: ƒ, consume: ƒ}` ✅
6. Navigate to Stats tab
7. Should see: Google Play button ✅

---

## 🐛 Common Issues & Solutions

### Issue 1: "Payment button not showing"
**Cause**: Premium already unlocked
**Solution**: Clear localStorage and refresh
```javascript
localStorage.removeItem('streak_ads_removed');
localStorage.removeItem('rise_premium');
location.reload();
```

### Issue 2: "Wrong payment method showing"
**Cause**: Platform detection issue
**Solution**: Check `window.AndroidBilling` in console
```javascript
// In console:
console.log('Is TWA?', typeof window.AndroidBilling !== 'undefined');
// Should be true for Android app, false for web
```

### Issue 3: "Paystack not loading"
**Cause**: Missing react-paystack package
**Solution**: Install dependency
```bash
pnpm add react-paystack
```

### Issue 4: "Google Play billing not working"
**Cause**: TWA not properly configured
**Solution**: 
1. Check TWA wrapper has billing enabled
2. Verify `window.AndroidBilling` is injected
3. Check product ID matches: `premium_unlock`

---

## 📊 Payment Success Flow

### Paystack Success:
```typescript
const handlePaystackSuccess = async (reference: any) => {
  console.log('✅ Payment successful:', reference);
  
  // Unlock premium
  await unlockPremium(userEmail);
  
  // Update UI
  setAdsRemoved(true);
  
  // Show success message
  toast.success('🎉 Premium unlocked! Enjoy your new features!');
};
```

### Google Play Success:
```typescript
const handleRemoveAds = async () => {
  try {
    const success = await purchasePremium();
    
    if (success) {
      setAdsRemoved(true);
      toast.success('🎉 Premium unlocked via Google Play!');
    }
  } catch (error) {
    toast.error('Purchase failed. Please try again.');
  }
};
```

---

## 🔄 Restore Purchase

### Web (Paystack):
- Uses `RestorePremiumWeb` component
- Checks backend for email-based purchases
- Restores premium if payment found

### Android (Google Play):
- Uses `restorePurchases()` function
- Queries Google Play for existing purchases
- Syncs with localStorage

```typescript
const handleRestorePurchases = async () => {
  try {
    const restored = await restorePurchases();
    
    if (restored) {
      setAdsRemoved(true);
      toast.success('✅ Premium restored from Google Play!');
    } else {
      toast.info('No premium purchase found');
    }
  } catch (error) {
    toast.error('Failed to restore purchases');
  }
};
```

---

## 📝 Environment Variables

```env
# Paystack Configuration
VITE_PAYSTACK_PUBLIC_KEY=pk_live_000ac40050b8af5c5ee87edb8976d88d6eb6e315
VITE_PREMIUM_PRICE=800000  # ₦8,000 in kobo

# App Configuration
VITE_APP_ID=your_app_id
```

---

## ✅ Current Status

**What's Working:**
- ✅ Platform detection (TWA vs Web)
- ✅ Paystack payment for web users
- ✅ Google Play billing for Android users
- ✅ Email collection for receipts
- ✅ Premium status storage
- ✅ Restore purchase functionality
- ✅ Clear, non-confusing UI text

**Recent Fixes:**
- ✅ Removed confusing "Download Android app" text (Commit: 3cad28a)
- ✅ Enabled Paystack payment (Commit: ee99e2b)
- ✅ Fixed navigation (Commit: 9fc91b7)
- ✅ Installed react-paystack (Commit: a135110)

---

## 🎯 Summary

**Your app now has a smart payment system that:**

1. **Automatically detects** the platform (Web vs Android TWA)
2. **Shows the right payment method** (Paystack vs Google Play)
3. **Uses consistent messaging** ("Unlock Sleep Tracker and premium features forever!")
4. **Handles both payment flows** seamlessly
5. **Stores premium status** reliably
6. **Allows purchase restoration** on both platforms

**Users can pay via:**
- **Web**: Paystack (₦8,000) - Card, Bank Transfer, USSD, Zap, OPay
- **Android**: Google Play ($4.99) - Google Play billing

**No more confusion!** The text is clear, the payment buttons are obvious, and the system works reliably on both platforms.

---

*Last Updated: 2025-12-13*
*Build: 891.45 kB*
*Status: ✅ Production Ready*
