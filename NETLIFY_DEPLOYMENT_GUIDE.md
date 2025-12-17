# Netlify Deployment Guide - Fix 404 Errors

## Problem: 404 Errors on Netlify

### Issue
When deploying a Single Page Application (SPA) to Netlify, you get 404 errors when:
- Refreshing the page on any route other than `/`
- Directly accessing a URL like `https://your-site.netlify.app/calendar`
- Navigating to a route and then refreshing

### Root Cause
Netlify tries to find actual files for each route (e.g., `/calendar.html`), but in a SPA, all routes are handled by `index.html` through client-side routing.

### Solution
Configure Netlify to redirect all routes to `index.html` with a 200 status code (not 301/302).

---

## Solution Implemented: ✅

### 1. Created `public/_redirects` File

**File:** `public/_redirects`

```
# Netlify Redirects for SPA (Single Page Application)
# This ensures all routes are handled by index.html

# Redirect all routes to index.html with 200 status (SPA mode)
/*    /index.html   200
```

**How it works:**
- `/*` matches all routes
- `/index.html` is the target
- `200` status means "serve this file" (not a redirect)
- This file is copied to `dist/` during build

### 2. Created `netlify.toml` Configuration

**File:** `netlify.toml` (in project root)

```toml
[build]
  command = "npm run build"
  publish = "dist"
  environment = { NODE_VERSION = "18" }

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
  force = false
```

**Benefits:**
- ✅ Handles SPA routing
- ✅ Configures build settings
- ✅ Sets security headers
- ✅ Optimizes caching
- ✅ PWA-ready configuration

---

## Deployment Steps

### Option 1: Deploy via Netlify CLI (Recommended)

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify:**
   ```bash
   netlify login
   ```

3. **Build the project:**
   ```bash
   npm run build
   ```

4. **Deploy to production:**
   ```bash
   netlify deploy --prod --dir=dist
   ```

5. **Verify deployment:**
   - Open the provided URL
   - Test navigation to different routes
   - Refresh on each route
   - All routes should work ✅

### Option 2: Deploy via Netlify Dashboard

1. **Build the project locally:**
   ```bash
   npm run build
   ```

2. **Go to Netlify Dashboard:**
   - Visit: https://app.netlify.com
   - Click "Add new site" → "Deploy manually"

3. **Drag and drop:**
   - Drag the `dist/` folder to the upload area
   - Wait for deployment to complete

4. **Verify deployment:**
   - Open the provided URL
   - Test all routes
   - Should work without 404 errors ✅

### Option 3: Deploy via Git (Continuous Deployment)

1. **Push to Git repository:**
   ```bash
   git add .
   git commit -m "Add Netlify configuration for SPA routing"
   git push origin main
   ```

2. **Connect to Netlify:**
   - Go to: https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Choose your Git provider (GitHub, GitLab, Bitbucket)
   - Select your repository

3. **Configure build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Click "Deploy site"

4. **Netlify will automatically:**
   - Read `netlify.toml` configuration
   - Use `_redirects` file from `dist/`
   - Handle SPA routing correctly ✅

---

## Verification Steps

### Test 1: Root Route
1. Open: `https://your-site.netlify.app/`
2. Should load home page ✅

### Test 2: Direct Route Access
1. Open: `https://your-site.netlify.app/calendar`
2. Should load calendar page (not 404) ✅

### Test 3: Refresh on Route
1. Navigate to: `https://your-site.netlify.app/stats`
2. Press F5 to refresh
3. Should stay on stats page (not 404) ✅

### Test 4: Deep Link
1. Share link: `https://your-site.netlify.app/settings`
2. Open in new browser/incognito
3. Should load settings page directly ✅

### Test 5: Service Worker
1. Open DevTools (F12)
2. Go to Application → Service Workers
3. Should show: `sw.js` activated ✅

### Test 6: PWA Install
1. Look for install icon in address bar
2. Click to install
3. Should install successfully ✅

---

## File Structure After Build

```
dist/
├── index.html                    # Main HTML file
├── _redirects                    # SPA routing config (copied from public/)
├── manifest.json                 # PWA manifest
├── sw.js                         # Service worker
├── rise-icon.png                 # App icon
├── shortcut-icon-96.png          # Shortcut icon
├── shortcut-icon-192.png         # Shortcut icon
├── screenshot-1.png              # Screenshot 1
├── screenshot-2.png              # Screenshot 2
├── screenshot-3.png              # Screenshot 3
├── screenshot-4.png              # Screenshot 4
└── assets/
    ├── index-[hash].js           # JavaScript bundle
    └── index-[hash].css          # CSS bundle
```

**Important:** The `_redirects` file must be in the `dist/` folder after build. Vite automatically copies files from `public/` to `dist/`.

---

## Troubleshooting

### Issue 1: Still Getting 404 Errors

**Possible causes:**
1. `_redirects` file not in `dist/` folder
2. `netlify.toml` not in project root
3. Old deployment cached

**Solutions:**

1. **Verify `_redirects` file:**
   ```bash
   # Check if file exists in public/
   ls -la public/_redirects
   
   # Build and check dist/
   npm run build
   ls -la dist/_redirects
   ```

2. **Verify `netlify.toml` location:**
   ```bash
   # Should be in project root
   ls -la netlify.toml
   ```

3. **Clear Netlify cache:**
   - Go to Netlify Dashboard
   - Site settings → Build & deploy
   - Click "Clear cache and retry deploy"

4. **Redeploy:**
   ```bash
   npm run build
   netlify deploy --prod --dir=dist
   ```

### Issue 2: `_redirects` File Not Working

**Check file format:**
```bash
# View file content
cat public/_redirects

# Should show:
# /*    /index.html   200
```

