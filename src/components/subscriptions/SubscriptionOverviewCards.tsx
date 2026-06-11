import { Crown, DollarSign, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/shared";
import { formatCompact, formatCurrency } from "@/lib/utils";
import { useGetSubscriptionStatsQuery } from "@/redux/apiSlices/admin/subscriptionApi";

export function SubscriptionOverviewCards() {
  const { data: stats, isLoading } = useGetSubscriptionStatsQuery({});
  const data = stats?.data

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatCard
        label="Premium Users"
        value={data ? formatCompact(data.totalPremiumSubscribers) : "—"}
        icon={Crown}
        isLoading={isLoading}
        accent
      />
      <StatCard
        label="Total Revenue"
        value={data ? formatCurrency(data.totalRevenue) : "—"}
        icon={DollarSign}
        isLoading={isLoading}
      />
      <StatCard
        label="Monthly Revenue"
        value={data ? formatCurrency(data.thisMonthRevenue) : "—"}
        icon={TrendingUp}
        hint="last 30 days"
        isLoading={isLoading}
      />
    </div>
  );
}
