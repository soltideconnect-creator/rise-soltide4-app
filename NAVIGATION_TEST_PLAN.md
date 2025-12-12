# Navigation Test Plan - "Upgrade to Premium" Button

## Issue History
- **Reported**: 3 times today by user
- **Problem**: "The upgrade to premium does not lead to anywhere"
- **Root Cause**: Incorrect navigation method (hash-based instead of view-based)

## Test Scenarios

### ✅ Test 1: Sleep Page → Stats Page Navigation
**Steps:**
1. Open the app
2. Navigate to Sleep tab (bottom navigation)
3. Verify you see "Premium Feature" lock screen
4. Click "Upgrade to Premium - $4.99" button
5. **Expected**: App navigates to Stats tab
6. **Expected**: Stats tab shows payment options (Paystack or Google Play)

**Status**: ⏳ NEEDS USER TESTING

---

### ✅ Test 2: Stats Page Payment Options
**Steps:**
1. Navigate to Stats tab directly
2. Scroll down to payment section
3. **Expected**: See "Upgrade to Premium" section
4. **Expected**: See payment buttons (Paystack or Google Play depending on platform)

**Status**: ⏳ NEEDS USER TESTING

---

### ✅ Test 3: Complete Purchase Flow
**Steps:**
1. Go to Sleep tab
2. Click "Upgrade to Premium - $4.99"
3. Navigate to Stats tab
4. Click payment button (Paystack or Google Play)
5. Complete payment
6. Return to Sleep tab
7. **Expected**: Sleep tracker is now unlocked (no lock screen)

**Status**: ⏳ NEEDS USER TESTING

---

## Code Changes Made

### 1. Sleep.tsx
```typescript
// BEFORE (BROKEN):
<Button onClick={() => window.location.href = '#/stats'}>
  Upgrade to Premium - $4.99
</Button>

// AFTER (FIXED):
interface SleepProps {
  onNavigateToStats?: () => void;
}

export default function Sleep({ onNavigateToStats }: SleepProps) {
  // ...
  <Button onClick={() => onNavigateToStats?.()}>
    Upgrade to Premium - $4.99
  </Button>
}
```

### 2. App.tsx
```typescript
// BEFORE (BROKEN):
{currentView === 'sleep' && <Sleep />}

// AFTER (FIXED):
{currentView === 'sleep' && <Sleep onNavigateToStats={() => setCurrentView('stats')} />}
```

### 3. Documentation Added
- Added comprehensive navigation guide in App.tsx
- Added inline comments in Sleep.tsx
- Created NAVIGATION_FIX_TODO.md
- Created this test plan

---

## Prevention Measures

### ✅ Implemented
1. **Documentation**: Added clear navigation guide in App.tsx
2. **Comments**: Added inline comments explaining navigation
3. **Example**: Sleep component serves as reference implementation

### 🔮 Future Improvements
1. **ESLint Rule**: Detect and prevent hash-based navigation
2. **Navigation Hook**: Create reusable `useNavigation()` hook
3. **Type Safety**: Add navigation types to prevent mistakes

---

## User Verification Checklist

Please test and confirm:
- [ ] Sleep tab shows lock screen when not premium
- [ ] "Upgrade to Premium" button is visible and clickable
- [ ] Clicking button navigates to Stats tab
- [ ] Stats tab shows payment options
- [ ] Can complete purchase flow
- [ ] After purchase, Sleep tab is unlocked

---

## Build Status
✅ Build succeeds: 888.72 kB
✅ No TypeScript errors
✅ No linting errors

---

## Commit History
1. `9fc91b7` - fix: Make 'Upgrade to Premium' button navigate to Stats page
2. `edf7973` - docs: Add error fix summary for React hooks null errors
3. `eb9c37a` - fix: CRITICAL - Add React imports to UI components

---

## Next Steps
1. **USER**: Test the navigation flow
2. **USER**: Confirm the button works correctly
3. **DEV**: If issue persists, investigate other potential causes
4. **DEV**: Consider adding navigation hook for future-proofing
