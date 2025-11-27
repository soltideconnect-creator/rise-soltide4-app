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

// LocalStorage key for premium status (fallback for web)
const PREMIUM_STORAGE_KEY = 'streak_ads_removed';

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
 * Check if user has purchased premium
 * Works both in TWA (checks Google Play) and web (checks localStorage)
 */
export async function isPremiumUnlocked(): Promise<boolean> {
  // If running in TWA with billing support, check Google Play purchases
  if (isTWAWithBilling() && window.AndroidBilling) {
    try {
      const purchases = await window.AndroidBilling.getPurchases();
      const hasPremium = purchases.includes(PREMIUM_PRODUCT_ID);
      
      // Sync with localStorage for consistency
      if (hasPremium) {
        localStorage.setItem(PREMIUM_STORAGE_KEY, 'true');
      }
      
      return hasPremium;
    } catch (error) {
      console.error('Error checking Google Play purchases:', error);
      // Fallback to localStorage if API fails
      return localStorage.getItem(PREMIUM_STORAGE_KEY) === 'true';
    }
  }
  
  // Fallback for web version: check localStorage
  return localStorage.getItem(PREMIUM_STORAGE_KEY) === 'true';
}

/**
 * Purchase premium unlock
 * In TWA: triggers Google Play billing flow
 * On web: simulates purchase (for testing)
 */
export async function purchasePremium(): Promise<boolean> {
  // If running in TWA with billing support, use Google Play
  if (isTWAWithBilling() && window.AndroidBilling) {
    try {
      const success = await window.AndroidBilling.buy(PREMIUM_PRODUCT_ID);
      
      if (success) {
        // Mark as premium in localStorage for offline access
        localStorage.setItem(PREMIUM_STORAGE_KEY, 'true');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error purchasing premium:', error);
      throw new Error('Purchase failed. Please try again.');
    }
  }
  
  // Fallback for web version: simulate purchase (for testing)
  localStorage.setItem(PREMIUM_STORAGE_KEY, 'true');
  return true;
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
 * Get premium status synchronously from localStorage
 * Use this for immediate UI rendering, then verify with isPremiumUnlocked()
 */
export function getPremiumStatusSync(): boolean {
  return localStorage.getItem(PREMIUM_STORAGE_KEY) === 'true';
}
