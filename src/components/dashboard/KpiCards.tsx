import { BadgeCheck, Crown, DollarSign, Users } from "lucide-react";
import { StatCard } from "@/components/shared";
import { useGetKpisQuery } from "@/services";
import { formatCompact, formatCurrency } from "@/lib/utils";

export function KpiCards({ timeframe }: { timeframe: string }) {
  const { data, isLoading } = useGetKpisQuery(timeframe);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Total Users"
        value={data ? formatCompact(data.totalUsers) : "—"}
        icon={Users}
        trend={data?.trends.totalUsers}
        hint="vs last month"
        isLoading={isLoading}
        accent
      />
      <StatCard
        label="Verified Users"
        value={data ? formatCompact(data.verifiedUsers) : "—"}
        icon={BadgeCheck}
        trend={data?.trends.verifiedUsers}
        hint="vs last month"
        isLoading={isLoading}
      />
      <StatCard
        label="Premium Users"
        value={data ? formatCompact(data.premiumUsers) : "—"}
        icon={Crown}
        trend={data?.trends.premiumUsers}
        hint="vs last month"
        isLoading={isLoading}
      />
      <StatCard
        label="Revenue"
        value={data ? formatCurrency(data.revenue) : "—"}
        icon={DollarSign}
        trend={data?.trends.revenue}
        hint="vs last month"
        isLoading={isLoading}
      />
    </div>
  );
}
