import { useEffect, useState, useRef } from 'react';
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
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadAttempts = useRef(0);
  const maxAttempts = 3;

  useEffect(() => {
    let mounted = true;
    let checkInterval: NodeJS.Timeout;
    let timeoutId: NodeJS.Timeout;

    const loadPaystack = async () => {
      loadAttempts.current += 1;
      
      console.log(`🔄 Loading Paystack (attempt ${loadAttempts.current}/${maxAttempts})...`);

      // Check if already loaded
      if (window.PaystackPop) {
        console.log('✅ Paystack already available');
        if (mounted) {
          setIsReady(true);
          setIsLoading(false);
        }
        return;
      }

      // Remove any existing failed scripts
      const existingScripts = document.querySelectorAll('script[src*="paystack"]');
      existingScripts.forEach(script => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });

      // Create new script element
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;
      script.crossOrigin = 'anonymous';

      // Success handler
      script.onload = () => {
        console.log('📦 Paystack script loaded');
        
        // Wait for PaystackPop to be available
        checkInterval = setInterval(() => {
          if (window.PaystackPop && mounted) {
            console.log('✅ Paystack ready!');
            clearInterval(checkInterval);
            clearTimeout(timeoutId);
            setIsReady(true);
            setIsLoading(false);
            setError(null);
          }
        }, 100);

        // Timeout after 10 seconds
        timeoutId = setTimeout(() => {
          clearInterval(checkInterval);
          if (!window.PaystackPop && mounted) {
            console.warn('⚠️ Paystack script loaded but PaystackPop not available');
            handleLoadError();
          }
        }, 10000);
      };

      // Error handler
      script.onerror = () => {
        console.error('❌ Failed to load Paystack script');
        handleLoadError();
      };

      // Append script
      document.head.appendChild(script);
    };

    const handleLoadError = () => {
      if (!mounted) return;

      if (loadAttempts.current < maxAttempts) {
        console.log(`🔄 Retrying in 2 seconds...`);
        setTimeout(() => {
          if (mounted) {
            loadPaystack();
          }
        }, 2000);
      } else {
        console.error('❌ All load attempts failed');
        setError('Unable to load payment system. Please try again or use a different browser.');
        setIsLoading(false);
        toast.error('Payment system unavailable. Please refresh the page or try a different browser.');
      }
    };

    // Start loading
    loadPaystack();

    // Cleanup
    return () => {
      mounted = false;
      if (checkInterval) clearInterval(checkInterval);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const handlePayment = () => {
    // Validate inputs
    if (!email || !email.includes('@')) {
      toast.error('Please provide a valid email address');
      return;
    }

    if (!amount || amount <= 0) {
      toast.error('Invalid payment amount');
      return;
    }

    if (!publicKey || !publicKey.startsWith('pk_')) {
      toast.error('Payment configuration error. Please contact support.');
      return;
    }

    if (!isReady || !window.PaystackPop) {
      toast.error('Payment system is still loading. Please wait...');
      return;
    }

    try {
      console.log('🚀 Initializing Paystack payment...');
      console.log('Email:', email);
      console.log('Amount:', amount, 'kobo');

      const handler = window.PaystackPop.setup({
        key: publicKey,
        email: email,
        amount: amount,
        currency: 'NGN',
        ref: 'rise_premium_' + Date.now().toString(),
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
          console.log('✅ Payment successful:', response);
          toast.success('Payment successful!');
          onSuccess(response);
        },
        onClose: () => {
          console.log('🔒 Payment popup closed');
          onClose();
        }
      });

      console.log('✅ Opening payment popup...');
      handler.openIframe();
    } catch (error) {
      console.error('❌ Payment initialization error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Payment error: ${errorMessage}`);
    }
  };

  // Error state
  if (error) {
    return (
      <div className="space-y-2">
        <Button
          onClick={() => window.location.reload()}
          className={className}
          variant="outline"
        >
          🔄 Refresh Page
        </Button>
        <p className="text-xs text-destructive text-center">{error}</p>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <Button
        disabled
        className={className}
      >
        <span className="animate-pulse">⚡ Loading Payment System...</span>
      </Button>
    );
  }

  // Ready state
  return (
    <Button
      onClick={handlePayment}
      disabled={disabled || !isReady}
      className={className}
    >
      {text}
    </Button>
  );
};
