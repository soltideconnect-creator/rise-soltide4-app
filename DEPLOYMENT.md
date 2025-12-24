# Deployment Guide - Rise Habit Tracker

## 🚀 Quick Deployment to Netlify

### Prerequisites
- Git repository initialized
- Netlify account (free tier works)
- Node.js 18+ installed locally

### Step 1: Prepare Environment Variables

Create a `.env.production` file (or configure in Netlify dashboard):

```bash
# Required
VITE_APP_ID=app-7qtp23c0l8u9

# Optional - Paystack Payment Integration
VITE_PAYSTACK_PUBLIC_KEY=pk_live_your_key_here
VITE_PREMIUM_PRICE=499000
VITE_CURRENCY=NGN
VITE_APP_URL=https://your-app.netlify.app
VITE_PAYSTACK_CALLBACK_URL=https://your-app.netlify.app/payment-success
VITE_ENV=production
```

### Step 2: Push to Git

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Rise Habit Tracker"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/yourusername/rise-habit-tracker.git

# Push
git push -u origin main
```

### Step 3: Deploy to Netlify

#### Option A: Netlify CLI (Recommended)

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

#### Option B: Netlify Dashboard

1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect your Git repository
4. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Node version:** `18`
5. Add environment variables in Site settings → Environment variables
6. Click "Deploy site"

### Step 4: Configure Environment Variables in Netlify

1. Go to Site settings → Environment variables
2. Add the following variables:
   - `VITE_APP_ID` = `app-7qtp23c0l8u9`
   - (Optional) Add Paystack keys if using payment features

### Step 5: Verify Deployment

1. Visit your deployed URL (e.g., `https://your-app.netlify.app`)
2. Test the following:
   - ✅ App loads without errors
   - ✅ Can create habits
   - ✅ Can complete habits
   - ✅ Calendar view works
   - ✅ Stats display correctly
   - ✅ Sleep tracker works (requires HTTPS)
   - ✅ Dark mode toggle works
   - ✅ PWA install prompt appears
   - ✅ Debug Center is NOT visible (production mode)

## 🔧 Production Configuration

### Automatic Optimizations

The app is pre-configured with production optimizations:

1. **Console Removal**: All `console.log`, `console.warn`, `console.info` statements are automatically removed in production builds (only `console.error` remains for critical error tracking)

2. **Debug Center**: Only visible in development mode (`npm run dev`), automatically hidden in production

3. **Minification**: Code is minified using Terser with aggressive compression

4. **Bundle Size**: Optimized to ~880 KB (gzipped: ~248 KB)

5. **Caching**: Static assets cached for 1 year via Netlify headers

6. **PWA**: Service worker enabled for offline functionality

### Build Output

```
dist/
├── index.html (10.49 KB)
├── assets/
│   ├── index-[hash].css (93.42 KB, gzipped: 15.32 KB)
│   └── index-[hash].js (879.40 KB, gzipped: 248.13 KB)
├── manifest.json
├── sw.js
└── icons/
```

## 🐛 Debugging Production Issues

### Enable Debug Mode Locally

To test production build locally with debug features:

```bash
# Build for production
npm run build

# Serve production build
npm run preview

# Debug Center will NOT be visible (as expected)
```

### View Production Logs

Since console statements are stripped in production, use browser DevTools:

1. Open DevTools (F12)
2. Go to Console tab
3. Only critical errors (console.error) will appear

### Test Production Build Locally

```bash
# Build
npm run build

# Preview
npm run preview

# Open http://localhost:4173
```

## 📱 Android TWA (Trusted Web Activity) Setup

### Prerequisites
- App deployed to Netlify with HTTPS
- Google Play Console account
- Android Studio installed

### Steps

1. **Generate Digital Asset Links**
   - Use PWABuilder: https://www.pwabuilder.com
   - Enter your Netlify URL
   - Download Android package

2. **Configure Google Play Billing**
   - Create in-app product: `premium_unlock`
   - Set price: $4.99
   - Product type: One-time purchase

3. **Update Product ID**
   - Already configured in `src/utils/googlePlayBilling.ts`
   - Product ID: `premium_unlock`

4. **Test Payment Flow**
   - Use Google Play Console test accounts
   - Test purchase flow before production release

## 🔐 Security Checklist

- ✅ No API keys in source code
- ✅ Environment variables used for sensitive data
- ✅ HTTPS enforced via Netlify
- ✅ Content Security Policy configured
- ✅ XSS protection enabled
- ✅ CORS properly configured
- ✅ Service Worker uses HTTPS only

## 📊 Performance Metrics

Target metrics (measured with Lighthouse):

- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 90+
- PWA: ✅ Installable

## 🔄 Continuous Deployment

Netlify automatically deploys when you push to your main branch:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push

# Netlify automatically builds and deploys
```

## 🆘 Troubleshooting

### Build Fails on Netlify

**Issue**: Build command fails

**Solution**:
1. Check Node version is 18+
2. Verify all dependencies are in package.json
3. Check build logs for specific errors

### App Loads Blank Page

**Issue**: White screen after deployment

**Solution**:
1. Check browser console for errors
2. Verify environment variables are set
3. Clear browser cache and reload

### Debug Center Visible in Production

**Issue**: Debug Center appears in production

**Solution**:
1. Verify build command is `npm run build` (not `npm run dev`)
2. Check `import.meta.env.DEV` is false in production
3. Rebuild and redeploy

### Payment Not Working

**Issue**: Google Play Billing fails

**Solution**:
1. Verify app is installed from Google Play Store (not sideloaded)
2. Check Digital Goods API is available
3. Verify product ID matches Google Play Console
4. Test with Paystack fallback on web

## 📝 Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_APP_ID` | Yes | - | Unique app identifier |
| `VITE_PAYSTACK_PUBLIC_KEY` | No | - | Paystack public key for web payments |
| `VITE_PREMIUM_PRICE` | No | 499000 | Price in kobo (₦4,990) |
| `VITE_CURRENCY` | No | NGN | Currency code |
| `VITE_APP_URL` | No | - | Deployed app URL |
| `VITE_PAYSTACK_CALLBACK_URL` | No | - | Payment callback URL |
| `VITE_ENV` | No | production | Environment name |

## 🎉 Post-Deployment

After successful deployment:

1. ✅ Test all features on mobile and desktop
2. ✅ Install PWA on mobile device
3. ✅ Test offline functionality
4. ✅ Verify notifications work
5. ✅ Test payment flow (if enabled)
6. ✅ Monitor error logs
7. ✅ Set up analytics (optional)

## 📞 Support

For issues or questions:
- Check browser console for errors
- Review Netlify build logs
- Test locally with `npm run build && npm run preview`
- Verify environment variables are set correctly

---

**Ready to deploy!** 🚀

The app is production-ready with all optimizations enabled. Simply push to Git and deploy to Netlify.
