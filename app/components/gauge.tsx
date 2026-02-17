"use client";

import { motion } from "framer-motion";

interface GaugeProps {
  value: number;
  max?: number;
  label: string;
  sublabel?: string;
  color?: string;
  size?: number;
}

export function Gauge({ 
  value, 
  max = 100, 
  label, 
  sublabel,
  color = "#06B6D4",
  size = 140 
}: GaugeProps) {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const arcLength = circumference * 0.75;
  const progress = (value / max) * arcLength;
  
  return (
    <div className="relative flex flex-col items-center">
      <div style={{ width: size, height: size * 0.75 }}>
        <svg width={size} height={size} className="overflow-visible -rotate-[135deg]">
          {/* Background arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(0,0,0,0.08)"
            strokeWidth={strokeWidth}
            strokeDasharray={arcLength}
            strokeLinecap="round"
          />
          
          {/* Progress arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${progress} ${circumference}`}
            strokeLinecap="round"
            initial={{ strokeDasharray: `0 ${circumference}` }}
            animate={{ strokeDasharray: `${progress} ${circumference}` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        
        {/* Value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
          <motion.span 
            className="text-3xl font-bold"
            style={{ color }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            {Math.round(value)}{max === 100 ? "%" : ""}
          </motion.span>
        </div>
      </div>
      
      {/* Label */}
      <div className="text-center mt-2">
        <div className="text-sm font-medium text-neutral-900">{label}</div>
        {sublabel && <div className="text-xs text-neutral-500">{sublabel}</div>}
      </div>
    </div>
  );
}
