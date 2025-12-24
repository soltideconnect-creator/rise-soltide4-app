# Error Handling & Crash Prevention System

## Overview

This application implements a comprehensive, multi-layered error handling system that ensures the app **never crashes** and always provides a recovery path for users.

## 🛡️ Error Handling Layers

### 1. **React Error Boundary** (`src/components/ErrorBoundary.tsx`)

**Purpose**: Catches all React component errors and prevents white screen crashes.

**Features**:
- ✅ Catches rendering errors in React components
- ✅ Displays user-friendly error UI with recovery options
- ✅ Logs errors to localStorage for debugging
- ✅ Tracks error count to detect repeated failures
- ✅ Auto-recovery after 3 consecutive errors
- ✅ Provides "Reload", "Clear Data", and "Try Again" options
- ✅ Preserves error logs across reloads

**Usage**:
```tsx
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

**Recovery Actions**:
1. **Try Again**: Resets error state without reloading
2. **Reload App**: Full page reload
3. **Clear All Data & Reload**: Emergency reset (clears localStorage, sessionStorage, IndexedDB, service workers)

---

### 2. **Global Error Handlers** (`src/main.tsx`)

**Purpose**: Catches all uncaught JavaScript errors and unhandled promise rejections.

**Features**:
- ✅ Catches synchronous errors (`window.addEventListener('error')`)
- ✅ Catches async errors (`window.addEventListener('unhandledrejection')`)
- ✅ Logs all errors to localStorage with full context
- ✅ Tracks error count with automatic reset
- ✅ Emergency recovery UI after 5 errors in 10 seconds
- ✅ Intercepts console.error for debugging
- ✅ Prevents infinite error loops

**Error Tracking**:
- Logs stored in `localStorage.global_error_logs`
- Keeps last 20 errors
- Includes: message, filename, line number, stack trace, timestamp, user agent

**Auto-Recovery**:
- Triggers after 5 errors within 10 seconds
- Shows emergency recovery UI
- Options: "Clear Data & Restart" or "Try Reload"

---

### 3. **Service Worker Error Handling** (`public/sw.js`)

**Purpose**: Ensures service worker never crashes and provides offline fallback.

**Features**:
- ✅ Catches service worker errors
- ✅ Catches unhandled promise rejections in SW
- ✅ Resilient caching (continues on cache failures)
- ✅ Network-first strategy with cache fallback
- ✅ Beautiful offline page when network fails
- ✅ Graceful degradation for all fetch errors
- ✅ Safe notification handling with error catching

**Offline Experience**:
- Shows styled offline page with "Try Again" button
- Serves cached content when available
- Never blocks app from loading

---

### 4. **Error Recovery Utilities** (`src/utils/errorRecovery.ts`)

**Purpose**: Provides programmatic error handling and recovery tools.

**Features**:
- ✅ `logError()`: Log errors to localStorage
- ✅ `getErrorLogs()`: Retrieve all error logs
- ✅ `clearErrorLogs()`: Clear all error logs
- ✅ `isInErrorState()`: Check if app has recent errors
- ✅ `emergencyReset()`: Clear all data and reset app
- ✅ `safeReload()`: Reload with fallback
- ✅ `checkAppHealth()`: Comprehensive health check
- ✅ `withErrorHandling()`: Wrap async functions with error handling
- ✅ `withErrorHandlingSync()`: Wrap sync functions with error handling
- ✅ `initializeErrorRecovery()`: Initialize error recovery system

**Usage Examples**:
```typescript
// Log an error
errorRecovery.logError(error, 'payment_processing');

// Check app health
const health = errorRecovery.checkAppHealth();
if (!health.healthy) {
  console.warn('Issues:', health.issues);
}

// Wrap function with error handling
const safeFunction = errorRecovery.withErrorHandling(
  async () => {
    // Your code here
  },
  'function_context'
);

