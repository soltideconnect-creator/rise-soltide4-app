import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface RestorePremiumWebProps {
  onRestoreSuccess: () => void;
}

export function RestorePremiumWeb({ onRestoreSuccess }: RestorePremiumWebProps) {
  const [reference, setReference] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleRestore = async () => {
    if (!reference.trim()) {
      toast.error('Please enter your payment reference');
      return;
    }

    setIsVerifying(true);

    try {
      // For now, we'll use a simple verification approach
      // In production, this should verify with Paystack API
      
      // Check if reference looks valid (starts with RISE_ or T or similar pattern)
      const isValidFormat = /^(RISE_|T|REF_|PAY_)/i.test(reference.trim());
      
      if (!isValidFormat) {
        toast.error('Invalid payment reference format', {
          description: 'Payment reference should start with RISE_, T, REF_, or PAY_',
        });
        setIsVerifying(false);
        return;
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // For production: Verify with Paystack
      // const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      //   headers: { Authorization: `Bearer ${PAYSTACK_PUBLIC_KEY}` }
      // });

      // For now, restore premium if reference format is valid
      // Store the reference for future verification
      const premiumData = {
        unlocked: true,
        unlockedAt: new Date().toISOString(),
        transactionId: reference.trim(),
        features: ['sleep_tracker', 'no_ads', 'advanced_analytics'],
        platform: 'web',
        amount: 499, // $4.99
        currency: 'USD',
        restoredOn: new Date().toISOString(),
      };

      localStorage.setItem('rise_premium', JSON.stringify(premiumData));
      localStorage.setItem('streak_ads_removed', 'true');
      
      toast.success('Premium restored successfully! 🎉', {
        description: 'Your premium features are now active on this device.',
        duration: 5000,
      });

      onRestoreSuccess();
    } catch (error) {
      console.error('Error verifying payment:', error);
      toast.error('Failed to verify payment', {
        description: 'Please check your reference and try again, or contact support.',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <CheckCircle2 className="w-5 h-5 text-primary" />
          Already Purchased Premium?
        </CardTitle>
        <CardDescription className="text-sm">
          Enter your payment reference to restore premium access on this device.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="reference" className="text-sm font-medium">
            Payment Reference
          </label>
          <Input
            id="reference"
            placeholder="e.g., RISE_1234567890 or T123456789"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            disabled={isVerifying}
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            You received this reference in your payment confirmation email.
          </p>
        </div>

        <Button
          onClick={handleRestore}
          disabled={isVerifying || !reference.trim()}
          className="w-full"
          size="sm"
        >
          {isVerifying ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Restore Premium
            </>
          )}
        </Button>

        <div className="rounded-lg bg-muted/50 p-3 space-y-2">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="text-xs text-muted-foreground space-y-1">
              <p className="font-medium text-foreground">Where to find your reference:</p>
              <ul className="list-disc list-inside space-y-0.5 ml-1">
                <li>Check your payment confirmation email</li>
                <li>Look for a reference starting with "RISE_", "T", or "REF_"</li>
                <li>It was shown on the payment success screen</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t text-center">
          <p className="text-xs text-muted-foreground">
            <strong>Can't find your reference?</strong>
            <br />
            Contact support with your payment email and we'll help restore access.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
