import { useState, useEffect } from 'react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

// Helper functions for platform detection
const isAndroid = () => /Android/i.test(navigator.userAgent);
const isTWAWithBilling = () => {
  return isAndroid() && 
         typeof (window as any).getDigitalGoodsService === 'function' &&
         typeof (window as any).PaymentRequest === 'function';
};
const isDigitalGoodsAvailable = async () => {
  if (typeof (window as any).getDigitalGoodsService !== 'function') {
    return false;
  }
  try {
    const service = await (window as any).getDigitalGoodsService('https://play.google.com/billing');
    return service !== null;
  } catch {
    return false;
  }
};

export function DebugPage() {
  const [environmentChecks, setEnvironmentChecks] = useState<Record<string, any>>({});
  const [storageInfo, setStorageInfo] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    // Run environment checks
    const checks = {
      'React Loaded': typeof React !== 'undefined',
      'Promise Support': typeof Promise !== 'undefined',
      'Async Support': (async () => {}).constructor.name === 'AsyncFunction',
      'LocalStorage': typeof localStorage !== 'undefined',
      'Digital Goods API': typeof (window as any).getDigitalGoodsService === 'function',
      'Payment Request API': typeof (window as any).PaymentRequest === 'function',
      'Is Android': isAndroid(),
      'TWA with Billing': isTWAWithBilling(),
      'User Agent': navigator.userAgent.substring(0, 100),
      'Screen Size': `${window.innerWidth}x${window.innerHeight}`,
      'Online Status': navigator.onLine,
      'Service Worker': 'serviceWorker' in navigator,
    };
    setEnvironmentChecks(checks);

    // Check storage
    const storage = {
      'streak_ads_removed': localStorage.getItem('streak_ads_removed'),
      'rise_premium': localStorage.getItem('rise_premium'),
      'Total Keys': localStorage.length,
      'Storage Used': JSON.stringify(localStorage).length + ' bytes',
    };
    setStorageInfo(storage);

    // Listen for errors
    const errorHandler = (e: ErrorEvent) => {
      setErrors(prev => [...prev, e.message]);
    };

    const rejectionHandler = (e: PromiseRejectionEvent) => {
      setErrors(prev => [...prev, 'Promise: ' + e.reason]);
    };

    window.addEventListener('error', errorHandler);
    window.addEventListener('unhandledrejection', rejectionHandler);

    return () => {
      window.removeEventListener('error', errorHandler);
      window.removeEventListener('unhandledrejection', rejectionHandler);
    };
  }, []);

  const handleClearData = () => {
    if (confirm('This will clear ALL app data including habits. Continue?')) {
      localStorage.clear();
      sessionStorage.clear();
      toast.success('Data cleared. Reloading...');
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  const handleClearCache = () => {
    // Try to clear service worker cache
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' });
    }

    // Clear caches API
    if ('caches' in window) {
      caches.keys().then(keys => {
        keys.forEach(key => caches.delete(key));
      });
    }

    toast.success('Cache cleared. Reloading...');
    setTimeout(() => window.location.reload(), 1000);
  };

  const handleTestPurchase = async () => {
    try {
      const available = await isDigitalGoodsAvailable();
      toast.info(available ? '✅ Digital Goods API available' : '❌ Digital Goods API not available');
    } catch (error) {
      toast.error('Test failed: ' + error);
    }
  };

  const handleExportDiagnostics = () => {
    const data = {
      timestamp: new Date().toISOString(),
      environment: environmentChecks,
      storage: storageInfo,
      errors: errors,
      platform: {
        android: isAndroid(),
        twa: isTWAWithBilling(),
        userAgent: navigator.userAgent,
      }
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rise-diagnostic-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Diagnostics exported');
  };

  const handleResetApp = () => {
    if (confirm('This will reset the entire app to factory state. Continue?')) {
      // Clear everything
      localStorage.clear();
      sessionStorage.clear();

      // Clear IndexedDB
      if (window.indexedDB) {
        const databases = ['rise-db', 'habit-db', 'sleep-db'];
        databases.forEach(dbName => {
          const request = indexedDB.deleteDatabase(dbName);
          request.onerror = () => {
            console.log(`Failed to delete database: ${dbName}`);
          };
        });
      }

      // Clear service worker
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          registrations.forEach(registration => registration.unregister());
        });
      }

      toast.success('App fully reset. Reloading...');
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 pb-24">
      <h1 className="text-3xl font-bold mb-6">Rise Debug Center</h1>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleClearData}
          >
            🗑️ Clear App Data
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleClearCache}
          >
            🧹 Clear Cache Only
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleTestPurchase}
          >
            💳 Test Payment API
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleExportDiagnostics}
          >
            📊 Export Diagnostics
          </Button>

          <Button
            variant="destructive"
            className="w-full justify-start"
            onClick={handleResetApp}
          >
            🔄 Full App Reset
          </Button>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Environment Checks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(environmentChecks).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center py-2 border-b last:border-b-0">
                <span className="font-medium">{key}</span>
                <span className="text-sm text-muted-foreground font-mono">
                  {typeof value === 'boolean' ? (value ? '✓' : '✗') : String(value)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Storage Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(storageInfo).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center py-2 border-b last:border-b-0">
                <span className="font-medium">{key}</span>
                <span className="text-sm text-muted-foreground font-mono">
                  {String(value)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {errors.length > 0 && (
        <Card className="mb-4 border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">
              Recent Errors ({errors.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {errors.map((error, index) => (
                <div key={index} className="p-2 bg-destructive/10 rounded text-sm font-mono">
                  {error}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground text-center">
              Use these tools to diagnose and fix app issues.
            </p>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/'}
              className="w-full"
            >
              ← Back to App
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Version: {import.meta.env.VITE_APP_VERSION || '1.0.0'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
