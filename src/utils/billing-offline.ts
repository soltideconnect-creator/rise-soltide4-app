/**
 * 100% Offline-First Google Play Billing
 * No backend needed - verification handled by Google Play
 */

import { toast } from 'sonner';
import { debugLog, debugError } from './debug';

export const PREMIUM_PRODUCT_ID = 'premium_unlock';

interface PremiumData {
  valid: boolean;
  purchaseToken: string;
  purchasedAt?: string;
  restoredAt?: string;
  platform: 'google-play';
  features: string[];
}

/**
 * Check if we're running in a Trusted Web Activity (TWA)
 * TWA is required for Google Play billing to work
 */
function isTrustedWebActivity(): boolean {
  // Check for TWA-specific indicators
  const userAgent = navigator.userAgent;
  
  // Check if running in Android WebView/TWA
  const isAndroidWebView = /wv|WebView/i.test(userAgent);
  const isAndroid = /Android/i.test(userAgent);
  
  // Check for TWA-specific document referrer
  const isTWA = document.referrer.includes('android-app://');
  
  // Check if Digital Goods API is available (only in TWA)
  const hasDigitalGoodsAPI = typeof window.getDigitalGoodsService === 'function';
  
  debugLog('[TWA Detection]', {
    isAndroidWebView,
    isAndroid,
    isTWA,
    hasDigitalGoodsAPI,
    referrer: document.referrer,
    userAgent: userAgent.substring(0, 100)
  });
  
  return (isAndroid && (isTWA || hasDigitalGoodsAPI));
}

/**
 * Check if we're in development/testing mode
 */
function isDevelopmentMode(): boolean {
  const hostname = window.location.hostname;
  return hostname === 'localhost' || 
         hostname === '127.0.0.1' || 
         hostname.includes('medo.dev') ||
         hostname.includes('dev.') ||
         hostname.includes('staging.');
}

/**
 * Offline-first billing system for Rise app
 * Uses Google Play Digital Goods API for purchases
 * Stores premium status locally for offline access
 */
export class OfflineBilling {
  /**
   * Check if premium is unlocked (works offline)
   * @returns true if user has premium access
   */
  static isPremiumUnlocked(): boolean {
    const premiumData = localStorage.getItem('rise_premium');
    if (!premiumData) return false;

    try {
      const data: PremiumData = JSON.parse(premiumData);
      // Check if premium is valid (not expired)
      if (data.valid && data.platform === 'google-play') {
        debugLog('[OfflineBilling] Premium is unlocked');
        return true;
      }
    } catch (error) {
      debugError('[OfflineBilling] Error parsing premium data:', error);
      return false;
    }

    return false;
  }

