# 🧪 Instructions for Closed Testing Testers

## Quick Start - Unlock Premium for Testing

If you're stuck on "Opening Google Play purchase..." or "Restoring purchases...", here are **3 easy ways** to unlock premium:

---

## ⚡ Method 1: One-Click Unlock (Easiest)

1. **Open the app with this special URL:**
   ```
   Add ?test=true to the end of your app URL
   Example: https://your-app.com/?test=true
   ```

2. **Go to the Stats tab** (bottom navigation)

3. **Look for the "Unlock for Testing" button** (gray button with bug icon)

4. **Click it** → Premium unlocked instantly! ✅

---

## ⏱️ Method 2: Automatic Unlock (Wait 5 Seconds)

1. **Open the app normally**

2. **Go to the Stats tab**

3. **Click "Get Premium - $4.99 (Google Play)"**

4. **Wait 5 seconds** while it shows "Opening Google Play purchase..."

5. **After 5 seconds**, the system will automatically unlock premium for you ✅

---

## 🔄 Method 3: Restore Purchase (Also Works)

1. **Open the app**

2. **Go to the Stats tab**

3. **Click "Restore Purchase"**

4. **Wait 5 seconds** while it shows "Restoring purchases..."

5. **After 5 seconds**, premium will be unlocked automatically ✅

---

## ✅ How to Verify Premium is Unlocked

After using any method above, check if premium is working:

1. **Go to the Sleep tab** (bottom navigation)
2. **You should see the Sleep Tracker** (not a lock screen)
3. **Try setting a sleep time** - it should work!
4. **Check the Stats tab** - no more "Upgrade to Premium" card

---

## 🆘 Still Having Issues?

If none of the methods work, try this **manual fix**:

1. **Open the app**
2. **Press F12** on your keyboard (opens developer tools)
3. **Click the "Console" tab**
4. **Copy and paste this command:**
   ```javascript
   localStorage.setItem('streak_ads_removed', 'true');
   localStorage.setItem('rise_premium', 'true');
   location.reload();
   ```
5. **Press Enter**
6. **The page will reload** → Premium unlocked! ✅

---

## 📧 Contact Support

If you're still stuck after trying all methods:

**Email:** soltidewellness@gmail.com

**Please include:**
- Screenshot of the error/spinner
- Which method you tried
- Your browser/device info

---

## 🎯 What to Test After Unlocking

Once premium is unlocked, please test these features:

### Sleep Tracker:
- [ ] Set a sleep time
- [ ] Set a wake time
- [ ] View sleep duration
- [ ] Check sleep quality tracking

### Advanced Analytics:
- [ ] View detailed stats
- [ ] Check habit trends
- [ ] View completion rates
- [ ] Check streak history

### Premium Features:
- [ ] No ads visible
- [ ] All features accessible
- [ ] No lock screens
- [ ] Smooth performance

---

## 💡 Tips for Testing

1. **Test on different days** - Complete habits on multiple days to see streak tracking
2. **Try different habits** - Create multiple habits and track them
3. **Check notifications** - Make sure reminders work
4. **Test dark mode** - Switch between light and dark themes
5. **Report bugs** - Let us know if anything doesn't work as expected

---

## 🙏 Thank You!

Thank you for helping us test the app! Your feedback is invaluable for making the app better.

**Remember:** This is a testing environment. The "Unlock for Testing" button and automatic unlock are only available for testers. Real users will use normal Google Play billing.

---

*Need help? Email: soltidewellness@gmail.com*
*Testing Guide Updated: 2025-12-19*
