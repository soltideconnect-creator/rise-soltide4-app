import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { habitStorage } from '@/services/habitStorage';
import type { StreakInfo } from '@/types/habit';
import { Flame, Trophy, CheckCircle2, Calendar, CalendarCheck } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { subDays, format } from 'date-fns';
import { toast } from 'sonner';
import { OfflineBilling } from '@/utils/billing-offline';
import { PaystackPayment } from '@/components/PaystackPayment';
import { debugLog, debugError } from '@/utils/debug';

export function Stats() {
  const [stats, setStats] = useState<StreakInfo>({
    currentStreak: 0,
    longestStreak: 0,
    totalCompletions: 0,
    perfectDays: 0,
    perfectWeeks: 0,
  });
  const [chartData, setChartData] = useState<Array<{ date: string; completions: number }>>([]);
  const [isPremium, setIsPremium] = useState(false);
  const [isAndroidTWA, setIsAndroidTWA] = useState(false);

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

    // Check premium status (works offline)
    setIsPremium(OfflineBilling.isPremiumUnlocked());

    // Detect platform (Android TWA vs Web)
    setIsAndroidTWA(OfflineBilling.isInTWA());
    debugLog('[Stats] Platform detected:', {
      isAndroidTWA: OfflineBilling.isInTWA(),
      isDevelopment: OfflineBilling.isDevelopment(),
    });
  }, []);

  // Listen for premium changes (from other tabs/devices)
  useEffect(() => {
    const handlePremiumChange = () => {
      setIsPremium(OfflineBilling.isPremiumUnlocked());
      debugLog('[Stats] Premium status changed:', OfflineBilling.isPremiumUnlocked());
    };
    window.addEventListener('premiumChanged', handlePremiumChange);
    return () => window.removeEventListener('premiumChanged', handlePremiumChange);
  }, []);

  // Google Play purchase handler (Android TWA only)
  const handleGooglePlayPurchase = async () => {
    debugLog('[Stats] Starting Google Play purchase flow...');
    const success = await OfflineBilling.purchase();
    if (success) {
      setIsPremium(true);
      toast.success('Premium unlocked! 🎉');
    }
  };

  // Paystack purchase handler (Web only)
  const handlePaystackSuccess = (transaction: any) => {
    debugLog('[Stats] Paystack payment successful:', transaction);
    
    // Save premium status locally (offline-first)
    OfflineBilling.saveExternalPremium(transaction.reference);
    setIsPremium(true);
    
    toast.success('Premium unlocked! 🎉', {
      description: 'Sleep Tracker is now available. Thank you for your support!',
    });
  };

  const handlePaystackClose = () => {
    debugLog('[Stats] Paystack payment closed');
    toast.info('Payment cancelled');
  };

  // Restore purchases handler (Google Play only)
  const handleRestore = async () => {
    debugLog('[Stats] Starting restore flow...');
    const restored = await OfflineBilling.restore();
    if (restored) {
      setIsPremium(true);
      toast.success('Purchase restored! 🎉');
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

        {/* Premium Upgrade Section - ONLY show when premium is NOT active */}
        {!isPremium && (
          <Card className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 border-primary/20">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
            
            <CardContent className="relative pt-8 pb-8">
              <div className="text-center space-y-6">
                {/* Header */}
                <div className="space-y-3">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-2">
                    <Trophy className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold">Upgrade to Premium</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Unlock Sleep Tracker and premium features forever!
                  </p>
                </div>

                {/* Platform-Specific Payment Buttons */}
                <div className="space-y-3 max-w-sm mx-auto">
                  {/* Google Play Button (Android TWA Only) */}
                  {isAndroidTWA && (
                    <>
                      <Button
                        onClick={handleGooglePlayPurchase}
                        className="w-full"
                        size="lg"
                        variant="default"
                      >
                        <Trophy className="w-4 h-4 mr-2" />
                        Get Premium - $4.99
                      </Button>
                      
                      <Button
                        onClick={handleRestore}
                        className="w-full"
                        size="sm"
                        variant="outline"
                      >
                        Restore Purchase
                      </Button>
                      
                      <p className="text-xs text-muted-foreground">
                        One-time purchase via Google Play • Works offline after purchase
                      </p>
                    </>
                  )}

                  {/* Paystack Button (Web Only) */}
                  {!isAndroidTWA && (
                    <>
                      <PaystackPayment
                        email={import.meta.env.VITE_PAYSTACK_EMAIL || 'user@example.com'}
                        amount={499900} // ₦4,999.00 in kobo (approximately $4.99)
                        publicKey={import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || ''}
                        text="Get Premium - ₦4,999"
                        onSuccess={handlePaystackSuccess}
                        onClose={handlePaystackClose}
                      />
                      
                      <p className="text-xs text-muted-foreground">
                        One-time purchase via Paystack • Works offline after purchase
                      </p>
                    </>
                  )}
                </div>

                {/* Features list */}
                <div className="pt-4 space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>Sleep Tracker with Smart Alarms</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>Advanced Analytics</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>Lifetime Access</span>
                  </div>
                </div>

                {/* Environment Info - Show if not in TWA */}
                {!isAndroidTWA && (
                  <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-left">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">⚠️</div>
                      <div className="flex-1 space-y-2">
                        <p className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                          Web Payment Mode
                        </p>
                        <p className="text-xs text-muted-foreground">
                          You're viewing this in a web browser. Payment will be processed via Paystack (card, bank transfer, or mobile money).
                        </p>
                        {OfflineBilling.isDevelopment() && (
                          <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                            💡 Development Mode: Test payment available
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* TWA Info - Show if in TWA */}
                {isAndroidTWA && (
                  <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-left">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">✅</div>
                      <div className="flex-1 space-y-2">
                        <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                          Google Play Mode
                        </p>
                        <p className="text-xs text-muted-foreground">
                          You're using the official app from Google Play Store. Payment will be processed securely through Google Play.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Premium Active Card */}
        {isPremium && (
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
