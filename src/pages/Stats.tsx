import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { habitStorage } from '@/services/habitStorage';
import type { StreakInfo } from '@/types/habit';
import { Flame, Trophy, CheckCircle2, Calendar, CalendarCheck, X, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { subDays, format } from 'date-fns';
import { toast } from 'sonner';
import { isPremiumUnlocked, purchasePremium, isTWAWithBilling } from '@/utils/googlePlayBilling';

export function Stats() {
  const [stats, setStats] = useState<StreakInfo>({
    currentStreak: 0,
    longestStreak: 0,
    totalCompletions: 0,
    perfectDays: 0,
    perfectWeeks: 0,
  });
  const [chartData, setChartData] = useState<Array<{ date: string; completions: number }>>([]);
  const [adsRemoved, setAdsRemoved] = useState(false);

  useEffect(() => {
    setStats(habitStorage.getOverallStats());

    const endDate = new Date();
    const startDate = subDays(endDate, 29);
    const dailyStats = habitStorage.getDailyStats(startDate, endDate);

    const data = dailyStats.map(stat => ({
      date: format(new Date(stat.date), 'MMM d'),
      completions: stat.completedCount,
    }));

    setChartData(data);

    // Check premium status (works for both TWA and web)
    isPremiumUnlocked().then(hasPremium => {
      setAdsRemoved(hasPremium);
    }).catch(error => {
      console.error('Error checking premium status:', error);
    });
  }, []);

  // Paystack payment handler for web/PWA users
  const handlePaystackPayment = () => {
    if (!window.PaystackPop) {
      toast.error('Payment system not loaded. Please refresh the page.');
      return;
    }

    const handler = window.PaystackPop.setup({
      key: 'pk_live_XXXXXXXXXXXXXXXXXXXXXXXX', // Replace with actual Paystack public key
      email: 'user@soltide.app',
      amount: 800000, // ₦8,000 in kobo
      ref: 'rise_premium_' + new Date().getTime().toString(),
      currency: 'NGN',
      metadata: {
        custom_fields: [
          {
            display_name: 'Product',
            variable_name: 'product',
            value: 'Rise Premium Unlock'
          }
        ]
      },
      onSuccess: (transaction: any) => {
        // Unlock premium immediately
        localStorage.setItem('rise_premium', 'true');
        localStorage.setItem('streak_ads_removed', 'true');
        setAdsRemoved(true);
        toast.success('Premium unlocked forever! Thank you 🌅', {
          duration: 5000,
        });
        console.log('Payment successful:', transaction);
      },
      onCancel: () => {
        toast.error('Payment cancelled');
      },
      onClose: () => {
        // Called when popup is closed
      }
    });

    handler.newTransaction();
  };

  const handleRemoveAds = async () => {
    try {
      // Show loading toast
      const loadingToast = toast.loading(
        isTWAWithBilling() 
          ? 'Opening Google Play purchase...' 
          : 'Processing purchase...'
      );
      
      // Trigger purchase (Google Play in TWA, simulated on web)
      const success = await purchasePremium();
      
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      
      if (success) {
        toast.success('Premium unlocked! Sleep Tracker is now available! 🎉', {
          duration: 5000,
        });
        setAdsRemoved(true);
      } else {
        toast.error('Purchase cancelled or failed. Please try again.');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error(error instanceof Error ? error.message : 'Purchase failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-3xl font-bold">Statistics</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <Flame className="h-4 w-4 text-streak" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.currentStreak}</div>
              <p className="text-xs text-muted-foreground mt-1">days in a row</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Longest Streak</CardTitle>
              <Trophy className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.longestStreak}</div>
              <p className="text-xs text-muted-foreground mt-1">personal best</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Completions</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalCompletions}</div>
              <p className="text-xs text-muted-foreground mt-1">habits completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Perfect Days</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.perfectDays}</div>
              <p className="text-xs text-muted-foreground mt-1">100% completion</p>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Perfect Weeks</CardTitle>
              <CalendarCheck className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.perfectWeeks}</div>
              <p className="text-xs text-muted-foreground mt-1">weeks with 100% completion</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Last 30 Days Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="completions" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Premium Upgrade Section */}
        {!adsRemoved && (
          <Card className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 border-primary/30 shadow-lg">
            {/* Decorative background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent rounded-full blur-3xl" />
            </div>
            
            <CardContent className="relative pt-6">
              <div className="text-center space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Upgrade to Premium</h3>
                  <p className="text-sm text-muted-foreground">
                    Unlock Sleep Tracker and enjoy an ad-free experience!
                  </p>
                </div>

                <div className="space-y-3 max-w-md mx-auto">
                  {/* Google Play Button - Only show on Android */}
                  {isTWAWithBilling() && (
                    <Button
                      onClick={handleRemoveAds}
                      className="w-full"
                      size="lg"
                      variant="default"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Get Premium - $4.99 One-Time
                    </Button>
                  )}

                  {/* Paystack Button - Only show on Web/PWA (not Android) */}
                  {!isTWAWithBilling() && (
                    <Button
                      onClick={handlePaystackPayment}
                      className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                      size="lg"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Unlock Premium ₦8,000 (Instant • No Google Cut)
                    </Button>
                  )}
                </div>
                
                <p className="text-xs text-muted-foreground">
                  {isTWAWithBilling() 
                    ? 'One-time purchase via Google Play' 
                    : 'Instant unlock • Keep 100% of your payment'}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {adsRemoved && (
          <Card className="bg-gradient-to-br from-success/5 to-primary/5 border-success/20">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6 text-success" />
                </div>
                <h3 className="text-lg font-semibold">Premium Active! 🎉</h3>
                <p className="text-sm text-muted-foreground">
                  Sleep Tracker unlocked. Thank you for supporting Rise!
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
