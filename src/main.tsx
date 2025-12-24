import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
// import { TestApp } from "./TestApp.tsx"; // Uncomment to test basic React
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ErrorBoundary } from "./components/ErrorBoundary.tsx";
import { initializeBilling } from "./utils/googlePlayBilling";

// ============================================================================
// PROMISE API VALIDATION - Critical for production builds
// ============================================================================
// Validate that Promise API is available before app starts
// This prevents "so(...).then is not a function" errors in minified builds
if (typeof Promise !== 'function') {
  console.error('❌ CRITICAL: Promise API not available in this environment');
  document.body.innerHTML = `
    <div style="padding: 20px; font-family: sans-serif; text-align: center;">
      <h1 style="color: red;">⚠️ Browser Not Supported</h1>
      <p>Your browser does not support modern JavaScript features required by this app.</p>
      <p>Please update your browser or WebView to the latest version.</p>
      <p style="margin-top: 20px; font-size: 12px; color: #666;">
        Technical: Promise API not available
      </p>
    </div>
  `;
  throw new Error('Promise API required. Please update your browser or WebView.');
}

// Validate Promise.prototype.then exists
if (typeof Promise.prototype.then !== 'function') {
  console.error('❌ CRITICAL: Promise.prototype.then not available');
  document.body.innerHTML = `
    <div style="padding: 20px; font-family: sans-serif; text-align: center;">
      <h1 style="color: red;">⚠️ Browser Not Supported</h1>
      <p>Your browser does not support modern JavaScript features required by this app.</p>
      <p>Please update your browser or WebView to the latest version.</p>
      <p style="margin-top: 20px; font-size: 12px; color: #666;">
        Technical: Promise.then() not available
      </p>
    </div>
  `;
  throw new Error('Promise.then() required. Please update your browser or WebView.');
}

console.log('✅ Promise API validated successfully');
// ============================================================================

// To test if basic React works, uncomment the line below and comment out the App import
// const App = TestApp;

// Add global error handler to catch any errors
window.addEventListener('error', (event) => {
  console.error('[Global Error]', event.error);
  console.error('[Error Message]', event.message);
  console.error('[Error Stack]', event.error?.stack);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('[Unhandled Promise Rejection]', event.reason);
});

console.log('[App] Starting Rise app...');
console.log('[App] Environment:', import.meta.env.MODE);
console.log('[App] Base URL:', import.meta.env.BASE_URL);

try {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error('Root element not found!');
  }
  
  console.log('[App] Root element found, rendering app...');
  
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <AppWrapper>
          <App />
        </AppWrapper>
      </ErrorBoundary>
    </StrictMode>
  );
  
  console.log('[App] App rendered successfully');
} catch (error) {
  console.error('[App] Failed to render app:', error);
  // Show error on screen
  document.body.innerHTML = `
    <div style="padding: 20px; font-family: sans-serif;">
      <h1 style="color: red;">App Failed to Load</h1>
      <p><strong>Error:</strong> ${error instanceof Error ? error.message : String(error)}</p>
      <p><strong>Stack:</strong></p>
      <pre style="background: #f5f5f5; padding: 10px; overflow: auto;">${error instanceof Error ? error.stack : 'No stack trace'}</pre>
      <button onclick="location.reload()" style="padding: 10px 20px; margin-top: 20px; cursor: pointer;">
        Reload Page
      </button>
    </div>
  `;
}

// Register Service Worker for PWA and Offline Support
// CRITICAL: Register AFTER app renders to avoid blocking initial load
// Delayed registration improves cold start performance
if ('serviceWorker' in navigator) {
  // Use requestIdleCallback for non-blocking registration
  const registerSW = () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('[PWA] Service Worker registered successfully:', registration.scope);
        
        // Check for updates periodically (less aggressive)
        setInterval(() => {
          registration.update();
        }, 300000); // Check every 5 minutes instead of 1 minute
        
        // Handle updates with aggressive skipWaiting for TWA
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              // Immediately activate new service worker for TWA cold start optimization
              if (newWorker.state === 'installed') {
                console.log('[PWA] New service worker installed, activating immediately');
                
                // Tell the new service worker to skip waiting and activate immediately
                newWorker.postMessage({ type: 'SKIP_WAITING' });
                
                // If there's an existing controller, show update notification
                if (navigator.serviceWorker.controller) {
                  console.log('[PWA] New version available! Reloading...');
                  
                  // Show notification and auto-reload after 2 seconds
                  const notification = document.createElement('div');
                  notification.style.cssText = `
                    position: fixed;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #5E5CE6;
                    color: white;
                    padding: 16px 24px;
                    border-radius: 12px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                    z-index: 10000;
                    font-family: system-ui, -apple-system, sans-serif;
                    font-size: 14px;
                    font-weight: 500;
                    animation: slideDown 0.3s ease-out;
                  `;
                  notification.textContent = '🎉 New version available! Updating...';
                  document.body.appendChild(notification);
                  
                  // Reload the page after a short delay
                  setTimeout(() => {
                    window.location.reload();
                  }, 2000);
                }
              }
            });
          }
        });
        
        // Listen for the service worker taking control
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          console.log('[PWA] New service worker activated and took control');
        });
      })
      .catch((error) => {
        console.error('[PWA] Service Worker registration failed:', error);
      });
  };
  
  // Register SW after a delay to not block initial render
  // Use requestIdleCallback if available, otherwise setTimeout
  if ('requestIdleCallback' in window) {
    requestIdleCallback(registerSW);
  } else {
    setTimeout(registerSW, 2000); // Wait 2 seconds after page load
  }
}

// Handle "Add to Home Screen" prompt
let deferredPrompt: any;

window.addEventListener('beforeinstallprompt', (e) => {
  console.log('[PWA] beforeinstallprompt event fired');
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  // Update UI to notify the user they can install the PWA
  console.log('[PWA] App can be installed');
  
  // You can show a custom install button here
  // For now, we'll just log it
});

window.addEventListener('appinstalled', () => {
  console.log('[PWA] App installed successfully');
  deferredPrompt = null;
});

// Log PWA display mode
window.addEventListener('DOMContentLoaded', async () => {
  const displayMode = window.matchMedia('(display-mode: standalone)').matches ? 'standalone' : 'browser';
  console.log('[PWA] Display mode:', displayMode);
  
  // Track if running as PWA
  if (displayMode === 'standalone') {
    console.log('[PWA] Running as installed PWA');
  }
  
  // Initialize Google Play Billing (checks for existing purchases)
  try {
    await initializeBilling();
  } catch (error) {
    console.error('[Billing] Initialization failed:', error);
  }
});
