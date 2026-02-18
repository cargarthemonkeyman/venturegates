"use client";

interface GaugeProps {
  value: number;
  max?: number;
  label: string;
  color?: string;
}

export function Gauge({ 
  value, 
  max = 100, 
  label, 
  color = "#06B6D4"
}: GaugeProps) {
  const percentage = Math.round((value / max) * 100);
  
  return (
    <div className="flex flex-col items-center p-4">
      {/* Simple circular progress */}
      <div 
        className="relative rounded-full flex items-center justify-center mb-3"
        style={{ 
          width: 100, 
          height: 100,
          background: `conic-gradient(${color} ${percentage * 3.6}deg, #e5e5e5 0deg)`,
        }}
      >
        <div 
          className="absolute rounded-full bg-white flex items-center justify-center"
          style={{ width: 80, height: 80 }}
        >
          <span className="text-2xl font-bold" style={{ color }}>
            {percentage}%
          </span>
        </div>
      </div>
      
      {/* Label */}
      <p className="text-sm font-semibold text-neutral-900 text-center">{label}</p>
    </div>
  );
}
