# Streak – Daily Habit Tracker

A beautiful, modern web-based habit tracking application built with React, TypeScript, and shadcn/ui. Track your daily habits, build streaks, and visualize your progress with stunning charts and heatmaps.

## 🎯 Features

### Core Functionality
- ✅ **Habit Management** – Create, edit, and delete habits with ease
- 🔥 **Streak Tracking** – Build momentum with automatic streak counting
- 📊 **Progress Visualization** – Circular progress ring showing daily completion
- 📅 **Calendar Heatmap** – GitHub-style visualization of your consistency
- 📈 **Statistics Dashboard** – Comprehensive metrics and 30-day activity charts
- 🎨 **Customization** – 80+ emojis, 8 color themes, flexible scheduling
- 🔔 **Reminders** – Daily notifications for each habit
- 💪 **Motivation** – 50 inspirational quotes on habit completion
- 🎉 **Celebrations** – Confetti animations for milestone achievements (7, 30, 100 days)
- 🌙 **Dark Mode** – Full theme support with system preference detection
- 💾 **Offline First** – All data stored locally using localStorage

### User Experience
- 📱 **Mobile-First Design** – Optimized for mobile with desktop support
- ⚡ **Smooth Animations** – 60fps performance throughout
- 🎨 **Material 3 Design** – Modern, clean aesthetic
- 🚀 **No Account Required** – Start tracking immediately
- 🔒 **Privacy-Focused** – Data never leaves your device

## 🛠️ Technology Stack

- **Framework**: React 18 with TypeScript
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS with custom design tokens
- **Charts**: Recharts for data visualization
- **Date Handling**: date-fns
- **Fonts**: Google Fonts (Poppins, Inter)
- **Build Tool**: Vite
- **Storage**: localStorage API

## 📁 Project Structure

```
src/
├── components/
│   ├── BottomNav.tsx          # Bottom navigation bar
│   ├── CircularProgress.tsx   # Progress ring component
│   ├── ColorPicker.tsx        # Color selection component
│   ├── Confetti.tsx           # Celebration animation
│   ├── EmojiPicker.tsx        # Emoji selection component
│   ├── HabitItem.tsx          # Individual habit card
│   ├── Onboarding.tsx         # First-time user flow
│   ├── WeekdaySelector.tsx    # Day selection component
│   └── ui/                    # shadcn/ui components
├── pages/
│   ├── Home.tsx               # Main dashboard
│   ├── Calendar.tsx           # Heatmap visualization
│   ├── Stats.tsx              # Statistics dashboard
│   └── HabitForm.tsx          # Add/Edit habit form
├── services/
│   └── habitStorage.ts        # localStorage service layer
├── types/
│   └── habit.ts               # TypeScript interfaces
├── App.tsx                    # Main application component
└── index.css                  # Global styles and design tokens
```

## 🎨 Design System

### Color Palette
- **Primary**: #5E5CE6 (Indigo) – Main brand color
- **Accent**: #FF9500 (Orange) – Streak indicators
- **Success**: #34C759 (Green) – Completions and achievements
- **Destructive**: #FF3B30 (Red) – Delete actions

### Typography
- **Headings**: Poppins (400, 500, 600, 700)
- **Body**: Inter (300, 400, 500, 600)

### Design Tokens
All colors, spacing, and animations are defined in `src/index.css` using CSS custom properties for easy theming and consistency.

## 🚀 Getting Started

The application is ready to use! Simply open it in your web browser and start tracking your habits.

### For Developers
```bash
# Install dependencies
pnpm install

# Run linting
pnpm lint
```

## 📱 How to Use

### First Time Setup
1. **Onboarding**: Complete the 3-slide introduction
2. **Notifications**: Grant permission for daily reminders (optional)
3. **Add Habits**: Tap the + button to create your first habit

### Creating a Habit
1. Enter a habit name (e.g., "Morning Exercise")
2. Choose an emoji icon from 80+ options
3. Select a color theme
4. Set a daily reminder time
5. Pick which days to track (e.g., weekdays only)
6. Save your habit

