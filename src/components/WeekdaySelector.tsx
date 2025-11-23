import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface WeekdaySelectorProps {
  value: number[];
  onChange: (days: number[]) => void;
}

const WEEKDAYS = [
  { label: 'S', value: 0, name: 'Sunday' },
  { label: 'M', value: 1, name: 'Monday' },
  { label: 'T', value: 2, name: 'Tuesday' },
  { label: 'W', value: 3, name: 'Wednesday' },
  { label: 'T', value: 4, name: 'Thursday' },
  { label: 'F', value: 5, name: 'Friday' },
  { label: 'S', value: 6, name: 'Saturday' },
];

export function WeekdaySelector({ value, onChange }: WeekdaySelectorProps) {
  const handleToggle = (day: number) => {
    if (value.includes(day)) {
      onChange(value.filter(d => d !== day));
    } else {
      onChange([...value, day].sort());
    }
  };

  return (
    <div className="flex gap-2">
      {WEEKDAYS.map((day) => (
        <button
          key={day.value}
          type="button"
          onClick={() => handleToggle(day.value)}
          className={`w-12 h-12 rounded-full font-semibold transition-all ${
            value.includes(day.value)
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
          title={day.name}
        >
          {day.label}
        </button>
      ))}
    </div>
  );
}
