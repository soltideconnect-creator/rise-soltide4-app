# Streak – Daily Habit Tracker Requirements Document (Complete with Viral Share Feature)

## 1. Application Overview

### 1.1 Application Name
Streak – Daily Habit Tracker
\n### 1.2 Application Description
A production-ready Android habit tracking application built with Flutter and Material3 design. The app helps users build and maintain daily habits through streak tracking, visual progress indicators, and motivational features. Now includes a comprehensive sleep tracker with smart alarm functionality,27 premium features designed to outperform competitors, and a viral share feature for organic growth. Fully offline with local data storage and optional cloud sync. Enhanced with Progressive Web App (PWA) capabilities and dual payment system (Google Play Billing for Android + Paystack for Web/PWA). Includes robust device transfer and purchase restoration system for seamless premium access across devices.

### 1.3 Technical Stack
- Framework: Flutter (Android) + Next.js with TypeScript (Web/PWA)
- Design System: Material 3 (Material You)\n- Database: Hive (offline storage)
- Cloud Sync: Firebase Firestore (premium)\n- Payment: \n  - Google Play Billing Library v6+ (Android native)
  - Paystack via react-paystack (Web/PWA)
- Platform: Android + Wear OS (premium) + PWA
- Fonts: Poppins (headings), Inter (body text)
- Sensors: Microphone, Accelerometer, GPS (premium)\n- PWA: Service Worker, Web App Manifest, Cache API
- UI Components: shadcn/ui (@/components/ui/*)
- Icons: lucide-react\n- Toasts: sonner
- Charts: Recharts
- QR Code: qrcode.react (for viral share feature)

## 2. Core Features

### 2.1 Onboarding Flow
- 3 full-screen slides explaining streak concept and app features
- Highlight premium features with gold accents
- Request notification permission during onboarding
- Optional: Request location and camera permissions for premium features
- Beautiful, engaging visual presentation with smooth animations
- PWA install prompt for web users

### 2.2 Main Home Screen
\n#### 2.2.1 Free Version
- Large circular progress ring displaying today's completion percentage
- Scrollable list of up to 5 habits with:\n  - Emoji icon for each habit
  - Habit name
  - Current streak count with🔥 emoji
  - Large green checkbox for completion
- Floating action button (+) to add new habits (disabled when5 habits reached)
- Premium upgrade banner with 'Unlock Unlimited Habits' CTA
\n#### 2.2.2 Premium Version
- Unlimited habits display with smooth scrolling
- Habit grouping by custom categories with collapsible sections
- Color-coded category headers\n- Habit chain visual connections (lines connecting dependent habits)
- Quick filter buttons: All / Today / Category view
- Focus Mode toggle button in top bar
- Premium badge indicator in top-right corner
\n### 2.3 Add/Edit Habit Screen

#### 2.3.1 Basic Fields (Free + Premium)
- Text input field for habit name
- Emoji picker with 80+ common emojis
- Color picker with8 preset colors
- Daily reminder time picker\n- Weekday selector with toggle buttons (Monday–Sunday)
\n#### 2.3.2 Premium Fields
- **Habit Templates**: Browse and select from 50+ pre-built templates:\n  - Fitness: Workout, Yoga, Running, Cycling, Swimming
  - Health: Drink Water, Meditation, Vitamins, Sleep8 Hours, Healthy Meal
  - Productivity: Reading, Journaling, Learning, Deep Work, Email Zero
  - Self-care: Skincare, Gratitude, Stretching, No Social Media, Digital Detox
  - Each template includes pre-filled name, emoji, color, and suggested reminder time
- **Custom Categories**: Assign habit to category (Health, Work, Personal, Fitness, etc.)
- **Difficulty Level**: Select Easy/Medium/Hard (affects analytics and predictions)
- **Custom Frequency**: \n  - Daily (default)
  - X times per week (e.g., 3 times per week)
  - Every X days (e.g., every other day)
  - Specific days (e.g., Monday, Wednesday, Friday)
  - Monthly (e.g., 1st of each month)
- **Habit Dependencies**: Link to prerequisite habits (e.g., 'Protein Shake' requires 'Workout' completion)
- **Location-based Reminder**: Set geofence trigger (e.g., remind when arriving at gym)
- **Weather-based Reminder**: Enable weather conditions (e.g., only remind on sunny days for outdoor run)
- **Notes Field**: Add description or motivation for the habit

### 2.4 Calendar Tab

#### 2.4.1 Free Version
- Monthly heatmap visualization (GitHub/Duolingo style)
- Darker green shades indicate higher completion rates
- Tap on date to see completed habits for that day
\n#### 2.4.2 Premium Version
- **Year View**: Annual overview with 12-month grid
- **Multi-habit View**: Toggle to see individual habit calendars side-by-side
- **Export Options**:
  - Export calendar as high-resolution PNG image
  - Export as PDF with customizable date range
  - Share directly to social media
- **Frozen Days Indicator**: Visual marker (snowflake icon) on days with streak freeze applied
\n### 2.5 Stats Tab

#### 2.5.1 Free Version
- Current streak counter
- Longest streak record
- Total completions count
- Bar chart showing last 30 days activity
- Perfect days counter
- Perfect weeks counter
- Small banner ad placeholder at bottom

#### 2.5.2 Premium Version (Ad-Free)
- **Advanced Analytics Dashboard**:
  - Completion rate trends (daily/weekly/monthly)
  - Success rate percentage per habit
  - Average streak length
  - Best performing time of day
  - Consistency score (0-100)
- **Predictive Insights**:
  - AI-powered success predictions based on historical data
  - Risk alerts for habits likely to break streak
  - Optimal reminder time suggestions
- **Comparison Charts**:
  - Side-by-side habit performance comparison
  - Category-level analytics
  - Difficulty level success rates
- **Reports**:
  - Monthly summary report with charts and insights
  - Yearly summary report with achievements
  - Exportable PDF reports
  - Weekly email summaries (opt-in)

### 2.6 Sleep Tracker Tab

#### 2.6.1 Core Features (Free + Premium)
- Start/Stop sleep tracking button with bedtime reminder
- Uses phone microphone and accelerometer to monitor sleep overnight
- Records sleep duration and quality metrics
- Simple graphs displaying:\n  - Sleep duration over time (last 7 days)
  - Sleep quality scores (1-10 scale)
  - Sleep phases (light/deep sleep patterns)
- **Smart Alarm Feature**:
  - User sets desired wake-up time
  - Alarm rings within 30-minute window before set time
  - Triggers when sleep is in light phase for gentle awakening
  - Vibration + sound combination\n- Sleep history log with date, duration, and quality ratings
\n#### 2.6.2 Premium Sleep Features
- **Sleep Insights**:
  - Personalized sleep recommendations\n  - Sleep debt calculator
  - Optimal bedtime suggestions based on wake-up time
  - Sleep consistency score
- **Sleep Goals**:
  - Set target sleep duration (e.g., 8 hours)
  - Track progress toward sleep goals
  - Bedtime reminders to meet goals
- **Detailed Sleep Cycle Analysis**:
  - REM sleep detection and tracking
  - Deep sleep percentage
  - Sleep interruptions log
  - Sleep efficiency score
- **Sleep Sound Library**:
  - 20+ ambient sounds: White Noise, Rain, Ocean Waves, Forest, Thunderstorm, Fan, Fireplace, etc.
  - Sound mixer to combine multiple sounds
  - Volume control and fade-out timer
  - Download sounds for offline use

### 2.7 Settings Page

#### 2.7.1 Alarm Sound Selection
- **Free Version**: 8 pre-installed alarm sounds
  - Gentle Chimes\n  - Morning Birds
  - Soft Piano
  - Ocean Waves
  - Sunrise Melody
  - Peaceful Bells
  - Nature Sounds
  - Classic Alarm
- **Premium Version**: 20+ additional alarm sounds
  - Energetic Wake-Up\n  - Jazz Morning
  - Guitar Sunrise
  - Zen Garden
  - Tropical Beach
  - Mountain Stream
  - City Morning
  - Electronic Pulse
  - Plus12 more exclusive sounds
- **Custom Upload** (Premium): Upload personal alarm sound (MP3/OGG, max 2MB)
- Sound preview functionality (tap to play10-second sample)
- Selected sound indicator with checkmark
- All sounds stored locally in app assets for offline use

#### 2.7.2 Theme Customization
- **Free Version**: Light/Dark/Auto mode
- **Premium Version**:
  - Custom primary color picker (full spectrum)
  - Custom accent color picker
  - 10 pre-designed premium themes (Ocean, Forest, Sunset, Midnight, etc.)
  - Widget theme customization
\n#### 2.7.3 Data Management
- **Free Version**: Manual local backup/restore
- **Premium Version**:
  - **Automatic Cloud Backup**: Daily encrypted backup to Firebase
  - **Cross-device Sync**: Real-time sync across multiple Android devices
  - **Export Options**:
    - Export all data to CSV format
    - Export all data to JSON format
    - Export habits with notes and photos as ZIP archive
  - **Import Options**: Import data from CSV/JSON\n\n#### 2.7.4 Device Transfer & Purchase Restoration
- **Restore Purchases Button**: Prominently displayed in Settings page
- **Android Device Transfer**:
  - 'Restore Purchases' button calls AndroidBilling.getPurchases()
  - Verifies premium_unlock purchase with Google Play\n  - Automatically unlocks premium features if purchase found
  - Shows success message: '✅ Premium restored! All features unlocked.'
  - Shows error message if no purchase found:'No premium purchase found. Please contact support if you believe this is an error.'
- **Web/PWA Device Transfer**:
  - 'Restore Premium Access' button in Settings\n  - User enters email used for Paystack payment
  - Backend API verifies payment history via Paystack API
  - If verified, unlocks premium and stores in localStorage
  - Shows success message: '✅ Premium restored! All features unlocked.'\n  - Fallback: User can contact support with transaction reference
- **Cloud Sync for Premium Users**:
  - Premium status synced via Firebase Firestore
  - On new device login, checks Firestore for premium status
  - Automatically unlocks if premium found in cloud
- **Support Contact**:
  - 'Contact Support' button with pre-filled email template
  - Includes device info, purchase platform, and transaction ID
  - Support email: support@risehabittracker.com
\n#### 2.7.5 Viral Share Feature (NEW)
- **Location**: Settings page and Premium screen
- **Button**: 'Share Rise with Friends' - prominent purple button
- **Functionality**:
  - 100% offline - no internet, no servers, no tracking required
  - On tap: Opens device native share sheet (SMS, email, Bluetooth, WhatsApp, etc.)
  - Share content includes:
    - App title:'Rise: Habit Tracker & Smart Sleep'\n    - Message: 'Try Rise: Offline habit tracker with smart sleep features. One-time $4.99 premium unlock. Install free: [link]'
    - Link: https://play.google.com/store/apps/details?id=com.soltide.rise (production) or https://play.google.com/apps/testing/com.soltide.rise (closed test)
- **QR Code**:
  - Displays QR code below share button
  - QR code links to Play Store listing (opt-in link for testing, public link for production)
  - Size: 128x128px\n  - Scannable for easy install
- **Fallback**: For older browsers without navigator.share, copies link to clipboard with alert message
- **Design**:
  - Purple button with white text: 'Share Rise with Friends'
  - Subtext: 'Spread better habits — QR code for easy install'
  - QR code centered below button with4px margin-top
- **Global Appeal**: No region-specific messaging, universally accessible
- **Goal**: Target 20-30% organic download growth from word-of-mouth

#### 2.7.6 Other Settings
- Language selection (English, Spanish, French, German, Portuguese, Chinese, Japanese)\n- Notification settings\n- Privacy settings (anonymous analytics opt-in/out)
- Premium subscription management
- About and support\n\n### 2.8 Notification System

#### 2.8.1 Free Version
- Single daily reminder per habit at user-chosen time
- Notification text: 'Don't break the chain! Complete your habits🔥'
- Tap to open app and mark complete
\n#### 2.8.2 Premium Version
- **Multiple Reminders**: Up to 3 reminders per habit per day
- **Smart Reminder Timing**: AI suggests optimal reminder times based on completion patterns
- **Custom Notification Messages**: Personalize notification text per habit
- **Motivational Push Notifications**: Random motivational quotes sent throughout the day
- **Location-based Reminders**: Trigger when entering/leaving geofenced area
- **Weather-based Reminders**: Conditional reminders based on weather conditions
- **Reminder Snooze**: Snooze for 15/30/60 minutes with custom intervals
\n### 2.9 Home Screen Widgets

#### 2.9.1 Free Version
- **1×1 Widget**: Displays today's completion percentage in circular progress ring
- **4×2 Widget**: Lists today's habits (up to 5) with interactive checkboxes
\n#### 2.9.2 Premium Version
- **2×2 Widget**: Mini calendar view showing current week's heatmap
- **4×4 Widget**: Detailed stats dashboard with:\n  - Today's progress ring
  - Current streak counter
  - Top 3 habits with checkboxes
  - Mini bar chart of last 7 days
- **Customizable Widget Themes**: Match widget colors to app theme or choose custom colors
- **Widget Layouts**: Choose from 3 layout styles per widget size

### 2.10 Celebration Features

#### 2.10.1 Free Version
- Confetti explosion animation when streak reaches 7, 30, or 100 days
- Haptic feedback for milestone achievements
- 50built-in motivational quotes displayed randomly after completing a habit

#### 2.10.2 Premium Version\n- **200+ Motivational Quotes**: Expanded library with category-specific quotes
- **Custom Milestones**: Set personal streak goals (e.g., 14 days, 50 days, 365 days)
- **Achievement Badges System**:
  - 30+ unlockable badges (Early Bird, Night Owl, Perfect Week, Century Club, etc.)
  - Badge collection gallery
  - Progress toward next badge
- **Trophy Cabinet**: Display earned trophies for major achievements
- **Shareable Achievement Cards**:
  - Auto-generated beautiful cards with streak stats
  - Customizable card designs
  - One-tap share to Instagram, Twitter, Facebook
  - Save as image to gallery

### 2.11 Premium Exclusive Features

#### 2.11.1 Focus Mode
- **Distraction-Free Interface**:
  - Hides all UI elements except today's habits
  - Full-screen mode with minimal design
  - Swipe to complete habits
- **Pomodoro Timer Integration**:
  - Built-in 25/5 minute Pomodoro timer
  - Link timer to specific habits
  - Track time spent on habits
  - Pomodoro session history
- **Do Not Disturb Mode**: Automatically silence notifications during focus sessions
\n#### 2.11.2 Notes and Journaling
- **Habit Notes**: Add text notes to each habit completion (e.g., 'Ran 5km in 30 minutes')
- **Daily Journal**: Dedicated journal entry for each day\n- **Photo Attachments**:
  - Attach photos to habit completions (e.g., meal photos, workout selfies)
  - Photo gallery view per habit
  - Before/after photo comparison tool
- **Searchable History**: Full-text search across all notes and journal entries
- **Export Journal**: Export journal entries as PDF or text file

#### 2.11.3 Social Features
- **Accountability Partners**:
  - Share specific habits with friends
  - See friend's completion status
  - Send encouragement messages
- **Habit Challenges**:
  - Join community challenges (e.g., '30-Day Meditation Challenge')
  - Create private challenges with friends
  - Challenge leaderboards
- **Leaderboards**: Weekly/monthly rankings among friends
- **Privacy Controls**: Choose which habits to share publicly/privately

#### 2.11.4 Smartwatch Support (Wear OS)
- **Companion App**:
  - View today's habits on watch face
  - Quick completion with single tap
  - Glanceable progress ring complication
- **Haptic Reminders**: Gentle vibration reminders on wrist
- **Voice Input**: Use voice to add notes to habit completions
- **Standalone Mode**: Complete habits without phone nearby (syncs later)

#### 2.11.5 Streak Freeze Feature
- **Freeze Allowance**: 2 freeze days per month
- **Manual Activation**: Tap 'Freeze Streak' button on any day
- **Automatic Suggestion**: App suggests freeze when detecting potential streak break
- **Visual Indicator**: Snowflake icon on frozen days in calendar
- **Freeze History**: Log of all used freeze days
- **Rollover**: Unused freezes do not roll over to next month

#### 2.11.6 Advanced Data Export
- **CSV Export**: All habits, completions, streaks, and notes
- **JSON Export**: Complete data dump for developers
- **PDF Reports**:
  - Customizable date range
  - Include charts and graphs
  - Professional formatting
- **Photo Archive**: Export all attached photos as ZIP file

### 2.12 Monetization (Dual Payment System)

#### 2.12.1 Free Version Limitations
- Maximum 5 active habits
- Single daily reminder per habit
- Basic stats and 30-day chart
-8 alarm sounds
- Banner ad at bottom of Stats screen
- No cloud backup

#### 2.12.2 Premium Pricing
- **Android (Google Play)**: $4.99 USD one-time purchase
- **Web/PWA (Paystack)**: ₦8,000 NGN one-time payment
\n#### 2.12.3 Payment Implementation
\n**Android Users (Google Play Billing):**
- Product ID: premium_unlock
- Product Type: One-time in-app purchase (non-consumable)
- Price: $4.99 USD
- Payment Method: Google Play Billing Library v6+
- Button Text: 'Unlock Premium $4.99'
- Visibility: Only shown when window.AndroidBilling exists
\n**Web/PWA Users (Paystack Direct Payment):**
- Amount: 800000 kobo (₦8,000 NGN)
- Payment Gateway: Paystack via react-paystack package
- Live Public Key: pk_live_000ac40050b8af5c5ee87edb8976d88d6eb6e315
- Default Email: customer@riseapp.com (user can modify)
- Reference: RISE_{timestamp}_{random}\n- Button Text: 'Unlock Premium ₦8,000 (Instant • No Google Cut)'
- Visibility: Only shown when window.AndroidBilling is NOT present
- Payment Channels: Card, Bank, USSD, QR, Mobile Money
- On Success:\n  - Verify payment via backend API (/api/verify-payment)
  - Store premium data in localStorage with structure:
    ```json
    {
      'unlocked': true,
      'unlockedAt': ISO timestamp,
      'transactionId': payment reference,
      'features': ['sleep_tracker', 'no_ads', 'advanced_analytics'],
      'platform': 'web',
      'userEmail': user email\n    }
    ```\n  - localStorage.setItem('streak_ads_removed', 'true')
  - Dispatch'premiumStatusChanged' event
  - Unlock all premium features immediately
  - Show success toast: '🎉 Premium unlocked! Sleep Tracker and all premium features are now available!'

#### 2.12.4 Premium Benefits Summary
1. ✅ Unlimited habits
2. ✅ Ad-free experience
3. ✅ Advanced analytics and AI predictions
4. ✅50+ habit templates
5. ✅ Custom categories and tags
6. ✅ Year view calendar + export
7. ✅ Data export (CSV, JSON, PDF)
8. ✅ Multiple reminders per habit
9. ✅ Custom notification messages
10. ✅ 20+ additional alarm sounds + custom upload
11. ✅ Custom theme colors and premium themes
12. ✅ Automatic cloud backup and cross-device sync
13. ✅ Sleep insights and recommendations
14. ✅ Sleep sound library (20+ sounds)
15. ✅ Achievement badges and trophy cabinet
16. ✅ Custom milestone celebrations
17. ✅ Advanced widgets (2×2, 4×4) with customization
18. ✅ Location-based reminders
19. ✅ Weather-based reminders
20. ✅ Focus mode with Pomodoro timer
21. ✅ Habit chains and dependencies
22. ✅ Custom habit frequencies
23. ✅ Notes and journaling with photo attachments
24. ✅ Social features and challenges
25. ✅ Wear OS smartwatch support
26. ✅ Streak freeze feature (2 per month)
27. ✅ Priority customer support
28. ✅ Device transfer and purchase restoration
29. ✅ Viral share feature with QR code
\n#### 2.12.5 Premium Unlock UI
\n**Location**: Stats Tab and Premium/Settings Page

**Android Display**:
- Show only Google Play button\n- Hide Paystack button completely
- Button style: Material3 elevated button with indigo background
- Icon: Google Play logo
\n**Web/PWA Display**:
- Show only Paystack button
- Hide Google Play button completely
- Button style: Material3 elevated button with gold/orange gradient background
- Icon: Lightning bolt (Zap from lucide-react)
- Email input field with validation
- Email input button: '✏️ Enter Email for Receipt'
- Loading state during payment processing with Loader2icon
- Success message after payment verification
- Subtext: 'Secure payment via Paystack • Instant access • Lifetime premium'\n
**Premium Card Background**:
- Background image: /images/premium-bg.png (absolute path)
- Fallback: Gradient from #5E5CE6 to #FF9500
- Ensure image is visible after deployment
- Image should show sunrise/dawn theme matching app branding

## 3. Design Specifications

### 3.1 Color Scheme
- Primary color: #5E5CE6 (indigo)
- Accent color: #FF9500 (orange for streak indicators)
- Sleep tracker accent: #4A90E2 (calming blue)
- Premium badge color: #FFD700 (gold)
- Paystack button gradient: #FFD700 to #FF9500 (gold to orange)
- Viral share button: #8B5CF6 (purple) with hover state #7C3AED
- Success green: #34C759\n- Warning red: #FF3B30
- Clean, minimalist aesthetic with generous whitespace

### 3.2 Typography
- Headings: Google Fonts 'Poppins' (SemiBold 600)\n- Body text: Google Fonts 'Inter' (Regular 400)
- Stats numbers: 'Poppins' (Bold 700)
\n### 3.3 Visual Style
- Material3 (Material You) design language
- Smooth60fps animations throughout
- Full dark mode support with OLED-friendly blacks
- Modern, clean interface with focus on usability
- Premium features marked with subtle gold badge icon (crown symbol)
- Elegant upgrade prompts with clear value proposition
- Glassmorphism effects for premium UI elements
- Micro-interactions and haptic feedback for all user actions

### 3.4 Iconography
- Material Design Icons for system functions
- Custom emoji picker with high-quality emoji set
- Premium badge: Gold crown icon\n- Streak freeze: Snowflake icon
- Achievement badges: Custom illustrated icons
- Paystack button: Lightning bolt (Zap) icon from lucide-react
- Share button: Share icon from lucide-react
- lucide-react icons for web/PWA interface

## 4. Technical Requirements

### 4.1 Performance
- All animations must run at 60 fps
- App launch time under 2 seconds
- Smooth transitions and interactions
- Optimized for production use
- Efficient background processing for sleep tracking (minimal battery drain)
- Fast data synchronization for premium cloud backup (delta sync)
- Widget updates within 1 second of habit completion

### 4.2 Data Storage
\n#### 4.2.1 Local Storage (Hive)
- Fully offline functionality
- Local data persistence for all core features
- Encrypted local database for sensitive data
- Efficient indexing for fast queries
\n#### 4.2.2 Cloud Storage (Premium - Firebase Firestore)
- End-to-end encryption (AES-256)
- Real-time sync across devices
- Conflict resolution for simultaneous edits
- Automatic daily backups
- 30-day backup history
- **Premium Status Sync**: Store premium purchase info in Firestore for cross-device access

#### 4.2.3 Premium Status Storage
- localStorage key: 'rise_premium'\n- Value: JSON object with structure:
  ```json
  {
    'unlocked': true,
    'unlockedAt': '2025-12-01T20:06:32Z',
    'transactionId': 'RISE_1733079992_abc123xyz',
    'features': ['sleep_tracker', 'no_ads', 'advanced_analytics'],
    'platform': 'web',
    'userEmail': 'user@example.com'
  }
  ```
- Additional key: 'streak_ads_removed' = 'true'
- User email key: 'rise_user_email' (for payment receipts and restoration)
- Persists across sessions and offline usage
- Checked on app initialization
- Synced with cloud for cross-device access (premium users only)
- Event-driven updates via'premiumStatusChanged' event\n
### 4.3 Progressive Web App (PWA) Implementation

#### 4.3.1 Service Worker
- **Core Functionality**:
  - Implement Service Worker for offline functionality and caching
  - Cache static assets (HTML, CSS, JavaScript, fonts, icons)
  - Cache dynamic content (habit data, user preferences)
  - Background sync for data updates when connection is restored
  - Push notification support for habit reminders
- **Caching Strategy**:
  - Cache-first strategy for static assets
  - Network-first strategy for dynamic data with fallback to cache
  - Stale-while-revalidate for images and media files
- **Update Mechanism**:
  - Automatic Service Worker updates\n  - User notification when new version is available
  - Seamless update without disrupting user experience
\n#### 4.3.2 Web App Manifest
- **Manifest Configuration**:
  - App name: 'Streak – Daily Habit Tracker'
  - Short name: 'Streak'
  - Description: 'Build lasting habits with streak tracking'
  - Theme color: #5E5CE6 (indigo)
  - Background color: #FFFFFF (white)
  - Display mode: standalone
  - Start URL: /
  - Icons: 192x192px, 512x512px (adaptive)
  - Orientation: portrait
- **Install Prompt**:
  - Custom install banner with app benefits
  - Defer prompt until user engagement (after3 habit completions)
  - Track install acceptance rate
\n#### 4.3.3 Offline Capabilities
- **Offline-First Architecture**:
  - All core features work without internet connection
  - Queue actions when offline (habit completions, edits)\n  - Sync queued actions when connection restored
  - Visual indicator for offline status
- **Cached Resources**:
  - App shell (UI framework)
  - Habit data (last 90 days)
  - User preferences and settings
  - Alarm sounds (8 free + premium if subscribed)
  - Sleep tracking data
  - Achievement badges and stats

#### 4.3.4 Performance Optimization
- **Loading Performance**:
  - First Contentful Paint (FCP) < 1.5 seconds
  - Time to Interactive (TTI) < 3 seconds
  - Largest Contentful Paint (LCP) < 2.5 seconds
- **Runtime Performance**:
  - Smooth60fps animations
  - Lazy loading for images and heavy components
  - Code splitting for faster initial load
  - Minified and compressed assets
\n### 4.4 Payment Integration (Dual System)

#### 4.4.1 Google Play Billing (Android)
\n**Implementation Requirements:**
- Billing Library: Google Play Billing Library v6+ (native JavaScript integration via TWA)
- Product ID: premium_unlock
- Product Type: One-time in-app purchase (non-consumable)
- Price: $4.99 USD\n\n**Core Billing Logic:**
\n```javascript
// On App Initialization (Android only)
if (window.AndroidBilling) {
  window.AndroidBilling.getPurchases().then(purchases => {
    const hasPremium = purchases.some(p => p.productId === 'premium_unlock' && p.purchaseState === 1);
    if (hasPremium) {
      unlockPremiumFeatures();
      localStorage.setItem('rise_premium', JSON.stringify({\n        unlocked: true,\n        unlockedAt: new Date().toISOString(),\n        transactionId: 'google_play_purchase',
        features: ['sleep_tracker', 'no_ads', 'advanced_analytics'],\n        platform: 'android'\n      }));
    }
  }).catch(err => console.error('Billing check failed:', err));
}
\n// On 'Go Premium' Button Click (Android)
function handleGooglePlayPurchase() {
  if (window.AndroidBilling) {
    window.AndroidBilling.buy('premium_unlock').then(result => {
      if (result.purchaseState === 1) {
        unlockPremiumFeatures();
        localStorage.setItem('rise_premium', JSON.stringify({
          unlocked: true,
          unlockedAt: new Date().toISOString(),
          transactionId: result.purchaseToken,
          features: ['sleep_tracker', 'no_ads', 'advanced_analytics'],
          platform: 'android'
        }));
showSuccessMessage('Premium unlocked forever!');
      }
    }).catch(err => {
      console.error('Purchase failed:', err);
      showErrorMessage('Purchase failed. Please try again.');
    });
  }
}
\n// Restore Purchases (Android)
function restoreAndroidPurchases() {
  if (window.AndroidBilling) {
    window.AndroidBilling.getPurchases().then(purchases => {
      const hasPremium = purchases.some(p => p.productId === 'premium_unlock' && p.purchaseState === 1);
      if (hasPremium) {\n        unlockPremiumFeatures();
        localStorage.setItem('rise_premium', JSON.stringify({
          unlocked: true,
          unlockedAt: new Date().toISOString(),
          transactionId: 'google_play_restored',
          features: ['sleep_tracker', 'no_ads', 'advanced_analytics'],\n          platform: 'android'\n        }));
        showSuccessMessage('✅ Premium restored! All features unlocked.');
      } else {
        showErrorMessage('No premium purchase found. Please contact support if you believe this is an error.');
      }
    }).catch(err => {
      console.error('Restore failed:', err);\n      showErrorMessage('Restore failed. Please try again or contact support.');
    });\n  }
}
```

#### 4.4.2 Paystack Payment (Web/PWA)
\n**Implementation Requirements:**
- Package: react-paystack (install via npm install react-paystack)
- Amount: 800000 kobo (₦8,000 NGN)
- Live Public Key: pk_live_000ac40050b8af5c5ee87edb8976d88d6eb6e315\n- Default Email: customer@riseapp.com (user can modify)
- Reference Format: RISE_{timestamp}_{random}
- Currency: NGN\n- Payment Channels: Card, Bank, USSD, QR, Mobile Money\n
**File Structure:**
1. /components/PaystackButton.tsx - Reusable Paystack button component
2. /utils/paystack.ts - Utility functions for payment handling
3. /pages/api/verify-payment.ts - Backend API for payment verification
4. /pages/api/restore-premium.ts - Backend API for premium restoration
5. /components/Stats.tsx - Updated Stats component with Paystack integration
6. /components/Settings.tsx - Settings page with restore purchases button and viral share feature
7. .env.local - Environment variables configuration

**Core Payment Logic:**

```typescript\n// /components/PaystackButton.tsx\nimport React, { useState } from 'react';
import { usePaystackPayment } from 'react-paystack';
import { Button, ButtonProps } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface PaystackButtonProps extends ButtonProps {
  email: string;
  amount: number;
  publicKey: string;\n  text?: string;
  onSuccess: (reference: any) => void;
  onClose: () => void;
  metadata?: Record<string, any>;
}\n
export function PaystackButton({
  email,
  amount,
  publicKey,
  text = 'Make Payment',
  onSuccess,
  onClose,
  metadata = {},
  className,
  disabled,
  ...props
}: PaystackButtonProps) {\n  const [isLoading, setIsLoading] = useState(false);
\n  const config = {
    reference: `RISE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    email,\n    amount,
    publicKey,
    metadata: {
      custom_fields: [\n        {
          display_name: 'App Name',
          variable_name: 'app_name',
          value: 'Rise Habit Tracker'\n        },
        ...Object.entries(metadata).map(([key, value]) => ({
          display_name: key,
          variable_name: key,
          value
        }))
      ]
    },
    currency: 'NGN',
    channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money'],
  };

  const initializePayment = usePaystackPayment(config);
\n  const handlePayment = () => {
    setIsLoading(true);
    \n    initializePayment({
      onSuccess: (reference) => {\n        setIsLoading(false);
        onSuccess(reference);
      },
      onClose: () => {
        setIsLoading(false);
        onClose();
      },
    }).catch((error) => {
      setIsLoading(false);
      console.error('Paystack error:', error);
    });\n  };

  return (
    <Button\n      onClick={handlePayment}\n      disabled={disabled || isLoading || !email}\n      className={className}
      {...props}
    >
      {isLoading ? (
        <>\n          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          Processing...
        </>
      ) : (
        text
      )}
    </Button>
  );
}\n```

```typescript
// /utils/paystack.ts

export const createPaymentReference = (): string => {
  return `RISE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const verifyPayment = async (reference: string): Promise<boolean> => {
  try {
    const response = await fetch('/api/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',\n      },
      body: JSON.stringify({ reference }),
    });
\n    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data.status === 'success';
  } catch (error) {
    console.error('Payment verification failed:', error);
    return false;
  }
};

export const restorePremiumByEmail = async (email: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch('/api/restore-premium', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',\n      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }\n
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Premium restoration failed:', error);
    return { success: false, message: 'Restoration failed. Please try again or contact support.' };
  }
};
\nexport const unlockPremium = (transactionId?: string, userEmail?: string): void => {
  const premiumData = {
    unlocked: true,
    unlockedAt: new Date().toISOString(),
    transactionId: transactionId || createPaymentReference(),
    features: ['sleep_tracker', 'no_ads', 'advanced_analytics'],\n    platform: 'web',
    userEmail: userEmail || localStorage.getItem('rise_user_email') || 'customer@riseapp.com'
  };

  localStorage.setItem('rise_premium', JSON.stringify(premiumData));
  localStorage.setItem('streak_ads_removed', 'true');
  \n  window.dispatchEvent(new Event('premiumStatusChanged'));
};
\nexport const getPremiumStatus = (): boolean => {
  const premium = localStorage.getItem('rise_premium');
  if (!premium) return false;
  
  try {
    const data = JSON.parse(premium);
    return data.unlocked === true;
  } catch {\n    return false;
  }
};
```

```typescript
// /pages/api/verify-payment.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(\n  req: NextApiRequest,
  res: NextApiResponse\n) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { reference } = req.body;\n\n  if (!reference) {\n    return res.status(400).json({ message: 'Reference is required' });
  }

  try {\n    // In production, verify with Paystack
    const response = await fetch(\n      `https://api.paystack.co/transaction/verify/${reference}`,
      {\n        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();\n
    if (data.status && data.data.status === 'success') {
      return res.status(200).json({
        status: 'success',
        data: {
          amount: data.data.amount / 100,
          currency: data.data.currency,\n          customer: data.data.customer,
          paidAt: data.data.paid_at,
        },
      });
    } else {
      return res.status(400).json({
        status: 'failed',
        message: data.message || 'Payment verification failed',
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
}
```

```typescript
// /pages/api/restore-premium.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
\n  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }
\n  try {
    // Query Paystack for transactions by customer email
    const response = await fetch(
      `https://api.paystack.co/transaction?customer=${encodeURIComponent(email)}&status=success`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
\n    const data = await response.json();

    if (data.status && data.data && data.data.length > 0) {
      // Check if any transaction is for premium unlock (amount = 800000 kobo)
      const premiumPurchase = data.data.find(\n        (txn: any) => txn.amount === 800000 && txn.status === 'success'
      );
\n      if (premiumPurchase) {
        return res.status(200).json({
          success: true,
          message: 'Premium purchase found',
          data: {
            transactionId: premiumPurchase.reference,
            paidAt: premiumPurchase.paid_at,
            email: email,
          },
        });
      } else {
        return res.status(404).json({
          success: false,
          message: 'No premium purchase found for this email',
        });
      }
    } else {\n      return res.status(404).json({
        success: false,
        message: 'No transactions found for this email',
      });
    }
  } catch (error) {
    console.error('Premium restoration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });\n  }
}
```

```typescript
// Updated /components/Settings.tsx (key sections)
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';\nimport { Label } from '@/components/ui/label';
import { restorePremiumByEmail, unlockPremium, getPremiumStatus } from '@/utils/paystack';
import { toast } from 'sonner';\nimport { Loader2 } from 'lucide-react';\nimport QRCode from 'qrcode.react';

export function Settings() {
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreEmail, setRestoreEmail] = useState('');
  const isPremium = getPremiumStatus();

  const isTWAWithBilling = () => {
    return typeof window !== 'undefined' && !!(window as any).AndroidBilling;\n  };

  const handleRestoreAndroid = async () => {
    setIsRestoring(true);
    try {
      if ((window as any).AndroidBilling) {
        const purchases = await (window as any).AndroidBilling.getPurchases();
        const hasPremium = purchases.some(\n          (p: any) => p.productId === 'premium_unlock' && p.purchaseState === 1
        );
        if (hasPremium) {\n          unlockPremium('google_play_restored');
          toast.success('✅ Premium restored! All features unlocked.');
        } else {
          toast.error('No premium purchase found. Please contact support if you believe this is an error.');\n        }
      }\n    } catch (error) {
      console.error('Restore failed:', error);
      toast.error('Restore failed. Please try again or contact support.');
    } finally {
      setIsRestoring(false);
    }\n  };

  const handleRestoreWeb = async () => {
    if (!restoreEmail ||!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(restoreEmail)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setIsRestoring(true);
    try {
      const result = await restorePremiumByEmail(restoreEmail);
      if (result.success) {
        unlockPremium(result.data?.transactionId, restoreEmail);
        toast.success('✅ Premium restored! All features unlocked.');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Restore failed:', error);
      toast.error('Restore failed. Please try again or contact support.');
    } finally {
      setIsRestoring(false);
    }
  };

  // Viral Share Feature
  const shareLink = 'https://play.google.com/store/apps/details?id=com.soltide.rise'; // Switch to opt-in link in test:'https://play.google.com/apps/testing/com.soltide.rise'
  const shareMessage = 'Try Rise: Offline habit tracker with smart sleep features. One-time $4.99 premium unlock. Install free: ' + shareLink;

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Rise: Habit Tracker & Smart Sleep',
          text: shareMessage,
          url: shareLink,
        });
      } else {
        // Fallback for older browsers — copy to clipboard
        navigator.clipboard.writeText(shareMessage);
        alert('Link copied! Paste to share.');
      }
    } catch (err) {
      console.error('Share error:', err);
    }
  };
\n  return (
    <div className='settings-container'>
      {/* Other settings sections */}
