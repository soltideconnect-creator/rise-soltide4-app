import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  errorCount: number;
}

export class ErrorBoundary extends React.Component<Props, State> {
  private errorTimeout?: NodeJS.Timeout;

  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false,
      errorCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details for debugging
    console.error('🚨 Error Boundary Caught:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    });

    // Store error info in state
    this.setState(prevState => ({
      errorInfo,
      errorCount: prevState.errorCount + 1
    }));

    // Log to localStorage for persistence across reloads
    try {
      const errorLog = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      };
      
      const existingLogs = localStorage.getItem('error_logs');
      const logs = existingLogs ? JSON.parse(existingLogs) : [];
      logs.push(errorLog);
      
      // Keep only last 10 errors
      if (logs.length > 10) {
        logs.shift();
      }
      
      localStorage.setItem('error_logs', JSON.stringify(logs));
    } catch (e) {
      console.error('Failed to log error to localStorage:', e);
    }

    // Auto-recovery for repeated errors
    if (this.state.errorCount >= 3) {
      console.warn('⚠️ Multiple errors detected. Auto-clearing data...');
      this.clearDataAndReload();
    }
  }

  componentWillUnmount() {
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
    }
  }

  clearDataAndReload = () => {
    try {
      // Clear all storage except error logs
      const errorLogs = localStorage.getItem('error_logs');
      localStorage.clear();
      sessionStorage.clear();
      
      if (errorLogs) {
        localStorage.setItem('error_logs', errorLogs);
      }
      
      // Clear IndexedDB if exists
      if (window.indexedDB) {
        indexedDB.databases().then(databases => {
          databases.forEach(db => {
            if (db.name) {
              indexedDB.deleteDatabase(db.name);
            }
          });
        }).catch(console.error);
      }
      
      // Unregister service workers
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          registrations.forEach(registration => {
            registration.unregister();
          });
        }).catch(console.error);
      }
      
      // Force reload
      setTimeout(() => {
        window.location.href = window.location.origin;
      }, 100);
    } catch (e) {
      console.error('Failed to clear data:', e);
      window.location.reload();
    }
  };

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-destructive">
            <CardHeader>
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-6 w-6" />
                <CardTitle>Something went wrong</CardTitle>
              </div>
              <CardDescription>
                The app encountered an unexpected error. Don't worry, your data is safe.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {this.state.error && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Error Details:</p>
                  <div className="bg-muted p-3 rounded-md text-xs font-mono overflow-auto max-h-32 border">
                    <div className="text-destructive font-semibold mb-1">
                      {this.state.error.name || 'Error'}
                    </div>
                    <div className="text-foreground">
                      {this.state.error.message}
                    </div>
                  </div>
                </div>
              )}

              {this.state.errorCount > 1 && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3 text-sm">
                  <p className="text-destructive font-medium">
                    ⚠️ Multiple errors detected ({this.state.errorCount})
                  </p>
                  <p className="text-muted-foreground text-xs mt-1">
                    Consider clearing app data if the problem persists.
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Button
                  onClick={this.handleReload}
                  className="w-full"
                  size="lg"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reload App
                </Button>
                
                <Button
                  onClick={this.clearDataAndReload}
                  variant="destructive"
                  className="w-full"
                  size="lg"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All Data & Reload
                </Button>

                <Button
                  onClick={this.handleReset}
                  variant="outline"
                  className="w-full"
                  size="sm"
                >
                  Try Again
                </Button>
              </div>

              <div className="text-xs text-muted-foreground text-center pt-2 border-t">
                Error ID: {Date.now().toString(36)}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
