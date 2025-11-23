# Streak – Daily Habit Tracker Requirements Document

## 1. Application Overview

### 1.1 Application Name
Streak – Daily Habit Tracker\n
### 1.2 Application Description
A production-ready Android habit tracking application built with Flutter and Material 3 design. The app helps users build and maintain daily habits through streak tracking, visual progress indicators, and motivational features. Now includes a sleep tracker with smart alarm functionality. Fully offline with local data storage.\n
### 1.3 Technical Stack
- Framework: Flutter
- Design System: Material 3 (Material You)
- Database: Hive (offline storage)
- Platform: Android\n- Fonts: Poppins (headings), Inter (body text)
- Sensors: Microphone, Accelerometer\n
## 2. Core Features
\n### 2.1 Onboarding Flow
- 3 full-screen slides explaining streak concept and app features
- Request notification permission during onboarding
- Beautiful, engaging visual presentation

### 2.2 Main Home Screen
- Large circular progress ring displaying today's completion percentage
- Scrollable list of today's habits with:
  - Emoji icon for each habit
  - Habit name\n  - Current streak count with 🔥 emoji
  - Large green checkbox for completion
- Floating action button (+) to add new habits

### 2.3 Add/Edit Habit Screen
- Text input field for habit name
- Emoji picker with at least 80 common emojis
- Color picker with 8 preset colors\n- Daily reminder time picker
- Weekday selector with toggle buttons (Monday–Sunday)
- Save button

### 2.4 Calendar Tab
- Monthly heatmap visualization (GitHub/Duolingo style)
- Darker green shades indicate higher completion rates
- Visual representation of habit consistency over time

### 2.5 Stats Tab\n- Current streak counter
- Longest streak record
- Total completions count
- Bar chart showing last 30 days activity\n- Perfect days counter
- Perfect weeks counter
- Small non-intrusive banner ad placeholder at bottom

### 2.6 Sleep Tracker Tab
- Start/Stop sleep tracking button
- Uses phone microphone and accelerometer to monitor sleep overnight
- Records sleep duration and quality metrics
- Simple graphs displaying:\n  - Sleep duration over time\n  - Sleep quality scores
  - Sleep phases (light/deep sleep patterns)
- Smart alarm feature:\n  - User sets desired wake-up time
  - Alarm rings within 30-minute window before set time
  - Triggers when sleep is in light phase for gentle awakening
- Sleep history log with date, duration, and quality ratings

### 2.7 Notification System
- Daily reminder notifications at user-chosen time
- Notification text: 'Don't break the chain! Complete your habits 🔥'

### 2.8 Home Screen Widgets
- 1×1 widget: displays today's completion percentage
- 4×2 widget: lists today's habits with interactive checkboxes

### 2.9 Celebration Features
- Confetti explosion animation when streak reaches 7, 30, or 100 days
- Haptic feedback for milestone achievements
- 50 built-in motivational quotes displayed randomly after completing a habit

### 2.10 Monetization\n- Banner ad placeholder at bottom of Stats screen only
- One-time 'Remove Ads' in-app purchase priced at $4.99
- Premium upgrade unlocks ad-free experience

## 3. Design Specifications

### 3.1 Color Scheme
- Primary color: #5E5CE6 (indigo)
- Accent color: #FF9500 (orange for streak indicators)
- Sleep tracker accent: #4A90E2 (calming blue for sleep-related UI)
- Clean, minimalist aesthetic with generous whitespace

### 3.2 Typography
- Headings: Google Fonts 'Poppins'
- Body text: Google Fonts 'Inter'\n
### 3.3 Visual Style
- Material 3 (Material You) design language
- Smooth 60 fps animations throughout
- Full dark mode support
- Modern, clean interface with focus on usability

## 4. Technical Requirements

### 4.1 Performance
- All animations must run at 60 fps\n- Smooth transitions and interactions\n- Optimized for production use
- Efficient background processing for sleep tracking

### 4.2 Data Storage
- Fully offline functionality using Hive database
- Local data persistence\n- No internet connection required
- Sleep data stored locally with privacy protection

### 4.3 Permissions
- Microphone access for sleep sound monitoring
- Accelerometer access for movement detection
- Notification permission for reminders and smart alarm

### 4.4 Compatibility\n- Android platform
- Material 3 design system compliance

## 5. Deliverables

### 5.1 Code Deliverables
- Complete Flutter project that compiles and runs successfully on first attempt
- Ready-to-upload APK file

### 5.2 Google Play Store Assets
- App title
- Short description
- Full description
- 7 feature bullet points
- Keyword-optimized listing text

## 6. Success Criteria
- App compiles without errors
- All core features fully implemented (including sleep tracker)
- Smooth performance (60 fps)
- Production-ready quality
- Competitive with top 50 Productivity apps on Google Play
- Sleep tracking accuracy and smart alarm functionality working reliably