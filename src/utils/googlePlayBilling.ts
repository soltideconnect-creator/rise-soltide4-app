/**
 * Google Play Billing Integration for TWA (Trusted Web Activity)
 * 
 * Product ID: "premium_unlock"
 * Price: $4.99 one-time purchase
 * 
 * This module uses PWABuilder's Digital Goods API (W3C standard)
 * for in-app purchases. No custom native code required.
 * 
 * @see https://github.com/WICG/digital-goods/blob/main/explainer.md
 * @see https://developer.chrome.com/docs/android/trusted-web-activity/receive-payments-play-billing/
 */

// Product ID for premium unlock
export const PREMIUM_PRODUCT_ID = 'premium_unlock';

// LocalStorage keys for premium status (support both keys for compatibility)
const PREMIUM_STORAGE_KEY = 'streak_ads_removed';
const PREMIUM_STORAGE_KEY_ALT = 'rise_premium';

// Type definitions for Digital Goods API (PWABuilder standard)
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

// Extend Window interface for Digital Goods API
declare global {
  interface Window {
    getDigitalGoodsService?: (serviceProvider: string) => Promise<DigitalGoodsService>;
    PaymentRequest?: any;
  }
}

/**
 * Check if running on Android device
 */
export function isAndroid(): boolean {
  const ua = navigator.userAgent.toLowerCase();
  const isAndroidDevice = /android/.test(ua);
  
  console.log('🔍 Device detection:', {
    userAgent: ua,
    isAndroid: isAndroidDevice,
    hasDigitalGoods: !!window.getDigitalGoodsService,
    hasPaymentRequest: !!window.PaymentRequest
  });
  
  return isAndroidDevice;
}

/**
 * Check if Digital Goods API is available (PWABuilder TWA)
 */
export async function isDigitalGoodsAvailable(): Promise<boolean> {
  if (!window.getDigitalGoodsService) {
    console.log('❌ Digital Goods API not available');
    return false;
  }
  
  try {
    const service = await window.getDigitalGoodsService('https://play.google.com/billing');
    const available = !!service;
    console.log(available ? '✅ Digital Goods Service available' : '❌ Digital Goods Service not available');
    return available;
  } catch (error) {
    console.error('❌ Error checking Digital Goods API:', error);
    return false;
  }
}

/**
 * Check if running in TWA with billing support
 */
export function isTWAWithBilling(): boolean {
  return isAndroid() && !!window.getDigitalGoodsService && !!window.PaymentRequest;
}

/**
 * Check if premium is unlocked (synchronous)
 */
export function isPremiumUnlocked(): boolean {
  // Check primary key
  const primary = localStorage.getItem(PREMIUM_STORAGE_KEY);
  if (primary === 'true') {
    return true;
  }
  
  // Check alternative key (JSON format)
  const alt = localStorage.getItem(PREMIUM_STORAGE_KEY_ALT);
  if (alt) {
    try {
      const data = JSON.parse(alt);
      if (data.unlocked === true) {
        return true;
      }
    } catch (e) {
      // Invalid JSON, ignore
    }
  }
  
  return false;
}

/**
 * Purchase premium unlock using Digital Goods API
 * 
 * This will show the in-app billing overlay (not external Play Store)
 * 
 * @returns Promise<boolean> - true if purchase successful
 */
export async function purchasePremium(): Promise<boolean> {
  console.log('🚀 Starting premium purchase flow...');
  
  // Check if running on Android with Digital Goods API
  if (!isAndroid()) {
    console.log('ℹ️ Not on Android, use Paystack fallback');
    throw new Error('PAYSTACK_FALLBACK');
  }
  
  if (!window.getDigitalGoodsService || !window.PaymentRequest) {
    console.error('❌ Digital Goods API not available');
    throw new Error('Digital Goods API not available. Please make sure you downloaded the app from Google Play Store.');
  }
  
  try {
    console.log('💳 Getting Digital Goods Service...');
    const service = await window.getDigitalGoodsService('https://play.google.com/billing');
    
    if (!service) {
      throw new Error('Digital Goods Service not available');
    }
    
    console.log('✅ Digital Goods Service available');
    
    // Get product details
    console.log('📦 Fetching product details for:', PREMIUM_PRODUCT_ID);
    const details = await service.getDetails([PREMIUM_PRODUCT_ID]);
    
    if (!details || details.length === 0) {
      throw new Error('Product not found. Please make sure the product is configured in Google Play Console.');
    }
    
    const product = details[0];
    console.log('📦 Product details:', {
      itemId: product.itemId,
      title: product.title,
      price: `${product.price.currency} ${product.price.value}`,
      description: product.description
    });
    
    // Create payment request
    console.log('💳 Creating payment request...');
    const paymentRequest = new window.PaymentRequest(
      [{
        supportedMethods: 'https://play.google.com/billing',
        data: {
          sku: PREMIUM_PRODUCT_ID,
        }
      }],
      {
        total: {
          label: product.title || 'Premium Unlock',
          amount: {
            currency: product.price.currency,
            value: product.price.value,
          }
        }
      }
    );
    
    // Show payment UI (in-app billing overlay) with timeout
    console.log('🎨 Showing in-app billing overlay...');
    
    // Add 15-second timeout to prevent infinite "Opening Google Play purchase..."
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error('PURCHASE_TIMEOUT'));
      }, 15000); // 15 seconds
    });
    
    const paymentResponse = await Promise.race([
      paymentRequest.show(),
      timeoutPromise
    ]);
    
    // Complete the purchase
    console.log('✅ Purchase successful, completing transaction...');
    await paymentResponse.complete('success');
    
    // Mark as premium in localStorage
    localStorage.setItem(PREMIUM_STORAGE_KEY, 'true');
    localStorage.setItem(PREMIUM_STORAGE_KEY_ALT, JSON.stringify({
      unlocked: true,
      unlockedAt: new Date().toISOString(),
      transactionId: 'google_play_purchase',
      features: ['sleep_tracker', 'no_ads', 'advanced_analytics'],
      platform: 'android'
    }));
    
    console.log('✅ Premium unlocked successfully!');
    
    // Notify app of premium status change
    window.dispatchEvent(new Event('premiumStatusChanged'));
    
    return true;
  } catch (error: any) {
    console.error('❌ Purchase failed:', error);
    
    // Payment permissions policy error (PWABuilder TWA configuration issue)
    if (error.message?.includes('permissions policy') || error.message?.includes('not granted')) {
      throw new Error('BILLING_NOT_CONFIGURED');
    }
    
    // Purchase timeout
    if (error.message === 'PURCHASE_TIMEOUT') {
      throw new Error('BILLING_NOT_CONFIGURED');
    }
    
    // User cancelled
    if (error.name === 'AbortError' || error.message?.includes('cancel')) {
      throw new Error('Purchase cancelled');
    }
    
    // Generic error
    throw new Error(`Purchase failed: ${error.message || 'Unknown error'}`);
  }
}

