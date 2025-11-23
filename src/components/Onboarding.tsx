import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Flame, Calendar, TrendingUp, ChevronRight, ChevronLeft } from 'lucide-react';
import { notifications } from '@/services/notifications';

interface OnboardingProps {
  onComplete: () => void;
}

const slides = [
  {
    icon: Flame,
    title: 'Build Lasting Habits',
    description: 'Track your daily habits and build streaks that motivate you to keep going. Every day counts!',
    color: 'text-streak',
  },
  {
    icon: Calendar,
    title: 'Visualize Your Progress',
    description: 'See your consistency with beautiful heatmaps and charts. Watch your habits transform into achievements.',
    color: 'text-primary',
  },
  {
    icon: TrendingUp,
    title: 'Stay Motivated',
    description: 'Get daily reminders, celebrate milestones, and unlock motivational quotes as you complete your habits.',
    color: 'text-success',
  },
];

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      requestNotificationPermission();
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const requestNotificationPermission = async () => {
    if (notifications.isSupported() && notifications.getPermission() === 'default') {
      await notifications.requestPermission();
    }
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 space-y-8">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className={`${slide.color} bg-muted rounded-full p-6`}>
            <Icon className="w-16 h-16" />
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-bold">{slide.title}</h2>
            <p className="text-muted-foreground text-lg">{slide.description}</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide ? 'w-8 bg-primary' : 'w-2 bg-muted'
              }`}
            />
          ))}
        </div>

        <div className="flex gap-3">
          {currentSlide > 0 && (
            <Button variant="outline" onClick={handlePrev} className="flex-1">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          <Button onClick={handleNext} className="flex-1">
            {currentSlide < slides.length - 1 ? (
              <>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            ) : (
              'Get Started'
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
