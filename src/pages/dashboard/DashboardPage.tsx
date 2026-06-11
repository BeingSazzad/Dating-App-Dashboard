import { useState } from "react";
import { PageHeader } from "@/components/shared";
import {
  AdditionalStats,
  KpiCards,
  RecentUsersTable,
  RevenueOverviewCard,
  UserGrowthChart,
} from "@/components/dashboard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetDashboardStatsQuery } from "@/redux/apiSlices/admin/dashboardApi";
import Spinner from "@/components/ui/Spinner";

const KPI_TIMEFRAMES = ["Today", "This Month", "This Year", "All Time"] as const;

export function DashboardPage() {
  const [kpiTimeframe, setKpiTimeframe] = useState<string>("This Month");

  // Single source of truth for top-level stats
  const { data: statsRes, isLoading: statsLoading } = useGetDashboardStatsQuery();
  const statsData = statsRes?.data;

  if (statsLoading) {
    return <Spinner />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="A live overview of members, revenue, and platform health."
        actions={
          <Select value={kpiTimeframe} onValueChange={setKpiTimeframe}>
            <SelectTrigger className="h-9 w-[140px] text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {KPI_TIMEFRAMES.map((t) => (
                <SelectItem key={t} value={t} className="text-sm">
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />
      <KpiCards data={statsData} isLoading={statsLoading} />
      <AdditionalStats data={statsData} isLoading={statsLoading} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <RevenueOverviewCard />
        <UserGrowthChart />
      </div>
      <RecentUsersTable />
    </div>
  );
}