  /**
   * Purchase premium (needs internet for this step only)
   * @returns true if purchase was successful
   */
  static async purchase(): Promise<boolean> {
    debugLog('[OfflineBilling] Starting purchase flow...');

    // Check if we're in TWA (required for billing)
    const isInTWA = isTrustedWebActivity();
    const isDev = isDevelopmentMode();

    debugLog('[OfflineBilling] Environment check:', { isInTWA, isDev });

    // If not in TWA and not in development, show clear error
    if (!isInTWA && !isDev) {
      const errorMsg = '⚠️ Google Play billing only works in the app from Google Play Store.\n\nPlease download the app from Google Play to purchase premium.';
      toast.error(errorMsg, { duration: 6000 });
      debugError('[OfflineBilling] Not in TWA:', errorMsg);
      return false;
    }

    // Development mode: Allow testing without actual payment
    if (isDev && !window.getDigitalGoodsService) {
      debugLog('[OfflineBilling] Development mode - offering test unlock');
      
      // Show development bypass option
      const shouldUnlock = confirm(
        '🔧 DEVELOPMENT MODE\n\n' +
        'Google Play billing is not available in browser.\n\n' +
        'Click OK to unlock premium for testing.\n' +
        'Click Cancel to skip.\n\n' +
        'Note: This only works in development/preview environments.'
      );

      if (shouldUnlock) {
        this.savePremium({
          valid: true,
          purchaseToken: 'dev_test_token_' + Date.now(),
          purchasedAt: new Date().toISOString(),
          platform: 'google-play',
          features: ['sleep_tracker', 'no_ads', 'themes', 'analytics'],
        });
        toast.success('✅ Premium unlocked for testing!');
        debugLog('[OfflineBilling] Development unlock successful');
        
        // Trigger storage event for cross-tab sync
        window.dispatchEvent(new Event('storage'));
        
        return true;
      } else {
        toast.info('Test unlock cancelled');
        return false;
      }
    }

    // Check if Digital Goods API is available
    if (!window.getDigitalGoodsService) {
      const errorMsg = '❌ Google Play Billing API not available.\n\nMake sure you:\n1. Downloaded the app from Google Play Store\n2. Are using the latest version\n3. Have Google Play Services installed';
      toast.error(errorMsg, { duration: 8000 });
      debugError('[OfflineBilling]', errorMsg);
      return false;
    }

    try {
      // Get Digital Goods Service
      debugLog('[OfflineBilling] Requesting Digital Goods Service...');
      const service = await window.getDigitalGoodsService('https://play.google.com/billing');
      
      if (!service) {
        throw new Error('Digital Goods Service returned null - billing not available');
      }

      debugLog('[OfflineBilling] Digital Goods Service obtained successfully');

      // Get product details
      debugLog('[OfflineBilling] Fetching product details for:', PREMIUM_PRODUCT_ID);
      const details = await service.getDetails([PREMIUM_PRODUCT_ID]);
      debugLog('[OfflineBilling] Product details:', details);

      if (!details || details.length === 0) {
        throw new Error('Product not found in Google Play Console. Please configure the product first.');
      }

      // Create payment request
      debugLog('[OfflineBilling] Creating payment request...');
      const paymentRequest = new PaymentRequest(
        [
          {
            supportedMethods: 'https://play.google.com/billing',
            data: { sku: PREMIUM_PRODUCT_ID },
          },
        ],
        {
          total: {
            label: 'Premium Unlock',
            amount: { currency: 'USD', value: '4.99' },
          },
        }
      );

      // Show payment UI
      debugLog('[OfflineBilling] Showing payment UI...');
      const paymentResponse = await paymentRequest.show();
      debugLog('[OfflineBilling] Payment response received:', paymentResponse);

      // Complete the payment
      await paymentResponse.complete('success');
      debugLog('[OfflineBilling] Payment completed successfully');

      // Store premium status OFFLINE
      this.savePremium({
        valid: true,
        purchaseToken: paymentResponse.details.token,
        purchasedAt: new Date().toISOString(),
        platform: 'google-play',
        features: ['sleep_tracker', 'no_ads', 'themes', 'analytics'],
      });

      toast.success('🎉 Premium unlocked successfully!');
      debugLog('[OfflineBilling] Purchase successful');
      
      // Trigger storage event for cross-tab sync
      window.dispatchEvent(new Event('storage'));
      
      return true;
    } catch (error: any) {
      debugError('[OfflineBilling] Purchase error:', error);
      
      if (error.name === 'AbortError') {
        toast.info('Purchase cancelled');
        debugLog('[OfflineBilling] Purchase cancelled by user');
      } else if (error.message && error.message.includes('Permission')) {
        // Permission error - provide detailed help
        const helpMsg = '❌ Payment Permission Error\n\n' +
          'This usually means:\n' +
          '1. You\'re not using the Google Play Store version\n' +
          '2. The app needs to be updated\n' +
          '3. Google Play Services needs updating\n\n' +
          'Please download the official app from Google Play Store.';
        toast.error(helpMsg, { duration: 10000 });
        debugError('[OfflineBilling] Permission error:', error.message);
      } else {
        toast.error('Purchase failed: ' + (error.message || 'Unknown error'));
        debugError('[OfflineBilling] Purchase failed:', error);
      }
      return false;
    }
  }

