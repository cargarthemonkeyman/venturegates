"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

interface GaugeProps {
  value: number;
  max?: number;
  label: string;
  sublabel?: string;
  color?: string;
  size?: number;
}

const gaugeInterpretations: Record<string, Record<number, string>> = {
  "Market Fit": {
    90: "Exceptional alignment with your ideal market",
    75: "Strong market fit with growth potential",
    60: "Moderate fit - niche adjustments needed",
    50: "Needs strategic repositioning",
  },
  "Risk": {
    90: "High risk tolerance - moonshot ready",
    75: "Comfortable with calculated risks",
    50: "Balanced risk approach",
    30: "Risk-averse - consider gradual exposure",
  },
  "Independence": {
    90: "Strong solo founder potential",
    75: "Can lead independently with support",
    50: "Balanced - team player with autonomy",
    30: "Thrives in collaborative environments",
  },
  "Structure": {
    90: "Highly organized systematic approach",
    75: "Good balance of structure and flexibility",
    50: "Adaptive to different environments",
    30: "Thrives in dynamic unstructured settings",
  },
};

function getInterpretation(label: string, value: number): string {
  const interpretations = gaugeInterpretations[label];
  if (!interpretations) return "";
  
  const thresholds = Object.keys(interpretations).map(Number).sort((a, b) => b - a);
  for (const threshold of thresholds) {
    if (value >= threshold) return interpretations[threshold];
  }
  return interpretations[thresholds[thresholds.length - 1]] || "";
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
  
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isHovered, setIsHovered] = useState(false);
  
  const interpretation = getInterpretation(label, value);
  
  return (
    <motion.div 
      ref={ref}
      className="flex flex-col items-center relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* Tooltip */}
      {isHovered && interpretation && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-16 left-1/2 -translate-x-1/2 z-20 px-3 py-2 rounded-lg bg-neutral-900 text-white text-xs whitespace-nowrap pointer-events-none"
        >
          <div className="font-bold">{Math.round(value)}{max === 100 ? "%" : ""}</div>
          <div className="text-neutral-300">{interpretation}</div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-neutral-900 rotate-45" />
        </motion.div>
      )}
      
      {/* Gauge Container */}
      <div className="relative" style={{ width: size, height: size * 0.85 }}>
        <svg 
          width={size} 
          height={size} 
          className="overflow-visible -rotate-[135deg]"
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
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
            animate={isInView ? { strokeDasharray: `${progress} ${circumference}` } : { strokeDasharray: `0 ${circumference}` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        
        {/* Value - Centered inside the arc area */}
        <div 
          className="absolute flex flex-col items-center justify-center"
          style={{ 
            top: size * 0.25,
            left: '50%',
            transform: 'translateX(-50%)'
          }}
        >
          <motion.span 
            className="text-2xl font-bold"
            style={{ color }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {Math.round(value)}{max === 100 ? "%" : ""}
          </motion.span>
        </div>
      </div>
      
      {/* Label - Below the gauge */}
      <div className="text-center mt-3">
        <div className="text-sm font-medium text-neutral-900">{label}</div>
        {sublabel && <div className="text-xs text-neutral-500">{sublabel}</div>}
      </div>
    </motion.div>
  );
}
