import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  description?: string;
}

export default function StatCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  description,
}: StatCardProps) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex flex-col gap-3 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-[#6B7280]">{title}</span>
        <div className="w-8 h-8 rounded-lg bg-[#F0F4FF] flex items-center justify-center">
          <Icon className="w-4 h-4 text-[#2563EB]" />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[28px] font-bold text-[#0F0F0F] leading-none tracking-tight">
          {value}
        </span>
        {change && (
          <span
            className={cn(
              "text-[12px] font-medium",
              changeType === "positive" && "text-emerald-600",
              changeType === "negative" && "text-red-500",
              changeType === "neutral" && "text-[#6B7280]",
            )}
          >
            {change}
          </span>
        )}
        {description && (
          <span className="text-[12px] text-[#9CA3AF]">{description}</span>
        )}
      </div>
    </div>
  );
}
