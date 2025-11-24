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
        <h1 className="text-3xl font-bold">About Rise</h1>
      </div>

      {/* App Info */}
      <Card className="mb-4">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
              <Flame className="w-12 h-12 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">Rise – Habit Tracker & Smart Sleep</CardTitle>
          <CardDescription>Version 1.0 – The Premium Powerhouse</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-center font-medium text-foreground">
            Unbreakable streaks meet perfect mornings.
          </p>
          <p className="text-center text-muted-foreground">
            Rise is the habit tracker that finally understands you're human. Most apps break your streak the moment you're tired. Rise protects it instead with sleep intelligence and smart goal adjustments.
          </p>
        </CardContent>
      </Card>

      {/* Features */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Key Features</CardTitle>
          <CardDescription>Everything you need for unbreakable habits</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Moon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Sleep-Aware Streaks</h3>
              <p className="text-sm text-muted-foreground">
                Poor sleep = auto-adjusted goals. Your streak stays protected when you need rest.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Bell className="w-5 h-5 text-success" />
            </div>
            <div>
              <h3 className="font-semibold">Smart Alarm</h3>
              <p className="text-sm text-muted-foreground">
                Wakes you refreshed during light sleep, never groggy. 6 offline alarm sounds included.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold">24 Pro Habit Templates</h3>
              <p className="text-sm text-muted-foreground">
                Health, Productivity, Mindfulness + more. Start building habits instantly.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">8 Stunning Themes</h3>
              <p className="text-sm text-muted-foreground">
                Gorgeous color themes + personal notes on every habit for deeper tracking.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <div>
              <h3 className="font-semibold">Professional PDF Reports</h3>
              <p className="text-sm text-muted-foreground">
                Export beautiful reports with charts & notes. Perfect for tracking long-term progress.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold">Advanced Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Best days, trends, success rates – the deepest analytics you've ever seen.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Heart className="w-5 h-5 text-success" />
            </div>
            <div>
              <h3 className="font-semibold">50 Motivational Quotes</h3>
              <p className="text-sm text-muted-foreground">
                Get inspired with 50 built-in motivational quotes displayed randomly after completing each habit.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">100% Private & Offline</h3>
              <p className="text-sm text-muted-foreground">
                No account required. All data stored locally on your device.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What's New */}
      <Card className="mb-4 border-accent/50 bg-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            What's New in Rise 1.0
          </CardTitle>
          <CardDescription>The Premium Powerhouse</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">•</span>
              <span><strong>Advanced Analytics Dashboard</strong> – Best days, trends, and success rates with deep insights</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">•</span>
              <span><strong>24 Smart Templates</strong> – Health, Productivity, Mindfulness + more professionally designed habits</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">•</span>
              <span><strong>8 Premium Themes</strong> – Gorgeous color themes to personalize your experience</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">•</span>
              <span><strong>Personal Notes & PDF Exports</strong> – Add notes to habits and export professional reports</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">•</span>
              <span><strong>Sleep + Habit Intelligence</strong> – Auto-adjusts goals based on sleep quality</span>
            </li>
          </ul>
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
        <p>2025 Rise – Habit Tracker & Smart Sleep</p>
        <p className="mt-1">Made with ❤️ for habit builders</p>
      </div>
    </div>
  );
}
