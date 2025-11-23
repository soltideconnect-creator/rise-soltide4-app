import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Flame, Calendar, TrendingUp, Bell, Heart, Shield, Moon, Volume2, Sparkles } from 'lucide-react';

interface AboutProps {
  onBack: () => void;
}

export function About({ onBack }: AboutProps) {
  return (
    <div className="container max-w-2xl mx-auto px-4 py-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-3xl font-bold">About Streak</h1>
      </div>

      {/* App Info */}
      <Card className="mb-4">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center">
              <Flame className="w-12 h-12 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">Streak – Daily Habit Tracker</CardTitle>
          <CardDescription>Version 1.1.0</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Build lasting habits with beautiful streaks, charts, and daily motivation. Track your
            progress, stay consistent, and achieve your goals. Now with premium Sleep Tracker and Smart Alarm features.
          </p>
        </CardContent>
      </Card>

      {/* Features */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Core Features</CardTitle>
          <CardDescription>Everything you need to build lasting habits</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Flame className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Streak Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Build momentum with visual streak counters and celebrate milestones
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-success" />
            </div>
            <div>
              <h3 className="font-semibold">Interactive Calendar</h3>
              <p className="text-sm text-muted-foreground">
                Visualize your consistency with a beautiful heatmap. Click any day to see habit details and monthly statistics.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold">Detailed Statistics</h3>
              <p className="text-sm text-muted-foreground">
                Track your progress with comprehensive stats and 30-day activity charts
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Daily Reminders</h3>
              <p className="text-sm text-muted-foreground">
                Never miss a day with customizable notification reminders
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Heart className="w-5 h-5 text-success" />
            </div>
            <div>
              <h3 className="font-semibold">Motivational Quotes</h3>
              <p className="text-sm text-muted-foreground">
                Get inspired with 50 built-in motivational quotes after each completion
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold">Offline First</h3>
              <p className="text-sm text-muted-foreground">
                All your data is stored locally. No internet connection required.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Premium Features */}
      <Card className="mb-4 border-primary/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              Premium Features
              <Badge variant="default" className="bg-primary">
                <Sparkles className="w-3 h-3 mr-1" />
                $4.99
              </Badge>
            </CardTitle>
          </div>
          <CardDescription>Advanced features for better sleep and wellness</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Moon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Sleep Tracker</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Monitor your sleep quality with advanced tracking using microphone and accelerometer sensors
              </p>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside ml-2">
                <li>Real-time sleep phase detection (light/deep/awake)</li>
                <li>Sleep quality score (0-100) with ratings</li>
                <li>Duration and quality charts (last 7 days)</li>
                <li>Detailed session history with statistics</li>
                <li>Movement and sound analysis</li>
              </ul>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Bell className="w-5 h-5 text-success" />
            </div>
            <div>
              <h3 className="font-semibold">Smart Alarm</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Wake up naturally during light sleep within a 30-minute window
              </p>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside ml-2">
                <li>Intelligent wake-up timing based on sleep phases</li>
                <li>Customizable alarm window (default 30 minutes)</li>
                <li>Vibration support for gentle wake-up</li>
                <li>Browser notification when alarm triggers</li>
              </ul>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Volume2 className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold">6 Offline Alarm Sounds</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Choose from 6 beautiful alarm sounds, all generated offline using Web Audio API
              </p>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside ml-2">
                <li><strong>Gentle Wake:</strong> Soft ascending tones (C-D-E-F-G scale)</li>
                <li><strong>Classic Alarm:</strong> Traditional beeping sound</li>
                <li><strong>Wind Chimes:</strong> Peaceful, random chime sounds</li>
                <li><strong>Morning Birds:</strong> Simulated bird chirping</li>
                <li><strong>Ocean Waves:</strong> Calming wave sounds</li>
                <li><strong>Piano Melody:</strong> Soft piano arpeggio</li>
              </ul>
              <p className="text-xs text-muted-foreground mt-2">
                💡 Preview and select your favorite sound in Settings
              </p>
            </div>
          </div>

          <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-xs text-muted-foreground">
              <strong>Note:</strong> Premium features unlock ad-free experience and access to Sleep Tracker with Smart Alarm. All sounds work completely offline with no internet connection required.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Privacy */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Privacy & Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Your privacy is important to us. All your habit data is stored locally on your device
            using browser storage. We do not collect, transmit, or store any of your personal
            information on external servers.
          </p>
          <p className="text-sm text-muted-foreground">
            You have full control over your data and can export, import, or delete it at any time
            from the Settings page.
          </p>
        </CardContent>
      </Card>

      {/* Credits */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Credits</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-2">
            Built with modern web technologies:
          </p>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>React & TypeScript</li>
            <li>Tailwind CSS</li>
            <li>shadcn/ui Components</li>
            <li>Recharts for data visualization</li>
            <li>Lucide Icons</li>
          </ul>
        </CardContent>
      </Card>

      {/* Copyright */}
      <div className="text-center text-sm text-muted-foreground mt-8">
        <p>2025 Streak – Daily Habit Tracker</p>
        <p className="mt-1">Made with ❤️ for habit builders</p>
      </div>
    </div>
  );
}
