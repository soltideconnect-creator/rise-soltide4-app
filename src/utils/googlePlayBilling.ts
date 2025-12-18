/**
 * Google Play Billing Integration for TWA (Trusted Web Activity)
 * 
 * Product ID: "premium_unlock"
 * Price: $4.99 one-time purchase
 * 
 * This module provides a simple interface to Google Play Billing API v6+
 * injected by the TWA wrapper when running as an installed Android app.
 */

// Product ID for premium unlock
export const PREMIUM_PRODUCT_ID = 'premium_unlock';

// LocalStorage keys for premium status (support both keys for compatibility)
const PREMIUM_STORAGE_KEY = 'streak_ads_removed';
const PREMIUM_STORAGE_KEY_ALT = 'rise_premium';

// Timeout for billing operations (5 seconds)
const BILLING_TIMEOUT_MS = 5000;

// Helper to detect mobile browser
const isMobileBrowser = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  
  // Check for mobile devices
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
};

// Debug mode detection
const isTestMode = (): boolean => {
  // Check URL parameter ?test=true
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('test') === 'true') return true;
  }
  
  // Check if in development mode
  if (import.meta.env.DEV) return true;
  
  // Check if on mobile browser without TWA (closed testing scenario)
  // This allows testers to use debug unlock on mobile web
  if (isMobileBrowser() && !isTWAWithBilling()) {
    return true;
  }
  
  return false;
};

// Type definition for Android Billing interface injected by TWA
interface AndroidBilling {
  getPurchases(): Promise<string[]>; // Returns array of purchased product IDs
  buy(productId: string): Promise<boolean>; // Returns true if purchase successful
  consume(productId: string): Promise<boolean>; // For consumable products (not used here)
}

// Extend Window interface to include AndroidBilling
declare global {
  interface Window {
    AndroidBilling?: AndroidBilling;
  }
}

/**
 * Check if running in TWA (Android app) with billing support
 */
export function isTWAWithBilling(): boolean {
  return typeof window !== 'undefined' && typeof window.AndroidBilling !== 'undefined';
}

/**
 * Helper function to add timeout to billing operations
 */
async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  fallbackValue: T,
  operationName: string
): Promise<T> {
  let timeoutId: NodeJS.Timeout;
  
  const timeoutPromise = new Promise<T>((resolve) => {
    timeoutId = setTimeout(() => {
      console.warn(`⚠️ ${operationName} timed out after ${timeoutMs}ms - using fallback`);
      resolve(fallbackValue);
    }, timeoutMs);
  });
  
  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutId);
    return result;
  } catch (error) {
    clearTimeout(timeoutId);
    console.error(`❌ ${operationName} failed:`, error);
    return fallbackValue;
  }
}

/**
 * Debug unlock for testers (closed testing environment)
 */
export function debugUnlockPremium(): void {
  console.log('🔓 Debug unlock activated (for testing only)');
  localStorage.setItem(PREMIUM_STORAGE_KEY, 'true');
  localStorage.setItem(PREMIUM_STORAGE_KEY_ALT, 'true');
}

/**
 * Check if debug unlock is available
 */
export function isDebugUnlockAvailable(): boolean {
  return isTestMode();
}

/**
 * Check if user has purchased premium
 * Works both in TWA (checks Google Play) and web (checks localStorage)
 */
export async function isPremiumUnlocked(): Promise<boolean> {
  // If running in TWA with billing support, check Google Play purchases
  if (isTWAWithBilling() && window.AndroidBilling) {
    try {
      // Add timeout to prevent infinite hang
      const purchases = await withTimeout(
        window.AndroidBilling.getPurchases(),
        BILLING_TIMEOUT_MS,
        [] as string[],
        'getPurchases'
      );
      
      const hasPremium = purchases.includes(PREMIUM_PRODUCT_ID);
      
      // Sync with localStorage for consistency (both keys)
      if (hasPremium) {
        localStorage.setItem(PREMIUM_STORAGE_KEY, 'true');
        localStorage.setItem(PREMIUM_STORAGE_KEY_ALT, 'true');
      }
      
      return hasPremium;
    } catch (error) {
      console.error('Error checking Google Play purchases:', error);
      // Fallback to localStorage if API fails (check both keys)
      return localStorage.getItem(PREMIUM_STORAGE_KEY) === 'true' || 
             localStorage.getItem(PREMIUM_STORAGE_KEY_ALT) === 'true';
    }
  }
  
  // Fallback for web version: check localStorage (both keys)
  return localStorage.getItem(PREMIUM_STORAGE_KEY) === 'true' || 
         localStorage.getItem(PREMIUM_STORAGE_KEY_ALT) === 'true';
}

