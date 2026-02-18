"use client";

interface StatCardProps {
  value: string | number;
  label: string;
  color?: string;
}

export function StatCard({ 
  value, 
  label, 
  color = "#06B6D4"
}: StatCardProps) {
  return (
    <div
      className="relative p-5 rounded-xl bg-white border"
      style={{ 
        background: `linear-gradient(135deg, ${color}08 0%, transparent 50%)`,
        borderColor: `${color}40`,
      }}
    >
      <div 
        className="absolute -top-10 -right-10 w-20 h-20 rounded-full blur-2xl opacity-20"
        style={{ backgroundColor: color }}
      />
      
      <div className="relative">
        <div className="text-3xl font-bold" style={{ color }}>
          {value}
        </div>
        <div className="text-sm font-medium text-neutral-900 mt-1">{label}</div>
      </div>
    </div>
  );
}
