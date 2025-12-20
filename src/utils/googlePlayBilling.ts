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
 * Check if running on Android device
 * Uses multiple detection methods for reliability
 */
export function isAndroid(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Method 1: Check User-Agent for Android
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  const isAndroidUA = /android/i.test(userAgent);
  
  // Method 2: Check for TWA-specific features
  const isTWA = window.matchMedia('(display-mode: standalone)').matches ||
                (window.navigator as any).standalone === true ||
                document.referrer.includes('android-app://');
  
  // Method 3: Check localStorage override (for testing)
  const forceAndroid = localStorage.getItem('force_android_mode') === 'true';
  
  // Method 4: Check for common Android WebView indicators
  const isWebView = /wv|WebView/i.test(userAgent);
  
  return isAndroidUA || isTWA || forceAndroid || isWebView;
}

/**
 * Check if running in TWA (Android app) with billing support
 * Now uses improved Android detection
 */
export function isTWAWithBilling(): boolean {
  // First check if we're on Android
  if (!isAndroid()) return false;
  
  // Check if AndroidBilling interface is available
  return typeof window !== 'undefined' && 
         typeof (window as any).AndroidBilling !== 'undefined';
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
 * Check if running in test mode
 * Returns true if:
 * - Development environment (localhost)
 * - URL has ?test=true parameter
 * - Mobile browser without TWA (for testing)
 */
function isTestMode(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check for ?test=true URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('test') === 'true') return true;
  
  // Check for development environment
  const isDev = window.location.hostname === 'localhost' || 
                window.location.hostname === '127.0.0.1' ||
                window.location.hostname.includes('192.168.');
  
  return isDev;
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
 * Returns true in test mode (dev, ?test=true, or mobile browser without TWA)
 */
export function isDebugUnlockAvailable(): boolean {
  return isTestMode();
}

/**
 * Check if user has purchased premium
 * Works both in TWA (checks Google Play) and web (checks localStorage)
 */
export async function isPremiumUnlocked(): Promise<boolean> {
  // If running on Android with billing support, check Google Play purchases
  if (isAndroid() && window.AndroidBilling) {
    try {
      const purchases = await window.AndroidBilling.getPurchases();
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
  // If running on Android, use Google Play
  if (isAndroid()) {
    // Check if AndroidBilling interface is available
    if (window.AndroidBilling) {
      try {
        const success = await window.AndroidBilling.buy(PREMIUM_PRODUCT_ID);
        
        if (success) {
          // Mark as premium in localStorage for offline access (both keys)
          localStorage.setItem(PREMIUM_STORAGE_KEY, 'true');
          localStorage.setItem(PREMIUM_STORAGE_KEY_ALT, 'true');
          return true;
        }
        
        return false;
      } catch (error) {
        console.error('Error purchasing premium:', error);
        throw new Error('Purchase failed. Please try again.');
      }
    } else {
      // AndroidBilling not available - show helpful error
      throw new Error('Google Play Billing is not available. Please make sure you downloaded the app from Google Play Store.');
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
  if (!isAndroid()) {
    throw new Error('Restore purchases is only available on Android app');
  }
  
  if (!window.AndroidBilling) {
    throw new Error('Google Play Billing is not available. Please make sure you downloaded the app from Google Play Store.');
  }
  
  try {
    const purchases = await window.AndroidBilling.getPurchases();
    const hasPremium = purchases.includes(PREMIUM_PRODUCT_ID);
    
    if (hasPremium) {
      // Restore premium status in localStorage
      localStorage.setItem(PREMIUM_STORAGE_KEY, 'true');
      localStorage.setItem(PREMIUM_STORAGE_KEY_ALT, 'true');
      console.log('✅ Premium restored from Google Play');
      return true;
    } else {
      console.log('ℹ️ No premium purchase found');
      return false;
    }
  } catch (error) {
    console.error('Error restoring purchases:', error);
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