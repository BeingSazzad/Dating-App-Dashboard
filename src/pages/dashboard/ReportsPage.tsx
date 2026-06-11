import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Clock, CheckCircle2, XCircle, ShieldAlert } from "lucide-react";
import { PageHeader, StatCard, } from "@/components/shared";
import { Card } from "@/components/ui/card";
import { SendWarningDialog, BanUserDialog } from "@/components/users";
import { ReportsTable } from "@/components/reports";

import type { UserReport } from "@/types";
import { useGetAllReportsQuery, useReportsStatisticsQuery } from "@/redux/apiSlices/admin/reportsApi";
import Spinner from "@/components/ui/Spinner";

export function ReportsPage() {
  const navigate = useNavigate();
  const { data: reportsStatsRes, isLoading: isStatsLoading } = useReportsStatisticsQuery()
  const { data: reportsData, isLoading: isReportsLoading, refetch } = useGetAllReportsQuery();
  const reports = reportsData?.data ?? [];
  // const [updateReport] = useUpdateReportMutation();
  const updateReport = ({ id, status }: { id: string; status: string }) => {
    console.log("id", id, "status", status)
  }

  const [warnTarget, setWarnTarget] = React.useState<UserReport | null>(null);
  const [banTarget, setBanTarget] = React.useState<UserReport | null>(null);

  const totalReports = reportsStatsRes?.data?.totalReports;
  const pendingReports = reportsStatsRes?.data?.pendingReports;
  const resolvedReports = reportsStatsRes?.data?.resolvedReports;
  const ignoredReports = reportsStatsRes?.data?.ignoreReports;

  const getReportId = (report: UserReport) => report._id ?? report.id ?? "";
  const getReportedUserId = (report?: UserReport | null) =>
    report?.reportedUser?._id ?? report?.reportedUserId ?? "";
  const getReportedUserName = (report?: UserReport | null) =>
    report?.reportedUser?.name ?? report?.reportedUserName ?? "N/A";

  // The ban mutation is now handled inside BanUserDialog

  if (isReportsLoading || isStatsLoading) return <Spinner />
  return (
    <div className="space-y-6">
      <PageHeader
        title="Report Management"
        description="Review and act on reports from members regarding safety, spam, and harassment."
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Reports" value={totalReports} icon={ShieldAlert} isLoading={isStatsLoading} accent />
        <StatCard label="Pending Moderation" value={pendingReports} icon={Clock} isLoading={isStatsLoading} />
        <StatCard label="Resolved Reports" value={resolvedReports} icon={CheckCircle2} isLoading={isStatsLoading} />
        <StatCard label="Ignored Reports" value={ignoredReports} icon={XCircle} isLoading={isStatsLoading} />
      </div>

      {/* Reports Table */}
      <Card className="p-4 sm:p-5">
        <ReportsTable
          data={reports}
          isLoading={isReportsLoading}
          onRowClick={(r) => navigate(`/reports/${getReportId(r)}`)}
          onWarnClick={(r) => setWarnTarget(r)}
          onBanClick={(r) => setBanTarget(r)}
          onResolveClick={(r) => updateReport({ id: getReportId(r), status: "resolved" })}
          onIgnoreClick={(r) => updateReport({ id: getReportId(r), status: "ignored" })}
        />
      </Card>

      {/* Send Warning */}
      <SendWarningDialog
        userId={getReportedUserId(warnTarget) || null}
        userName={getReportedUserName(warnTarget)}
        open={Boolean(warnTarget)}
        onOpenChange={(o) => !o && setWarnTarget(null)}
      />

      {/* Ban Confirm */}
      <BanUserDialog
        userId={getReportedUserId(banTarget) || null}
        userName={getReportedUserName(banTarget)}
        isBanned={banTarget?.reportedUser?.status === "delete"}
        open={Boolean(banTarget)}
        onOpenChange={(o) => !o && setBanTarget(null)}
        refetch={refetch}
      />
    </div>
  );
}
