/**
 * Error Recovery Utilities
 * Provides comprehensive error handling and recovery mechanisms
 */

import React from 'react';

interface ErrorLog {
  type: string;
  message: string;
  stack?: string;
  timestamp: string;
  userAgent: string;
  url?: string;
}

/**
 * Log error to localStorage for debugging
 */
export function logError(error: Error | string, context?: string): void {
  try {
    const errorLog: ErrorLog = {
      type: context || 'application_error',
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'object' ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    const existingLogs = localStorage.getItem('app_error_logs');
    const logs: ErrorLog[] = existingLogs ? JSON.parse(existingLogs) : [];
    logs.push(errorLog);

    // Keep only last 50 errors
    if (logs.length > 50) {
      logs.shift();
    }

    localStorage.setItem('app_error_logs', JSON.stringify(logs));
    console.error(`[Error Recovery] Logged error:`, errorLog);
  } catch (e) {
    console.error('[Error Recovery] Failed to log error:', e);
  }
}

/**
 * Get all error logs
 */
export function getErrorLogs(): ErrorLog[] {
  try {
    const logs = localStorage.getItem('app_error_logs');
    return logs ? JSON.parse(logs) : [];
  } catch (e) {
    console.error('[Error Recovery] Failed to get error logs:', e);
    return [];
  }
}

/**
 * Clear all error logs
 */
export function clearErrorLogs(): void {
  try {
    localStorage.removeItem('app_error_logs');
    localStorage.removeItem('error_logs');
    localStorage.removeItem('global_error_logs');
    localStorage.removeItem('console_error_logs');
    console.log('[Error Recovery] All error logs cleared');
  } catch (e) {
    console.error('[Error Recovery] Failed to clear error logs:', e);
  }
}

/**
 * Check if app is in error state
 */
export function isInErrorState(): boolean {
  try {
    const logs = getErrorLogs();
    const recentErrors = logs.filter(log => {
      const errorTime = new Date(log.timestamp).getTime();
      const now = Date.now();
      return now - errorTime < 60000; // Last minute
    });
    return recentErrors.length >= 3;
  } catch (e) {
    return false;
  }
}

/**
 * Clear all app data (emergency recovery)
 */
export function emergencyReset(): void {
  try {
    console.warn('[Error Recovery] Performing emergency reset...');

    // Save error logs before clearing
    const errorLogs = localStorage.getItem('app_error_logs');

    // Clear all storage
    localStorage.clear();
    sessionStorage.clear();

    // Restore error logs
    if (errorLogs) {
      localStorage.setItem('app_error_logs', errorLogs);
    }

    // Clear IndexedDB
    if (window.indexedDB) {
      indexedDB.databases().then(databases => {
        databases.forEach(db => {
          if (db.name) {
            indexedDB.deleteDatabase(db.name);
            console.log('[Error Recovery] Deleted IndexedDB:', db.name);
          }
        });
      }).catch(console.error);
    }

    // Unregister service workers
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => {
          registration.unregister();
          console.log('[Error Recovery] Unregistered service worker');
        });
      }).catch(console.error);
    }

    console.log('[Error Recovery] Emergency reset complete');
  } catch (e) {
    console.error('[Error Recovery] Emergency reset failed:', e);
  }
}

/**
 * Safe reload with fallback
 */
export function safeReload(): void {
  try {
    // Try to reload
    window.location.reload();
  } catch (e) {
    // Fallback: navigate to origin
    try {
      window.location.href = window.location.origin;
    } catch (e2) {
      console.error('[Error Recovery] Failed to reload:', e2);
    }
  }
}

/**
 * Check app health
 */
export function checkAppHealth(): {
  healthy: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  try {
    // Check localStorage
    try {
      localStorage.setItem('health_check', 'test');
      localStorage.removeItem('health_check');
    } catch (e) {
      issues.push('localStorage not available');
    }

    // Check if React is loaded
    if (typeof React === 'undefined') {
      issues.push('React not loaded');
    }

    // Check for recent errors
    if (isInErrorState()) {
      issues.push('Multiple recent errors detected');
    }

    // Check service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        if (registrations.length === 0) {
          console.warn('[Health Check] No service worker registered');
        }
      }).catch(() => {
        issues.push('Service worker check failed');
      });
    }

    return {
      healthy: issues.length === 0,
      issues
    };
  } catch (e) {
    return {
      healthy: false,
      issues: ['Health check failed']
    };
  }
}

/**
 * Wrap async function with error handling
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context?: string
): T {
  return (async (...args: any[]) => {
    try {
      return await fn(...args);
    } catch (error) {
      logError(error as Error, context);
      throw error;
    }
  }) as T;
}

/**
 * Wrap sync function with error handling
 */
export function withErrorHandlingSync<T extends (...args: any[]) => any>(
  fn: T,
  context?: string
): T {
  return ((...args: any[]) => {
    try {
      return fn(...args);
    } catch (error) {
      logError(error as Error, context);
      throw error;
    }
  }) as T;
}

/**
 * Initialize error recovery system
 */
export function initializeErrorRecovery(): void {
  console.log('[Error Recovery] Initializing error recovery system...');

  // Check app health on startup
  const health = checkAppHealth();
  if (!health.healthy) {
    console.warn('[Error Recovery] App health issues detected:', health.issues);
  }

  // Set up periodic health checks
  setInterval(() => {
    const health = checkAppHealth();
    if (!health.healthy) {
      console.warn('[Error Recovery] Health check failed:', health.issues);
    }
  }, 60000); // Every minute

  console.log('[Error Recovery] Error recovery system initialized');
}

// Export error recovery utilities
export const errorRecovery = {
  logError,
  getErrorLogs,
  clearErrorLogs,
  isInErrorState,
  emergencyReset,
  safeReload,
  checkAppHealth,
  withErrorHandling,
  withErrorHandlingSync,
  initializeErrorRecovery
};

export default errorRecovery;
