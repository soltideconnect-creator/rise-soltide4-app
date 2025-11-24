import { habitStorage } from './habitStorage';
import { analyticsService } from './analyticsService';
import type { Habit } from '@/types/habit';

export const pdfExportService = {
  /**
   * Generate and download a PDF report of habit data
   */
  exportHabitReport: (period: 30 | 60 | 90 = 30) => {
    const habits = habitStorage.getHabits();
    const analytics = analyticsService.getAnalyticsSummary(period);
    
    // Create a printable HTML document
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error('Please allow popups to export PDF');
    }

    const html = generateReportHTML(habits, analytics, period);
    printWindow.document.write(html);
    printWindow.document.close();
    
    // Trigger print dialog after content loads
    printWindow.onload = () => {
      printWindow.print();
    };
  },

  /**
   * Export individual habit data
   */
  exportHabitData: (habitId: string) => {
    const habit = habitStorage.getHabits().find(h => h.id === habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }

    const allCompletions = habitStorage.getCompletions();
    const completions = allCompletions
      .filter(c => c.habitId === habitId && c.completed)
      .map(c => new Date(c.date));
    const streak = habitStorage.getHabitStreak(habitId);
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error('Please allow popups to export PDF');
    }

    const html = generateHabitHTML(habit, completions, streak);
    printWindow.document.write(html);
    printWindow.document.close();
    
    printWindow.onload = () => {
      printWindow.print();
    };
  },
};

