# Streak – Daily Habit Tracker Requirements Document (Updated: Offline-First Google Play Billing)\n
## 1. Application Overview

### 1.1 Application Name
Streak – Daily Habit Tracker
\n### 1.2 Application Description
A production-ready Android habit tracking application built with Flutter and Material3 design. The app helps users build and maintain daily habits through streak tracking, visual progress indicators, and motivational features. Now includes a comprehensive sleep tracker with smart alarm functionality,27 premium features designed to outperform competitors, and a viral share feature for organic growth. **Fully offline-first with local data storage** and optional cloud sync. Enhanced with Progressive Web App (PWA) capabilities and **simplified offline-first payment system (Google Play Billing for Android + Paystack for Web/PWA)**. Includes robust device transfer and purchase restoration system for seamless premium access across devices. Integrated Debug Center for advanced troubleshooting and diagnostics.

### 1.3 Technical Stack
- Framework: Flutter (Android) + Next.js with TypeScript (Web/PWA)
- Design System: Material 3 (Material You)
- Database: Hive (offline storage)
- Cloud Sync: Firebase Firestore (premium)\n- Payment: \n  - **Google Play Billing via Digital Goods API + Payment Request API (Android TWA) -100% Offline-First, No Backend Verification**
  - Paystack via react-paystack (Web/PWA)\n- Platform: Android + Wear OS (premium) + PWA
- Fonts: Poppins (headings), Inter (body text)
- Sensors: Microphone, Accelerometer, GPS (premium)
- PWA: Service Worker, Web App Manifest, Cache API
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
\n#### 2.2.1 Free Version\n- Large circular progress ring displaying today's completion percentage
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
- **Habit Templates**: Browse and select from 50+ pre-built templates:\n  - Fitness: Workout, Yoga, Running, Cycling, Swimming\n  - Health: Drink Water, Meditation, Vitamins, Sleep8 Hours, Healthy Meal
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
  - **Automatic Cloud Backup**: Daily encrypted backup to Firebase\n  - **Cross-device Sync**: Real-time sync across multiple Android devices
  - **Export Options**:
    - Export all data to CSV format
    - Export all data to JSON format
    - Export habits with notes and photos as ZIP archive
  - **Import Options**: Import data from CSV/JSON\n
#### 2.7.4 Device Transfer & Purchase Restoration
- **Restore Purchases Button**: Prominently displayed in Settings page
- **Android Device Transfer (Offline-First)**:
  - 'Restore Purchases' button callsOfflineBilling.restore()
  - **First checks localStorage for existing premium status (works offline)**
  - If online, queries Digital Goods API via getDigitalGoodsService().listPurchases()
  - Verifies premium_unlock purchase exists in Google Play purchase history
  - Automatically unlocks premium features if purchase found
  - Stores premium status in localStorage for offline access
  - Shows success message: '✅ Premium restored! All features unlocked.'
  - Shows error message if no purchase found:'No premium purchase found. Please contact support if you believe this is an error.'
  - **Fallback**: If offline, uses cached localStorage premium status
- **Web/PWA Device Transfer**:
  - 'Restore Premium Access' button in Settings
  - User enters email used for Paystack payment
  - Backend API verifies payment history via Paystack API
  - If verified, unlocks premium and stores in localStorage
  - Shows success message: '✅ Premium restored! All features unlocked.'\n  - Fallback: User can contact support with transaction reference
- **Cloud Sync for Premium Users**:
  - Premium status synced via Firebase Firestore
  - On new device login, checks Firestore for premium status
  - Automatically unlocks if premium found in cloud\n- **Support Contact**:
  - 'Contact Support' button with pre-filled email template
  - Includes device info, purchase platform, and transaction ID
  - Support email: support@risehabittracker.com
