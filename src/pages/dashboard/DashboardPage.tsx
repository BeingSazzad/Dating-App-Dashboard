import { PageHeader } from "@/components/shared";
import {
  AdditionalStats,
  KpiCards,
  RecentUsersTable,
  RevenueOverviewCard,
  UserGrowthChart,
} from "@/components/dashboard";

import { useGetDashboardStatsQuery } from "@/redux/apiSlices/admin/dashboardApi";
import Spinner from "@/components/ui/Spinner";


export function DashboardPage() {

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