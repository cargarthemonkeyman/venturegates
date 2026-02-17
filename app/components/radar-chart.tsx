"use client";

import { motion } from "framer-motion";

interface RadarChartProps {
  data: {
    label: string;
    value: number;
    color?: string;
  }[];
  size?: number;
}

export function RadarChart({ data, size = 280 }: RadarChartProps) {
  const center = size / 2;
  const radius = size * 0.35;
  const levels = 5;
  
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
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="overflow-visible">
        {/* Background circles */}
        {Array.from({ length: levels }).map((_, i) => (
          <circle
            key={i}
            cx={center}
            cy={center}
            r={(radius * (i + 1)) / levels}
            fill="none"
            stroke="rgba(0,0,0,0.08)"
            strokeWidth={1}
          />
        ))}
        
        {/* Axis lines */}
        {data.map((_, i) => {
          const angle = (Math.PI * 2 * i) / data.length - Math.PI / 2;
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="rgba(0,0,0,0.08)"
              strokeWidth={1}
            />
          );
        })}
        
        {/* Data area */}
        <motion.path
          d={pathData}
          fill="url(#radarGradient)"
          stroke="#06B6D4"
          strokeWidth={2}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
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
          return (
            <motion.circle
              key={i}
              cx={point.x}
              cy={point.y}
              r={5}
              fill="#06B6D4"
              stroke="#f5f5f5"
              strokeWidth={2}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            />
          );
        })}
      </svg>
      
      {/* Labels */}
      {data.map((d, i) => {
        const angle = (Math.PI * 2 * i) / data.length - Math.PI / 2;
        const labelRadius = radius + 30;
        const x = center + labelRadius * Math.cos(angle);
        const y = center + labelRadius * Math.sin(angle);
        return (
          <motion.div
            key={i}
            className="absolute text-xs font-medium text-center"
            style={{
              left: x,
              top: y,
              transform: "translate(-50%, -50%)",
              color: "rgba(0,0,0,0.7)",
              maxWidth: 80,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 + i * 0.1 }}
          >
            <div>{d.label}</div>
            <div className="text-cyan-600 font-bold">{d.value}/10</div>
          </motion.div>
        );
      })}
    </div>
  );
}
