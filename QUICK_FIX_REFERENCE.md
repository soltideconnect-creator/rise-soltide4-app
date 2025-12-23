# Quick Fix Reference - Cache Issues

## Problem: Function Signature Changed But Browser Has Old Code

### Symptoms
```
TypeError: someFunction(...).then is not a function
TypeError: Cannot read property 'X' of undefined
Unexpected behavior after code changes
```

### Quick Fix (3 Steps)

```bash
# 1. Remove any .old or .backup files
rm src/**/*.old.ts
rm src/**/*.backup.ts

# 2. Clear Vite cache
rm -rf node_modules/.vite

# 3. Restart dev server
pnpm run dev
```

### Browser Side (If Still Not Working)

```
1. Hard refresh: Ctrl + Shift + R (Windows/Linux)
                 Cmd + Shift + R (Mac)
                 
2. Clear browser cache:
   - Chrome: DevTools → Network → Disable cache (checkbox)
   - Then refresh again
   
3. Incognito/Private window:
   - Open app in new incognito window
   - This bypasses all cache
```

## Common Cache Issues

### 1. Function Changed from Async to Sync
```typescript
// Old (cached)
export async function myFunc(): Promise<boolean> { }

// New (actual code)
export function myFunc(): boolean { }

// Error: myFunc(...).then is not a function
```

**Fix**: Clear cache (steps above)

### 2. Function Changed from Sync to Async
```typescript
// Old (cached)
export function myFunc(): boolean { }

// New (actual code)
export async function myFunc(): Promise<boolean> { }

// Error: Cannot read property 'X' of boolean
```

**Fix**: Clear cache (steps above)

### 3. Import Path Changed
```typescript
// Old (cached)
import { myFunc } from './old-path';

// New (actual code)
import { myFunc } from './new-path';

// Error: Module not found or undefined
```

**Fix**: Clear cache (steps above)

## Prevention

### ✅ DO
- Use git for version history
- Clear cache when changing function signatures
- Hard refresh browser when debugging
- Keep only current version of files

### ❌ DON'T
- Keep .old.ts or .backup.ts files
- Assume browser has latest code
- Skip cache clearing after major changes
- Have multiple versions of same file

## Vite Cache Locations

```
node_modules/.vite/          ← Main cache (clear this)
node_modules/.vite/deps/     ← Dependency cache
dist/                        ← Build output (can delete)
```

## Full Nuclear Option

If nothing else works:

```bash
# Delete everything and rebuild
rm -rf node_modules
rm -rf node_modules/.vite
rm -rf dist
rm package-lock.json  # or pnpm-lock.yaml

# Reinstall
pnpm install

# Restart
pnpm run dev
```

## Quick Checklist

When you encounter cache issues:

- [ ] Remove .old/.backup files
- [ ] Clear Vite cache (`rm -rf node_modules/.vite`)
- [ ] Restart dev server
- [ ] Hard refresh browser (Ctrl+Shift+R)
- [ ] Check DevTools console for errors
- [ ] Try incognito window
- [ ] If still broken: nuclear option

## Specific to This Project

### isPremiumUnlocked() Issue

**Problem**: Function changed from async to sync  
**Error**: `isPremiumUnlocked(...).then is not a function`  
**Fix**: Removed `googlePlayBilling.old.ts`, cleared cache, restarted

**Current (Correct)**:
```typescript
export function isPremiumUnlocked(): boolean {
  return localStorage.getItem('streak_ads_removed') === 'true';
}
```

**Usage**:
```typescript
const hasPremium = isPremiumUnlocked();  // No await!
```

---

**Last Updated**: 2025-11-23  
**Status**: ✅ All cache issues resolved
