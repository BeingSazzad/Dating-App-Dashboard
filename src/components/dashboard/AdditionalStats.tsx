import { Activity, Gauge, ScanLine, UserPlus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetKpisQuery } from "@/services";
import { formatCompact } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface MiniStat {
  label: string;
  value: string;
  icon: LucideIcon;
}

export function AdditionalStats({ timeframe }: { timeframe: string }) {
  const { data, isLoading } = useGetKpisQuery(timeframe);

  const stats: MiniStat[] = [
    {
      label: "New Users Today",
      value: data ? formatCompact(data.newUsersToday) : "—",
      icon: UserPlus,
    },
    {
      label: "Active Users Today",
      value: data ? formatCompact(data.activeUsersToday) : "—",
      icon: Activity,
    },
    {
      label: "Average AI Score",
      value: data ? data.averageAiScore.toFixed(1) : "—",
      icon: Gauge,
    },
    {
      label: "Total AI Scans",
      value: data ? formatCompact(data.totalAiScans) : "—",
      icon: ScanLine,
    },
  ];

  return (
    <Card className="divide-y divide-border sm:grid sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4">
      {stats.map((s, i) => (
        <div
          key={s.label}
          className={cn(
            "flex items-center gap-3 p-5",
            i !== 0 && "sm:border-l sm:border-border",
            i === 2 && "sm:border-l-0 lg:border-l",
          )}
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
            <s.icon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {s.label}
            </p>
            {isLoading ? (
              <Skeleton className="mt-1.5 h-6 w-16" />
            ) : (
              <p className="font-display text-xl font-semibold">{s.value}</p>
            )}
          </div>
        </div>
      ))}
    </Card>
  );
}