// Emergency reset
errorRecovery.emergencyReset();
```

---

### 5. **Promise API Validation** (`src/main.tsx`)

**Purpose**: Validates browser compatibility before app starts.

**Features**:
- ✅ Checks if Promise API is available
- ✅ Checks if Promise.prototype.then exists
- ✅ Shows browser compatibility error if validation fails
- ✅ Prevents app from starting in unsupported browsers

**Browser Support**:
- Requires modern JavaScript features
- Shows clear error message for outdated browsers
- Prevents cryptic errors in old WebViews

---

## 🔄 Error Recovery Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     Error Occurs                            │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  1. Error Boundary catches React errors                     │
│  2. Global handlers catch JS errors                         │
│  3. Service Worker catches SW errors                        │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  Log error to localStorage with full context                │
│  - Message, stack trace, timestamp, user agent              │
│  - Keep last 20-50 errors                                   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  Check error count                                          │
│  - Single error: Show error UI                              │
│  - 3+ errors: Auto-recovery                                 │
│  - 5+ errors in 10s: Emergency reset                        │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  Present recovery options to user                           │
│  1. Try Again (reset error state)                           │
│  2. Reload App (full reload)                                │
│  3. Clear Data & Reload (emergency reset)                   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  App recovers and continues running                         │
│  - Error logs preserved for debugging                       │
│  - User data preserved (unless emergency reset)             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Error Logging

### Storage Locations

| Log Type | Storage Key | Max Entries | Purpose |
|----------|-------------|-------------|---------|
| App Errors | `app_error_logs` | 50 | Application-level errors |
| Error Boundary | `error_logs` | 10 | React component errors |
| Global Errors | `global_error_logs` | 20 | Uncaught JS errors |
| Console Errors | `console_error_logs` | 50 | console.error calls |

### Error Log Format

```typescript
{
  type: string;           // Error context (e.g., 'app_initialization')
  message: string;        // Error message
  stack?: string;         // Stack trace
  timestamp: string;      // ISO timestamp
  userAgent: string;      // Browser user agent
  url?: string;          // Page URL when error occurred
}
```

---

## 🚨 Emergency Recovery

### Triggers

1. **3 consecutive errors** in Error Boundary → Auto-clear data
2. **5 errors in 10 seconds** in global handler → Emergency UI
3. **Manual trigger** via `errorRecovery.emergencyReset()`

### What Gets Cleared

✅ **Cleared**:
- localStorage (except error logs)
- sessionStorage
- IndexedDB databases
- Service worker registrations

❌ **Preserved**:
- Error logs (for debugging)
- Browser cache
- Cookies

---

## 🧪 Health Checks

### Automatic Health Monitoring

- Runs on app initialization
- Periodic checks every 60 seconds
- Checks:
  - localStorage availability
  - React loaded
  - Recent error count
  - Service worker status

### Manual Health Check

```typescript
const health = errorRecovery.checkAppHealth();
console.log('Healthy:', health.healthy);
console.log('Issues:', health.issues);
```

---

## 🎯 Best Practices

### For Developers

1. **Always wrap risky operations**:
   ```typescript
   const safeOperation = errorRecovery.withErrorHandling(
     async () => {
       // Risky code here
     },
     'operation_context'
   );
   ```

2. **Log errors with context**:
   ```typescript
   try {
     // Code
   } catch (error) {
     errorRecovery.logError(error, 'specific_context');
   }
   ```

3. **Check health before critical operations**:
   ```typescript
   const health = errorRecovery.checkAppHealth();
   if (!health.healthy) {
     // Handle unhealthy state
   }
   ```

### For Users

1. **First error**: Click "Reload App"
2. **Repeated errors**: Click "Clear All Data & Reload"
3. **Persistent issues**: Check browser/WebView version

---

## 📱 PWA & Offline Support

### Service Worker Features

- **Network-first** strategy for fresh content
- **Cache fallback** for offline access
- **Graceful degradation** on errors
- **Beautiful offline page** with retry button
- **Automatic cache cleanup** on updates

### Offline Experience

When offline:
1. App serves cached content
2. If no cache, shows styled offline page
3. User can retry when connection restored
4. No white screen or crash

---

## 🔍 Debugging

### View Error Logs

```typescript
// In browser console
const logs = JSON.parse(localStorage.getItem('app_error_logs'));
console.table(logs);
```

### Clear Error Logs

```typescript
// In browser console
errorRecovery.clearErrorLogs();
```

### Check App Health

```typescript
// In browser console
const health = errorRecovery.checkAppHealth();
console.log(health);
```

---

## ✅ Testing Error Handling

### Test Error Boundary

```typescript
// Throw error in component
throw new Error('Test error');
```

### Test Global Handler

```typescript
// In console
throw new Error('Test global error');
```

### Test Promise Rejection

```typescript
// In console
Promise.reject('Test rejection');
```

### Test Service Worker

```typescript
// In console
navigator.serviceWorker.controller.postMessage({ type: 'TEST_ERROR' });
```

---

## 🎉 Result

**Your app will NEVER crash permanently!**

- ✅ All errors are caught
- ✅ All errors are logged
- ✅ Users always have recovery options
- ✅ App can always be reset to working state
- ✅ Offline support with graceful fallback
- ✅ Automatic health monitoring
- ✅ Emergency recovery for critical failures

**The app is now production-ready with enterprise-grade error handling!** 🚀
