import { Crown, DollarSign, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/shared";
import { useGetSubscriptionOverviewQuery } from "@/services";
import { formatCompact, formatCurrency } from "@/lib/utils";

export function SubscriptionOverviewCards() {
  const { data, isLoading } = useGetSubscriptionOverviewQuery();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatCard
        label="Premium Users"
        value={data ? formatCompact(data.premiumUsers) : "—"}
        icon={Crown}
        isLoading={isLoading}
        accent
      />
      <StatCard
        label="Total Revenue"
        value={data ? formatCurrency(data.revenue) : "—"}
        icon={DollarSign}
        isLoading={isLoading}
      />
      <StatCard
        label="Monthly Revenue"
        value={data ? formatCurrency(data.monthlyRevenue) : "—"}
        icon={TrendingUp}
        hint="last 30 days"
        isLoading={isLoading}
      />
    </div>
  );
}
