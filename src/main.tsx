import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
// import { TestApp } from "./TestApp.tsx"; // Uncomment to test basic React
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ErrorBoundary } from "./components/ErrorBoundary.tsx";
import { initializeBilling } from "./utils/googlePlayBilling";

// To test if basic React works, uncomment the line below and comment out the App import
// const App = TestApp;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <AppWrapper>
        <App />
      </AppWrapper>
    </ErrorBoundary>
  </StrictMode>
);

// Register Service Worker for PWA and Offline Support
// Optimized for TWA cold start - aggressive caching with skipWaiting
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('[PWA] Service Worker registered successfully:', registration.scope);
        
        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60000); // Check every minute
        
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
  });
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
window.addEventListener('DOMContentLoaded', () => {
  const displayMode = window.matchMedia('(display-mode: standalone)').matches ? 'standalone' : 'browser';
  console.log('[PWA] Display mode:', displayMode);
  
  // Track if running as PWA
  if (displayMode === 'standalone') {
    console.log('[PWA] Running as installed PWA');
  }
  
  // Initialize Google Play Billing (checks for existing purchases)
  initializeBilling().catch(error => {
    console.error('[Billing] Initialization failed:', error);
  });
});