function generateReportHTML(habits: Habit[], analytics: any, period: number): string {
  const today = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Habit Tracker Report - ${today}</title>
      <style>
        @media print {
          @page {
            margin: 1cm;
            size: A4;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .header {
          text-align: center;
          margin-bottom: 40px;
          border-bottom: 3px solid #3b82f6;
          padding-bottom: 20px;
        }
        
        .header h1 {
          color: #1e40af;
          margin: 0 0 10px 0;
          font-size: 32px;
        }
        
        .header p {
          color: #6b7280;
          margin: 5px 0;
        }
        
        .summary {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 40px;
        }
        
        .summary-card {
          background: #f3f4f6;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
        }
        
        .summary-card h3 {
          margin: 0 0 10px 0;
          color: #6b7280;
          font-size: 14px;
          text-transform: uppercase;
        }
        
        .summary-card .value {
          font-size: 36px;
          font-weight: bold;
          color: #1e40af;
        }
        
        .habits-section {
          margin-bottom: 40px;
        }
        
        .habits-section h2 {
          color: #1e40af;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }
        
        .habit-item {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-left: 4px solid;
          padding: 15px;
          margin-bottom: 15px;
          border-radius: 4px;
          page-break-inside: avoid;
        }
        
        .habit-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }
        
        .habit-emoji {
          font-size: 32px;
        }
        
        .habit-name {
          font-size: 18px;
          font-weight: 600;
          color: #111827;
        }
        
        .habit-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin-top: 10px;
        }
        
        .stat {
          text-align: center;
        }
        
        .stat-label {
          font-size: 12px;
          color: #6b7280;
          text-transform: uppercase;
        }
        
        .stat-value {
          font-size: 20px;
          font-weight: bold;
          color: #1e40af;
        }
        
        .notes {
          margin-top: 10px;
          padding: 10px;
          background: #fef3c7;
          border-radius: 4px;
          font-size: 14px;
        }
        
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 2px solid #e5e7eb;
          text-align: center;
          color: #6b7280;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🎯 Habit Tracker Report</h1>
        <p>Generated on ${today}</p>
        <p>Period: Last ${period} Days</p>
      </div>
      
      <div class="summary">
        <div class="summary-card">
          <h3>Total Habits</h3>
          <div class="value">${habits.length}</div>
        </div>
        <div class="summary-card">
          <h3>Completion Rate</h3>
          <div class="value">${analytics.overallCompletionRate}%</div>
        </div>
        <div class="summary-card">
          <h3>Active Streak</h3>
          <div class="value">${analytics.longestCurrentStreak}</div>
        </div>
      </div>
      
      <div class="habits-section">
        <h2>Habit Details</h2>
        ${habits.map(habit => {
          const allCompletions = habitStorage.getCompletions();
          const completions = allCompletions.filter(c => c.habitId === habit.id && c.completed);
          const streak = habitStorage.getHabitStreak(habit.id);
          const completionRate = Math.round((completions.length / period) * 100);
          
          return `
            <div class="habit-item" style="border-left-color: ${habit.color}">
              <div class="habit-header">
                <span class="habit-emoji">${habit.emoji}</span>
                <span class="habit-name">${habit.name}</span>
              </div>
              <div class="habit-stats">
                <div class="stat">
                  <div class="stat-label">Streak</div>
                  <div class="stat-value">${streak} 🔥</div>
                </div>
                <div class="stat">
                  <div class="stat-label">Completions</div>
                  <div class="stat-value">${completions.length}</div>
                </div>
                <div class="stat">
                  <div class="stat-label">Rate</div>
                  <div class="stat-value">${completionRate}%</div>
                </div>
              </div>
              ${habit.notes ? `<div class="notes">📝 ${habit.notes}</div>` : ''}
            </div>
          `;
        }).join('')}
      </div>
      
      <div class="footer">
        <p>Generated by Habit Tracker App</p>
        <p>Keep building great habits! 💪</p>
      </div>
    </body>
    </html>
  `;
}

function generateHabitHTML(habit: Habit, completions: Date[], streak: number): string {
  const today = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${habit.name} - Habit Report</title>
      <style>
        @media print {
          @page {
            margin: 1cm;
            size: A4;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .header {
          text-align: center;
          margin-bottom: 40px;
          border-bottom: 3px solid ${habit.color};
          padding-bottom: 20px;
        }
        
        .header .emoji {
          font-size: 64px;
          margin-bottom: 10px;
        }
        
        .header h1 {
          color: #1e40af;
          margin: 10px 0;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-bottom: 40px;
        }
        
        .stat-card {
          background: #f3f4f6;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
        }
        
        .stat-card h3 {
          margin: 0 0 10px 0;
          color: #6b7280;
          font-size: 14px;
          text-transform: uppercase;
        }
        
        .stat-card .value {
          font-size: 36px;
          font-weight: bold;
          color: ${habit.color};
        }
        
        .notes-section {
          background: #fef3c7;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 40px;
        }
        
        .notes-section h2 {
          margin-top: 0;
          color: #92400e;
        }
        
        .completions-section h2 {
          color: #1e40af;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }
        
        .completion-list {
          columns: 2;
          column-gap: 20px;
        }
        
        .completion-item {
          padding: 8px;
          margin-bottom: 8px;
          background: #f3f4f6;
          border-radius: 4px;
          break-inside: avoid;
        }
        
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 2px solid #e5e7eb;
          text-align: center;
          color: #6b7280;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="emoji">${habit.emoji}</div>
        <h1>${habit.name}</h1>
        <p>Generated on ${today}</p>
      </div>
      
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Current Streak</h3>
          <div class="value">${streak} 🔥</div>
        </div>
        <div class="stat-card">
          <h3>Total Completions</h3>
          <div class="value">${completions.length}</div>
        </div>
      </div>
      
      ${habit.notes ? `
        <div class="notes-section">
          <h2>📝 Notes</h2>
          <p>${habit.notes}</p>
        </div>
      ` : ''}
      
      <div class="completions-section">
        <h2>Completion History</h2>
        <div class="completion-list">
          ${completions.slice(0, 50).map(date => `
            <div class="completion-item">
              ✅ ${new Date(date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}
            </div>
          `).join('')}
        </div>
        ${completions.length > 50 ? `<p style="text-align: center; margin-top: 20px; color: #6b7280;">Showing 50 most recent completions</p>` : ''}
      </div>
      
      <div class="footer">
        <p>Generated by Habit Tracker App</p>
        <p>Keep up the great work! 💪</p>
      </div>
    </body>
    </html>
  `;
}