\n      {/* Viral Share Feature */}
      <div className='share-section text-center p-6'>
        <button
          onClick={handleShare}\n          className='bg-purple-500 hover:bg-purple-600 text-white font-bold py-4 px-8 rounded-xl text-lg'\n        >
          Share Rise with Friends
        </button>
        <p className='text-sm text-gray-600 mt-4'>Spread better habits — QR code for easy install</p>
        <QRCode value={shareLink} size={128} className='mt-4 mx-auto' />
      </div>

      {!isPremium && (
        <div className='restore-section'>
          <h3>Restore Premium Purchase</h3>
          <p className='text-sm text-gray-600 mb-4'>
            Changed your device? Restore your premium access here.
          </p>
\n          {isTWAWithBilling() ? (
            <Button
              onClick={handleRestoreAndroid}
              disabled={isRestoring}
              className='w-full'
            >
              {isRestoring ? (
                <>\n                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Restoring...
                </>\n              ) : (
                'Restore Purchases (Google Play)'
              )}
            </Button>
          ) : (\n            <div className='space-y-4'>
              <div>\n                <Label htmlFor='restore-email'>Email used for payment</Label>
                <Input\n                  id='restore-email'
                  type='email'\n                  placeholder='your@email.com'
                  value={restoreEmail}
                  onChange={(e) => setRestoreEmail(e.target.value)}
                  disabled={isRestoring}
                />
              </div>
              <Button
                onClick={handleRestoreWeb}
                disabled={isRestoring}
                className='w-full'
              >\n                {isRestoring ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Restoring...
                  </>
                ) : (
                  'Restore Premium Access'
                )}
              </Button>
            </div>
          )}
\n          <p className='text-xs text-gray-500 mt-4'>
            Can't restore? Contact support at support@risehabittracker.com with your transaction reference.
          </p>
        </div>
      )}

      {isPremium && (
        <div className='premium-active'>
          <p>✅ Premium Active - All features unlocked!</p>
</div>
      )}
    </div>
  );\n}
