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
  onSuccess?: (transaction: any) => void;
  onCancel?: () => void;
  onClose?: () => void;
}

interface PaystackPopup {
  newTransaction: (options: PaystackPopupOptions) => void;
}

interface Window {
  PaystackPop?: {
    setup: (options: PaystackPopupOptions) => PaystackPopup;
  };
  paystackLoadAttempted?: boolean;
  paystackLoadFailed?: boolean;
}
