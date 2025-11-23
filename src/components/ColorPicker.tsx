import { PRESET_COLORS } from '@/types/habit';
import { Check } from 'lucide-react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="flex gap-3 flex-wrap">
      {PRESET_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          className="w-12 h-12 rounded-full border-2 border-border hover:scale-110 transition-transform flex items-center justify-center"
          style={{ backgroundColor: color }}
          onClick={() => onChange(color)}
        >
          {value === color && <Check className="w-6 h-6 text-white drop-shadow-md" />}
        </button>
      ))}
    </div>
  );
}
