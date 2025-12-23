/**
 * Google Play Billing Integration for TWA (Trusted Web Activity)
 * 
 * Product ID: "premium_unlock"
 * Price: $4.99 one-time purchase
 * 
 * This module supports BOTH:
 * 1. PWABuilder's Digital Goods API (automatic, no native code needed)
 * 2. Custom AndroidBilling interface (for custom TWA wrappers)
 */

// Product ID for premium unlock
export const PREMIUM_PRODUCT_ID = 'premium_unlock';

// LocalStorage keys for premium status (support both keys for compatibility)
const PREMIUM_STORAGE_KEY = 'streak_ads_removed';
const PREMIUM_STORAGE_KEY_ALT = 'rise_premium';

// Type definition for Digital Goods API (PWABuilder standard)
interface DigitalGoodsService {
  getDetails(itemIds: string[]): Promise<ItemDetails[]>;
  listPurchases(): Promise<PurchaseDetails[]>;
  consume(purchaseToken: string): Promise<void>;
}

interface ItemDetails {
  itemId: string;
  title: string;
  price: {
    currency: string;
    value: string;
  };
  description: string;
}

interface PurchaseDetails {
  itemId: string;
  purchaseToken: string;
}

interface PaymentRequest {
  new(methodData: any[], details: any): PaymentRequest;
  show(): Promise<PaymentResponse>;
}

interface PaymentResponse {
  complete(result: string): Promise<void>;
  details: {
    token: string;
  };
}

// Type definition for Android Billing interface (custom TWA)
interface AndroidBilling {
  getPurchases(): Promise<string[]>; // Returns array of purchased product IDs
  buy(productId: string): Promise<boolean>; // Returns true if purchase successful
  consume(productId: string): Promise<boolean>; // For consumable products (not used here)
}

