import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

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
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(false);

  useEffect(() => {
    // Check if script is already loaded
    if (window.PaystackPop) {
      setScriptLoaded(true);
      return;
    }

    // Check if script tag already exists
    const existingScript = document.querySelector('script[src*="paystack"]');
    if (existingScript) {
      // Script exists, wait for it to load
      const checkInterval = setInterval(() => {
        if (window.PaystackPop) {
          setScriptLoaded(true);
          clearInterval(checkInterval);
        }
      }, 100);

      // Timeout after 15 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        if (!window.PaystackPop) {
          setScriptError(true);
        }
      }, 15000);

      return () => clearInterval(checkInterval);
    }

    // Load script dynamically
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    
    script.onload = () => {
      console.log('✅ Paystack script loaded successfully');
      setScriptLoaded(true);
    };
    
    script.onerror = () => {
      console.error('❌ Failed to load Paystack script');
      setScriptError(true);
      toast.error('Failed to load payment system. Please check your internet connection.');
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup if needed
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const handlePayment = () => {
    if (!scriptLoaded || !window.PaystackPop) {
      toast.error('Payment system is still loading. Please wait a moment.');
      return;
    }

    try {
      const handler = window.PaystackPop.setup({
        key: publicKey,
        email: email,
        amount: amount,
        currency: 'NGN',
        ref: 'rise_premium_' + new Date().getTime().toString(),
        metadata: {
          custom_fields: [
            {
              display_name: 'Product',
              variable_name: 'product',
              value: 'Rise Premium Unlock'
            }
          ]
        },
        callback: (response: any) => {
          console.log('Payment successful:', response);
          onSuccess(response);
        },
        onClose: () => {
          console.log('Payment popup closed');
          onClose();
        }
      });

      // Use openIframe() to match official react-paystack behavior
      handler.openIframe();
    } catch (error) {
      console.error('Error initializing Paystack:', error);
      toast.error('Failed to initialize payment. Please try again.');
    }
  };

  if (scriptError) {
    return (
      <Button
        onClick={() => window.location.reload()}
        className={className}
        variant="outline"
      >
        🔄 Refresh to Load Payment
      </Button>
    );
  }

  return (
    <Button
      onClick={handlePayment}
      disabled={disabled || !scriptLoaded}
      className={className}
    >
      {!scriptLoaded ? '⚡ Loading Payment System...' : text}
    </Button>
  );
};