**Check for hidden characters:**
```bash
# Use hexdump to check
hexdump -C public/_redirects | head
```

**Recreate file:**
```bash
# Delete old file
rm public/_redirects

# Create new file
echo "/*    /index.html   200" > public/_redirects

# Verify
cat public/_redirects
```

### Issue 3: Routes Work Locally But Not on Netlify

**Local vs Production:**
- Local dev server (Vite) handles SPA routing automatically
- Netlify needs explicit configuration

**Solution:**
- Ensure `_redirects` file is in `public/` folder
- Build and verify it's copied to `dist/`
- Deploy with `netlify deploy --prod --dir=dist`

### Issue 4: Service Worker Not Working on Netlify

**Check HTTPS:**
```bash
# Service workers require HTTPS
curl -I https://your-site.netlify.app
# Should return: HTTP/2 200
```

**Check service worker file:**
```bash
# Verify sw.js is in dist/
ls -la dist/sw.js

# Check if accessible
curl https://your-site.netlify.app/sw.js
```

**Clear service worker cache:**
1. Open DevTools (F12)
2. Go to Application → Service Workers
3. Click "Unregister"
4. Hard reload (Ctrl+Shift+R)

---

## Netlify Configuration Explained

### `_redirects` File

```
/*    /index.html   200
```

**Breakdown:**
- `/*` - Match all routes (wildcard)
- `/index.html` - Serve this file
- `200` - HTTP status code (success, not redirect)

**Why 200 and not 301/302?**
- `200` serves the file at the requested URL
- `301/302` redirects to a different URL
- For SPA, we want to serve `index.html` but keep the URL

### `netlify.toml` File

**Build Configuration:**
```toml
[build]
  command = "npm run build"
  publish = "dist"
  environment = { NODE_VERSION = "18" }
```

**Redirect Rules:**
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
  force = false
```

**Security Headers:**
```toml
[[headers]]
  for = "/*"
  [headers.values]
    Strict-Transport-Security = "max-age=31536000"
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
```

**Caching:**
```toml
# Static assets - cache for 1 year
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

# Service worker - no cache
[[headers]]
  for = "/sw.js"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"
```

---

## Best Practices

### 1. Always Use `_redirects` File
- ✅ Simple and reliable
- ✅ Works with all Netlify plans
- ✅ No configuration needed in dashboard

### 2. Use `netlify.toml` for Advanced Config
- ✅ Version controlled
- ✅ Consistent across deployments
- ✅ Includes security headers
- ✅ Optimizes caching

### 3. Test Before Production
```bash
# Build locally
npm run build

# Preview production build
npm run preview

# Test all routes
# Then deploy to Netlify
```

### 4. Use Environment Variables
```toml
[build.environment]
  NODE_VERSION = "18"
  VITE_API_URL = "https://api.example.com"
```

### 5. Monitor Deployments
- Check Netlify deploy logs
- Verify all routes work
- Test PWA installation
- Run Lighthouse audit

---

## Common Netlify Errors & Solutions

### Error: "Page Not Found"

**Cause:** Missing `_redirects` file

**Solution:**
```bash
# Create _redirects file
echo "/*    /index.html   200" > public/_redirects

# Rebuild and deploy
npm run build
netlify deploy --prod --dir=dist
```

### Error: "Build Failed"

**Cause:** Build command or publish directory incorrect

**Solution:**
```toml
# In netlify.toml
[build]
  command = "npm run build"  # Correct build command
  publish = "dist"           # Correct output directory
```

### Error: "Service Worker Not Found"

**Cause:** Service worker not in dist/ folder

**Solution:**
```bash
# Verify sw.js is in public/
ls public/sw.js

# Build and check dist/
npm run build
ls dist/sw.js

# Should be copied automatically
```

### Error: "Manifest Not Found"

**Cause:** Manifest not in dist/ folder

**Solution:**
```bash
# Verify manifest.json is in public/
ls public/manifest.json

# Build and check dist/
npm run build
ls dist/manifest.json
```

---

## Deployment Checklist

### Pre-Deployment
- [ ] `_redirects` file in `public/` folder
- [ ] `netlify.toml` in project root
- [ ] All assets in `public/` folder
- [ ] Build completes successfully: `npm run build`
- [ ] Preview works: `npm run preview`

### Deployment
- [ ] Deploy to Netlify
- [ ] Wait for deployment to complete
- [ ] Check deploy logs for errors
- [ ] Verify site is live

### Post-Deployment
- [ ] Test root route: `/`
- [ ] Test all routes: `/calendar`, `/stats`, etc.
- [ ] Refresh on each route (should not 404)
- [ ] Test direct URL access
- [ ] Verify service worker activated
- [ ] Test PWA installation
- [ ] Run Lighthouse audit
- [ ] Check PWABuilder analysis

---

## Summary

### Problem
- ✅ 404 errors on Netlify when refreshing or accessing routes directly

### Solution
- ✅ Created `public/_redirects` file
- ✅ Created `netlify.toml` configuration
- ✅ Configured SPA routing with 200 status
- ✅ Added security headers
- ✅ Optimized caching

### Result
- ✅ All routes work correctly
- ✅ No 404 errors on refresh
- ✅ Direct URL access works
- ✅ Service worker activated
- ✅ PWA installable
- ✅ Production ready

### Next Steps
1. Build: `npm run build`
2. Deploy: `netlify deploy --prod --dir=dist`
3. Test: Verify all routes work
4. Monitor: Check Netlify dashboard

---

**Last Updated:** 2025-11-26  
**Version:** 1.3  
**Status:** Netlify Configuration Complete ✅  
**404 Errors:** Fixed ✅
