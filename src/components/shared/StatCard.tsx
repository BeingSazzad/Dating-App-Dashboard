import * as React from "react";
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  icon?: LucideIcon;
  trend?: number;
  hint?: string;
  isLoading?: boolean;
  accent?: boolean;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  hint,
  isLoading,
  accent,
}: StatCardProps) {
  const positive = (trend ?? 0) >= 0;

  if (isLoading) {
    return (
      <Card className="p-5">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-4 h-8 w-32" />
        <Skeleton className="mt-3 h-4 w-20" />
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "relative overflow-hidden p-5 transition-shadow hover:shadow-soft",
        accent && "bg-gradient-to-br from-primary/10 via-card to-card",
      )}
    >
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {Icon && (
          <span
            className={cn(
              "grid h-9 w-9 place-items-center rounded-lg",
              accent ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground",
            )}
          >
            <Icon className="h-4.5 w-4.5" strokeWidth={2} />
          </span>
        )}
      </div>
      <p className="mt-3 font-display text-3xl font-semibold tracking-tight">
        {value}
      </p>
      <div className="mt-2 flex items-center gap-2 text-sm">
        {typeof trend === "number" && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 font-semibold",
              positive ? "text-success" : "text-destructive",
            )}
          >
            {positive ? (
              <ArrowUpRight className="h-3.5 w-3.5" />
            ) : (
              <ArrowDownRight className="h-3.5 w-3.5" />
            )}
            {Math.abs(trend)}%
          </span>
        )}
        {hint && <span className="text-muted-foreground">{hint}</span>}
      </div>
    </Card>
  );
}
