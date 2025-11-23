import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { habitStorage } from '@/services/habitStorage';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, startOfWeek, endOfWeek, isSameMonth } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [heatmapData, setHeatmapData] = useState<Record<string, number>>({});

  useEffect(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);

    const stats = habitStorage.getDailyStats(calendarStart, calendarEnd);
    const data: Record<string, number> = {};
    
    for (const stat of stats) {
      data[stat.date] = stat.percentage;
    }

    setHeatmapData(data);
  }, [currentDate]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getColorIntensity = (percentage: number) => {
    if (percentage === 0) return 'bg-muted';
    if (percentage < 25) return 'bg-success/20';
    if (percentage < 50) return 'bg-success/40';
    if (percentage < 75) return 'bg-success/60';
    if (percentage < 100) return 'bg-success/80';
    return 'bg-success';
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Calendar</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={previousMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-lg font-semibold min-w-[150px] text-center">
              {format(currentDate, 'MMMM yyyy')}
            </span>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Card className="p-6">
          <div className="grid grid-cols-7 gap-2 mb-2">
            {weekDays.map((day) => (
              <div key={day} className="text-center text-sm font-semibold text-muted-foreground">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {days.map((day) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const percentage = heatmapData[dateStr] || 0;
              const isCurrentMonth = isSameMonth(day, currentDate);

              return (
                <div
                  key={dateStr}
                  className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all hover:scale-105 ${
                    getColorIntensity(percentage)
                  } ${
                    isCurrentMonth ? 'opacity-100' : 'opacity-30'
                  }`}
                  title={`${format(day, 'MMM d, yyyy')}: ${percentage}% complete`}
                >
                  {format(day, 'd')}
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-center gap-4 text-sm">
            <span className="text-muted-foreground">Less</span>
            <div className="flex gap-1">
              <div className="w-4 h-4 rounded bg-muted" />
              <div className="w-4 h-4 rounded bg-success/20" />
              <div className="w-4 h-4 rounded bg-success/40" />
              <div className="w-4 h-4 rounded bg-success/60" />
              <div className="w-4 h-4 rounded bg-success/80" />
              <div className="w-4 h-4 rounded bg-success" />
            </div>
            <span className="text-muted-foreground">More</span>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">Legend</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-muted" />
              <span>No habits completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-success/40" />
              <span>1-49% of habits completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-success/70" />
              <span>50-99% of habits completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-success" />
              <span>100% of habits completed (Perfect day!)</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
