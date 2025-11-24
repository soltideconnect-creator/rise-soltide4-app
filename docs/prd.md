# Streak – Daily Habit Tracker Requirements Document

## 1. Application Overview

### 1.1 Application Name
Streak – Daily Habit Tracker

### 1.2 Application Description
A production-ready Android habit tracking application built with Flutter and Material 3 design. The app helps users build and maintain daily habits through streak tracking, visual progress indicators, and motivational features. Now includes a sleep tracker with smart alarm functionality and comprehensive premium features. Fully offline with local data storage.

### 1.3 Technical Stack
- Framework: Flutter
- Design System: Material 3 (Material You)
- Database: Hive (offline storage)
- Platform: Android
- Fonts: Poppins (headings), Inter (body text)
- Sensors: Microphone, Accelerometer

## 2. Core Features
\n### 2.1 Onboarding Flow
- 3 full-screen slides explaining streak concept and app features
- Request notification permission during onboarding
- Beautiful, engaging visual presentation

### 2.2 Main Home Screen
- Large circular progress ring displaying today's completion percentage\n- Scrollable list of today's habits with:
  - Emoji icon for each habit
  - Habit name
  - Current streak count with 🔥 emoji
  - Large green checkbox for completion
- Floating action button (+) to add new habits
- Quick access to premium features indicator

### 2.3 Add/Edit Habit Screen
- Text input field for habit name
- Emoji picker with at least 80 common emojis
- Color picker with 8 preset colors
- Daily reminder time picker
- Weekday selector with toggle buttons (Monday–Sunday)
- Save button
- Premium: Custom habit categories and tags
- Premium: Habit difficulty levels (Easy/Medium/Hard)\n\n### 2.4 Calendar Tab
- Monthly heatmap visualization (GitHub/Duolingo style)
- Darker green shades indicate higher completion rates
- Visual representation of habit consistency over time\n- Premium: Year view with annual progress overview
- Premium: Export calendar data as PDF or image

### 2.5 Stats Tab
- Current streak counter
- Longest streak record
- Total completions count
- Bar chart showing last 30 days activity
- Perfect days counter
- Perfect weeks counter
- Small non-intrusive banner ad placeholder at bottom (removed for premium users)
- Premium: Advanced analytics with completion rate trends
- Premium: Habit success predictions based on historical data
- Premium: Comparison charts between multiple habits
- Premium: Monthly and yearly summary reports

### 2.6 Sleep Tracker Tab\n- Start/Stop sleep tracking button
- Uses phone microphone and accelerometer to monitor sleep overnight
- Records sleep duration and quality metrics\n- Simple graphs displaying:
  - Sleep duration over time
  - Sleep quality scores
  - Sleep phases (light/deep sleep patterns)
- Smart alarm feature:
  - User sets desired wake-up time
  - Alarm rings within 30-minute window before set time
  - Triggers when sleep is in light phase for gentle awakening
- Sleep history log with date, duration, and quality ratings\n- Premium: Sleep insights and recommendations
- Premium: Sleep goal setting and tracking
- Premium: Detailed sleep cycle analysis with REM detection
- Premium: Sleep sound library (white noise, rain, ocean waves, etc.)

### 2.7 Settings Page
- Smart alarm sound selection:
  - List of pre-installed alarm sounds (at least 8 options)\n  - Sound preview functionality (tap to play sample)
  - Selected sound indicator
  - All alarm sounds stored locally in app assets for offline use
- Premium: 20+ additional alarm sounds
- Premium: Custom alarm sound upload\n- Theme customization (Light/Dark/Auto)
- Premium: Custom theme colors and accent selection
- Data backup and restore options
- Premium: Automatic cloud backup (encrypted)
- Language selection\n- Other app settings and preferences

