"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

interface RadarChartProps {
  data: {
    label: string;
    value: number;
    color?: string;
  }[];
  size?: number;
}

export function RadarChart({ data, size = 320 }: RadarChartProps) {
  const center = size / 2;
  const radius = size * 0.35;
  const levels = 5;
  
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  
  const getPoint = (index: number, value: number, maxValue: number = 10) => {
    const angle = (Math.PI * 2 * index) / data.length - Math.PI / 2;
    const r = (value / maxValue) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const pathData = data
    .map((d, i) => {
      const point = getPoint(i, d.value);
      return `${i === 0 ? "M" : "L"} ${point.x} ${point.y}`;
    })
    .join(" ") + " Z";

  return (
    <div ref={ref} className="relative" style={{ width: size, height: size }}>
      <svg 
        width={size} 
        height={size} 
        className="overflow-visible"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }}
      >
        {/* Background circles */}
        {Array.from({ length: levels }).map((_, i) => (
          <motion.circle
            key={i}
            cx={center}
            cy={center}
            r={(radius * (i + 1)) / levels}
            fill="none"
            stroke="rgba(0,0,0,0.06)"
            strokeWidth={1}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: i * 0.1 }}
          />
        ))}
        
        {/* Axis lines with hover effect */}
        {data.map((d, i) => {
          const angle = (Math.PI * 2 * i) / data.length - Math.PI / 2;
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);
          const isHovered = hoveredIndex === i;
          
          return (
            <motion.g key={i}>
              <line
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke={isHovered ? "#06B6D4" : "rgba(0,0,0,0.08)"}
                strokeWidth={isHovered ? 2 : 1}
                className="transition-all duration-200"
              />
              {/* Invisible wider line for easier hovering */}
              <line
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="transparent"
                strokeWidth={20}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            </motion.g>
          );
        })}
        
        {/* Data area with pathLength animation */}
        <motion.path
          d={pathData}
          fill="url(#radarGradient)"
          stroke="#06B6D4"
          strokeWidth={2}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        
        {/* Gradient */}
        <defs>
          <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity={0.05} />
          </radialGradient>
        </defs>
        
        {/* Data points */}
        {data.map((d, i) => {
          const point = getPoint(i, d.value);
          const isHovered = hoveredIndex === i;
          
          return (
            <motion.g key={i}>
              {/* Glow effect on hover */}
              {isHovered && (
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={12}
                  fill="#06B6D4"
                  opacity={0.2}
                />
              )}
              <motion.circle
                cx={point.x}
                cy={point.y}
                r={isHovered ? 7 : 5}
                fill="#06B6D4"
                stroke="#f5f5f5"
                strokeWidth={2}
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : { scale: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            </motion.g>
          );
        })}
      </svg>
      
      {/* Floating tooltip */}
      {hoveredIndex !== null && tooltipPos && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute z-10 px-3 py-2 rounded-lg bg-neutral-900 text-white text-sm pointer-events-none"
          style={{
            left: tooltipPos.x + 10,
            top: tooltipPos.y - 40,
          }}
        >
          <div className="font-semibold">{data[hoveredIndex].label}</div>
          <div className="text-cyan-400 font-bold">{data[hoveredIndex].value}/10</div>
        </motion.div>
      )}
      
      {/* Labels */}
      {data.map((d, i) => {
        const angle = (Math.PI * 2 * i) / data.length - Math.PI / 2;
        const labelRadius = radius + 35;
        const x = center + labelRadius * Math.cos(angle);
        const y = center + labelRadius * Math.sin(angle);
        const isHovered = hoveredIndex === i;
        
        return (
          <motion.div
            key={i}
            className="absolute text-xs font-medium text-center cursor-pointer transition-all duration-200"
            style={{
              left: x,
              top: y,
              transform: "translate(-50%, -50%)",
              color: isHovered ? "#06B6D4" : "rgba(0,0,0,0.7)",
              maxWidth: 90,
              fontWeight: isHovered ? 700 : 500,
            }}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 1 + i * 0.1 }}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div>{d.label}</div>
            <div 
              className="font-bold transition-colors duration-200" 
              style={{ color: isHovered ? "#06B6D4" : "#0891b2" }}
            >
              {d.value}/10
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