### Tracking Progress
1. **Complete Habits**: Tap the checkbox when you complete a habit
2. **View Progress**: See your daily completion percentage in the circular ring
3. **Build Streaks**: Complete habits consistently to build streaks
4. **Celebrate Milestones**: Enjoy confetti at 7, 30, and 100-day streaks!

### Viewing Statistics
1. **Calendar Tab**: See your consistency with the heatmap visualization
2. **Stats Tab**: View detailed metrics and 30-day activity chart
3. **Track Achievements**: Monitor perfect days and weeks

## 💾 Data Storage

All data is stored locally in your browser using localStorage:
- **Privacy**: Your data never leaves your device
- **Offline**: Works without internet connection
- **Persistent**: Data survives browser restarts
- **Device-Specific**: Each device has its own data

## 🎉 Milestone Celebrations

Confetti animations trigger at:
- **7 days**: First week milestone 🎊
- **30 days**: One month achievement 🎉
- **100 days**: Major milestone 🏆

## 📊 Statistics Explained

- **Current Streak**: Consecutive days with habit completion (ending today)
- **Longest Streak**: Your personal best streak ever
- **Total Completions**: All-time count of completed habits
- **Perfect Days**: Days with 100% habit completion
- **Perfect Weeks**: Weeks with 100% daily completion

## 🔔 Notifications

- Set custom reminder times for each habit
- Receive daily notifications: "Don't break the chain! Complete your habits 🔥"
- Manage permissions in your browser settings

## 🌙 Dark Mode

- Automatically follows your system preference
- Smooth transitions between light and dark themes
- All components optimized for both modes

## 📝 Important Notes

### Platform Clarification
This is a **web application**, not a native Flutter Android app. While the original requirements specified Flutter, this implementation:
- ✅ Provides all the same functionality
- ✅ Works on any device (mobile, tablet, desktop)
- ✅ Accessible through any modern web browser
- ✅ No app store installation required
- ✅ Cross-platform compatibility

### Browser Compatibility
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Optimized for mobile use

### Data Backup
Since data is stored locally:
- Consider exporting your data periodically (future feature)
- Clearing browser data will delete your habits
- Use the same browser to maintain your data

## 🎨 Customization Options

### Available Emojis
80+ emojis including:
- Fitness: 💪 🏃 🏋️ 🚴 🏊
- Wellness: 🧘 💧 🍎 🥗 ☕
- Learning: 📚 📖 ✍️ 🎓 💻
- Productivity: 🎯 ✅ 📝 📊 💼
- And many more!

### Color Themes
8 beautiful preset colors:
- Indigo (#5E5CE6)
- Orange (#FF9500)
- Green (#34C759)
- Red (#FF3B30)
- Purple (#AF52DE)
- Pink (#FF2D55)
- Blue (#5AC8FA)
- Yellow (#FFCC00)

### Scheduling Flexibility
- Choose any combination of days
- Different schedules for different habits
- Skip weekends or weekdays as needed

## 🏆 Tips for Success

1. **Start Small**: Begin with 2-3 habits
2. **Be Consistent**: Track daily for best results
3. **Set Reminders**: Use notifications to stay on track
4. **Celebrate Wins**: Enjoy the confetti animations!
5. **Review Progress**: Check your calendar and stats regularly
6. **Adjust as Needed**: Edit habits to match your routine

## 🐛 Troubleshooting

### Notifications Not Working
- Check browser notification permissions
- Ensure notifications are enabled for the site
- Try granting permission again from browser settings

### Data Not Saving
- Check if localStorage is enabled in your browser
- Ensure you're not in private/incognito mode
- Check available storage space

### Performance Issues
- Clear browser cache
- Close unnecessary tabs
- Update to the latest browser version

## 📈 Future Enhancements

Potential features for future versions:
- Export/import data functionality
- Habit templates and categories
- Notes for each completion
- Weekly/monthly goal setting
- Social sharing capabilities
- Cloud sync (optional)
- Progressive Web App (PWA) installation
- Advanced analytics and insights

## 🙏 Credits

Built with:
- **React** – UI framework
- **TypeScript** – Type safety
- **shadcn/ui** – Component library
- **Tailwind CSS** – Styling
- **Recharts** – Data visualization
- **date-fns** – Date utilities
- **Radix UI** – Accessible primitives

---

**Start building better habits today! 🔥**