### 2.8 Notification System
- Daily reminder notifications at user-chosen time
- Notification text: 'Don't break the chain! Complete your habits 🔥'
- Premium: Multiple daily reminders per habit
- Premium: Smart reminder timing based on completion patterns
- Premium: Custom notification messages
- Premium: Motivational push notifications
\n### 2.9 Home Screen Widgets
- 1×1 widget: displays today's completion percentage
- 4×2 widget: lists today's habits with interactive checkboxes
- Premium: 2×2 widget with mini calendar view
- Premium: 4×4 widget with detailed stats and progress rings
- Premium: Customizable widget themes and layouts

### 2.10 Celebration Features
- Confetti explosion animation when streak reaches 7, 30, or 100 days
- Haptic feedback for milestone achievements
- 50 built-in motivational quotes displayed randomly after completing a habit\n- Premium: 200+ additional motivational quotes
- Premium: Custom milestone celebrations (user-defined streak goals)
- Premium: Achievement badges and trophies system
- Premium: Shareable achievement cards for social media
\n### 2.11 Premium Exclusive Features
\n#### 2.11.1 Unlimited Habits
- Free version: Maximum 5 active habits
- Premium: Unlimited habit creation\n\n#### 2.11.2Habit Templates
- Pre-built habit templates for common goals:\n  - Fitness routines (workout, yoga, running)
  - Health habits (drink water, meditation, vitamins)
  - Productivity (reading, journaling, learning)
  - Self-care (skincare, gratitude, stretching)
- One-tap habit creation from templates
\n#### 2.11.3 Habit Groups and Categories
- Organize habits into custom categories (Health, Work, Personal, etc.)
- Color-coded category system
- Filter and view habits by category
\n#### 2.11.4 Advanced Reminders
- Location-based reminders (trigger when arriving/leaving a place)
- Weather-based reminders (e.g., 'Go for a run' only on sunny days)
- Reminder snooze options with custom intervals

#### 2.11.5 Data Export and Insights
- Export all habit data to CSV or JSON format
- Detailed PDF reports with charts and analytics
- Weekly/Monthly email summaries
\n#### 2.11.6 Focus Mode
- Distraction-free interface highlighting only today's habits
- Pomodoro timer integration for time-based habits
- Do Not Disturb mode during focus sessions

#### 2.11.7 Habit Chains and Dependencies
- Link related habits together\n- Set habit prerequisites (e.g., 'Workout' must be completed before 'Protein shake')
- Visual chain connections on home screen

#### 2.11.8 Custom Habit Frequencies
- Free version: Daily habits only
- Premium: Weekly, bi-weekly, monthly, or custom interval habits
- Flexible scheduling (e.g., '3 times per week', 'Every other day')

#### 2.11.9 Notes and Journaling
- Add notes to each habit completion
- Daily journal entries\n- Photo attachments for habit progress (e.g., fitness transformation)
- Searchable note history

#### 2.11.10 Social Features
- Share habits with friends for accountability
- Join habit challenges with community
- Leaderboards for friendly competition
- Private habit sharing with selected contacts

#### 2.11.11 Apple Watch / Wear OS Support
- Quick habit completion from smartwatch
- Glanceable progress widgets
- Haptic reminders on wrist

#### 2.11.12 Habit Streaks Freeze
- Freeze your streak for up to 2 days per month
- Protect streaks during illness, travel, or emergencies
- Visual indicator for frozen days in calendar

### 2.12 Monetization
- Banner ad placeholder at bottom of Stats screen only (free version)
- Premium subscription options:\n  - Monthly: $4.99/month
  - Yearly: $29.99/year (save 50%)
  - Lifetime: $49.99 one-time payment
- 7-day free trial for premium features
- Premium unlocks:\n  - Ad-free experience
  - All exclusive features listed in section 2.11\n  - Priority customer support
  - Early access to new features

## 3. Design Specifications\n
### 3.1 Color Scheme
- Primary color: #5E5CE6 (indigo)
- Accent color: #FF9500 (orange for streak indicators)
- Sleep tracker accent: #4A90E2 (calming blue for sleep-related UI)
- Premium badge color: #FFD700 (gold)\n- Clean, minimalist aesthetic with generous whitespace

