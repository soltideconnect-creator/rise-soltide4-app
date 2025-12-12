import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { habitStorage } from '@/services/habitStorage';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, startOfWeek, endOfWeek, isSameMonth, isToday, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, TrendingUp, Award, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import type { Habit } from '@/types/habit';

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [heatmapData, setHeatmapData] = useState<Record<string, number>>({});
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);

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
    setHabits(habitStorage.getHabits());
  }, [currentDate]);

  // Memoized calendar calculations
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentDate]);

  // Memoized monthly statistics
  const monthlyStats = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    let perfectDays = 0;
    let totalCompletion = 0;
    let daysWithData = 0;
    let bestDay = { date: '', percentage: 0 };

    monthDays.forEach(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const percentage = heatmapData[dateStr];
      
      if (percentage !== undefined) {
        daysWithData++;
        totalCompletion += percentage;
        
        if (percentage === 100) {
          perfectDays++;
        }
        
        if (percentage > bestDay.percentage) {
          bestDay = { date: dateStr, percentage };
        }
      }
    });

    const avgCompletion = daysWithData > 0 ? Math.round(totalCompletion / daysWithData) : 0;

    return {
      perfectDays,
      avgCompletion,
      bestDay: bestDay.percentage > 0 ? bestDay : null,
      totalDays: monthDays.length,
      daysWithData,
    };
  }, [currentDate, heatmapData]);

  // Get habits for selected date
  const selectedDateHabits = useMemo(() => {
    if (!selectedDate) return [];
    
    const dayOfWeek = format(selectedDate, 'EEEE').toLowerCase();
    const dayIndex = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].indexOf(dayOfWeek);
    
    return habits.map(habit => {
      const isCompleted = habitStorage.isCompleted(habit.id, selectedDate);
      const isScheduled = habit.weekdays.includes(dayIndex);
      const currentStreak = habitStorage.getHabitStreak(habit.id);
      return {
        ...habit,
        isCompleted,
        isScheduled,
        currentStreak,
      };
    }).filter(h => h.isScheduled);
  }, [selectedDate, habits]);

  const getColorIntensity = (percentage: number) => {
    if (percentage === 0) return 'bg-muted hover:bg-muted/80';
    if (percentage < 25) return 'bg-success/20 hover:bg-success/30';
    if (percentage < 50) return 'bg-success/40 hover:bg-success/50';
    if (percentage < 75) return 'bg-success/60 hover:bg-success/70';
    if (percentage < 100) return 'bg-success/80 hover:bg-success/90';
    return 'bg-success hover:bg-success/90';
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Calendar</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={previousMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" onClick={goToToday} className="min-w-[100px]">
              Today
            </Button>
            <span className="text-lg font-semibold min-w-[150px] text-center">
              {format(currentDate, 'MMMM yyyy')}
            </span>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Monthly Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Perfect Days</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{monthlyStats.perfectDays}</div>
              <p className="text-xs text-muted-foreground">
                100% completion days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Completion</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{monthlyStats.avgCompletion}%</div>
              <p className="text-xs text-muted-foreground">
                Across {monthlyStats.daysWithData} days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Best Day</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {monthlyStats.bestDay ? `${monthlyStats.bestDay.percentage}%` : 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground">
                {monthlyStats.bestDay 
                  ? format(new Date(monthlyStats.bestDay.date), 'MMM d')
                  : 'No data yet'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Calendar Heatmap */}
        <Card className="p-6">
          <div className="grid grid-cols-7 gap-2 mb-2">
            {weekDays.map((day) => (
              <div key={day} className="text-center text-sm font-semibold text-muted-foreground">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const percentage = heatmapData[dateStr] || 0;
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isTodayDate = isToday(day);

              return (
                <button
                  key={dateStr}
                  onClick={() => handleDayClick(day)}
                  className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all hover:scale-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                    getColorIntensity(percentage)
                  } ${
                    isCurrentMonth ? 'opacity-100' : 'opacity-30'
                  } ${
                    isTodayDate ? 'ring-2 ring-primary ring-offset-2' : ''
                  }`}
                  title={`${format(day, 'MMM d, yyyy')}: ${percentage}% complete`}
                  aria-label={`${format(day, 'MMMM d, yyyy')}, ${percentage}% habits completed`}
                >
                  <span className={isTodayDate ? 'font-bold' : ''}>
                    {format(day, 'd')}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 flex items-center justify-center gap-4 text-sm flex-wrap">
            <span className="text-muted-foreground">Less</span>
            <div className="flex gap-1">
              <div className="w-4 h-4 rounded bg-muted" title="0%" />
              <div className="w-4 h-4 rounded bg-success/20" title="1-24%" />
              <div className="w-4 h-4 rounded bg-success/40" title="25-49%" />
              <div className="w-4 h-4 rounded bg-success/60" title="50-74%" />
              <div className="w-4 h-4 rounded bg-success/80" title="75-99%" />
              <div className="w-4 h-4 rounded bg-success" title="100%" />
            </div>
            <span className="text-muted-foreground">More</span>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-4">
            💡 Click any day to see habit details
          </p>
        </Card>

        {/* Empty State */}
        {habits.length === 0 && (
          <Card className="p-8 text-center">
            <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Habits Yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first habit to start tracking your progress on the calendar.
            </p>
          </Card>
        )}
      </div>

      {/* Day Details Sheet */}
      <Sheet open={selectedDate !== null} onOpenChange={(open) => !open && setSelectedDate(null)}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </SheetTitle>
            <SheetDescription>
              {selectedDate && (
                <>
                  {selectedDateHabits.length > 0 ? (
                    <>
                      {selectedDateHabits.filter(h => h.isCompleted).length} of {selectedDateHabits.length} habits completed
                      {selectedDateHabits.length > 0 && (
                        <span className="ml-2">
                          ({Math.round((selectedDateHabits.filter(h => h.isCompleted).length / selectedDateHabits.length) * 100)}%)
                        </span>
                      )}
                    </>
                  ) : (
                    'No habits scheduled for this day'
                  )}
                </>
              )}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-3">
            {selectedDateHabits.length > 0 ? (
              selectedDateHabits.map((habit) => (
                <Card key={habit.id} className={habit.isCompleted ? 'border-success' : ''}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{habit.emoji}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold">{habit.name}</h4>
                          {habit.isCompleted && (
                            <Badge variant="default" className="bg-success">
                              ✓ Done
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>🔥 {habit.currentStreak} day streak</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No habits scheduled for this day</p>
              </div>
            )}
          </div>

          {selectedDate && isToday(selectedDate) && (
            <div className="mt-6 p-4 bg-primary/10 rounded-lg">
              <p className="text-sm text-center">
                📅 This is today! Complete your habits to maintain your streaks.
              </p>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
