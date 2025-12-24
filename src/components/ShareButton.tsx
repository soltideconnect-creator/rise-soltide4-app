import { Share2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

/**
 * Viral Share Button Component
 * 
 * 100% offline-first share feature for organic growth
 * - Native share sheet (SMS, email, Bluetooth, WhatsApp)
 * - QR code for easy install
 * - No servers, no tracking, no internet required
 * - Global appeal messaging
 */

export const ShareButton = () => {
  // Production Play Store link (switch to opt-in link for closed testing)
  const shareLink = 'https://play.google.com/store/apps/details?id=com.soltide.rise';
  // For closed testing, use: 'https://play.google.com/apps/testing/com.soltide.rise'
  
  const shareMessage = `Try Rise: Offline habit tracker with smart sleep features. One-time $4.99 premium unlock. Install free: ${shareLink}`;

  const handleShare = async () => {
    try {
      // Use native share sheet if available (Android TWA, modern browsers)
      if (navigator.share) {
        await navigator.share({
          title: 'Rise: Habit Tracker & Smart Sleep',
          text: shareMessage,
          url: shareLink,
        });
        
        toast.success('Thanks for sharing Rise! 🚀');
      } else {
        // Fallback for older browsers - copy to clipboard
        await navigator.clipboard.writeText(shareMessage);
        toast.success('Link copied! Paste to share with friends.');
      }
    } catch (err) {
      // User cancelled share or clipboard failed
      if ((err as Error).name !== 'AbortError') {
        console.error('Share error:', err);
        toast.error('Could not share. Please try again.');
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="w-5 h-5" />
          Share Rise with Friends
        </CardTitle>
        <CardDescription>
          Help others build better habits. Share via SMS, email, WhatsApp, or scan the QR code.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        {/* QR Code for easy install */}
        <div className="bg-white p-4 rounded-lg">
          <QRCodeSVG 
            value={shareLink} 
            size={160}
            level="M"
            includeMargin={true}
          />
        </div>
        
        <p className="text-sm text-muted-foreground text-center">
          Scan QR code to install Rise
        </p>

        {/* Share Button */}
        <Button
          onClick={handleShare}
          size="lg"
          className="w-full"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share Rise
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          100% offline • No tracking • Help friends build unbreakable streaks
        </p>
      </CardContent>
    </Card>
  );
};
