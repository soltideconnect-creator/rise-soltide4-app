/**
 * Official Paystack Button Component
 * Uses the official react-paystack library for reliable payment processing
 */

import { PaystackButton as OfficialPaystackButton } from 'react-paystack';
import { Button } from '@/components/ui/button';

interface PaystackButtonProps {
  email: string;
  amount: number;
  publicKey: string;
  text: string;
  onSuccess: (reference: any) => void;
  onClose: () => void;
  className?: string;
  disabled?: boolean;
}

export const PaystackButton = ({
  email,
  amount,
  publicKey,
  text,
  onSuccess,
  onClose,
  className,
  disabled = false,
}: PaystackButtonProps) => {
  // Generate unique reference for each transaction
  const reference = `rise_premium_${new Date().getTime()}`;

  // Paystack configuration
  const config = {
    reference,
    email,
    amount, // Amount in kobo (₦8,000 = 800,000 kobo)
    publicKey,
    currency: 'NGN',
    metadata: {
      custom_fields: [
        {
          display_name: 'Product',
          variable_name: 'product',
          value: 'Rise Premium Unlock'
        },
        {
          display_name: 'Description',
          variable_name: 'description',
          value: 'Lifetime premium access with Sleep Tracker'
        }
      ]
    }
  };

  // Component props for official PaystackButton
  const componentProps = {
    ...config,
    text,
    onSuccess: (reference: any) => {
      console.log('✅ Payment successful:', reference);
      onSuccess(reference);
    },
    onClose: () => {
      console.log('🔒 Payment popup closed');
      onClose();
    },
  };

  // Wrap official PaystackButton with our Button styling
  return (
    <div className={className}>
      <OfficialPaystackButton
        {...componentProps}
        className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold h-12 px-6 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
};
