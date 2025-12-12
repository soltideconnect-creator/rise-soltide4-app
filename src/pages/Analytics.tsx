import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { analyticsService } from '@/services/analyticsService';
import { pdfExportService } from '@/services/pdfExportService';
import { habitStorage } from '@/services/habitStorage';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell } from 'recharts';
import { TrendingUp, Calendar, Target, Zap, Award, Activity, Download, FileText } from 'lucide-react';
import { toast } from 'sonner';
import type { AnalyticsSummary, DayOfWeekStats, MonthlyComparison, HabitAnalytics } from '@/types/analytics';

export function Analytics() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [dayOfWeekStats, setDayOfWeekStats] = useState<DayOfWeekStats[]>([]);
  const [monthlyComparison, setMonthlyComparison] = useState<MonthlyComparison[]>([]);
  const [habitAnalytics, setHabitAnalytics] = useState<HabitAnalytics[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<30 | 60 | 90>(30);

  useEffect(() => {
    loadAnalytics();
  }, [selectedPeriod]);

  const loadAnalytics = () => {
    const habits = habitStorage.getHabits();
    
    // Load summary
    setSummary(analyticsService.getAnalyticsSummary(selectedPeriod));
    
    // Load day of week stats
    setDayOfWeekStats(analyticsService.getDayOfWeekStats(selectedPeriod));
    
    // Load monthly comparison
    setMonthlyComparison(analyticsService.getMonthlyComparison(6));
    
    // Load per-habit analytics
    const habitStats = habits.map(habit => 
      analyticsService.getHabitAnalytics(habit.id, selectedPeriod)
    );
    setHabitAnalytics(habitStats.sort((a, b) => b.successRate - a.successRate));
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 80) return 'hsl(var(--success))';
    if (rate >= 60) return 'hsl(var(--primary))';
    if (rate >= 40) return 'hsl(var(--accent))';
    return 'hsl(var(--destructive))';
  };

  const handleExportPDF = () => {
    try {
      pdfExportService.exportHabitReport(selectedPeriod);
      toast.success('Opening print dialog for PDF export...');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to export PDF');
    }
  };

  return (
    <div className="pb-20 px-4 pt-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Activity className="w-8 h-8 text-primary" />
            Advanced Analytics
          </h1>
          <p className="text-muted-foreground">
            Deep insights into your habit patterns and progress
          </p>
        </div>
        <Button onClick={handleExportPDF} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export PDF
        </Button>
      </div>

      {/* Period Selector */}
      <div className="flex gap-2">
        <button
          onClick={() => setSelectedPeriod(30)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedPeriod === 30
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
        >
          30 Days
        </button>
        <button
          onClick={() => setSelectedPeriod(60)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedPeriod === 60
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
        >
          60 Days
        </button>
        <button
          onClick={() => setSelectedPeriod(90)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedPeriod === 90
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
        >
          90 Days
        </button>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Success Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{summary.overallSuccessRate}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                Overall completion rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4 text-accent" />
                Perfect Days
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{summary.perfectDaysCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                100% completion days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Zap className="w-4 h-4 text-success" />
                Avg Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{summary.currentAverageStreak}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Average across habits
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Award className="w-4 h-4 text-primary" />
                Best Day
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.bestDayOfWeek}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Most consistent day
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs for Different Analytics Views */}
      <Tabs defaultValue="weekly" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="weekly">Weekly Pattern</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Trends</TabsTrigger>
          <TabsTrigger value="habits">Per Habit</TabsTrigger>
        </TabsList>

        {/* Weekly Pattern */}
        <TabsContent value="weekly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Success Rate by Day of Week</CardTitle>
              <CardDescription>
                Discover which days you're most consistent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dayOfWeekStats}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    dataKey="day" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    label={{ value: 'Success Rate (%)', angle: -90, position: 'insideLeft', fontSize: 12 }}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`${value}%`, 'Success Rate']}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="successRate" radius={[8, 8, 0, 0]}>
                    {dayOfWeekStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getSuccessRateColor(entry.successRate)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Day of Week Details */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dayOfWeekStats.map((stat) => (
                  <div key={stat.day} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                    <div className="flex items-center gap-3">
                      <div className="font-semibold w-24">{stat.day}</div>
                      <div className="text-sm text-muted-foreground">
                        {stat.completions} / {stat.attempts} completed
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="font-bold text-lg">{stat.successRate}%</div>
                      </div>
                      <div 
                        className="w-2 h-8 rounded-full"
                        style={{ backgroundColor: getSuccessRateColor(stat.successRate) }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monthly Trends */}
        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>6-Month Comparison</CardTitle>
              <CardDescription>
                Track your progress over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyComparison}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    label={{ value: 'Average Completion (%)', angle: -90, position: 'insideLeft', fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="averageCompletion" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Monthly Details */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {monthlyComparison.map((month) => (
              <Card key={month.month}>
                <CardHeader>
                  <CardTitle className="text-lg">{month.month}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Completions</span>
                    <span className="font-bold text-lg">{month.completions}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Perfect Days</span>
                    <span className="font-bold text-lg text-success">{month.perfectDays}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Average Completion</span>
                    <span className="font-bold text-lg text-primary">{month.averageCompletion}%</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Per Habit Analytics */}
        <TabsContent value="habits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Habit Performance</CardTitle>
              <CardDescription>
                Detailed analytics for each habit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {habitAnalytics.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No habits to analyze. Create some habits to see analytics!
                  </div>
                ) : (
                  habitAnalytics.map((habit) => (
                    <Card key={habit.habitId} className="border-2">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg">{habit.habitName}</CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            try {
                              pdfExportService.exportHabitData(habit.habitId);
                              toast.success('Opening print dialog...');
                            } catch (error) {
                              toast.error('Failed to export habit data');
                            }
                          }}
                          className="flex items-center gap-1"
                        >
                          <FileText className="w-4 h-4" />
                          Export
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Success Rate Bar */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Success Rate</span>
                            <span className="text-2xl font-bold" style={{ color: getSuccessRateColor(habit.successRate) }}>
                              {habit.successRate}%
                            </span>
                          </div>
                          <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all duration-500"
                              style={{ 
                                width: `${habit.successRate}%`,
                                backgroundColor: getSuccessRateColor(habit.successRate)
                              }}
                            />
                          </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground">Current Streak</div>
                            <div className="text-xl font-bold flex items-center gap-1">
                              {habit.currentStreak} 🔥
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground">Longest Streak</div>
                            <div className="text-xl font-bold flex items-center gap-1">
                              {habit.longestStreak} 🏆
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground">Completions</div>
                            <div className="text-xl font-bold">
                              {habit.totalCompletions} / {habit.totalAttempts}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground">Best Day</div>
                            <div className="text-lg font-bold text-success">
                              {habit.bestDayOfWeek.slice(0, 3)}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Insights Section */}
      {summary && habitAnalytics.length > 0 && (
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Key Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
              <div className="text-2xl">🏆</div>
              <div>
                <div className="font-semibold">Most Consistent Habit</div>
                <div className="text-sm text-muted-foreground">
                  {summary.mostConsistentHabit} is your strongest habit
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
              <div className="text-2xl">📈</div>
              <div>
                <div className="font-semibold">Best Performance Day</div>
                <div className="text-sm text-muted-foreground">
                  You're most consistent on {summary.bestDayOfWeek}s
                </div>
              </div>
            </div>

            {summary.overallSuccessRate >= 80 && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-success/10">
                <div className="text-2xl">🎉</div>
                <div>
                  <div className="font-semibold text-success">Excellent Performance!</div>
                  <div className="text-sm text-muted-foreground">
                    You're maintaining an {summary.overallSuccessRate}% success rate. Keep it up!
                  </div>
                </div>
              </div>
            )}

            {summary.overallSuccessRate < 50 && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/10">
                <div className="text-2xl">💪</div>
                <div>
                  <div className="font-semibold">Room for Growth</div>
                  <div className="text-sm text-muted-foreground">
                    Focus on {summary.leastConsistentHabit} to improve your overall success rate
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
