/**
 * Debug utilities for development logging
 * These functions only log in development mode
 */

// Debug mode flag (only logs in development)
export const DEBUG_MODE = import.meta.env.DEV || false;

// Debug logger (only logs in development mode)
export const debugLog = (...args: any[]) => {
  if (DEBUG_MODE) {
    console.log(...args);
  }
};

// Debug error logger (only logs in development mode)
export const debugError = (...args: any[]) => {
  if (DEBUG_MODE) {
    console.error(...args);
  }
};
