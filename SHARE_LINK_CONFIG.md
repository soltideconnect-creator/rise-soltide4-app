# Quick Reference: Share Link Configuration

## Current Configuration

**Status:** Production (Public Play Store)

**Link:** `https://play.google.com/store/apps/details?id=com.soltide.rise`

**File:** `src/components/ShareButton.tsx` (line 18)

---

## Switch to Closed Testing (Opt-in Link)

### Step 1: Edit ShareButton.tsx

Open `src/components/ShareButton.tsx` and change line 18:

**FROM:**
```typescript
const shareLink = 'https://play.google.com/store/apps/details?id=com.soltide.rise';
```

**TO:**
```typescript
const shareLink = 'https://play.google.com/apps/testing/com.soltide.rise';
```

### Step 2: Rebuild and Deploy

```bash
pnpm run build
git add src/components/ShareButton.tsx
git commit -m "Switch share link to closed testing opt-in"
git push origin master
```

### Step 3: Verify

- Wait for Netlify deployment (~2 minutes)
- Open Settings page
- Scan QR code
- Confirm it opens opt-in page

---

## Switch Back to Production

### Step 1: Edit ShareButton.tsx

Open `src/components/ShareButton.tsx` and change line 18:

**FROM:**
```typescript
const shareLink = 'https://play.google.com/apps/testing/com.soltide.rise';
```

**TO:**
```typescript
const shareLink = 'https://play.google.com/store/apps/details?id=com.soltide.rise';
```

### Step 2: Rebuild and Deploy

```bash
pnpm run build
git add src/components/ShareButton.tsx
git commit -m "Switch share link back to production Play Store"
git push origin master
```

---

## Testing Both Links

### Production Link Test
1. Open: `https://play.google.com/store/apps/details?id=com.soltide.rise`
2. Should show: Public Play Store listing
3. Available to: All users

### Opt-in Link Test
1. Open: `https://play.google.com/apps/testing/com.soltide.rise`
2. Should show: "Become a tester" page
3. Available to: Testers only (closed testing)

---

## Share Message

**Current Message:**
```
Try Rise: Offline habit tracker with smart sleep features. One-time $4.99 premium unlock. Install free: [link]
```

**To Customize:**
Edit `src/components/ShareButton.tsx` line 21

---

## QR Code Configuration

**Current Settings:**
- Size: 160x160px
- Error correction: Medium (M)
- Margin: Included
- Background: White

**To Customize:**
Edit `src/components/ShareButton.tsx` lines 63-67

---

## Quick Commands

### Build
```bash
pnpm run build
```

### Lint
```bash
pnpm run lint
```

### Deploy
```bash
git push origin master
```

### Check Current Link
```bash
grep "shareLink =" src/components/ShareButton.tsx
```

---

## Troubleshooting

### QR Code Not Scanning
- Ensure white background (line 62)
- Increase size if needed (line 65)
- Improve lighting conditions

### Share Sheet Not Opening
- Check browser support (Web Share API)
- Test on Android TWA
- Verify clipboard fallback works

### Wrong Link in Share
- Check line 18 in ShareButton.tsx
- Rebuild after changes
- Clear browser cache

---

## Support

**Documentation:** VIRAL_SHARE_FEATURE.md

**Files:**
- Component: `src/components/ShareButton.tsx`
- Settings: `src/pages/Settings.tsx`

**Commit:** 16d2302
