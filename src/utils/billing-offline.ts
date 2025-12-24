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

    // Check if Digital Goods API is available
    if (!window.getDigitalGoodsService) {
      const errorMsg = 'Google Play Billing not available. Please use the app from Google Play Store.';
      toast.error(errorMsg);
      debugError('[OfflineBilling]', errorMsg);
      return false;
    }

    try {
      // Get Digital Goods Service
      const service = await window.getDigitalGoodsService('https://play.google.com/billing');
      if (!service) {
        throw new Error('Digital Goods Service not available');
      }

      // Get product details
      const details = await service.getDetails([PREMIUM_PRODUCT_ID]);
      debugLog('[OfflineBilling] Product details:', details);

      if (!details || details.length === 0) {
        throw new Error('Product not found');
      }

      // Create payment request
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
      const paymentResponse = await paymentRequest.show();
      debugLog('[OfflineBilling] Payment response:', paymentResponse);

      // Complete the payment
      await paymentResponse.complete('success');

      // Store premium status OFFLINE
      this.savePremium({
        valid: true,
        purchaseToken: paymentResponse.details.token,
        purchasedAt: new Date().toISOString(),
        platform: 'google-play',
        features: ['sleep_tracker', 'no_ads', 'themes', 'analytics'],
      });

      toast.success('Premium unlocked! 🎉');
      debugLog('[OfflineBilling] Purchase successful');
      return true;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        toast.info('Purchase cancelled');
        debugLog('[OfflineBilling] Purchase cancelled by user');
      } else {
        toast.error('Purchase failed: ' + error.message);
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
