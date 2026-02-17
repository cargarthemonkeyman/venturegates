"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export function Slider({
  value,
  onChange,
  min = 0,
  max = 10,
  step = 1,
  className,
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn("relative w-full", className)}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2"
        style={{
          background: `linear-gradient(to right, #171717 0%, #171717 ${percentage}%, #e5e5e5 ${percentage}%, #e5e5e5 100%)`,
        }}
      />
      <div className="flex justify-between mt-2 text-xs text-neutral-500">
        <span>{min}</span>
        <span className="font-bold text-neutral-900 text-lg">{value}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