/**
 * Purchase premium unlock
 * In TWA: triggers Google Play billing flow
 * On web: triggers Paystack payment (handled by Stats.tsx)
 */
export async function purchasePremium(): Promise<boolean> {
  // If running in TWA with billing support, use Google Play
  if (isTWAWithBilling() && window.AndroidBilling) {
    try {
      // Add timeout to prevent infinite hang
      const success = await withTimeout(
        window.AndroidBilling.buy(PREMIUM_PRODUCT_ID),
        BILLING_TIMEOUT_MS,
        false,
        'buy'
      );
      
      if (success) {
        // Mark as premium in localStorage for offline access (both keys)
        localStorage.setItem(PREMIUM_STORAGE_KEY, 'true');
        localStorage.setItem(PREMIUM_STORAGE_KEY_ALT, 'true');
        return true;
      }
      
      // If billing timed out or failed in test mode, use debug unlock
      if (isTestMode()) {
        console.warn('⚠️ Billing failed in test mode - activating debug unlock');
        debugUnlockPremium();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error purchasing premium:', error);
      
      // If in test mode and billing failed, use debug unlock
      if (isTestMode()) {
        console.warn('⚠️ Billing error in test mode - activating debug unlock');
        debugUnlockPremium();
        return true;
      }
      
      throw new Error('Purchase failed. Please try again.');
    }
  }
  
  // PRODUCTION MODE: Web version must use Paystack (no test unlock)
  // This function should not be called directly on web - use Paystack button in Stats.tsx
  throw new Error('Please use Paystack payment button to purchase premium on web');
}

/**
 * Initialize billing on app start
 * Checks for existing purchases and syncs premium status
 */
export async function initializeBilling(): Promise<void> {
  try {
    const hasPremium = await isPremiumUnlocked();
    
    if (hasPremium) {
      console.log('✅ Premium unlocked');
    } else {
      console.log('ℹ️ Free version - Premium available for $4.99');
    }
  } catch (error) {
    console.error('Error initializing billing:', error);
  }
}

/**
 * Restore purchases (for Android TWA)
 * Checks Google Play for existing purchases and syncs with localStorage
 */
export async function restorePurchases(): Promise<boolean> {
  if (!isTWAWithBilling() || !window.AndroidBilling) {
    throw new Error('Restore purchases is only available on Android app');
  }
  
  try {
    // Add timeout to prevent infinite hang
    const purchases = await withTimeout(
      window.AndroidBilling.getPurchases(),
      BILLING_TIMEOUT_MS,
      [] as string[],
      'restorePurchases'
    );
    
    const hasPremium = purchases.includes(PREMIUM_PRODUCT_ID);
    
    if (hasPremium) {
      // Restore premium status in localStorage
      localStorage.setItem(PREMIUM_STORAGE_KEY, 'true');
      localStorage.setItem(PREMIUM_STORAGE_KEY_ALT, 'true');
      console.log('✅ Premium restored from Google Play');
      return true;
    } else {
      console.log('ℹ️ No premium purchase found');
      
      // If in test mode and no purchase found, offer debug unlock
      if (isTestMode()) {
        console.warn('⚠️ No purchase found in test mode - check if debug unlock needed');
      }
      
      return false;
    }
  } catch (error) {
    console.error('Error restoring purchases:', error);
    
    // If in test mode and restore failed, use debug unlock
    if (isTestMode()) {
      console.warn('⚠️ Restore failed in test mode - activating debug unlock');
      debugUnlockPremium();
      return true;
    }
    
    throw new Error('Failed to restore purchases. Please try again.');
  }
}

/**
 * Get premium status synchronously from localStorage
 * Use this for immediate UI rendering, then verify with isPremiumUnlocked()
 */
export function getPremiumStatusSync(): boolean {
  return localStorage.getItem(PREMIUM_STORAGE_KEY) === 'true' || 
         localStorage.getItem(PREMIUM_STORAGE_KEY_ALT) === 'true';
}