  /**
   * Restore purchases (checks Google Play when online)
   * @returns true if purchase was restored
   */
  static async restore(): Promise<boolean> {
    debugLog('[OfflineBilling] Starting restore flow...');

    // If offline or API not available, check local storage
    if (!window.getDigitalGoodsService) {
      const isUnlocked = this.isPremiumUnlocked();
      if (isUnlocked) {
        toast.success('Premium already unlocked! ✨');
      } else {
        toast.info('No purchase found. Purchase premium first.');
      }
      return isUnlocked;
    }

    try {
      // Get Digital Goods Service
      const service = await window.getDigitalGoodsService('https://play.google.com/billing');
      if (!service) {
        throw new Error('Digital Goods Service not available');
      }

      // List all purchases
      const purchases = await service.listPurchases();
      debugLog('[OfflineBilling] Found purchases:', purchases);

      // Find premium purchase
      const premiumPurchase = purchases.find((p) => p.itemId === PREMIUM_PRODUCT_ID);

      if (premiumPurchase) {
        // Save premium status
        this.savePremium({
          valid: true,
          purchaseToken: premiumPurchase.purchaseToken,
          restoredAt: new Date().toISOString(),
          platform: 'google-play',
          features: ['sleep_tracker', 'no_ads', 'themes', 'analytics'],
        });

        toast.success('Purchase restored! ✨');
        debugLog('[OfflineBilling] Purchase restored successfully');
        return true;
      }

      toast.info('No purchase found. Purchase premium first.');
      debugLog('[OfflineBilling] No premium purchase found');
      return false;
    } catch (error) {
      debugError('[OfflineBilling] Restore failed:', error);
      // If offline, check local storage
      const isUnlocked = this.isPremiumUnlocked();
      if (isUnlocked) {
        toast.success('Premium already unlocked! ✨');
      } else {
        toast.error('Failed to restore purchase. Please try again later.');
      }
      return isUnlocked;
    }
  }

  /**
   * Save premium status for offline use
   * @param data Premium data to save
   */
  private static savePremium(data: PremiumData): void {
    localStorage.setItem('rise_premium', JSON.stringify(data));

    // Also set the simple flag for compatibility
    localStorage.setItem('streak_ads_removed', 'true');

    // Notify app of premium status change
    window.dispatchEvent(new CustomEvent('premiumChanged'));

    debugLog('[OfflineBilling] Premium status saved:', data);
  }

  /**
   * Clear premium status (for testing/debugging)
   */
  static clearPremium(): void {
    localStorage.removeItem('rise_premium');
    localStorage.removeItem('streak_ads_removed');
    window.dispatchEvent(new CustomEvent('premiumChanged'));
    debugLog('[OfflineBilling] Premium status cleared');
  }

  /**
   * Get premium features
   * @returns Array of premium features
   */
  static getPremiumFeatures(): string[] {
    const premiumData = localStorage.getItem('rise_premium');
    if (!premiumData) return [];

    try {
      const data: PremiumData = JSON.parse(premiumData);
      return data.features || [];
    } catch {
      return [];
    }
  }

  /**
   * Check if a specific feature is unlocked
   * @param feature Feature name to check
   * @returns true if feature is unlocked
   */
  static hasFeature(feature: string): boolean {
    const features = this.getPremiumFeatures();
    return features.includes(feature);
  }

  /**
   * Check if app is running in Trusted Web Activity
   * @returns true if in TWA, false if in regular browser
   */
  static isInTWA(): boolean {
    return isTrustedWebActivity();
  }

  /**
   * Check if app is in development mode
   * @returns true if in development/testing environment
   */
  static isDevelopment(): boolean {
    return isDevelopmentMode();
  }

  /**
   * Get environment information for debugging
   * @returns Object with environment details
   */
  static getEnvironmentInfo(): {
    isTWA: boolean;
    isDevelopment: boolean;
    hasDigitalGoodsAPI: boolean;
    hostname: string;
    userAgent: string;
    referrer: string;
  } {
    return {
      isTWA: isTrustedWebActivity(),
      isDevelopment: isDevelopmentMode(),
      hasDigitalGoodsAPI: typeof window.getDigitalGoodsService === 'function',
      hostname: window.location.hostname,
      userAgent: navigator.userAgent,
      referrer: document.referrer,
    };
  }
}

// Type definitions for Digital Goods API
declare global {
  interface Window {
    getDigitalGoodsService?: (serviceProvider: string) => Promise<DigitalGoodsService | null>;
  }

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
}
