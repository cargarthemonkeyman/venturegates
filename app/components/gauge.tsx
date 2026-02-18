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

export function Gauge({ 
  value, 
  max = 100, 
  label, 
  color = "#06B6D4",
  size = 120 
}: GaugeProps) {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2 - 4; // padding
  const circumference = radius * 2 * Math.PI;
  const arcLength = circumference * 0.75; // 270 degrees (3/4 circle)
  const progress = Math.min((value / max) * arcLength, arcLength);
  
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [isHovered, setIsHovered] = useState(false);
  
  // Calculate percentage for display
  const percentage = Math.round((value / max) * 100);
  
  return (
    <motion.div 
      ref={ref}
      className="flex flex-col items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2 }}
      style={{ width: size + 20 }}
    >
      {/* Gauge SVG Container */}
      <div 
        className="relative flex items-center justify-center"
        style={{ width: size, height: size * 0.75 }}
      >
        <svg 
          width={size} 
          height={size * 0.75}
          className="overflow-visible"
          style={{ transform: 'rotate(-135deg)', transformOrigin: 'center' }}
        >
          {/* Background arc */}
          <circle
            cx={size / 2}
            cy={size * 0.75 / 2}
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
            cy={size * 0.75 / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${progress} ${circumference}`}
            strokeLinecap="round"
            initial={{ strokeDasharray: `0 ${circumference}` }}
            animate={isInView ? { strokeDasharray: `${progress} ${circumference}` } : { strokeDasharray: `0 ${circumference}` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>
        
        {/* Centered Value */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span 
            className="text-2xl font-bold"
            style={{ color }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            {percentage}%
          </motion.span>
        </div>
      </div>
      
      {/* Label below */}
      <div className="text-center mt-2 px-2">
        <p className="text-sm font-semibold text-neutral-900 leading-tight">{label}</p>
      </div>
    </motion.div>
  );
}
