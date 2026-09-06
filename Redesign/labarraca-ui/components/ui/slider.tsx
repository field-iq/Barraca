'use client';
import { cn } from '@/lib/cn';
export interface SliderProps { value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number; format?: (v: number) => string; label?: string; className?: string }
export function Slider({ value, onChange, min = 0, max = 100, step = 1, format = v => String(v), label, className }: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className={cn('grid gap-3', className)}>
      {label && <div className="flex justify-between text-sm"><span className="font-medium">{label}</span><span className="text-nm-muted">{format(value)}</span></div>}
      <div className="relative h-8">
        <div className="absolute inset-x-0 top-1/2 h-3 -translate-y-1/2 rounded-pill shadow-soft-inset" />
        <div className="absolute left-0 top-1/2 h-3 -translate-y-1/2 rounded-pill bg-nm-accent/80" style={{ width: pct + '%' }} />
        <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))}
          aria-label={label}
          className="absolute inset-0 w-full cursor-pointer appearance-none bg-transparent
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-7 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-nm-surface [&::-webkit-slider-thumb]:shadow-soft
            [&::-moz-range-thumb]:size-7 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-nm-surface [&::-moz-range-thumb]:shadow-soft" />
      </div>
    </div>
  );
}
