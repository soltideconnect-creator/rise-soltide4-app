# Streak – Daily Habit Tracker Requirements Document

## 1. Application Overview

### 1.1 Application Name
Streak – Daily Habit Tracker

### 1.2 Application Description
A production-ready Android habit tracking application built with Flutter and Material 3 design. The app helps users build and maintain daily habits through streak tracking, visual progress indicators, and motivational features. Now includes a sleep tracker with smart alarm functionality. Fully offline with local data storage.

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

### 2.3 Add/Edit Habit Screen
- Text input field for habit name
- Emoji picker with at least 80 common emojis
- Color picker with 8 preset colors
- Daily reminder time picker
- Weekday selector with toggle buttons (Monday–Sunday)
- Save button

### 2.4 Calendar Tab
- Monthly heatmap visualization (GitHub/Duolingo style)
- Darker green shades indicate higher completion rates
- Visual representation of habit consistency over time

### 2.5 Stats Tab
- Current streak counter
- Longest streak record
- Total completions count
- Bar chart showing last 30 days activity
- Perfect days counter
- Perfect weeks counter
- Small non-intrusive banner ad placeholder at bottom
\n### 2.6 Sleep Tracker Tab
- Start/Stop sleep tracking button
- Uses phone microphone and accelerometer to monitor sleep overnight
- Records sleep duration and quality metrics
- Simple graphs displaying:
  - Sleep duration over time
  - Sleep quality scores
  - Sleep phases (light/deep sleep patterns)
- Smart alarm feature:
  - User sets desired wake-up time
  - Alarm rings within 30-minute window before set time
  - Triggers when sleep is in light phase for gentle awakening
- Sleep history log with date, duration, and quality ratings

### 2.7 Settings Page
- Smart alarm sound selection:\n  - List of pre-installed alarm sounds (at least 8 options)
  - Sound preview functionality (tap to play sample)
  - Selected sound indicator
  - All alarm sounds stored locally in app assets for offline use
- Other app settings and preferences

### 2.8 Notification System
- Daily reminder notifications at user-chosen time
- Notification text: 'Don't break the chain! Complete your habits 🔥'

### 2.9 Home Screen Widgets
- 1×1 widget: displays today's completion percentage
- 4×2 widget: lists today's habits with interactive checkboxes

### 2.10 Celebration Features
- Confetti explosion animation when streak reaches 7, 30, or 100 days\n- Haptic feedback for milestone achievements
- 50 built-in motivational quotes displayed randomly after completing a habit

### 2.11 Monetization
- Banner ad placeholder at bottom of Stats screen only
- One-time 'Remove Ads' in-app purchase priced at $4.99
- Premium upgrade unlocks ad-free experience

## 3. Design Specifications

### 3.1 Color Scheme
- Primary color: #5E5CE6 (indigo)
- Accent color: #FF9500 (orange for streak indicators)\n- Sleep tracker accent: #4A90E2 (calming blue for sleep-related UI)
- Clean, minimalist aesthetic with generous whitespace

### 3.2 Typography
- Headings: Google Fonts 'Poppins'
- Body text: Google Fonts 'Inter'

### 3.3 Visual Style
- Material 3 (Material You) design language
- Smooth 60 fps animations throughout
- Full dark mode support
- Modern, clean interface with focus on usability

## 4. Technical Requirements

### 4.1 Performance
- All animations must run at 60 fps
- Smooth transitions and interactions
- Optimized for production use
- Efficient background processing for sleep tracking

### 4.2 Data Storage
- Fully offline functionality using Hive database
- Local data persistence
- No internet connection required
- Sleep data stored locally with privacy protection
- All alarm sound files bundled in app assets for offline access

### 4.3 Permissions
- Microphone access for sleep sound monitoring\n- Accelerometer access for movement detection
- Notification permission for reminders and smart alarm
\n### 4.4 Compatibility
- Android platform
- Material 3 design system compliance

### 4.5 Audio Assets
- Minimum 8 alarm sound files in MP3 or OGG format
- All sounds stored in app's assets folder\n- Total audio assets size optimized for app bundle\n
## 5. Deliverables

### 5.1 Code Deliverables
- Complete Flutter project that compiles and runs successfully on first attempt
- Ready-to-upload APK file

### 5.2 Google Play Store Assets
- App title\n- Short description
- Full description
- 7 feature bullet points
- Keyword-optimized listing text

## 6. Success Criteria\n- App compiles without errors\n- All core features fully implemented (including sleep tracker and alarm sound selection)
- Smooth performance (60 fps)
- Production-ready quality
- Competitive with top 50 Productivity apps on Google Play
- Sleep tracking accuracy and smart alarm functionality working reliably
- All alarm sounds accessible offline without internet connection