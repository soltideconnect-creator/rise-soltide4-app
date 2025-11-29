import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { habitStorage } from '@/services/habitStorage';
import type { StreakInfo } from '@/types/habit';
import { Flame, Trophy, CheckCircle2, Calendar, CalendarCheck, X } from 'lucide-react';
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
          <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Upgrade to Premium</h3>
                  <p className="text-sm text-muted-foreground">
                    Unlock Sleep Tracker for just $4.99!
                  </p>
                </div>

                {/* Premium Purchase Section */}
<div className="flex flex-col items-center gap-4">
  {/* Google Play Billing (Android only) */}
  {window.AndroidBilling && !isPremium && (
    <Button
      onClick={handleRemoveAds} // ← your existing Google Billing function
      className="w-full max-w-xs mx-auto"
      size="lg"
    >
      <X className="w-4 h-4 mr-2" />
      Get Premium – $4.99 One-Time
    </Button>
  )}

  {/* Paystack Direct (Web / PWA sideloading) */}
  {!window.AndroidBilling && !isPremium && (
    <PaystackButton
      amount={800000} // ₦8,000
      email="user@soltide.app" // you can make this dynamic later
      publicKey="pk_live_YOUR_PAYSTACK_KEY_HERE" // ← replace this
      reference={new Date().getTime().toString()}
      onSuccess={(ref: any) => {
        localStorage.setItem("rise_premium", "true");
        setIsPremium(true); // or call your unlock function
        toast.success("Premium unlocked forever! Thank you 🌅");
      }}
      onClose={() => toast.info("Payment cancelled")}
      className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-lg"
    >
      Unlock Premium ₦8,000 (Instant • No Google Cut)
    </PaystackButton>
  )}

  {/* Already Premium Message */}
  {isPremium && (
    <div className="text-center">
      <p className="text-green-500 font-bold text-lg">✓ Premium Unlocked Forever</p>
      <p className="text-sm text-muted-foreground">Sleep Tracker & Smart Alarm active</p>
    </div>
  )}

  <p className="text-xs text-muted-foreground text-center max-w-xs">
    {!window.AndroidBilling && !isPremium
      ? "Pay direct → I receive 100% → you get full features instantly"
      : "Unlock Sleep Tracker, Smart Alarm & remove ads forever"}
  </p>
</div>
                
                <p className="text-xs text-muted-foreground">
                  Unlock Sleep Tracker Feature
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
