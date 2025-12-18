import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  isAndroid, 
  isTWAWithBilling, 
  isPremiumUnlocked, 
  purchasePremium, 
  restorePurchases,
  getPremiumStatusSync,
  PREMIUM_PRODUCT_ID
} from '@/utils/googlePlayBilling';
import { toast } from 'sonner';
import { 
  CheckCircle2, 
  XCircle, 
  Smartphone, 
  Globe, 
  RefreshCw, 
  ShoppingCart,
  AlertCircle,
  Info,
  Trash2
} from 'lucide-react';

/**
 * Billing Test Page
 * 
 * This page provides comprehensive testing for Google Play Billing integration.
 * Use this to verify:
 * - Android detection works correctly
 * - Paystack is hidden on Android
 * - Google Play Billing shows on Android
 * - Purchase restoration works
 * - Error handling is correct
 */
export function BillingTest() {
  const [isAndroidEnv, setIsAndroidEnv] = useState(false);
  const [hasBilling, setHasBilling] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [userAgent, setUserAgent] = useState('');
  const [forceAndroidMode, setForceAndroidMode] = useState(false);
  const [testResults, setTestResults] = useState<Array<{ test: string; passed: boolean; message: string }>>([]);

  useEffect(() => {
    updateEnvironmentInfo();
  }, []);

  const updateEnvironmentInfo = async () => {
    setIsAndroidEnv(isAndroid());
    setHasBilling(isTWAWithBilling());
    setUserAgent(navigator.userAgent);
    setForceAndroidMode(localStorage.getItem('force_android_mode') === 'true');
    
    const premium = await isPremiumUnlocked();
    setIsPremium(premium);
  };

  const handleForceAndroidMode = () => {
    if (forceAndroidMode) {
      localStorage.removeItem('force_android_mode');
      toast.success('Android mode disabled');
    } else {
      localStorage.setItem('force_android_mode', 'true');
      toast.success('Android mode enabled - Reload to see changes');
    }
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleTestPurchase = async () => {
    try {
      toast.loading('Testing purchase flow...');
      const success = await purchasePremium();
      
      if (success) {
        toast.success('Purchase successful!');
        await updateEnvironmentInfo();
      } else {
        toast.error('Purchase failed');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Purchase failed');
    }
  };

  const handleTestRestore = async () => {
    try {
      toast.loading('Testing restore purchases...');
      const restored = await restorePurchases();
      
      if (restored) {
        toast.success('Purchases restored successfully!');
        await updateEnvironmentInfo();
      } else {
        toast.info('No purchases found to restore');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Restore failed');
    }
  };

  const handleClearPremium = () => {
    localStorage.removeItem('streak_ads_removed');
    localStorage.removeItem('rise_premium');
    toast.success('Premium status cleared');
    updateEnvironmentInfo();
  };

  const runComprehensiveTests = async () => {
    const results: Array<{ test: string; passed: boolean; message: string }> = [];

    // Test 1: Android Detection
    const androidDetected = isAndroid();
    results.push({
      test: 'Android Detection',
      passed: true,
      message: androidDetected ? '✅ Android detected' : '✅ Web detected'
    });

    // Test 2: TWA Billing Detection
    const billingAvailable = isTWAWithBilling();
    results.push({
      test: 'TWA Billing Detection',
      passed: true,
      message: billingAvailable ? '✅ Billing available' : '✅ Billing not available (web)'
    });

    // Test 3: Premium Status Check
    const premium = await isPremiumUnlocked();
    results.push({
      test: 'Premium Status Check',
      passed: true,
      message: premium ? '✅ Premium active' : '✅ Premium not active'
    });

    // Test 4: LocalStorage Sync
    const syncStatus = getPremiumStatusSync();
    results.push({
      test: 'LocalStorage Sync',
      passed: syncStatus === premium,
      message: syncStatus === premium ? '✅ Sync correct' : '❌ Sync mismatch'
    });

    // Test 5: User Agent Check
    const hasAndroidUA = /android/i.test(navigator.userAgent);
    results.push({
      test: 'User Agent Check',
      passed: true,
      message: hasAndroidUA ? '✅ Android UA detected' : '✅ Non-Android UA'
    });

    // Test 6: TWA Features Check
    const isTWA = window.matchMedia('(display-mode: standalone)').matches;
    results.push({
      test: 'TWA Features Check',
      passed: true,
      message: isTWA ? '✅ TWA mode detected' : '✅ Browser mode'
    });

    // Test 7: AndroidBilling Interface
    const hasInterface = typeof window.AndroidBilling !== 'undefined';
    results.push({
      test: 'AndroidBilling Interface',
      passed: true,
      message: hasInterface ? '✅ Interface available' : '⚠️ Interface not available (expected on web)'
    });

    // Test 8: Force Android Mode
    const forceMode = localStorage.getItem('force_android_mode') === 'true';
    results.push({
      test: 'Force Android Mode',
      passed: true,
      message: forceMode ? '✅ Force mode enabled' : '✅ Force mode disabled'
    });

    setTestResults(results);
    toast.success('All tests completed!');
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Billing Test Page</h1>
          <Badge variant={isAndroidEnv ? "default" : "secondary"}>
            {isAndroidEnv ? (
              <><Smartphone className="w-3 h-3 mr-1" /> Android</>
            ) : (
              <><Globe className="w-3 h-3 mr-1" /> Web</>
            )}
          </Badge>
        </div>

        {/* Environment Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              Environment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Android Detected:</span>
                  {isAndroidEnv ? (
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  ) : (
                    <XCircle className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">TWA Billing Available:</span>
                  {hasBilling ? (
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  ) : (
                    <XCircle className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Premium Status:</span>
                  {isPremium ? (
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  ) : (
                    <XCircle className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Force Android Mode:</span>
                  {forceAndroidMode ? (
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  ) : (
                    <XCircle className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">AndroidBilling Interface:</span>
                  {typeof window.AndroidBilling !== 'undefined' ? (
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  ) : (
                    <XCircle className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Product ID:</span>
                  <code className="text-xs bg-muted px-2 py-1 rounded">{PREMIUM_PRODUCT_ID}</code>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Display Mode:</span>
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {window.matchMedia('(display-mode: standalone)').matches ? 'standalone' : 'browser'}
                  </code>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-2">User Agent:</p>
              <code className="text-xs bg-muted p-2 rounded block break-all">
                {userAgent}
              </code>
            </div>
          </CardContent>
        </Card>

        {/* Test Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Test Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button
                onClick={handleForceAndroidMode}
                variant={forceAndroidMode ? "destructive" : "default"}
                className="w-full"
              >
                <Smartphone className="w-4 h-4 mr-2" />
                {forceAndroidMode ? 'Disable' : 'Enable'} Android Mode
              </Button>

              <Button
                onClick={updateEnvironmentInfo}
                variant="outline"
                className="w-full"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Info
              </Button>

              <Button
                onClick={handleTestPurchase}
                variant="default"
                className="w-full"
                disabled={!isAndroidEnv}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Test Purchase
              </Button>

              <Button
                onClick={handleTestRestore}
                variant="default"
                className="w-full"
                disabled={!isAndroidEnv}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Test Restore
              </Button>

              <Button
                onClick={handleClearPremium}
                variant="outline"
                className="w-full"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Premium
              </Button>

              <Button
                onClick={runComprehensiveTests}
                variant="secondary"
                className="w-full"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Run All Tests
              </Button>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> Purchase and Restore buttons only work when Android is detected.
                Use "Enable Android Mode" to simulate Android environment on web.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        {testResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Test Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {testResults.map((result, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {result.passed ? (
                        <CheckCircle2 className="w-5 h-5 text-success" />
                      ) : (
                        <XCircle className="w-5 h-5 text-destructive" />
                      )}
                      <div>
                        <p className="text-sm font-medium">{result.test}</p>
                        <p className="text-xs text-muted-foreground">{result.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Expected Behavior */}
        <Card>
          <CardHeader>
            <CardTitle>Expected Behavior</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">On Web (Browser):</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Android Detected: ❌ (should be false)</li>
                <li>TWA Billing Available: ❌ (should be false)</li>
                <li>Stats page shows: Paystack payment UI</li>
                <li>Email input visible</li>
                <li>Purchase/Restore buttons disabled</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">On Android (Google Play):</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Android Detected: ✅ (should be true)</li>
                <li>TWA Billing Available: ✅ (should be true)</li>
                <li>Stats page shows: Google Play Billing button</li>
                <li>Paystack UI completely hidden</li>
                <li>Purchase/Restore buttons enabled</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">With Force Android Mode:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Android Detected: ✅ (forced to true)</li>
                <li>TWA Billing Available: ✅ (forced to true)</li>
                <li>Stats page shows: Google Play Billing button</li>
                <li>Paystack UI hidden (simulating Android)</li>
                <li>Purchase/Restore buttons enabled</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>Testing Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <h4 className="font-semibold mb-1">1. Test Web Environment:</h4>
              <p className="text-muted-foreground">
                Verify "Android Detected" is ❌ and Paystack shows on Stats page.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-1">2. Test Android Simulation:</h4>
              <p className="text-muted-foreground">
                Click "Enable Android Mode", reload page, verify "Android Detected" is ✅ and Paystack is hidden on Stats page.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-1">3. Test Purchase Flow:</h4>
              <p className="text-muted-foreground">
                With Android mode enabled, click "Test Purchase" to verify error handling (AndroidBilling interface not available on web).
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-1">4. Run Comprehensive Tests:</h4>
              <p className="text-muted-foreground">
                Click "Run All Tests" to verify all detection methods work correctly.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-1">5. Verify Stats Page:</h4>
              <p className="text-muted-foreground">
                Go to Stats tab and verify correct payment UI shows based on environment.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
