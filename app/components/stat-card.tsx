"use client";

import { motion } from "framer-motion";

interface StatCardProps {
  value: string | number;
  label: string;
  sublabel?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  color?: string;
  icon?: React.ReactNode;
  delay?: number;
}

export function StatCard({ 
  value, 
  label, 
  sublabel,
  trend,
  trendValue,
  color = "#06B6D4",
  icon,
  delay = 0 
}: StatCardProps) {
  return (
    <motion.div
      className="relative p-5 rounded-xl overflow-hidden bg-white border border-neutral-200"
      style={{ 
        background: `linear-gradient(135deg, ${color}08 0%, transparent 50%)`,
        border: `1px solid ${color}20`,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      {/* Glow effect */}
      <div 
        className="absolute -top-10 -right-10 w-20 h-20 rounded-full blur-2xl opacity-20"
        style={{ backgroundColor: color }}
      />
      
      <div className="relative">
        {icon && (
          <div className="mb-3 text-neutral-400">
            {icon}
          </div>
        )}
        
        <div className="flex items-baseline gap-2">
          <motion.span 
            className="text-3xl font-bold"
            style={{ color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.2 }}
          >
            {value}
          </motion.span>
          
          {trend && (
            <span className={`text-xs font-medium ${
              trend === "up" ? "text-emerald-600" : 
              trend === "down" ? "text-rose-600" : "text-neutral-400"
            }`}>
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
            </span>
          )}
        </div>
        
        <div className="text-sm font-medium text-neutral-900 mt-1">{label}</div>
        {sublabel && <div className="text-xs text-neutral-500 mt-1">{sublabel}</div>}
      </div>
    </motion.div>
  );
}
