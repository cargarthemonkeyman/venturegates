"use client";

import { motion } from "framer-motion";

interface SkillBarProps {
  label: string;
  value: number;
  max?: number;
  color?: string;
  icon?: React.ReactNode;
}

export function SkillBar({ label, value, max = 100, color = "#06B6D4", icon }: SkillBarProps) {
  const percentage = (value / max) * 100;
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && <span className="text-neutral-500">{icon}</span>}
          <span className="text-sm font-medium text-neutral-900">{label}</span>
        </div>
        <span className="text-sm font-bold" style={{ color }}>{value}{max === 100 ? "%" : ""}</span>
      </div>
      <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