```

####4.4.3 Platform Detection and Button Display

```typescript
const isTWAWithBilling = () => {
  return typeof window !== 'undefined' && !!(window as any).AndroidBilling;
};

// In Premium/Stats Page JSX:\n{!isTWAWithBilling() ? (
  // Web/PWA - Show Paystack\n  <div className='space-y-4'>
    {!userEmail.includes('@riseapp.com') && (\n      <Button onClick={handleEmailInput} variant='outline' className='w-full'>
        ✏️ Enter Email for Receipt
      </Button>
    )}
    <PaystackButton
      email={userEmail}
      amount={800000}
      publicKey={process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ||'pk_live_000ac40050b8af5c5ee87edb8976d88d6eb6e315'}
      text='Unlock Premium ₦8,000'
      onSuccess={handlePaystackSuccess}
      onClose={handlePaystackClose}
disabled={isProcessing}
      className='w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600text-white font-semibold py-6 text-lg'
    />
<p className='text-sm text-center text-gray-600'>
      Secure payment via Paystack • Instant access • Lifetime premium
    </p>
  </div>
) : (\n  // Android TWA - Show Google Play\n  <button onClick={handleGooglePlayPurchase}>
    Unlock Premium $4.99
  </button>
)}\n```

#### 4.4.4 Premium Feature Gating
- Check getPremiumStatus() function to unlock features
- Ad removal, sleep tracker, analytics, and all27 premium features gated behind this check
- Premium status persists offline via localStorage
- On app restart, verify with AndroidBilling.getPurchases() (Android) or getPremiumStatus() (Web)
- Event-driven updates via'premiumStatusChanged' event\n
#### 4.4.5 Restore Purchases
- **Android**: 'Restore Purchases' button calls AndroidBilling.getPurchases()
- **Web/PWA**: 'Restore Premium Access' button queries Paystack API by email
- Updates localStorage and unlocks features if purchase found
- Shows success/error messages accordingly
- Fallback: Contact support with transaction reference

#### 4.4.6 Premium Card Background Fix
- Background image path: /images/premium-bg.png (absolute path from public folder)
- Ensure image is included in build and deployed to Netlify
- CSS: background-image: url('/images/premium-bg.png')\n- Fallback gradient: linear-gradient(135deg, #5E5CE6 0%, #FF9500 100%)
- Image should display sunrise/dawn theme with warm colors

### 4.5 Viral Share Feature Implementation (NEW)

#### 4.5.1 Package Installation
- Install qrcode.react: `npm install qrcode.react`
- Install types: `npm install --save-dev @types/qrcode.react`
\n#### 4.5.2 ShareButton Component
- **Location**: /components/ShareButton.tsx (reusable component)
- **Import**: `import QRCode from 'qrcode.react';`
- **Functionality**:
  - 100% offline - no internet, no servers, no tracking
  - Uses native Web Share API (navigator.share)
  - Fallback to clipboard copy for older browsers
  - Generates QR code for Play Store link
  - Share content includes app title, message, and link
  - Link switches between production and test (opt-in) based on environment

#### 4.5.3 Integration Points
- **Settings Page**: Add ShareButton component in prominent position
- **Premium Screen**: Optional placement for viral growth
- **Button Style**: Purple background (#8B5CF6) with hover state (#7C3AED)
- **QR Code**: 128x128px, centered below button with4px margin-top

#### 4.5.4 Share Content
- **Title**: 'Rise: Habit Tracker & Smart Sleep'
- **Message**: 'Try Rise: Offline habit tracker with smart sleep features. One-time $4.99 premium unlock. Install free: [link]'
- **Link (Production)**: https://play.google.com/store/apps/details?id=com.soltide.rise
- **Link (Testing)**: https://play.google.com/apps/testing/com.soltide.rise
- **Global Appeal**: No region-specific messaging

#### 4.5.5 Error Handling
- Try-catch block for share API\n- Fallback to clipboard copy if navigator.share not available
- Alert message: 'Link copied! Paste to share.'\n- Console error logging for debugging

#### 4.5.6 Testing Requirements
- Test on Android TWA (share sheet should pop with message + link)
- Test on PWA browser (clipboard copy fallback)
- Test QR code scanning (should open Play Store listing)
- Verify offline functionality (no network calls)
- Test on multiple devices and browsers

### 4.6 Permissions\n\n#### 4.6.1 Required Permissions
- Notification permission for reminders and smart alarm
- Microphone access for sleep sound monitoring
- Accelerometer access for movement detection
\n#### 4.6.2 Optional Permissions (Premium)
- Location permission for location-based reminders (GPS)
- Camera permission for photo attachments
- Storage permission for data export and photo saving
- Contacts permission for social features (optional)

### 4.7 Compatibility
- Android platform (minimum Android 8.0 / API 26)
- Target Android 14 (API 34)
- Material3 design system compliance
- Wear OS 3.0+ for smartwatch companion app (premium)\n- Tablet optimization with responsive layouts
- **PWA Compatibility**:
  - Modern browsers: Chrome 90+, Edge 90+, Safari 14+, Firefox 88+
  - Mobile browsers: Chrome Mobile, Safari iOS14+\n  - Desktop platforms: Windows, macOS, Linux, Chrome OS

### 4.8 Audio Assets
- **Free Version**: 8 alarm sound files (MP3 format, 128kbps, 30-60 seconds each)
- **Premium Version**: 20+ additional alarm sounds\n- **Sleep Sounds**: 20+ ambient sound files (OGG format, loopable, 3-5 minutes each)
- Total audio assets size: ~50MB (optimized compression)
- All sounds stored in app's assets folder for offline access
- Service Worker caches alarm sounds for offline playback

### 4.9 Security and Privacy
- All user data stored locally by default
- Premium cloud backup uses AES-256 encryption
- No personal data shared with third parties
- GDPR and CCPA compliant
- Optional anonymous usage analytics (opt-in)
- Two-factor authentication for premium account (optional)
- Data deletion option (right to be forgotten)
- Secure HTTPS connection for all network requests
- Content Security Policy (CSP) headers
- **Payment Security**: \n  - Google Play Billing: Purchase verification handled by Google\n  - Paystack: PCI-DSS compliant payment processing
  - Backend payment verification via secure API route
  - No credit card data stored locally
  - Paystack secret key stored in environment variables only
  - Payment reference format includes timestamp and random string for uniqueness
  - Email stored securely for purchase restoration

### 4.10 Third-Party Integrations
- Google Play Billing Library v6+ for Android in-app purchases
- Paystack (react-paystack) for Web/PWA payments
- Firebase Firestore for cloud sync (premium)\n- Firebase Analytics for usage tracking (anonymous)
- Weather API for weather-based reminders (premium)
- Google Maps API for location-based reminders (premium)
- qrcode.react for QR code generation (viral share feature)

### 4.11 Testing Requirements
- Unit tests for all business logic (80%+ coverage)
- Widget tests for UI components\n- Integration tests for critical user flows
- Performance testing for 60fps animations
- Battery drain testing for sleep tracker
- Cross-device sync testing for premium features
- **Payment Testing**:
  - Google Play: Test with Google Play test accounts
  - Paystack: Test with Paystack test mode and test cards
  - Test payment verification API endpoint
  - Verify purchase restoration works across devices
  - Test offline premium feature access
  - Validate purchase state persistence
  - Test platform detection (Android vs Web)
  - Verify correct button display on each platform
  - Test email input validation and storage
  - Test loading states during payment processing
  - Verify success/error toast messages
  - Test payment reference generation uniqueness
  - Test payment channels (card, bank, USSD, QR, mobile money)
  - Test payment metadata transmission
  - Test premiumStatusChanged event dispatch
  - **Test device transfer scenarios**:\n    - Android to Android (same Google account)
    - Web to Web (same email)
    - Android to Web (not supported, separate purchases)
    - Test restore purchases button on new device
    - Test email-based restoration on Web/PWA
    - Verify premium status syncs via Firebase
    - Test offline restoration (localStorage persistence)
- **Viral Share Feature Testing**:
  - Test share button on Android TWA (native share sheet)
  - Test share button on Web/PWA (clipboard fallback)
  - Test QR code generation and scanning
  - Verify share content (title, message, link)
  - Test offline functionality (no network calls)
  - Test on multiple devices and browsers
  - Verify link switches between production and test
  - Test error handling and fallback mechanisms
- **PWA Testing**:
  - Service Worker functionality testing
  - Offline mode testing
  - Cache invalidation testing
  - Install prompt testing
  - Push notification testing
  - Lighthouse PWA audit (score 90+)
\n## 5. Deliverables

### 5.1 Code Deliverables
- Complete Flutter project that compiles and runs successfully on first attempt
- Ready-to-upload AAB (Android App Bundle) with Google Play Billing integration
- All27 premium features fully implemented with purchase gating
- Dual payment system:\n  - Google Play Billing v6+ integration (Android)\n  - Paystack integration via react-paystack (Web/PWA)
- Platform detection logic to show appropriate payment button
- **Device transfer and purchase restoration system**:\n  - Restore Purchases button in Settings\n  - Android restoration via Google Play Billing
  - Web/PWA restoration via Paystack API query by email
  - Firebase Firestore premium status sync
  - Support contact integration\n- **Viral Share Feature**:
  - ShareButton component with QR code\n  - Native share sheet integration
  - Clipboard fallback for older browsers
  - Offline-first implementation
  - Global appeal messaging
- Premium card background image fix(/images/premium-bg.png)
- Wear OS companion app APK (premium)
- **PWA Build**:
  - Service Worker implementation (sw.js)
  - Web App Manifest (manifest.json)
  - PWA-optimized build for web deployment
  - Offline fallback page
- **Paystack Integration Files**:
  - /components/PaystackButton.tsx (complete TypeScript implementation)
  - /utils/paystack.ts (utility functions with proper types)
  - /pages/api/verify-payment.ts (backend verification endpoint)
  - /pages/api/restore-premium.ts (backend restoration endpoint)
  - Updated /components/Stats.tsx (with email input and Paystack button)
  - Updated /components/Settings.tsx (with restore purchases functionality and viral share feature)
- **Viral Share Files**:
  - /components/ShareButton.tsx (reusable share component with QR code)
  - Updated /components/Settings.tsx (with integrated share feature)
- .env.local.example template
- Comprehensive code documentation
- README with setup instructions and dual payment configuration guide

### 5.2 Google Play Store Assets
- **App Title**: Streak – Daily Habit Tracker
- **Short Description** (80 chars): Build lasting habits with streak tracking, sleep monitor & smart reminders
- **Full Description** (4000 chars): Highlighting all27 premium features with compelling copy
- **Feature Bullet Points**:
  1. Track unlimited habits with beautiful streak visualization
  2. Smart sleep tracker with gentle wake-up alarm
  3. Advanced analytics and AI-powered success predictions
  4. 50+ habit templates for instant setup
  5. Social challenges and accountability partners
  6. Wear OS support for on-the-go tracking
  7. One-time $4.99 purchase unlocks all premium features forever
  8. PWA support for cross-platform access
  9. Seamless device transfer - restore premium on new devices
  10. Viral share feature - spread better habits with friends
- **Keywords**: habit tracker, streak, daily habits, productivity, sleep tracker, routine builder, goal tracker, PWA\n- **Screenshots**: 8 high-quality screenshots showcasing:\n  1. Home screen with habits (Screenshot_20251125-170711.png)
  2. Calendar heatmap (Screenshot_20251125-170720.png)
  3. Stats dashboard (Screenshot_20251125-170733.png)
  4. Sleep tracker (Screenshot_20251125-170740.png)
  5. Premium features overview\n  6. Widgets\n  7. Achievement badges
  8. Social features
- **Feature Graphic**: 1024x500px banner\n- **App Icon**: 512x512px adaptive icon (Rise - Habit tracker and smart sleep Icon.png)
- **Promotional Video**: 30-second video showcasing key features (optional)
- **In-App Products Configuration**:
  - Product ID: premium_unlock\n  - Product Type: One-time purchase (non-consumable)
  - Price: $4.99 USD
  - Title: Premium Unlock
  - Description: Unlock all premium features forever
\n### 5.3 Documentation
- User guide for premium features
- Privacy policy
- Terms of service
- Subscription terms and conditions (updated for one-time purchase)
- FAQdocument
- **Payment Documentation**:
  - Google Play Console setup guide for product ID 'premium_unlock'
  - Paystack account setup guide and API key configuration
  - Environment variables setup guide (.env.local)\n  - Testing guide for both payment systems
  - Payment verification API documentation
  - **Device transfer and restoration guide**:\n    - How to restore purchases on Android
    - How to restore premium on Web/PWA
    - Troubleshooting common restoration issues
    - Support contact information
  - Troubleshooting guide for purchase issues
  - Platform detection logic explanation
  - Email input and validation guide
  - Payment reference format documentation
  - Payment channels configuration guide
- **Viral Share Documentation**:
  - Implementation guide for ShareButton component
  - QR code generation documentation
  - Native share API usage guide
  - Fallback mechanism documentation
  - Testing guide for share feature
  - Link configuration (production vs test)
- **PWA Documentation**:
  - Service Worker implementation guide
  - Offline functionality documentation
  - Installation instructions for web users
  - Browser compatibility matrix
\n## 6. Success Criteria
- App compiles without errors on first build
- All 27 premium features fully functional and tested
- Dual payment system working seamlessly:\n  - **Android**: Google Play button appears, Paystack hidden\n  - **Web/PWA**: Paystack button appears, Google Play hidden
  - Purchase flow completes successfully on both platforms
  - Payment verification API works correctly
  - Premium features unlock immediately after payment
  - Purchase persists offline via localStorage
  - **Restore purchases works across devices**:\n    - Android: Restore via Google Play Billing
    - Web/PWA: Restore via email-based Paystack query
    - Firebase Firestore syncs premium status
    - Success/error messages display correctly
  - Email input validation works properly
  - Email storage and retrieval functions correctly
  - Loading states display correctly during payment
  - Success/error messages show appropriately
  - Payment reference generation is unique\n  - All payment channels (card, bank, USSD, QR, mobile money) work\n  - Payment metadata transmitted correctly
  - premiumStatusChanged event dispatches properly
- **Viral Share Feature Success**:
  - Share button displays correctly in Settings and Premium screens
  - Native share sheet opens on Android TWA with correct content
  - Clipboard fallback works on Web/PWA
  - QR code generates correctly and scans to Play Store
  - Share functionality works 100% offline
  - No network calls or tracking
  - Global messaging appeals to all users
  - Target: 20-30% organic download growth from word-of-mouth
- Premium card background image visible after deployment
- Smooth performance (consistent 60 fps)
- Production-ready quality code
- Competitive with top20Productivity apps on Google Play
- Sleep tracking accuracy >90%
- Smart alarm triggers within optimal wake window >95% of the time
- All alarm sounds accessible offline without internet connection
- Clear value differentiation between free and premium tiers
- Premium features provide significant value to justify pricing
- User retention rate >40% after 30 days (industry benchmark)
- Premium conversion rate target: 5-8% of active users
- **Device transfer success rate >95%**
- **Viral share adoption rate >15% of active users**
- **Netlify Deployment**: Existing build settings and online deployment remain unaffected
- **PWA Success Metrics**:
  - Lighthouse PWA score >90\n  - Service Worker successfully caches all critical assets
  - Offline functionality works for all core features
  - Install prompt acceptance rate >15%
  - PWA load time <2 seconds on3G connection
\n## 7. Competitive Advantages

This app is designed to outperform competitors through:\n\n1. **Comprehensive Feature Set**: 27 premium features vs. competitors' 10-15\n2. **Sleep Tracker Integration**: Unique combination of habit tracking + sleep monitoring
3. **Smart Alarm Technology**: Light-phase wake-up for better mornings
4. **AI-Powered Insights**: Predictive analytics and personalized recommendations
5. **Social Accountability**: Built-in community and challenge features
6. **Wear OS Support**: Seamless smartwatch integration
7. **Flexible Habit Scheduling**: Custom frequencies beyond daily habits
8. **Habit Dependencies**: Unique chain and prerequisite system
9. **Location & Weather Triggers**: Context-aware reminders
10. **Generous Free Tier**: 5 habits free (competitors offer 3) to drive adoption
11. **Affordable One-Time Purchase**: $4.99 lifetime unlock (no recurring fees)
12. **Dual Payment Options**: Google Play for Android, Paystack for Web/PWA (100% revenue retention)
13. **Privacy-First**: Local-first storage with optional cloud sync
14. **Beautiful Design**: Material3 with premium glassmorphism effects
15. **Performance**: Guaranteed 60 fps animations and fast load times
16. **Offline-First**: Full functionality without internet connection
17. **PWA Support**: Cross-platform access via web with native app experience
18. **Service Worker**: Enhanced offline capabilities and faster load times
19. **Secure Payment Processing**: Backend verification for Paystack payments
20. **Flexible Payment Email**: Users can specify email for payment receipts
21. **Multiple Payment Channels**: Card, Bank, USSD, QR, Mobile Money via Paystack
22. **Event-Driven Architecture**: Real-time premium status updates across components
23. **Seamless Device Transfer**: Easy premium restoration on new devices
24. **Cross-Platform Premium**: Premium status syncs via cloud (Firebase)
25. **Viral Share Feature**: Built-in word-of-mouth growth mechanism with QR code
26. **Offline Sharing**: Share functionality works without internet connection
27. **Global Appeal**: Universal messaging for worldwide user base

## 8. Post-Launch Roadmap (Future Enhancements)

- iOS version with iCloud sync
- Apple Watch companion app
- Web dashboard for desktop access
- Team/family plans for shared habits
- Integration with fitness trackers (Fitbit, Garmin)
- Siri/Google Assistant voice commands
- Habit coaching AI chatbot
- Gamification with XP and levels
- Marketplace for community-created habit templates
- API for third-party integrations
- Additional payment gateways (Stripe, Flutterwave) for global reach
- Enhanced device transfer with QR code pairing
- Referral program with rewards for viral sharing
- Social media integration for achievement sharing
- Advanced analytics dashboard for web users
\n---

## Reference Images
1. Rise - Habit tracker and smart sleep Icon.png: App icon reference for design inspiration
2. Screenshot_20251125-170711.png: Home screen with today's progress and habit list
3. Screenshot_20251125-170720.png: Calendar view with perfect days and completion statistics
4. Screenshot_20251125-170733.png: Statistics page showing current streak and total completions
5. Screenshot_20251125-170740.png: Advanced Analytics page with success rate and insights
6. Screenshot_20251130-011046.png: Netlify deployment dashboard showing production deploys
7. Screenshot_20251130-210721_1.png: Rise app site information on Netlify
8. Screenshot_20251130-223533.png: Paystack dashboard showing live API keys configuration
9. Screenshot_20251208-195202.png: Android app notification settings
10. Screenshot_20251208-195214.png: Android app info page showing storage and permissions
11. Screenshot_20251212-142304.png: Web app loading on appmedo.com
12. Screenshot_20251212-151514.png: Web app loading on medo.dev
13. Screenshot_20251212-152528.png: Premium feature unlock screen with upgrade button
14. Screenshot_20251212-205738.png: (New reference image)\n15. Screenshot_20251212-205756.png: (New reference image)\n16. Screenshot_20251219-000013.png: (New reference image)\n17. Screenshot_20251219-002237.png: (New reference image)\n18. Screenshot_20251219-055710.png: (New reference image)\n19. Screenshot_20251220-130946.png: (New reference image)\n20. Screenshot_20251220-133408.png: (New reference image)\n21. Screenshot_20251220-155301.png: (New reference image)\n22. Screenshot_20251220-155107.png: (New reference image)\n23. Screenshot_20251221-064419.png: (New reference image)\n\n---

## Implementation Checklist

**Viral Share Feature (NEW URGENT IMPLEMENTATION):**
1. ✅ Install qrcode.react package: `npm install qrcode.react`
2. ✅ Install types: `npm install --save-dev @types/qrcode.react`
3. ✅ Create /components/ShareButton.tsx component
4. ✅ Implement native share API (navigator.share)
5. ✅ Add clipboard fallback for older browsers
6. ✅ Generate QR code with qrcode.react\n7. ✅ Configure share link (production vs test)
8. ✅ Add share button to Settings page
9. ✅ Add share button to Premium screen (optional)
10. ✅ Style button with purple background (#8B5CF6)
11. ✅ Add hover state (#7C3AED)
12. ✅ Position QR code below button (128x128px, 4px margin-top)
13. ✅ Add subtext:'Spread better habits — QR code for easy install'
14. ✅ Test on Android TWA (native share sheet)
15. ✅ Test on Web/PWA (clipboard fallback)
16. ✅ Test QR code scanning\n17. ✅ Verify offline functionality (no network calls)
18. ✅ Test on multiple devices and browsers
19. ✅ Verify global appeal messaging
20. ✅ Commit message: 'Add viral share button + QR for downloads spike (offline-first)'
21. ✅ Push to main branch for Netlify auto-deploy
22. ✅ Confirm deployment works\n23. ✅ Regenerate .aab for Android after testing
\n**Device Transfer & Purchase Restoration (Existing Implementation):**
1. ✅ Add 'Restore Purchases' button to Settings page
2. ✅ Implement restoreAndroidPurchases() function for Android
3. ✅ Implement restorePremiumByEmail() function for Web/PWA
4. ✅ Create /pages/api/restore-premium.ts backend endpoint
5. ✅ Query Paystack API for transactions by customer email
6. ✅ Verify transaction amount matches premium unlock (800000 kobo)
7. ✅ Store user email in premium data structure
8. ✅ Update unlockPremium() to accept userEmail parameter
9. ✅ Add email input field in Settings for restoration
10. ✅ Add loading states during restoration process
11. ✅ Show success message: '✅ Premium restored! All features unlocked.'
12. ✅ Show error message if no purchase found
13. ✅ Add support contact information with pre-filled email template
14. ✅ Test Android restoration on new device
15. ✅ Test Web/PWA restoration with email\n16. ✅ Test Firebase Firestore premium status sync\n17. ✅ Test offline restoration (localStorage persistence)
18. ✅ Update documentation with restoration guide
19. ✅ Add FAQ section for device transfer
20. ✅ Commit message: 'Implement device transfer and purchase restoration system'
21. ✅ Push to main branch for Netlify auto-deploy
\n**Paystack Integration (Complete Implementation):**
1. ✅ Install react-paystack package: `npm install react-paystack`
2. ✅ Create /components/PaystackButton.tsx with complete TypeScript implementation
3. ✅ Create /utils/paystack.ts with utility functions
4. ✅ Create /pages/api/verify-payment.ts for backend verification
5. ✅ Update /components/Stats.tsx with Paystack integration
6. ✅ Create .env.local.example with configuration template
7. ✅ Add email input field with validation
8. ✅ Add email input button: '✏️ Enter Email for Receipt'
9. ✅ Implement loading states during payment processing with Loader2icon
10. ✅ Add payment verification logic with error handling
11. ✅ Store premium data in localStorage with JSON structure
12. ✅ Store user email in localStorage ('rise_user_email')
13. ✅ Show success toast after payment verification
14. ✅ Hide Paystack button on Android TWA
15. ✅ Show Paystack button only on Web/PWA
16. ✅ Use live public key\n17. ✅ Use default email: customer@riseapp.com
18. ✅ Generate unique payment reference
19. ✅ Configure payment channels\n20. ✅ Add payment metadata with app name\n21. ✅ Implement premiumStatusChanged event dispatch
22. ✅ Add event listener for premium status changes
23. ✅ Test on desktop browser
24. ✅ Test payment verification API
25. ✅ Verify premium features unlock after payment
26. ✅ Test offline premium access
27. ✅ Test email input and storage
28. ✅ Test loading states and toast notifications
\n**Google Play Billing Configuration (Unchanged):**
1. Create in-app product in Google Play Console
2. Add test accounts for billing testing
3. Test purchase flow with test account
4. Verify purchase restoration works\n5. Confirm premium features unlock correctly
6. Test offline premium access
\n**Environment Variables Setup:**
1. Copy .env.local.example to .env.local
2. Add Paystack secret key to .env.local
3. Verify NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY is set
4. Ensure .env.local is in .gitignore
5. Document environment setup in README

**Testing Checklist:**
1. Test Paystack payment flow on web browser
2. Test payment verification API endpoint
3. Verify premium unlock after successful payment
4. Test email input validation
5. Test email storage and retrieval
6. Test loading states during payment
7. Verify success/error toast messages
8. Test platform detection (Android vs Web)
9. Verify correct button display on each platform
10. Test offline premium feature access
11. Test payment with different email addresses
12. Verify premium data structure in localStorage
13. Test on multiple browsers (Chrome, Safari, Firefox)
14. Test payment reference uniqueness
15. Test all payment channels\n16. Test payment metadata transmission
17. Test premiumStatusChanged event\n18. Test premium status persistence across page reloads
19. Test device transfer scenarios
20. Test restore purchases on Android
21. Test email-based restoration on Web/PWA
22. Test Firebase premium status sync
23. Test offline restoration\n24. Test support contact integration
25. **Test viral share feature on Android TWA**
26. **Test viral share feature on Web/PWA**
27. **Test QR code generation and scanning**
28. **Test share content (title, message, link)**
29. **Test offline share functionality**
30. **Test clipboard fallback**
31. **Test on multiple devices and browsers**
32. **Verify global appeal messaging**
\n---

**This updated requirements document now includes a comprehensive viral share feature with QR code for organic download growth. The feature is designed to be 100% offline, uses native share APIs, and targets 20-30% organic download growth from word-of-mouth. Implementation is urgent for tester viral growth.**\n