/**
 * Restore purchases from Google Play
 * 
 * Checks if user has already purchased premium and syncs with localStorage
 * 
 * @returns Promise<boolean> - true if premium was restored
 */
export async function restorePurchases(): Promise<boolean> {
  if (!isAndroid()) {
    throw new Error('Restore purchases is only available on Android app');
  }
  
  if (!window.getDigitalGoodsService) {
    throw new Error('Digital Goods API not available. Please make sure you downloaded the app from Google Play Store.');
  }
  
  console.log('🔄 Restoring purchases...');
  
  try {
    console.log('💳 Getting Digital Goods Service...');
    const service = await window.getDigitalGoodsService('https://play.google.com/billing');
    
    if (!service) {
      throw new Error('Digital Goods Service not available');
    }
    
    console.log('📦 Checking for existing purchases...');
    const purchases = await service.listPurchases();
    
    console.log(`📦 Found ${purchases.length} purchase(s)`);
    
    const hasPremium = purchases.some(p => p.itemId === PREMIUM_PRODUCT_ID);
    
    if (hasPremium) {
      // Restore premium status
      localStorage.setItem(PREMIUM_STORAGE_KEY, 'true');
      localStorage.setItem(PREMIUM_STORAGE_KEY_ALT, JSON.stringify({
        unlocked: true,
        unlockedAt: new Date().toISOString(),
        transactionId: 'google_play_restored',
        features: ['sleep_tracker', 'no_ads', 'advanced_analytics'],
        platform: 'android'
      }));
      
      console.log('✅ Premium restored successfully!');
      
      // Notify app of premium status change
      window.dispatchEvent(new Event('premiumStatusChanged'));
      
      return true;
    } else {
      console.log('ℹ️ No premium purchase found');
      return false;
    }
  } catch (error) {
    console.error('❌ Restore failed:', error);
    throw new Error('Failed to restore purchases. Please try again.');
  }
}

/**
 * Initialize billing (check for existing purchases on app start)
 */
export async function initializeBilling(): Promise<void> {
  if (!isTWAWithBilling()) {
    console.log('ℹ️ Not in TWA with billing, skipping initialization');
    return;
  }
  
  try {
    console.log('🔄 Initializing billing...');
    await restorePurchases();
  } catch (error) {
    console.error('⚠️ Billing initialization failed:', error);
    // Don't throw, just log - app should still work
  }
}

/**
 * Get premium status (synchronous, for immediate UI updates)
 */
export function getPremiumStatusSync(): boolean {
  return isPremiumUnlocked();
}

/**
 * Check if test mode is enabled (for development/testing)
 */
export function isTestMode(): boolean {
  // Check if running on localhost or test domain
  const hostname = window.location.hostname;
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('netlify.app');
}

/**
 * Debug function to unlock premium (for testing only)
 * Only works in test mode
 */
export function debugUnlockPremium(): void {
  if (!isTestMode()) {
    console.warn('⚠️ Debug unlock only available in test mode');
    return;
  }
  
  localStorage.setItem(PREMIUM_STORAGE_KEY, 'true');
  localStorage.setItem(PREMIUM_STORAGE_KEY_ALT, JSON.stringify({
    unlocked: true,
    unlockedAt: new Date().toISOString(),
    transactionId: 'debug_unlock',
    features: ['sleep_tracker', 'no_ads', 'advanced_analytics'],
    platform: 'debug'
  }));
  
  console.log('🔓 Debug: Premium unlocked');
  window.dispatchEvent(new Event('premiumStatusChanged'));
}

/**
 * Check if debug unlock is available
 */
export function isDebugUnlockAvailable(): boolean {
  return isTestMode();
}