### 3.2 Typography
- Headings: Google Fonts 'Poppins'
- Body text: Google Fonts 'Inter'\n
### 3.3 Visual Style
- Material 3 (Material You) design language
- Smooth 60 fps animations throughout
- Full dark mode support
- Modern, clean interface with focus on usability
- Premium features marked with subtle gold badge icon
- Elegant upgrade prompts with clear value proposition

## 4. Technical Requirements

### 4.1 Performance
- All animations must run at 60 fps
- Smooth transitions and interactions
- Optimized for production use
- Efficient background processing for sleep tracking
- Fast data synchronization for premium cloud backup

### 4.2 Data Storage
- Fully offline functionality using Hive database
- Local data persistence
- No internet connection required for core features
- Sleep data stored locally with privacy protection
- All alarm sound files bundled in app assets for offline access
- Premium: Encrypted cloud backup with end-to-end encryption
- Premium: Cross-device synchronization

### 4.3 Permissions
- Microphone access for sleep sound monitoring
- Accelerometer access for movement detection
- Notification permission for reminders and smart alarm\n- Premium: Location permission for location-based reminders
- Premium: Camera permission for photo attachments
- Premium: Storage permission for data export

### 4.4 Compatibility
- Android platform (minimum Android 8.0)
- Material 3 design system compliance
- Premium: Wear OS companion app support

### 4.5 Audio Assets
- Minimum 8 alarm sound files in MP3 or OGG format (free version)
- Premium: 20+ additional alarm sounds
- All sounds stored in app's assets folder\n- Total audio assets size optimized for app bundle

### 4.6 Security and Privacy
- All user data stored locally by default
- Premium cloud backup uses AES-256 encryption
- No personal data shared with third parties
- GDPR and privacy law compliant
- Optional anonymous usage analytics (opt-in)

## 5. Deliverables

### 5.1 Code Deliverables
- Complete Flutter project that compiles and runs successfully on first attempt
- Ready-to-upload APK file\n- Premium features fully implemented with subscription logic
- In-app purchase integration (Google Play Billing)
\n### 5.2 Google Play Store Assets
- App title
- Short description
- Full description highlighting premium features
- 7 feature bullet points
- Keyword-optimized listing text
- Screenshots showcasing both free and premium features
- Promotional video (optional)

## 6. Success Criteria
- App compiles without errors
- All core features fully implemented (including sleep tracker and alarm sound selection)
- All premium features fully functional
- Smooth performance (60 fps)
- Production-ready quality
- Competitive with top 50 Productivity apps on Google Play
- Sleep tracking accuracy and smart alarm functionality working reliably\n- All alarm sounds accessible offline without internet connection
- Subscription and in-app purchase flow working seamlessly
- Clear value differentiation between free and premium tiers
- Premium features provide significant value to justify subscription cost

## 7. Premium Features Summary

### Currently Included Premium Features:
1. ✅ Unlimited habits (vs. 5 in free version)\n2. ✅ Advanced analytics and insights
3. ✅ Habit templates library
4. ✅ Custom categories and tags
5. ✅ Year view calendar
6. ✅ Data export (CSV, JSON, PDF)
7. ✅ Multiple reminders per habit
8. ✅ Custom notification messages
9. ✅ Additional alarm sounds (20+)
10. ✅ Custom theme colors\n11. ✅ Cloud backup and sync
12. ✅ Sleep insights and recommendations
13. ✅ Achievement badges system
14. ✅ Custom milestone celebrations
15. ✅ Advanced widgets (2×2, 4×4)
16. ✅ Location-based reminders
17. ✅ Weather-based reminders
18. ✅ Focus mode with Pomodoro timer
19. ✅ Habit chains and dependencies
20. ✅ Custom habit frequencies\n21. ✅ Notes and journaling
22. ✅ Photo attachments
23. ✅ Social features and challenges
24. ✅ Smartwatch support
25. ✅ Streak freeze feature
26. ✅ Ad-free experience
27. ✅ Priority support
\nAll premium features listed above are now fully integrated into the updated requirements document and ready for implementation.