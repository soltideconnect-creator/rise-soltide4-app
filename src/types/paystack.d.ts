/**
 * Paystack Inline JS Type Definitions
 * https://paystack.com/docs/payments/accept-payments/#popup
 */

interface PaystackPopupOptions {
  key: string;
  email: string;
  amount: number;
  ref?: string;
  currency?: string;
  metadata?: Record<string, any>;
  callback?: (response: any) => void;  // Official Paystack callback
  onSuccess?: (transaction: any) => void;  // Alternative callback
  onCancel?: () => void;
  onClose?: () => void;
}

interface PaystackPopup {
  newTransaction: () => void;
  openIframe: () => void;
}

interface Window {
  PaystackPop?: {
    setup: (options: PaystackPopupOptions) => PaystackPopup;
  };
  paystackLoadAttempted?: boolean;
  paystackLoadFailed?: boolean;
}