\n#### 2.7.5 Viral Share Feature
- **Location in Settings Page**: \n  - **DEDICATED SECTION**: 'Share & Grow' section
  - **Placement**: Between 'Data Management' section and 'Device Transfer & Purchase Restoration' section
  - **Visual Hierarchy**: Full-width card with light purple background (#F3F4F6) and rounded corners
  - **Section Title**: 'Share & Grow' (bold, 18px, Poppins SemiBold)
  - **Section Subtitle**: 'Help friends build better habits' (14px, gray-600)
- **Button**: 'Share Rise with Friends' - prominent purple button
- **Functionality**:
  - 100% offline - no internet, no servers, no tracking required
  - On tap: Opens device native share sheet (SMS, email, Bluetooth, WhatsApp, etc.)
  - Share content includes:
    - App title: 'Rise: Habit Tracker & Smart Sleep'\n    - Message: 'Try Rise: Offline habit tracker with smart sleep features. One-time $4.99 premium unlock. Install free: [link]'
    - Link: https://play.google.com/store/apps/details?id=com.soltide.rise (production) or https://play.google.com/apps/testing/com.soltide.rise (closed test)
- **QR Code**:
  - Displays QR code below share button
  - QR code links to Play Store listing (opt-in link for testing, public link for production)
  - Size: 128x128px
  - Scannable for easy install
- **Fallback**: For older browsers without navigator.share, copies link to clipboard with alert message
- **Design**:
  - Purple button with white text: 'Share Rise with Friends'
  - Button style: Full-width, rounded-xl, py-4, px-8, bg-purple-500hover:bg-purple-600
  - Subtext: 'Spread better habits — QR code for easy install' (centered, text-sm, text-gray-600, mt-2)
  - QR code centered below subtext with4px margin-top
  - Card padding: p-6\n  - Card margin: mb-6(spacing from sections above and below)
- **Global Appeal**: No region-specific messaging, universally accessible
- **Goal**: Target 20-30% organic download growth from word-of-mouth

#### 2.7.6 Other Settings
- Language selection (English, Spanish, French, German, Portuguese, Chinese, Japanese)
- Notification settings\n- Privacy settings (anonymous analytics opt-in/out)
- Premium subscription management
- About and support\n
#### 2.7.7 Debug Center
- **Access**: Hidden menu accessible via Settings page (long-press on app version number or dedicated 'Debug' button for developers)
- **Purpose**: Advanced troubleshooting and diagnostics for developers and power users
- **Features**:\n  - **Environment Checks**: Display comprehensive system information
    - React loaded status
    - Promise and Async support
    - LocalStorage availability
    - Digital Goods API availability
    - Payment Request API availability
    - Android detection
    - TWA with Billing detection
    - User Agent string (first 100 characters)
    - Screen size\n    - Online status
    - Service Worker availability
  - **Storage Status**: Display current storage information
    - streak_ads_removed value
    - rise_premium value
    - Total localStorage keys
    - Storage size in bytes
  - **Error Logging**: Real-time error capture and display
    - Window error events
    - Unhandled promise rejections
    - Error message list with timestamps
  - **Quick Actions**:
    - **Clear App Data**: Remove all localStorage and sessionStorage data (with confirmation)
    - **Clear Cache Only**: Clear service worker cache and caches API\n    - **Test Payment API**: Test Digital Goods API availability
    - **Export Diagnostics**: Export full diagnostic report as JSON file
    - **Full App Reset**: Complete factory reset including IndexedDB and service worker unregistration
  - **Back to App Button**: Return to main app interface
  - **Version Display**: Show current app version from environment variables
- **Design**:
  - Clean card-based layout with shadcn/ui components
  - Color-coded status indicators (✓ for success, ✗ for failure)
  - Prominent action buttons with clear labels
  - Warning confirmations for destructive actions
  - Toast notifications for action feedback
- **Security**: Only accessible in development builds or with special developer flag enabled
\n**SETTINGS PAGE LAYOUT ORDER:**
1. **Alarm Sound Selection**
2. **Theme Customization**
3. **Data Management**
4. **Share & Grow** (viral share button + QR code)
5. **Device Transfer & Purchase Restoration**\n6. **About Rise**
7. **Debug Center** (hidden/developer-only access)
\n### 2.8 Notification System

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

#### 2.9.1 Free Version\n- **1×1 Widget**: Displays today's completion percentage in circular progress ring
- **4×2 Widget**: Lists today's habits (up to 5) with interactive checkboxes
\n#### 2.9.2 Premium Version
- **2×2 Widget**: Mini calendar view showing current week's heatmap
- **4×4 Widget**: Detailed stats dashboard with:\n  - Today's progress ring
  - Current streak counter
  - Top 3 habits with checkboxes
  - Mini bar chart of last 7 days
- **Customizable Widget Themes**: Match widget colors to app theme or choose custom colors
- **Widget Layouts**: Choose from 3 layout styles per widget size
\n### 2.10 Celebration Features

#### 2.10.1 Free Version
- Confetti explosion animation when streak reaches 7, 30, or 100 days
- Haptic feedback for milestone achievements
- 50built-in motivational quotes displayed randomly after completing a habit
\n#### 2.10.2 Premium Version
- **200+ Motivational Quotes**: Expanded library with category-specific quotes
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
\n### 2.11 Premium Exclusive Features

#### 2.11.1 Focus Mode
- **Distraction-Free Interface**:
  - Hides all UI elements except today's habits
  - Full-screen mode with minimal design
  - Swipe to complete habits
- **Pomodoro Timer Integration**:
  - Built-in25/5 minute Pomodoro timer
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

### 2.12 Monetization (Dual Payment System - Offline-First)

#### 2.12.1 Free Version Limitations
- Maximum 5 active habits
- Single daily reminder per habit
- Basic stats and 30-day chart
- 8 alarm sounds
- Banner ad at bottom of Stats screen
- No cloud backup

#### 2.12.2 Premium Pricing
- **Android (Google Play)**: $4.99 USD one-time purchase
- **Web/PWA (Paystack)**: ₦8,000 NGN one-time payment
\n#### 2.12.3 Payment Implementation (Offline-First)
\n**Android Users (Google Play Billing -100% Offline-First, No Backend):**
- Product ID: premium_unlock
- Product Type: One-time in-app purchase (non-consumable)
- Price: $4.99 USD
- Payment Method: **Digital Goods API + Payment Request API (no backend verification)**
- Button Text: 'Unlock Premium $4.99'\n- Visibility: Only shown when window.getDigitalGoodsService exists
\n**Core Offline-First Billing Logic:**
\n```typescript
// utils/billing-offline.ts
import { toast } from 'sonner';

export const PREMIUM_PRODUCT_ID = 'premium_unlock';

/**
 * 100% Offline-first Google Play Billing\n * No backend needed - verification handled by Google Play
 */
export class OfflineBilling {
  // Check if premium is unlocked (works offline)
  static isPremiumUnlocked(): boolean {
    const premiumData = localStorage.getItem('rise_premium');
    if (!premiumData) return false;
    
    try {
      const data = JSON.parse(premiumData);
      // Check if premium is valid (not expired)
      if (data.valid && data.platform === 'google-play') {
        return true;
      }
    } catch {
      return false;
    }
    return false;
  }

  // Purchase premium (needs internet for this step only)
  static async purchase(): Promise<boolean> {
    if (!window.getDigitalGoodsService) {
      throw new Error('Google Play Billing not available');
    }
\n    try {
      const service = await window.getDigitalGoodsService('https://play.google.com/billing');
      const details = await service.getDetails([PREMIUM_PRODUCT_ID]);
      
      const paymentRequest = new PaymentRequest([{
        supportedMethods:'https://play.google.com/billing',
        data: {sku: PREMIUM_PRODUCT_ID }
      }], {
        total: {
          label: 'Premium Unlock',
          amount: { currency: 'USD', value: '4.99' }
        }
      });

      const paymentResponse = await paymentRequest.show();
      await paymentResponse.complete('success');
      
      // Store premium status OFFLINE
      this.savePremium({\n        valid: true,
        purchaseToken: paymentResponse.details.token,
        purchasedAt: new Date().toISOString(),
        platform: 'google-play',
        features: ['sleep_tracker', 'no_ads', 'themes', 'analytics']
      });
      
      toast.success('Premium unlocked! 🎉');
      return true;
      
    } catch (error: any) {
      if (error.name === 'AbortError') {
        toast.info('Purchase cancelled');
      } else {
        toast.error('Purchase failed: ' + error.message);
      }
      return false;
    }
  }

  // Restore purchases (checks Google Play when online)
  static async restore(): Promise<boolean> {
    if (!window.getDigitalGoodsService) {
      return this.isPremiumUnlocked(); // Fallback to offline check
    }

    try {
      const service = await window.getDigitalGoodsService('https://play.google.com/billing');
      const purchases = await service.listPurchases();
      \n      const premiumPurchase = purchases.find(p => p.itemId === PREMIUM_PRODUCT_ID);
      \n      if (premiumPurchase) {
        this.savePremium({\n          valid: true,
          purchaseToken: premiumPurchase.purchaseToken,\n          restoredAt: new Date().toISOString(),
          platform: 'google-play',\n          features: ['sleep_tracker', 'no_ads', 'themes', 'analytics']\n        });
        
        toast.success('Purchase restored! ✨');
        return true;
      }
      
      return false;
      
    } catch (error) {
      // If offline, check local storage
      return this.isPremiumUnlocked();
    }
  }

  // Save premium status for offline use
  private static savePremium(data: any): void {
    localStorage.setItem('rise_premium', JSON.stringify(data));
    
    // Also set the simple flag for compatibility
    localStorage.setItem('streak_ads_removed', 'true');
    \n    // Notify app\n    window.dispatchEvent(new CustomEvent('premiumChanged'));
  }
}
```

**Stats Page Integration (Offline-First):**

```typescript
// Stats.tsx - Simplified offline version
import { OfflineBilling } from '@/utils/billing-offline';\n
export function Stats() {
  const [isPremium, setIsPremium] = useState(OfflineBilling.isPremiumUnlocked());
\n  const handlePurchase = async () => {
    const success = await OfflineBilling.purchase();
    if (success) {
      setIsPremium(true);
    }
  };

  const handleRestore = async () => {
    const restored = await OfflineBilling.restore();
    if (restored) {
      setIsPremium(true);
    } else {
      toast.info('No purchase found. Purchase premium first.');
    }
  };

  // Listen for premium changes (from other tabs/devices)
  useEffect(() => {
    const handlePremiumChange = () => {
      setIsPremium(OfflineBilling.isPremiumUnlocked());
    };\n    window.addEventListener('premiumChanged', handlePremiumChange);
    return () => window.removeEventListener('premiumChanged', handlePremiumChange);
  }, []);

  return (
    <div>\n      {/* Your stats */}
      {!isPremium && (
        <PremiumCard\n          onPurchase={handlePurchase}
          onRestore={handleRestore}
        />
      )}
    </div>
  );
}
```

**Web/PWA Users (Paystack Direct Payment - Unchanged):**
- Amount: 800000 kobo (₦8,000 NGN)
- Payment Gateway: Paystack via react-paystack package
- Live Public Key: pk_live_000ac40050b8af5c5ee87edb8976d88d6eb6e315
- Default Email: customer@riseapp.com (user can modify)
- Reference: RISE_{timestamp}_{random}\n- Button Text: 'Unlock Premium ₦8,000 (Instant • No Google Cut)'
- Visibility: Only shown when window.getDigitalGoodsService is NOT present
- Payment Channels: Card, Bank, USSD, QR, Mobile Money
- On Success:\n  - Verify payment via backend API(/api/verify-payment)
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
1. ✅ Unlimited habits\n2. ✅ Ad-free experience
3. ✅ Advanced analytics and AI predictions
4. ✅50+ habit templates
5. ✅ Custom categories and tags
6. ✅ Year view calendar + export
7. ✅ Data export (CSV, JSON, PDF)
8. ✅ Multiple reminders per habit
9. ✅ Custom notification messages
10. ✅20+ additional alarm sounds + custom upload
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
30. ✅ Debug Center for advanced troubleshooting

#### 2.12.5 Premium Unlock UI
\n**Location**: Stats Tab and Premium/Settings Page

**Android Display**:
- Show only Google Play button
- Hide Paystack button completely
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

##3. Design Specifications

### 3.1 Color Scheme
- Primary color: #5E5CE6 (indigo)
- Accent color: #FF9500 (orange for streak indicators)
- Sleep tracker accent: #4A90E2 (calming blue)
- Premium badge color: #FFD700 (gold)
- Paystack button gradient: #FFD700 to #FF9500 (gold to orange)
- Viral share button: #8B5CF6 (purple) with hover state #7C3AED
- Share section background: #F3F4F6 (light purple/gray)
- Success green: #34C759\n- Warning red: #FF3B30
- Debug Center: Neutral grays with accent colors for status indicators
- Clean, minimalist aesthetic with generous whitespace

### 3.2 Typography
- Headings: Google Fonts 'Poppins' (SemiBold 600)\n- Body text: Google Fonts 'Inter' (Regular 400)
- Stats numbers: 'Poppins' (Bold 700)
- Debug Center: Monospace font for technical data
\n### 3.3 Visual Style
- Material3 (Material You) design language
- Smooth60fps animations throughout
- Full dark mode support with OLED-friendly blacks
- Modern, clean interface with focus on usability
- Premium features marked with subtle gold badge icon (crown symbol)
- Elegant upgrade prompts with clear value proposition
- Glassmorphism effects for premium UI elements
- Micro-interactions and haptic feedback for all user actions
- Debug Center: Technical, developer-friendly interface with clear data presentation

### 3.4 Iconography
- Material Design Icons for system functions
- Custom emoji picker with high-quality emoji set
- Premium badge: Gold crown icon\n- Streak freeze: Snowflake icon\n- Achievement badges: Custom illustrated icons
- Paystack button: Lightning bolt (Zap) icon from lucide-react
- Share button: Share icon from lucide-react
- lucide-react icons for web/PWA interface
- Debug Center: System icons for diagnostics and actions

## 4. Technical Requirements

### 4.1 Performance
- All animations must run at 60 fps
- App launch time under 2 seconds
- Smooth transitions and interactions
- Optimized for production use
- Efficient background processing for sleep tracking (minimal battery drain)
- Fast data synchronization for premium cloud backup (delta sync)
- Widget updates within 1 second of habit completion
- Debug Center loads instantly without impacting app performance

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

#### 4.2.3 Premium Status Storage (Offline-First)
- localStorage key: 'rise_premium'\n- Value: JSON object with structure:
  ```json
  {
    'valid': true,
    'purchaseToken': 'google_play_token_or_paystack_reference',
    'purchasedAt': '2025-12-24T19:46:22Z',
    'platform': 'google-play',
    'features': ['sleep_tracker', 'no_ads', 'advanced_analytics']
  }
  ```
- Additional key: 'streak_ads_removed' = 'true'
- User email key: 'rise_user_email' (for Paystack payment receipts and restoration)
- Persists across sessions and offline usage
- Checked on app initialization
- Synced with cloud for cross-device access (premium users only)
- Event-driven updates via'premiumChanged' event
- **No backend verification required for Google Play purchases - Digital Goods API handles verification**

### 4.3 Progressive Web App (PWA) Implementation

#### 4.3.1 Service Worker
- **Core Functionality**:
  - Implement Service Worker for offline functionality and caching
  - Cache static assets (HTML, CSS, JavaScript, fonts, icons)
  - Cache dynamic content (habit data, user preferences)
  - Background sync for data updates when connection is restored
  - Push notification support for habit reminders
  - **Cache clearing support**: Listen for CLEAR_CACHE message from Debug Center
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
  - Defer prompt until user engagement (after 3 habit completions)
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
\n#### 4.3.4 Performance Optimization
- **Loading Performance**:
  - First Contentful Paint (FCP) < 1.5 seconds
  - Time to Interactive (TTI) < 3seconds
  - Largest Contentful Paint (LCP) < 2.5 seconds
- **Runtime Performance**:
  - Smooth60fps animations
  - Lazy loading for images and heavy components
  - Code splitting for faster initial load
  - Minified and compressed assets
\n### 4.4 Payment Integration (Offline-First Dual System)

#### 4.4.1 Google Play Billing (Android -100% Offline-First)
\n**Implementation Requirements:**
- Billing Library: **Digital Goods API + Payment Request API (no backend verification)**
- Product ID: premium_unlock\n- Product Type: One-time in-app purchase (non-consumable)
- Price: $4.99 USD
\n**Key Offline-First Principles:**
1. ✅ **No Internet Required After Purchase**: Premium status stored in localStorage, works offline forever
2. ✅ **No Backend Verification**: Digital Goods API handles all verification through Google Play\n3. ✅ **Instant Unlock**: Premium features unlock immediately after purchase without server calls
4. ✅ **Offline Restore**: Restore purchases checks localStorage first, only queries Google Play if online
5. ✅ **Cross-Device Sync**: Optional Firebase sync for premium status (requires internet once)

**Core Billing Logic (Simplified):**
\n```typescript
// utils/billing-offline.ts
export class OfflineBilling {
  // Check premium status (works offline)
  static isPremiumUnlocked(): boolean {
    const premiumData = localStorage.getItem('rise_premium');
    if (!premiumData) return false;
    try {
      const data = JSON.parse(premiumData);
      return data.valid && data.platform === 'google-play';\n    } catch {
      return false;
    }
  }

  // Purchase premium (needs internet for this step only)
  static async purchase(): Promise<boolean> {
    if (!window.getDigitalGoodsService) {
      throw new Error('Google Play Billing not available');
    }
    try {
      const service = await window.getDigitalGoodsService('https://play.google.com/billing');
      const paymentRequest = new PaymentRequest([{
        supportedMethods: 'https://play.google.com/billing',
        data: {sku: PREMIUM_PRODUCT_ID }
      }], {
        total: { label: 'Premium Unlock', amount: { currency: 'USD', value: '4.99' } }
      });
      const paymentResponse = await paymentRequest.show();
      await paymentResponse.complete('success');
      \n      // Store premium status OFFLINE (no backend call)
      this.savePremium({\n        valid: true,
        purchaseToken: paymentResponse.details.token,
        purchasedAt: new Date().toISOString(),
        platform: 'google-play',
        features: ['sleep_tracker', 'no_ads', 'themes', 'analytics']
      });
      
      toast.success('Premium unlocked! 🎉');
      return true;
    } catch (error: any) {
      toast.error('Purchase failed: ' + error.message);
      return false;
    }\n  }

  // Restore purchases (checks Google Play when online, falls back to localStorage)
  static async restore(): Promise<boolean> {
    // First check offline storage
    if (this.isPremiumUnlocked()) {
      toast.success('Premium already unlocked! ✨');
      return true;
    }
    
    // If online, query Google Play\n    if (!window.getDigitalGoodsService) {
      return false;
    }
    try {
      const service = await window.getDigitalGoodsService('https://play.google.com/billing');
      const purchases = await service.listPurchases();
      const premiumPurchase = purchases.find(p => p.itemId === PREMIUM_PRODUCT_ID);
      
      if (premiumPurchase) {
        this.savePremium({\n          valid: true,
          purchaseToken: premiumPurchase.purchaseToken,\n          restoredAt: new Date().toISOString(),
          platform: 'google-play',\n          features: ['sleep_tracker', 'no_ads', 'themes', 'analytics']\n        });
        toast.success('Purchase restored! ✨');
        return true;
      }
      return false;
    } catch (error) {
      // If offline, check local storage
      return this.isPremiumUnlocked();
    }
  }

  // Save premium status for offline use
  private static savePremium(data: any): void {
    localStorage.setItem('rise_premium', JSON.stringify(data));
    localStorage.setItem('streak_ads_removed', 'true');
window.dispatchEvent(new CustomEvent('premiumChanged'));
  }
}
```

#### 4.4.2 Paystack Payment (Web/PWA - Unchanged)

**Implementation Requirements:**
- Package: react-paystack (install via npm install react-paystack)
- Amount: 800000 kobo (₦8,000 NGN)
- Live Public Key: pk_live_000ac40050b8af5c5ee87edb8976d88d6eb6e315
- Default Email: customer@riseapp.com (user can modify)
- Reference Format: RISE_{timestamp}_{random}\n- Currency: NGN
- Payment Channels: Card, Bank, USSD, QR, Mobile Money

**File Structure:**
1. /components/PaystackButton.tsx - Reusable Paystack button component
2. /utils/paystack.ts - Utility functions for payment handling
3. /pages/api/verify-payment.ts - Backend API for payment verification
4. /pages/api/restore-premium.ts - Backend API for premium restoration
5. /components/Stats.tsx - Updated Stats component with Paystack integration
6. /components/Settings.tsx - Settings page with restore purchases button and viral share feature
7. /components/DebugPage.tsx - Debug Center component for diagnostics
8. /utils/billing-offline.ts - NEW: Offline-first Google Play Billing utility
9. .env.local - Environment variables configuration

**Core Payment Logic (Unchanged):**

```typescript
// /components/PaystackButton.tsx\nimport React, { useState } from 'react';
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
    \n    initializePayment({\n      onSuccess: (reference) => {
        setIsLoading(false);
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
\nexport const createPaymentReference = (): string => {
  return `RISE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const verifyPayment = async (reference: string): Promise<boolean> => {
  try {
    const response = await fetch('/api/verify-payment', {\n      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reference }),
    });\n\n    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data.status === 'success';
  } catch (error) {
    console.error('Payment verification failed:', error);
    return false;
  }
};\n
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
    features: ['sleep_tracker', 'no_ads', 'advanced_analytics'],
    platform: 'web',
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
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });\n  }

  const { reference } = req.body;
