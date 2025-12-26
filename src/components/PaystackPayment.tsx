/**
 * Official Paystack Payment Component
 * Uses Paystack's official inline.js SDK for reliable payment processing
 * 
 * Documentation: https://paystack.com/docs/payments/accept-payments/#embed-paystack-inline
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// Use existing Paystack types from src/types/paystack.d.ts
interface PaystackTransaction {
  reference: string;
  status: string;
  trans: string;
  transaction: string;
  message: string;
  trxref: string;
}

interface PaystackPaymentProps {
  email: string;
  amount: number;
  publicKey: string;
  text: string;
  onSuccess: (transaction: PaystackTransaction) => void;
  onClose: () => void;
  className?: string;
  disabled?: boolean;
}

export function PaystackPayment({
  email,
  amount,
  publicKey,
  text,
  onSuccess,
  onClose,
  className,
  disabled = false,
}: PaystackPaymentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState<string | null>(null);

  // Load Paystack inline.js script
  useEffect(() => {
    // Check if script is already loaded
    if (window.PaystackPop) {
      setIsScriptLoaded(true);
      return;
    }

    // Check if script tag already exists
    const existingScript = document.querySelector('script[src*="paystack"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => {
        setIsScriptLoaded(true);
      });
      return;
    }

    // Load Paystack script
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    
    script.onload = () => {
      console.log('✅ Paystack script loaded successfully');
      setIsScriptLoaded(true);
      setScriptError(null);
    };
    
    script.onerror = () => {
      console.error('❌ Failed to load Paystack script');
      setScriptError('Failed to load payment system. Please check your internet connection.');
      setIsScriptLoaded(false);
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup: remove script on unmount
      const scriptToRemove = document.querySelector('script[src*="paystack"]');
      if (scriptToRemove && scriptToRemove.parentNode) {
        scriptToRemove.parentNode.removeChild(scriptToRemove);
      }
    };
  }, []);

  // Generate unique transaction reference
  const generateReference = (): string => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000000);
    return `RISE_${timestamp}_${random}`;
  };

  // Handle payment button click
  const handlePayment = () => {
    // Validate environment configuration
    if (!publicKey || publicKey === 'undefined' || publicKey === '') {
      console.error('❌ Missing Paystack public key');
      console.error('Current publicKey value:', publicKey);
      console.error('Environment variables:', {
        VITE_PAYSTACK_PUBLIC_KEY: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        allEnvVars: import.meta.env
      });
      setScriptError('Payment configuration error. Please contact support.');
      toast.error('Payment configuration error. Missing Paystack public key.', {
        description: 'Please ensure VITE_PAYSTACK_PUBLIC_KEY is set in Netlify environment variables.'
      });
      return;
    }

    if (!isScriptLoaded) {
      console.error('❌ Paystack script not loaded');
      setScriptError('Payment system not ready. Please wait a moment and try again.');
      toast.error('Payment system not ready', {
        description: 'Please wait a moment and try again.'
      });
      return;
    }

    if (!window.PaystackPop) {
      console.error('❌ PaystackPop not available');
      setScriptError('Payment system not available. Please refresh the page.');
      toast.error('Payment system not available', {
        description: 'Please refresh the page and try again.'
      });
      return;
    }

    if (!email || !email.includes('@')) {
      console.error('❌ Invalid email:', email);
      setScriptError('Invalid email address. Please update your email.');
      toast.error('Invalid email address', {
        description: 'Please provide a valid email address.'
      });
      return;
    }

    setIsLoading(true);
    setScriptError(null);

    try {
      // Generate unique reference for this transaction
      const reference = generateReference();
      
      console.log('🚀 Initiating Paystack payment:', {
        reference,
        email,
        amount: `₦${(amount / 100).toLocaleString()}`,
        publicKey: publicKey.substring(0, 10) + '...',
        appUrl: import.meta.env.VITE_APP_URL || window.location.origin,
        timestamp: new Date().toISOString(),
      });

      // Configure Paystack payment
      const config: PaystackPopupOptions = {
        key: publicKey,
        email,
        amount, // Amount in kobo
        currency: 'NGN',
        ref: reference,
        metadata: {
          channels: ['card', 'bank', 'ussd', 'mobile_money'],
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
            },
            {
              display_name: 'App URL',
              variable_name: 'app_url',
              value: import.meta.env.VITE_APP_URL || window.location.origin
            }
          ]
        },
        onSuccess: (transaction: PaystackTransaction) => {
          console.log('✅ Payment successful:', transaction);
          setIsLoading(false);
          onSuccess(transaction);
        },
        onClose: () => {
          console.log('🔒 Payment popup closed');
          setIsLoading(false);
          onClose();
        },
      };

      // Initialize Paystack popup
      const handler = window.PaystackPop.setup(config);
      
      // Open payment iframe
      handler.openIframe();
      
      console.log('✅ Paystack popup opened');
    } catch (error) {
      console.error('❌ Paystack error:', error);
      setIsLoading(false);
      setScriptError(
        error instanceof Error 
          ? error.message 
          : 'Failed to start payment. Please try again.'
      );
    }
  };

  return (
    <div className={className}>
      <Button
        onClick={handlePayment}
        disabled={disabled || isLoading || !isScriptLoaded}
        className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold h-12 px-6 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Opening Payment...
          </>
        ) : !isScriptLoaded ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Loading Payment System...
          </>
        ) : (
          text
        )}
      </Button>
      
      {scriptError && (
        <p className="text-xs text-destructive mt-2 text-center">
          {scriptError}
        </p>
      )}
      
      {!isScriptLoaded && !scriptError && (
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Initializing secure payment system...
        </p>
      )}
    </div>
  );
}
