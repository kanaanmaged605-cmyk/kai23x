import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "up" | "down";
  icon: LucideIcon;
  iconColor?: string;
}

export function StatCard({ title, value, change, changeType, icon: Icon, iconColor }: StatCardProps) {
  return (
    <div className="glass-card rounded-xl p-5 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl font-bold text-foreground animate-count-up">{value}</p>
          <p className={cn(
            "text-xs mt-2 font-medium",
            changeType === "up" ? "text-success" : "text-destructive"
          )}>
            {changeType === "up" ? "↑" : "↓"} {change}
          </p>
        </div>
        <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", iconColor || "bg-primary/10")}>
          <Icon className={cn("h-5 w-5", iconColor ? "text-primary-foreground" : "text-primary")} />
        </div>
      </div>
    </div>
  );
}