\n  if (!reference) {\n    return res.status(400).json({ message: 'Reference is required' });
  }

  try {\n    // In production, verify with Paystack
    const response = await fetch(\n      `https://api.paystack.co/transaction/verify/${reference}`,
      {\n        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },\n      }
    );\n
    const data = await response.json();\n
    if (data.status && data.data.status === 'success') {
      return res.status(200).json({
        status: 'success',
        data: {
          amount: data.data.amount / 100,
          currency: data.data.currency,
          customer: data.data.customer,\n          paidAt: data.data.paid_at,
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
  if (req.method !== 'POST') {\n    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email } = req.body;
\n  if (!email) {\n    return res.status(400).json({ message: 'Email is required' });
  }

  try {\n    // Query Paystack for transactions by customer email
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
          data: {\n            transactionId: premiumPurchase.reference,
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
    });
  }
}
```

#### 4.4.3 Platform Detection and Button Display

```typescript
const isTWAWithBilling = () => {
  return typeof window !== 'undefined' && !!(window as any).getDigitalGoodsService;
};\n
// In Premium/Stats Page JSX:\n{!isTWAWithBilling() ? (
  // Web/PWA - Show Paystack\n  <div className='space-y-4'>
    {!userEmail.includes('@riseapp.com') && (\n      <Button onClick={handleEmailInput} variant='outline' className='w-full'>
        ✏️ Enter Email for Receipt
      </Button>
    )}
    <PaystackButton\n      email={userEmail}
      amount={800000}
      publicKey={process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ||'pk_live_000ac40050b8af5c5ee87edb8976d88d6eb6e315'}
      text='Unlock Premium ₦8,000'
      onSuccess={handlePaystackSuccess}
      onClose={handlePaystackClose}
      disabled={isProcessing}
      className='w-full bg-gradient-to-r from-yellow-400 to-orange-500hover:from-yellow-500 hover:to-orange-600 text-white font-semibold py-6 text-lg'
    />
<p className='text-sm text-center text-gray-600'>
      Secure payment via Paystack • Instant access • Lifetime premium
    </p>
  </div>
) : (\n  // Android TWA - Show Google Play (Offline-First)
  <button onClick={handleGooglePlayPurchase}>
    Unlock Premium $4.99
  </button>
)}\n```

#### 4.4.4 Premium Feature Gating
- CheckOfflineBilling.isPremiumUnlocked() function to unlock features (Android)\n- Check getPremiumStatus() function for Web/PWA
- Ad removal, sleep tracker, analytics, and all27 premium features gated behind this check
- Premium status persists offline via localStorage
- On app restart, verify withOfflineBilling.restore() (Android) or getPremiumStatus() (Web)\n- Event-driven updates via'premiumChanged' event

#### 4.4.5 Restore Purchases (Offline-First)
- **Android**: 'Restore Purchases' button calls OfflineBilling.restore()
  - First checks localStorage for existing premium status (works offline)
  - If online, queries Digital Goods API via getDigitalGoodsService().listPurchases()
  - No backend verification required
- **Web/PWA**: 'Restore Premium Access' button queries Paystack API by email
- Updates localStorage and unlocks features if purchase found
- Shows success/error messages accordingly
- Fallback: Contact support with transaction reference

#### 4.4.6 Premium Card Background Fix
- Background image path: /images/premium-bg.png (absolute path from public folder)
- Ensure image is included in build and deployed to Netlify
- CSS: background-image: url('/images/premium-bg.png')\n- Fallback gradient: linear-gradient(135deg, #5E5CE6 0%, #FF9500 100%)
- Image should display sunrise/dawn theme with warm colors

### 4.5 Viral Share Feature Implementation

#### 4.5.1 Package Installation
- Install qrcode.react: `npm install qrcode.react`
- Install types: `npm install --save-dev @types/qrcode.react`
\n#### 4.5.2 ShareButton Component
- **Location**: Integrated directly into Settings page (not a separate component)
- **Import**: `import QRCode from 'qrcode.react';` and `import { Share } from 'lucide-react';`
- **Functionality**:
  - 100% offline - no internet, no servers, no tracking
  - Uses native Web Share API (navigator.share)\n  - Fallback to clipboard copy for older browsers
  - Generates QR code for Play Store link
  - Share content includes app title, message, and link
  - Link switches between production and test (opt-in) based on environment

#### 4.5.3 Integration Points
- **Settings Page**: \n  - **DEDICATED SECTION**: 'Share & Grow' section
  - **Placement**: Between 'Data Management' section and 'Device Transfer & Purchase Restoration' section (or'About Rise' if premium is active)
  - **Visual Design**: Full-width card with light purple background (#F3F4F6 or bg-purple-50), rounded-xl corners, p-6 padding, mb-6 margin-bottom
  - **Section Title**: 'Share & Grow' (text-lg font-semibold mb-2)
  - **Section Subtitle**: 'Help friends build better habits' (text-sm text-gray-600 mb-4)
- **Premium Screen**: Optional placement for viral growth (can be added later)
- **Button Style**: Full-width purple button (bg-purple-500 hover:bg-purple-600) with white text, rounded-xl, py-4px-8, text-lg, flex items-center justify-center gap-2
- **Button Icon**: Share icon from lucide-react (h-5 w-5)
- **QR Code**: 128x128px, centered below subtext with mt-4 margin-top, wrapped in flex justify-center container

#### 4.5.4 Share Content
- **Title**: 'Rise: Habit Tracker & Smart Sleep'\n- **Message**: 'Try Rise: Offline habit tracker with smart sleep features. One-time $4.99 premium unlock. Install free: [link]'
- **Link (Production)**: https://play.google.com/store/apps/details?id=com.soltide.rise
- **Link (Testing)**: https://play.google.com/apps/testing/com.soltide.rise
- **Global Appeal**: No region-specific messaging
\n#### 4.5.5 Error Handling
- Try-catch block for share API\n- Fallback to clipboard copy if navigator.share not available
- Alert message: 'Link copied! Paste to share.'
- Console error logging for debugging

#### 4.5.6 Testing Requirements
- Test on Android TWA (share sheet should pop with message + link)
- Test on PWA browser (clipboard copy fallback)
- Test QR code scanning (should open Play Store listing)
- Verify offline functionality (no network calls)
- Test on multiple devices and browsers

### 4.6 Debug Center Implementation

#### 4.6.1 Component Structure
- **File Location**: /components/DebugPage.tsx
- **Access Method**: Hidden menu in Settings (long-press on app version number or dedicated 'Debug' button for developers)
- **Component Type**: Full-page React component using shadcn/ui components
\n#### 4.6.2 Core Features
\n**Environment Checks:**
- React loaded status
- Promise support
- Async function support
- LocalStorage availability
- Digital Goods API availability (window.getDigitalGoodsService)
- Payment Request API availability (window.PaymentRequest)
- Android detection (isAndroid() utility)
- TWA with Billing detection (isTWAWithBilling() utility)
- User Agent string (first 100 characters)
- Screen size (window.innerWidth x window.innerHeight)
- Online status (navigator.onLine)
- Service Worker availability

**Storage Status:**
- streak_ads_removed value from localStorage
- rise_premium value from localStorage
- Total localStorage keys count
- Storage size in bytes (JSON.stringify(localStorage).length)

**Error Logging:**
- Window error event listener
- Unhandled promise rejection listener
- Error message array with timestamps
- Real-time error capture and display

**Quick Actions:**
1. **Clear App Data**: \n   - Clears all localStorage and sessionStorage
   - Confirmation dialog before execution
   - Toast notification on success
   - Auto-reload after 1 second

2. **Clear Cache Only**: 
   - Sends CLEAR_CACHE message to service worker
   - Clears caches API (caches.keys() and caches.delete())
   - Toast notification on success
   - Auto-reload after 1 second

3. **Test Payment API**: 
   - Tests Digital Goods API availability
   - Calls isDigitalGoodsAvailable() utility
   - Shows success/failure toast with result

4. **Export Diagnostics**: 
   - Exports full diagnostic report as JSON file
   - Includes timestamp, environment checks, storage info, errors, and platform data
   - Downloads as rise-diagnostic-{timestamp}.json
   - Toast notification on success

5. **Full App Reset**: 
   - Clears localStorage and sessionStorage
   - Deletes IndexedDB databases (rise-db, habit-db, sleep-db)
   - Unregisters all service workers
   - Confirmation dialog before execution
   - Toast notification on success
   - Redirects to home page after 1.5 seconds

#### 4.6.3 UI Components

**Layout:**
- Full-page container with padding
- Card-based sections for different data categories
- Responsive grid layout for action buttons
- Back to App button at bottom
- Version display from environment variables

**Cards:**
1. **Quick Actions Card**: Grid of action buttons with icons and labels
2. **Environment Checks Card**: Table of system checks with status indicators (✓/✗)
3. **Storage Status Card**: Table of storage information
4. **Recent Errors Card**: List of captured errors (only shown if errors exist)
5. **Footer Card**: Back button and version info

**Styling:**
- Uses shadcn/ui Card, CardHeader, CardTitle, CardContent components
- Button component with variants (default, destructive, outline)
- Color-coded status indicators (green for success, red for failure)
- Monospace font for technical data
- Responsive spacing and padding

#### 4.6.4 Utility Functions

**Platform Detection:**
```typescript
export const isAndroid = (): boolean => {
  return typeof window !== 'undefined' && /Android/i.test(navigator.userAgent);
};
\nexport const isTWAWithBilling = (): boolean => {
  return typeof window !== 'undefined' && !!(window as any).getDigitalGoodsService;
};\n\nexport const isDigitalGoodsAvailable = async (): Promise<boolean> => {
  try {
    if (typeof window.getDigitalGoodsService === 'function') {
      const service = await window.getDigitalGoodsService('https://play.google.com/billing');
      return !!service;
    }
    return false;
  } catch{
    return false;
  }
};
```\n
**File Location**: /utils/platform.ts (or integrate into /utils/billing-offline.ts)

#### 4.6.5 Security Considerations
- Debug Center only accessible in development builds or with special developer flag
- Production builds should hide or disable Debug Center access
- Sensitive data (API keys, tokens) should not be displayed\n- User confirmation required for destructive actions
- Error messages sanitized to avoid exposing sensitive information

#### 4.6.6 Testing Requirements
- Test all environment checks display correctly
- Test storage status updates in real-time
- Test error logging captures window errors and promise rejections
- Test Clear App Data removes all localStorage/sessionStorage
- Test Clear Cache Only clears service worker cache
- Test Payment API check returns correct status
- Test Export Diagnostics downloads valid JSON file
- Test Full App Reset clears all data and redirects\n- Test Back to App button navigates correctly
- Test version display shows correct app version
- Test on Android TWA and Web/PWA platforms
- Verify Debug Center does not impact app performance

### 4.7 Permissions\n
#### 4.7.1 Required Permissions
- Notification permission for reminders and smart alarm
- Microphone access for sleep sound monitoring
- Accelerometer access for movement detection
\n#### 4.7.2 Optional Permissions (Premium)\n- Location permission for location-based reminders (GPS)
- Camera permission for photo attachments
- Storage permission for data export and photo saving
- Contacts permission for social features (optional)

### 4.8 Compatibility
- Android platform (minimum Android 8.0 / API 26)
- Target Android 14 (API 34)
- Material3 design system compliance
- Wear OS 3.0+ for smartwatch companion app (premium)\n- Tablet optimization with responsive layouts
- **PWA Compatibility**:
  - Modern browsers: Chrome 90+, Edge 90+, Safari 14+, Firefox 88+
  - Mobile browsers: Chrome Mobile, Safari iOS14+\n  - Desktop platforms: Windows, macOS, Linux, Chrome OS

### 4.9 Audio Assets
- **Free Version**: 8 alarm sound files (MP3 format, 128kbps, 30-60 seconds each)
- **Premium Version**: 20+ additional alarm sounds\n- **Sleep Sounds**: 20+ ambient sound files (OGG format, loopable, 3-5 minutes each)
- Total audio assets size: ~50MB (optimized compression)
- All sounds stored in app's assets folder for offline access
- Service Worker caches alarm sounds for offline playback

### 4.10 Security and Privacy
- All user data stored locally by default
- Premium cloud backup uses AES-256 encryption
- No personal data shared with third parties
- GDPR and CCPA compliant
- Optional anonymous usage analytics (opt-in)
- Two-factor authentication for premium account (optional)
- Data deletion option (right to be forgotten)
- Secure HTTPS connection for all network requests
- Content Security Policy (CSP) headers
- **Payment Security**: \n  - **Google Play Billing**: Purchase verification handled by Google Play via Digital Goods API (no backend required)
  - **Paystack**: PCI-DSS compliant payment processing
  - Backend payment verification via secure API route (Paystack only)
  - No credit card data stored locally
  - Paystack secret key stored in environment variables only
  - Payment reference format includes timestamp and random string for uniqueness
  - Email stored securely for purchase restoration (Paystack only)
- **Debug Center Security**:
  - Only accessible in development builds or with developer flag
  - No sensitive data (API keys, tokens) displayed
  - User confirmation required for destructive actions
  - Error messages sanitized\n\n### 4.11 Third-Party Integrations
- **Google Play Billing via Digital Goods API + Payment Request API** for Android in-app purchases (no backend verification)\n- Paystack (react-paystack) for Web/PWA payments
- Firebase Firestore for cloud sync (premium)\n- Firebase Analytics for usage tracking (anonymous)
- Weather API for weather-based reminders (premium)
- Google Maps API for location-based reminders (premium)
- qrcode.react for QR code generation (viral share feature)

### 4.12 Testing Requirements
- Unit tests for all business logic (80%+ coverage)
- Widget tests for UI components\n- Integration tests for critical user flows
- Performance testing for 60fps animations
- Battery drain testing for sleep tracker
- Cross-device sync testing for premium features
- **Payment Testing**:
  - **Google Play (Offline-First)**:
    - Test with Google Play test accounts
    - Test purchase flow with Digital Goods API
    - Test Payment Request API integration
    - Verify premium status stored in localStorage
    - Test offline premium feature access
    - Test restore purchases with localStorage fallback
    - Test restore purchases with Google Play query (online)
    - Verify no backend calls during purchase or restore
    - Test platform detection (window.getDigitalGoodsService)
    - Test loading states during payment processing
    - Verify success/error toast messages
    - Test premiumChanged event dispatch
  - **Paystack (Web/PWA)**:
    - Test with Paystack test mode and test cards
    - Test payment verification API endpoint
    - Verify purchase restoration works across devices
    - Test offline premium feature access
    - Validate purchase state persistence
    - Test platform detection (no window.getDigitalGoodsService)
    - Verify correct button display on each platform
    - Test email input validation and storage
    - Test loading states during payment processing
    - Verify success/error toast messages\n    - Test payment reference generation uniqueness
    - Test payment channels (card, bank, USSD, QR, mobile money)
    - Test payment metadata transmission
    - Test premiumStatusChanged event dispatch
  - **Test device transfer scenarios**:
    - Android to Android (same Google account)
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
  - Verify share content (title, message, link)\n  - Test offline functionality (no network calls)
  - Test on multiple devices and browsers
  - Verify link switches between production and test\n  - Test error handling and fallback mechanisms
  - **Test share button location in Settings page**:\n    - Verify 'Share & Grow' section appears between 'Data Management' and 'Device Transfer & Purchase Restoration' (or 'About Rise' if premium)\n    - Verify section background color (light purple #F3F4F6)
    - Verify section title and subtitle display correctly
    - Verify button is full-width with purple background
    - Verify Share icon displays correctly
    - Verify QR code is centered below subtext
    - Verify spacing and padding match design specs
- **PWA Testing**:
  - Service Worker functionality testing
  - Offline mode testing
  - Cache invalidation testing
  - Install prompt testing
  - Push notification testing
  - Lighthouse PWA audit (score 90+)
- **Debug Center Testing**:
  - Test all environment checks display correctly
  - Test storage status updates in real-time
  - Test error logging captures window errors and promise rejections
  - Test Clear App Data removes all localStorage/sessionStorage
  - Test Clear Cache Only clears service worker cache
  - Test Payment API check returns correct status
  - Test Export Diagnostics downloads valid JSON file
  - Test Full App Reset clears all data and redirects
  - Test Back to App button navigates correctly
  - Test version display shows correct app version
  - Test on Android TWA and Web/PWA platforms
  - Verify Debug Center does not impact app performance
  - Test access control (development builds only)
  - Test confirmation dialogs for destructive actions
  - Test toast notifications for all actions
  - Test error message sanitization
\n## 5. Deliverables

### 5.1 Code Deliverables
- Complete Flutter project that compiles and runs successfully on first attempt
- Ready-to-upload AAB (Android App Bundle) with Google Play Billing integration
- All27 premium features fully implemented with purchase gating
- **Offline-first dual payment system**:
  - **Google Play Billing via Digital Goods API + Payment Request API (Android TWA) -100% Offline-First, No Backend Verification**
  - Paystack integration via react-paystack (Web/PWA)\n- Platform detection logic to show appropriate payment button
- **Device transfer and purchase restoration system**:
  - Restore Purchases button in Settings\n  - Android restoration via Digital Goods API (offline-first with localStorage fallback)
  - Web/PWA restoration via Paystack API query by email
  - Firebase Firestore premium status sync
  - Support contact integration\n- **Viral Share Feature**:
  - Share & Grow section in Settings page (between Data Management and Device Transfer sections)
  - Share button with QR code
  - Native share sheet integration
  - Clipboard fallback for older browsers
  - Offline-first implementation
  - Global appeal messaging
- **Debug Center Component**:
  - /components/DebugPage.tsx with full implementation
  - Environment checks display\n  - Storage status monitoring
  - Error logging system
  - Quick action buttons (Clear Data, Clear Cache, Test Payment, Export Diagnostics, Full Reset)
  - Platform detection utilities
  - Access control for development builds
- Premium card background image fix(/images/premium-bg.png)
- Wear OS companion app APK (premium)\n- **PWA Build**:
  - Service Worker implementation (sw.js) with cache clearing support
  - Web App Manifest (manifest.json)\n  - PWA-optimized build for web deployment
  - Offline fallback page
- **Offline-First Billing Files**:
  - /utils/billing-offline.ts (NEW: Offline-first Google Play Billing utility)
  - Updated /components/Stats.tsx (with offline-first billing integration)
  - Updated /components/Settings.tsx (with restore purchases functionality and viral share feature)
- **Paystack Integration Files** (Unchanged):
  - /components/PaystackButton.tsx (complete TypeScript implementation)
  - /utils/paystack.ts (utility functions with proper types)
  - /pages/api/verify-payment.ts (backend verification endpoint)
  - /pages/api/restore-premium.ts (backend restoration endpoint)
- .env.local.example template\n- Comprehensive code documentation
- README with setup instructions and offline-first payment configuration guide
\n### 5.2 Google Play Store Assets
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
  8. **100% offline-first - works without internet after purchase**
  9. PWA support for cross-platform access
  10. Seamless device transfer - restore premium on new devices
  11. Viral share feature - spread better habits with friends
  12. Debug Center for advanced troubleshooting (developer feature)
- **Keywords**: habit tracker, streak, daily habits, productivity, sleep tracker, routine builder, goal tracker, PWA, offline-first\n- **Screenshots**: 8 high-quality screenshots showcasing:\n  1. Home screen with habits (Screenshot_20251125-170711.png)
  2. Calendar heatmap (Screenshot_20251125-170720.png)
  3. Stats dashboard (Screenshot_20251125-170733.png)
  4. Sleep tracker (Screenshot_20251125-170740.png)
  5. Premium features overview\n  6. Widgets\n  7. Achievement badges
  8. Social features
- **Feature Graphic**: 1024x500px banner\n- **App Icon**: 512x512px adaptive icon (Rise - Habit tracker and smart sleep Icon.png)
- **Promotional Video**: 30-second video showcasing key features (optional)
- **In-App Products Configuration**:
  - Product ID: premium_unlock
  - Product Type: One-time purchase (non-consumable)
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
  - **Google Play Console setup guide for product ID 'premium_unlock'**
  - **Offline-first billing implementation guide**:\n    - Digital Goods API integration
    - Payment Request API integration
    - localStorage premium status structure
    - No backend verification required
    - Offline restore purchases flow
  - Paystack account setup guide and API key configuration
  - Environment variables setup guide (.env.local)\n  - Testing guide for both payment systems
  - Payment verification API documentation (Paystack only)
  - **Device transfer and restoration guide**:
    - How to restore purchases on Android (offline-first)
    - How to restore premium on Web/PWA\n    - Troubleshooting common restoration issues
    - Support contact information
  - Troubleshooting guide for purchase issues
  - Platform detection logic explanation
  - Email input and validation guide (Paystack only)
  - Payment reference format documentation (Paystack only)
  - Payment channels configuration guide (Paystack only)
- **Viral Share Documentation**:
  - Implementation guide for Share & Grow section in Settings
  - QR code generation documentation
  - Native share API usage guide
  - Fallback mechanism documentation
  - Testing guide for share feature
  - Link configuration (production vs test)
  - **Settings page layout documentation**:\n    - Section order and placement
    - Visual design specifications
    - Spacing and padding guidelines
- **Debug Center Documentation**:
  - Access instructions for developers
  - Feature overview and usage guide
  - Environment checks explanation
  - Storage status monitoring guide
  - Error logging system documentation
  - Quick actions usage guide
  - Export diagnostics format specification
  - Security considerations and access control\n  - Testing guide for Debug Center
  - Troubleshooting common issues
- **PWA Documentation**:
  - Service Worker implementation guide
  - Offline functionality documentation
  - Installation instructions for web users
  - Browser compatibility matrix
\n## 6. Success Criteria
- App compiles without errors on first build
- All 27 premium features fully functional and tested
- **Offline-first payment system working seamlessly**:\n  - **Android**: Google Play button appears, Paystack hidden\n  - **Web/PWA**: Paystack button appears, Google Play hidden
  - **Android purchase flow**:
    - Digital Goods API + Payment Request API integration works
    - Purchase completes successfully without backend calls
    - Premium status stored in localStorage immediately
    - Premium features unlock instantly after payment
    - Purchase persists offline via localStorage
  - **Android restore flow**:
    - Restore checks localStorage first (works offline)
    - If online, queries Digital Goods API via listPurchases()
    - No backend verification required
    - Success/error messages display correctly
  - **Web/PWA payment flow** (unchanged):
    - Paystack payment completes successfully
    - Backend verification works correctly
    - Premium features unlock immediately after payment
    - Purchase persists offline via localStorage
  - **Web/PWA restore flow** (unchanged):
    - Email-based restoration via Paystack API query
    - Firebase Firestore syncs premium status
    - Success/error messages display correctly
  - Email input validation works properly (Paystack only)
  - Email storage and retrieval functions correctly (Paystack only)
  - Loading states display correctly during payment\n  - Success/error messages show appropriately
  - Payment reference generation is unique (Paystack only)
  - All payment channels (card, bank, USSD, QR, mobile money) work (Paystack only)
  - Payment metadata transmitted correctly (Paystack only)
  - premiumChanged event dispatches properly\n- **Viral Share Feature Success**:
  - Share & Grow section displays correctly in Settings page
  - Section appears between Data Management and Device Transfer sections
  - Section background color is light purple (#F3F4F6)
  - Section title and subtitle display correctly
  - Share button is full-width with purple background and Share icon
  - Native share sheet opens on Android TWA with correct content
  - Clipboard fallback works on Web/PWA
  - QR code generates correctly and scans to Play Store
  - QR code is centered below subtext with proper spacing
  - Share functionality works 100% offline\n  - No network calls or tracking\n  - Global messaging appeals to all users
  - Target: 20-30% organic download growth from word-of-mouth
- **Debug Center Success**:
  - Debug Center accessible via Settings page (hidden/developer-only)
  - All environment checks display correctly
  - Storage status updates in real-time
  - Error logging captures window errors and promise rejections
  - Clear App Data removes all localStorage/sessionStorage
  - Clear Cache Only clears service worker cache
  - Payment API check returns correct status
  - Export Diagnostics downloads valid JSON file
  - Full App Reset clears all data and redirects
  - Back to App button navigates correctly
  - Version display shows correct app version
  - Debug Center does not impact app performance
  - Access control works (development builds only)
  - Confirmation dialogs appear for destructive actions
  - Toast notifications work for all actions
  - Error messages sanitized properly
- Premium card background image visible after deployment
- Smooth performance (consistent 60 fps)\n- Production-ready quality code
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
- **Debug Center usage by developers >80% for troubleshooting**
- **Netlify Deployment**: Existing build settings and online deployment remain unaffected
- **PWA Success Metrics**:
  - Lighthouse PWA score >90\n  - Service Worker successfully caches all critical assets
  - Offline functionality works for all core features
  - Install prompt acceptance rate >15%
  - PWA load time <2 seconds on3G connection
\n## 7. Competitive Advantages

This app is designed to outperform competitors through:
\n1. **Comprehensive Feature Set**: 27 premium features vs. competitors' 10-15\n2. **Sleep Tracker Integration**: Unique combination of habit tracking + sleep monitoring
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
20. **Flexible Payment Email**: Users can specify email for payment receipts (Paystack)\n21. **Multiple Payment Channels**: Card, Bank, USSD, QR, Mobile Money via Paystack
22. **Event-Driven Architecture**: Real-time premium status updates across components
23. **Seamless Device Transfer**: Easy premium restoration on new devices
24. **Cross-Platform Premium**: Premium status syncs via cloud (Firebase)
25. **Viral Share Feature**: Built-in word-of-mouth growth mechanism with QR code
26. **Offline Sharing**: Share functionality works without internet connection
27. **Global Appeal**: Universal messaging for worldwide user base
28. **Debug Center**: Advanced troubleshooting tool for developers and power users
29. **Comprehensive Diagnostics**: Export full diagnostic reports for support
30. **Developer-Friendly**: Built-in tools for debugging and testing
31. **100% Offline-First Google Play Billing**: No backend verification required, works offline after purchase
32. **Instant Premium Unlock**: Premium features unlock immediately without server calls
33. **Offline Restore Purchases**: Restore purchases works offline via localStorage fallback
\n## 8. Post-Launch Roadmap (Future Enhancements)

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
- Public Debug Center for user-facing diagnostics
- Remote diagnostics for customer support
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
14. Screenshot_20251212-205738.png: (Reference image)\n15. Screenshot_20251212-205756.png: (Reference image)
16. Screenshot_20251219-000013.png: (Reference image)
17. Screenshot_20251219-002237.png: (Reference image)
18. Screenshot_20251219-055710.png: (Reference image)
19. Screenshot_20251220-130946.png: (Reference image)
20. Screenshot_20251220-133408.png: (Reference image)
21. Screenshot_20251220-155301.png: (Reference image)
22. Screenshot_20251220-155107.png: (Reference image)
23. Screenshot_20251221-064419.png: (Reference image)
24. Screenshot_20251221-094801.png: Settings page showing Data Management section (used to clarify share button location)
25. Screenshot_20251223-095139.png: Billing Test Page showing environment information (Android detected, TWA Billing not available)
26. Screenshot_20251223-112503.png: Premium upgrade screen with Google Play purchase button and restore purchase option
27. Screenshot_20251223-132748.png: Premium upgrade screen showing'Opening Google Play purchase...' loading state
28. Screenshot_20251223-132755.png: Premium upgrade screen showing 'Purchase failed: Payment permissions policy not granted' error
29. Screenshot_20251224-064824.png: Error screen showing 'Something went wrong' with error message'SO(...).then is not a function'
30. Screenshot_20251224-163238.png: Rise Debug Center showing Quick Actions, Environment Checks, and Storage Status
\n---

## Implementation Checklist

**Offline-First Google Play Billing Implementation (NEW - URGENT):**
1. ✅ Create /utils/billing-offline.ts utility file
2. ✅ Implement OfflineBilling class with static methods
3. ✅ Implement isPremiumUnlocked() method (checks localStorage)
4. ✅ Implement purchase() method (Digital Goods API + Payment Request API)\n5. ✅ Implement restore() method (localStorage fallback + Digital Goods API query)
6. ✅ Implement savePremium() method (stores in localStorage)
7. ✅ Remove all backend verification code from googlePlayBilling.ts
8. ✅ Update Stats.tsx to use OfflineBilling class
9. ✅ Update Settings.tsx to use OfflineBilling.restore()
10. ✅ Update platform detection to check window.getDigitalGoodsService
11. ✅ Test purchase flow with Digital Goods API
12. ✅ Test Payment Request API integration
13. ✅ Test premium status stored in localStorage
14. ✅ Test offline premium feature access
15. ✅ Test restore purchases with localStorage fallback
16. ✅ Test restore purchases with Google Play query (online)
17. ✅ Verify no backend calls during purchase or restore
18. ✅ Test loading states during payment processing
19. ✅ Verify success/error toast messages
20. ✅ Test premiumChanged event dispatch
21. ✅ Update documentation with offline-first billing guide
22. ✅ Remove backend verification endpoints (if any)
23. ✅ Update README with offline-first payment configuration
24. ✅ Commit message: 'Implement offline-first Google Play Billing with Digital Goods API (no backend verification)'
25. ✅ Push to main branch for Netlify auto-deploy
26. ✅ Confirm deployment works\n27. ✅ Regenerate .aab for Android after testing
\n**Debug Center Implementation (Existing):**
1. ✅ Create /components/DebugPage.tsx component
2. ✅ Import required dependencies (React, useState, useEffect, Button, Card, toast)
3. ✅ Import platform detection utilities (isTWAWithBilling, isAndroid, isDigitalGoodsAvailable)
4. ✅ Implement environment checks state and logic
5. ✅ Implement storage status state and logic
6. ✅ Implement error logging state and event listeners
7. ✅ Implement handleClearData function with confirmation\n8. ✅ Implement handleClearCache function with service worker message
9. ✅ Implement handleTestPurchase function with Digital Goods API check
10. ✅ Implement handleExportDiagnostics function with JSON download
11. ✅ Implement handleResetApp function with full reset logic
12. ✅ Create Quick Actions card with action buttons
13. ✅ Create Environment Checks card with status table
14. ✅ Create Storage Status card with storage info table
15. ✅ Create Recent Errors card (conditional rendering)
16. ✅ Create Footer card with Back button and version display
17. ✅ Style components with shadcn/ui and Tailwind CSS
18. ✅ Add color-coded status indicators (✓/✗)\n19. ✅ Add toast notifications for all actions
20. ✅ Add confirmation dialogs for destructive actions
21. ✅ Test environment checks display
22. ✅ Test storage status updates
23. ✅ Test error logging captures errors
24. ✅ Test Clear App Data functionality
25. ✅ Test Clear Cache Only functionality
26. ✅ Test Payment API check\n27. ✅ Test Export Diagnostics download
28. ✅ Test Full App Reset functionality
29. ✅ Test Back to App navigation
30. ✅ Test version display
31. ✅ Test on Android TWA
32. ✅ Test on Web/PWA
33. ✅ Verify no performance impact
34. ✅ Add access control for development builds
35. ✅ Update Settings page with Debug Center access (long-press on version or dedicated button)
36. ✅ Update documentation with Debug Center guide
37. ✅ Commit message: 'Add Debug Center component for advanced troubleshooting and diagnostics'
38. ✅ Push to main branch for Netlify auto-deploy
39. ✅ Confirm deployment works
40. ✅ Regenerate .aab for Android after testing

**Viral Share Feature (Existing Implementation):**
1. ✅ Install qrcode.react package: `npm install qrcode.react`
2. ✅ Install types: `npm install --save-dev @types/qrcode.react`
3. ✅ Import QRCode and Share icon in Settings.tsx
4. ✅ Create'Share & Grow' section in Settings page
5. ✅ Place section between 'Data Management' and 'Device Transfer & Purchase Restoration' (or'About Rise' if premium)
6. ✅ Add section background color (bg-purple-50 or #F3F4F6)
7. ✅ Add section title: 'Share & Grow' (text-lg font-semibold mb-2)
8. ✅ Add section subtitle: 'Help friends build better habits' (text-sm text-gray-600 mb-4)
9. ✅ Implement native share API (navigator.share)
10. ✅ Add clipboard fallback for older browsers
11. ✅ Generate QR code with qrcode.react
12. ✅ Configure share link (production vs test)
13. ✅ Style button: full-width, bg-purple-500hover:bg-purple-600, text-white, font-bold, py-4 px-8, rounded-xl, text-lg, flex items-center justify-center gap-2
14. ✅ Add Share icon (h-5 w-5) to button
15. ✅ Add button text: 'Share Rise with Friends'
16. ✅ Add subtext below button: 'Spread better habits — QR code for easy install' (text-sm text-center text-gray-600 mt-4)
17. ✅ Position QR code below subtext (flex justify-center mt-4, size 128x128px)
18. ✅ Add section padding (p-6) and margin (mb-6)
19. ✅ Add rounded corners (rounded-xl)\n20. ✅ Test on Android TWA (native share sheet)
21. ✅ Test on Web/PWA (clipboard fallback)
22. ✅ Test QR code scanning\n23. ✅ Verify offline functionality (no network calls)
24. ✅ Test on multiple devices and browsers
25. ✅ Verify section placement in Settings page
26. ✅ Verify visual design matches specifications
27. ✅ Verify global appeal messaging
\n**Device Transfer & Purchase Restoration (Updated for Offline-First):**
1. ✅ Add 'Restore Purchases' button to Settings page
2. ✅ Update restoreAndroidPurchases() to use OfflineBilling.restore()
3. ✅ Implement localStorage fallback for offline restore
4. ✅ Implement restorePremiumByEmail() function for Web/PWA (unchanged)
5. ✅ Create /pages/api/restore-premium.ts backend endpoint (unchanged)
6. ✅ Query Paystack API for transactions by customer email (unchanged)
7. ✅ Verify transaction amount matches premium unlock (800000 kobo) (unchanged)
8. ✅ Store user email in premium data structure (unchanged)
9. ✅ Update unlockPremium() to accept userEmail parameter (unchanged)
10. ✅ Add email input field in Settings for restoration (unchanged)
11. ✅ Add loading states during restoration process\n12. ✅ Show success message: '✅ Premium restored! All features unlocked.'
13. ✅ Show error message if no purchase found
14. ✅ Add support contact information with pre-filled email template
15. ✅ Test Android restoration on new device (offline-first)
16. ✅ Test Web/PWA restoration with email (unchanged)
17. ✅ Test Firebase Firestore premium status sync
18. ✅ Test offline restoration (localStorage persistence)
19. ✅ Update documentation with offline-first restoration guide
20. ✅ Add FAQ section for device transfer\n\n**Paystack Integration (Complete Implementation - Unchanged):**
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
\n**Google Play Billing Configuration (Updated for Offline-First):**
1. Create in-app product in Google Play Console
2. Add test accounts for billing testing
3. Test purchase flow with Digital Goods API
4. Test Payment Request API integration
5. Verify premium status stored in localStorage
6. Test offline premium feature access\n7. Test restore purchases with localStorage fallback
8. Test restore purchases with Google Play query (online)\n9. Verify no backend calls during purchase or restore
10. Confirm premium features unlock correctly
\n**Environment Variables Setup:**
1. Copy .env.local.example to .env.local\n2. Add Paystack secret key to .env.local
3. Verify NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY is set
4. Ensure .env.local is in .gitignore
5. Document environment setup in README

**Testing Checklist:**
1. Test offline-first Google Play purchase flow
2. Test Digital Goods API integration
3. Test Payment Request API integration
4. Verify premium status stored in localStorage
5. Test offline premium feature access\n6. Test restore purchases with localStorage fallback
7. Test restore purchases with Google Play query (online)\n8. Verify no backend calls during purchase or restore
9. Test platform detection (window.getDigitalGoodsService)
10. Verify correct button display on each platform
11. Test loading states during payment\n12. Verify success/error toast messages
13. Test premiumChanged event\n14. Test premium status persistence across page reloads
15. Test Paystack payment flow on web browser (unchanged)
16. Test payment verification API endpoint (unchanged)
17. Verify premium unlock after successful payment (unchanged)
18. Test email input validation (unchanged)
19. Test email storage and retrieval (unchanged)
20. Test on multiple browsers (Chrome, Safari, Firefox)
21. Test payment reference uniqueness (Paystack)\n22. Test all payment channels (Paystack)\n23. Test payment metadata transmission (Paystack)
24. Test premiumStatusChanged event (Paystack)
25. Test device transfer scenarios\n26. Test restore purchases on Android (offline-first)
27. Test email-based restoration on Web/PWA (unchanged)
28. Test Firebase premium status sync\n29. Test offline restoration\n30. Test support contact integration
31. Test viral share feature on Android TWA
32. Test viral share feature on Web/PWA\n33. Test QR code generation and scanning
34. Test share content (title, message, link)
35. Test offline share functionality
36. Test clipboard fallback\n37. Test on multiple devices and browsers
38. Verify global appeal messaging
39. Test Share & Grow section placement in Settings page
40. Verify section appears between Data Management and Device Transfer sections
41. Verify section background color (light purple #F3F4F6)
42. Verify section title and subtitle display correctly
43. Verify share button is full-width with purple background
44. Verify Share icon displays correctly
45. Verify QR code is centered below subtext with proper spacing
46. Verify section padding and margin match design specs
47. **Test Debug Center on Android TWA**
48. **Test Debug Center on Web/PWA**
49. **Test all environment checks display correctly**
50. **Test storage status updates in real-time**
51. **Test error logging captures errors**
52. **Test Clear App Data functionality**
53. **Test Clear Cache Only functionality**
54. **Test Payment API check**
55. **Test Export Diagnostics download**
56. **Test Full App Reset functionality**
57. **Test Back to App navigation**
58. **Test version display**
59. **Verify Debug Center does not impact app performance**
60. **Test access control (development builds only)**
61. **Test confirmation dialogs for destructive actions**
62. **Test toast notifications for all actions**
63. **Test error message sanitization**
\n---

**This updated requirements document now implements a100% offline-first Google Play Billing system using Digital Goods API and Payment Request API, eliminating the need for backend verification. Premium status is stored in localStorage for offline access, and restore purchases checks localStorage first before querying Google Play (when online). This simplifies the architecture, improves offline functionality, and ensures instant premium unlock without server dependencies.**