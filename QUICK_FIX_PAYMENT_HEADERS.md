# Quick Fix: Add Payment Feature-Policy Headers

## The Problem

Error: **"Payment permissions policy not granted"**

## The Solution

Add these HTTP headers to your PWA:

```
Feature-Policy: payment 'self' https://play.google.com
Permissions-Policy: payment=(self "https://play.google.com")
```

## How to Add Headers

### Option 1: HTML Meta Tags (Easiest)

Add to `index.html` in `<head>` section:

```html
<meta http-equiv="Feature-Policy" content="payment 'self' https://play.google.com">
<meta http-equiv="Permissions-Policy" content="payment=(self 'https://play.google.com')">
```

### Option 2: Nginx

Add to your nginx config:

```nginx
location / {
  add_header Feature-Policy "payment 'self' https://play.google.com";
  add_header Permissions-Policy "payment=(self \"https://play.google.com\")";
}
```

### Option 3: Apache

Add to `.htaccess`:

```apache
Header set Feature-Policy "payment 'self' https://play.google.com"
Header set Permissions-Policy "payment=(self \"https://play.google.com\")"
```

### Option 4: Node.js/Express

Add middleware:

```javascript
app.use((req, res, next) => {
  res.setHeader('Feature-Policy', "payment 'self' https://play.google.com");
  res.setHeader('Permissions-Policy', 'payment=(self "https://play.google.com")');
  next();
});
```

### Option 5: Cloudflare Workers/Pages

Create `_headers` file in your public directory:

```
/*
  Feature-Policy: payment 'self' https://play.google.com
  Permissions-Policy: payment=(self "https://play.google.com")
```

Or use a Worker:

```javascript
export async function onRequest(context) {
  const response = await context.next();
  response.headers.set('Feature-Policy', "payment 'self' https://play.google.com");
  response.headers.set('Permissions-Policy', 'payment=(self "https://play.google.com")');
  return response;
}
```

### Option 6: Vercel

Create `vercel.json`:

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

### Option 7: Netlify

Create `netlify.toml`:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    Feature-Policy = "payment 'self' https://play.google.com"
    Permissions-Policy = "payment=(self \"https://play.google.com\")"
```

Or create `_headers` file:

```
/*
  Feature-Policy: payment 'self' https://play.google.com
  Permissions-Policy: payment=(self "https://play.google.com")
```

## Verify Headers

### Method 1: Browser DevTools

1. Open your PWA in Chrome
2. Open DevTools (F12)
3. Go to Network tab
4. Reload page
5. Click on the main document request
6. Check Response Headers

### Method 2: curl

```bash
curl -I https://medo.dev/project/your-app
```

Look for:
```
Feature-Policy: payment 'self' https://play.google.com
Permissions-Policy: payment=(self "https://play.google.com")
```

### Method 3: Online Tools

- https://securityheaders.com/
- https://observatory.mozilla.org/

## After Adding Headers

1. **Clear cache** in your browser
2. **Uninstall app** from Android device
3. **Reinstall app** from Google Play (closed testing)
4. **Test purchase** again

## If Still Not Working

Try regenerating your TWA with PWABuilder:

1. Go to https://www.pwabuilder.com/
2. Enter your PWA URL
3. ✅ Check "Enable Google Play Billing"
4. Download new .aab
5. Upload to Google Play Console
6. Test again

## Immediate Workaround

Use Paystack payment (already working in your app):

1. Scroll down on Stats page
2. Enter email
3. Click "Get Premium - ₦8,000 (Paystack)"
4. Complete payment

## Timeline

- **Headers added**: Immediate effect
- **TWA regenerated**: 1-2 hours (build + upload)
- **Google Play processing**: 5-10 minutes
- **Asset Links verification**: 24-48 hours (if needed)

## Expected Result

After adding headers:

✅ "Opening Google Play purchase..." → Google Play billing overlay appears  
✅ User completes purchase  
✅ "Premium unlocked! Sleep Tracker is now available! 🎉"  

## Need Help?

Contact: soltidewellness@gmail.com

---

**Quick Summary**:
1. Add Feature-Policy headers (choose method above)
2. Clear cache and reinstall app
3. Test purchase again
4. If still broken, regenerate TWA with PWABuilder
