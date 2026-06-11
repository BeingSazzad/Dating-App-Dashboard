import { BadgeCheck, Crown, DollarSign, Users } from "lucide-react";
import { StatCard } from "@/components/shared";
import { formatCompact, formatCurrency } from "@/lib/utils";

// Define the shape of your new API response
interface StatsData {
  total_users: number;
  verified_users: number;
  premiumUsers: number;
  total_revenue: number;
}

export function KpiCards({ data, isLoading }: { data?: StatsData; isLoading: boolean }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Total Users"
        value={data ? formatCompact(data.total_users) : "—"}
        icon={Users}
        hint="All time"
        isLoading={isLoading}
        accent
      />
      <StatCard
        label="Verified Users"
        value={data ? formatCompact(data.verified_users) : "—"}
        icon={BadgeCheck}
        hint="All time"
        isLoading={isLoading}
      />
      <StatCard
        label="Premium Users"
        value={data ? formatCompact(data.premiumUsers) : "—"}
        icon={Crown}
        hint="All time"
        isLoading={isLoading}
      />
      <StatCard
        label="Total Revenue"
        value={data ? formatCurrency(data.total_revenue) : "—"}
        icon={DollarSign}
        hint="All time"
        isLoading={isLoading}
      />
    </div>
  );
}