import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { habitStorage } from '@/services/habitStorage';
import type { StreakInfo } from '@/types/habit';
import { Flame, Trophy, CheckCircle2, Calendar, CalendarCheck, X, Mail, Edit2, Bug } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { subDays, format } from 'date-fns';
import { toast } from 'sonner';
import { isPremiumUnlocked, purchasePremium, isTWAWithBilling, restorePurchases, debugUnlockPremium, isDebugUnlockAvailable } from '@/utils/googlePlayBilling';
import { PaystackPayment } from '@/components/PaystackPayment';
import { unlockPremium, getUserEmail, setUserEmail, isValidEmail, formatAmount } from '@/utils/paystack';
import { RestorePremiumWeb } from '@/components/RestorePremiumWeb';

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
  const [userEmail, setUserEmailState] = useState('');
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [tempEmail, setTempEmail] = useState('');

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

    // Load user email from localStorage
    const storedEmail = getUserEmail();
    if (storedEmail && isValidEmail(storedEmail)) {
      setUserEmailState(storedEmail);
    }
  }, []);

  // Paystack payment success handler
  const handlePaystackSuccess = (transaction: any) => {
    console.log('✅ Payment successful:', transaction);
    
    // Unlock premium with transaction details
    unlockPremium(transaction.reference);
    setAdsRemoved(true);
    
    toast.success('🎉 Premium Unlocked Forever!', {
      description: `Receipt sent to ${userEmail}. All premium features are now available!`,
      duration: 5000,
    });
    
    console.log('Transaction details:', {
      reference: transaction.reference,
      amount: formatAmount(800000),
      email: userEmail,
      timestamp: new Date().toISOString(),
    });
  };

  // Paystack payment close handler
  const handlePaystackClose = () => {
    console.log('🔒 Payment popup closed');
    toast.info('Payment cancelled. You can try again anytime.');
  };

  const handleRemoveAds = async () => {
    try {
      // Show loading toast
      const loadingToast = toast.loading(
        isTWAWithBilling() 
          ? 'Opening Google Play purchase...' 
          : 'Processing purchase...'
      );
      
      // Trigger purchase (Google Play in TWA, error on web)
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

  // Restore purchases handler (Android only)
  const handleRestorePurchases = async () => {
    try {
      const loadingToast = toast.loading('Restoring purchases...');
      
      const restored = await restorePurchases();
      
      toast.dismiss(loadingToast);
      
      if (restored) {
        toast.success('Premium restored successfully! 🎉', {
          duration: 5000,
        });
        setAdsRemoved(true);
      } else {
        toast.info('No premium purchase found. Please purchase premium first.');
      }
    } catch (error) {
      console.error('Restore error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to restore purchases.');
    }
  };

  // Email handling functions
  const handleSaveEmail = () => {
    if (!tempEmail.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    if (!isValidEmail(tempEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setUserEmail(tempEmail);
    setUserEmailState(tempEmail);
    setIsEditingEmail(false);
    toast.success('Email saved! You can now proceed with payment.');
  };

  const handleEditEmail = () => {
    setTempEmail(userEmail);
    setIsEditingEmail(true);
  };

  const handleCancelEdit = () => {
    setTempEmail('');
    setIsEditingEmail(false);
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
        {!adsRemoved && (
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

                {/* Buttons - Conditional based on platform */}
                <div className="space-y-3 max-w-sm mx-auto">
                  {/* Google Play Button - Only show on Android TWA */}
                  {isTWAWithBilling() && (
                    <>
                      <Button
                        onClick={handleRemoveAds}
                        className="w-full"
                        size="lg"
                        variant="default"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Get Premium - $4.99 (Google Play)
                      </Button>
                      
                      {/* Restore Purchase Button */}
                      <Button
                        onClick={handleRestorePurchases}
                        className="w-full"
                        size="sm"
                        variant="outline"
                      >
                        Restore Purchase
                      </Button>
                      
                      {/* Tester Unlock Button - Only visible in test mode */}
                      {isDebugUnlockAvailable() && (
                        <Button
                          onClick={() => {
                            debugUnlockPremium();
                            setAdsRemoved(true);
                            toast.success('🔓 Debug unlock activated! Premium unlocked for testing.');
                            // Reload to apply changes
                            setTimeout(() => window.location.reload(), 1000);
                          }}
                          className="w-full"
                          size="sm"
                          variant="secondary"
                        >
                          <Bug className="w-4 h-4 mr-2" />
                          Unlock for Testing
                        </Button>
                      )}
                      
                      {/* Helper text for testers */}
                      <p className="text-xs text-center text-muted-foreground">
                        Testers: If stuck on "Opening Google Play purchase...", try the "Unlock for Testing" button above or contact{' '}
                        <a href="mailto:soltidewellness@gmail.com" className="text-primary hover:underline">
                          soltidewellness@gmail.com
                        </a>
                      </p>
                    </>
                  )}

                  {/* Web - Paystack Payment OR Debug Unlock for Mobile Testers */}
                  {!isTWAWithBilling() && (
                    <div className="space-y-4">
                      {/* Debug Unlock for Mobile Testers */}
                      {isDebugUnlockAvailable() ? (
                        <div className="space-y-4">
                          <Card className="border-primary/20 bg-primary/5">
                            <CardContent className="pt-6 space-y-4">
                              <div className="flex items-start gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                  <Bug className="w-5 h-5 text-primary" />
                                </div>
                                <div className="flex-1 space-y-1">
                                  <h4 className="font-semibold text-sm">Testing Mode Detected</h4>
                                  <p className="text-xs text-muted-foreground">
                                    You're accessing the app from a mobile browser. Use the button below to unlock premium for testing.
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Button
                            onClick={() => {
                              debugUnlockPremium();
                              setAdsRemoved(true);
                              toast.success('🔓 Debug unlock activated! Premium unlocked for testing.');
                              setTimeout(() => window.location.reload(), 1000);
                            }}
                            className="w-full"
                            size="lg"
                            variant="default"
                          >
                            <Bug className="w-4 h-4 mr-2" />
                            Unlock Premium for Testing
                          </Button>
                          
                          <p className="text-xs text-center text-muted-foreground">
                            For production use, please download the Android app from Google Play Store
                          </p>
                        </div>
                      ) : (
                        <>
                          {/* Email Input Section */}
                          {!userEmail || isEditingEmail ? (
                            <Card className="border-primary/20 bg-primary/5">
                              <CardContent className="pt-6 space-y-4">
                                <div className="flex items-start gap-3">
                                  <div className="p-2 bg-primary/10 rounded-lg">
                                    <Mail className="w-5 h-5 text-primary" />
                                  </div>
                                  <div className="flex-1 space-y-1">
                                    <h4 className="font-semibold text-sm">Email Required for Receipt</h4>
                                    <p className="text-xs text-muted-foreground">
                                      Your payment receipt will be sent to this email address
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="space-y-3">
                                  <Input
                                    type="email"
                                    placeholder="Enter your email address"
                                    value={tempEmail}
                                    onChange={(e) => setTempEmail(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        handleSaveEmail();
                                      }
                                    }}
                                    className="w-full"
                                    autoFocus
                                  />
                                  <div className="flex gap-2">
                                    <Button
                                      onClick={handleSaveEmail}
                                      className="flex-1"
                                      size="sm"
                                    >
                                      Save Email
                                    </Button>
                                    {isEditingEmail && (
                                      <Button
                                        onClick={handleCancelEdit}
                                        variant="outline"
                                        size="sm"
                                      >
                                        Cancel
                                      </Button>
                                    )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-muted-foreground" />
                              <div>
                                <p className="text-xs text-muted-foreground">Receipt will be sent to:</p>
                                <p className="text-sm font-medium">{userEmail}</p>
                              </div>
                            </div>
                            <Button
                              onClick={handleEditEmail}
                              variant="ghost"
                              size="sm"
                              className="h-8"
                            >
                              <Edit2 className="w-3 h-3 mr-1" />
                              Change
                            </Button>
                          </div>

                          <PaystackPayment
                            email={userEmail}
                            amount={Number(import.meta.env.VITE_PREMIUM_PRICE) || 800000}
                            publicKey={import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "pk_live_000ac40050b8af5c5ee87edb8976d88d6eb6e315"}
                            text="⚡ Unlock Premium - ₦8,000"
                            onSuccess={handlePaystackSuccess}
                            onClose={handlePaystackClose}
                            className="w-full"
                          />
                        </div>
                      )}
                      
                      <p className="text-xs text-center text-muted-foreground">
                        Secure payment via Paystack • Instant access • Lifetime premium
                      </p>
                    </>
                      )}
                    </div>
                  )}
                  
                  <p className="text-xs text-muted-foreground">
                    {isTWAWithBilling() 
                      ? 'One-time purchase • Unlock Sleep Tracker'
                      : 'Secure payment via Paystack • Instant premium access'}
                  </p>
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