// Extend Window interface to include both APIs
declare global {
  interface Window {
    AndroidBilling?: AndroidBilling;
    getDigitalGoodsService?: (serviceProvider: string) => Promise<DigitalGoodsService>;
    PaymentRequest?: any;
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
 * Purchase premium unlock with multiple fallback methods
 * Priority order:
 * 1. Digital Goods API (PWABuilder standard - RECOMMENDED)
 * 2. Custom AndroidBilling interface (for custom TWA wrappers)
 * 3. Paystack (web fallback)
 */
export async function purchasePremium(): Promise<boolean> {
  console.log('🚀 Starting premium purchase flow...');
  
  // If running on Android, try Google Play Billing
  if (isAndroid()) {
    console.log('📱 Android detected, attempting Google Play Billing...');
    
    // METHOD 1: Try Digital Goods API (PWABuilder standard)
    if (window.getDigitalGoodsService && window.PaymentRequest) {
      try {
        console.log('💳 Attempting Digital Goods API (PWABuilder)...');
        const service = await window.getDigitalGoodsService('https://play.google.com/billing');
        
        if (service) {
          console.log('✅ Digital Goods Service available');
          
          // Get product details
          const details = await service.getDetails([PREMIUM_PRODUCT_ID]);
          
          if (details && details.length > 0) {
            console.log('📦 Product details:', details[0]);
            
            // Create payment request
            const paymentRequest = new window.PaymentRequest(
              [{
                supportedMethods: 'https://play.google.com/billing',
                data: {
                  sku: PREMIUM_PRODUCT_ID,
                }
              }],
              {
                total: {
                  label: 'Premium Unlock',
                  amount: {
                    currency: details[0].price.currency,
                    value: details[0].price.value,
                  }
                }
              }
            );
            
            // Show payment UI
            console.log('🎨 Showing payment UI...');
            const paymentResponse = await paymentRequest.show();
            
            // Complete the purchase
            await paymentResponse.complete('success');
            console.log('✅ Purchase successful via Digital Goods API!');
            
            // Mark as premium
            localStorage.setItem(PREMIUM_STORAGE_KEY, 'true');
            localStorage.setItem(PREMIUM_STORAGE_KEY_ALT, 'true');
            
            return true;
          } else {
            console.warn('⚠️ Product not found in Digital Goods API');
          }
        }
      } catch (error) {
        console.error('❌ Digital Goods API error:', error);
        // Continue to fallback method
      }
    }
    
    // METHOD 2: Try custom AndroidBilling interface
    if (window.AndroidBilling) {
      try {
        console.log('🔧 Attempting custom AndroidBilling interface...');
        
        const success = await window.AndroidBilling.buy(PREMIUM_PRODUCT_ID);
        
        if (success) {
          console.log('✅ Purchase successful via AndroidBilling!');
          localStorage.setItem(PREMIUM_STORAGE_KEY, 'true');
          localStorage.setItem(PREMIUM_STORAGE_KEY_ALT, 'true');
          return true;
        }
        
        console.log('❌ Purchase cancelled or failed');
        return false;
      } catch (error) {
        console.error('❌ AndroidBilling error:', error);
        throw new Error('Purchase failed. Please try again or contact soltidewellness@gmail.com');
      }
    }
    
    // No billing method available
    console.error('❌ No billing method available');
    throw new Error(
      'Google Play Billing is not available. Please make sure you downloaded the app from Google Play Store. ' +
      'If the issue persists, contact soltidewellness@gmail.com'
    );
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
 * Supports both Digital Goods API and custom AndroidBilling interface
 */
export async function restorePurchases(): Promise<boolean> {
  if (!isAndroid()) {
    throw new Error('Restore purchases is only available on Android app');
  }
  
  console.log('🔄 Restoring purchases...');
  
  // METHOD 1: Try Digital Goods API (PWABuilder standard)
  if (window.getDigitalGoodsService) {
    try {
      console.log('💳 Checking Digital Goods API for purchases...');
      const service = await window.getDigitalGoodsService('https://play.google.com/billing');
      
      if (service) {
        const purchases = await service.listPurchases();
        const hasPremium = purchases.some(p => p.itemId === PREMIUM_PRODUCT_ID);
        
        if (hasPremium) {
          localStorage.setItem(PREMIUM_STORAGE_KEY, 'true');
          localStorage.setItem(PREMIUM_STORAGE_KEY_ALT, 'true');
          console.log('✅ Premium restored from Digital Goods API');
          return true;
        }
      }
    } catch (error) {
      console.error('❌ Digital Goods API restore error:', error);
      // Continue to fallback method
    }
  }
  
  // METHOD 2: Try custom AndroidBilling interface
  if (window.AndroidBilling) {
    try {
      console.log('🔧 Checking AndroidBilling for purchases...');
      const purchases = await window.AndroidBilling.getPurchases();
      const hasPremium = purchases.includes(PREMIUM_PRODUCT_ID);
      
      if (hasPremium) {
        localStorage.setItem(PREMIUM_STORAGE_KEY, 'true');
        localStorage.setItem(PREMIUM_STORAGE_KEY_ALT, 'true');
        console.log('✅ Premium restored from AndroidBilling');
        return true;
      } else {
        console.log('ℹ️ No premium purchase found');
        return false;
      }
    } catch (error) {
      console.error('❌ AndroidBilling restore error:', error);
      throw new Error('Failed to restore purchases. Please try again.');
    }
  }
  
  // No billing method available
  throw new Error('Google Play Billing is not available. Please make sure you downloaded the app from Google Play Store.');
}

/**
 * Get premium status synchronously from localStorage
 * Use this for immediate UI rendering, then verify with isPremiumUnlocked()
 */
export function getPremiumStatusSync(): boolean {
  return localStorage.getItem(PREMIUM_STORAGE_KEY) === 'true' || 
         localStorage.getItem(PREMIUM_STORAGE_KEY_ALT) === 'true';
}
