import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Clock, CheckCircle2, XCircle, ShieldAlert } from "lucide-react";
import { PageHeader, StatCard, ConfirmDialog } from "@/components/shared";
import { Card } from "@/components/ui/card";
import { SendWarningDialog } from "@/components/users";
import { ReportsTable } from "@/components/reports";
import {
  useGetReportsQuery,
  useUpdateReportMutation,
  useBanUserFromReportMutation,
} from "@/services";
import type { UserReport } from "@/types";

export function ReportsPage() {
  const navigate = useNavigate();
  const { data: reports = [], isLoading, isFetching } = useGetReportsQuery();
  const [updateReport] = useUpdateReportMutation();
  const [banUser, { isLoading: isBanning }] = useBanUserFromReportMutation();

  const [warnTarget, setWarnTarget] = React.useState<UserReport | null>(null);
  const [banTarget, setBanTarget] = React.useState<UserReport | null>(null);

  const totalReports    = reports.length;
  const pendingReports  = reports.filter((r) => r.status === "pending").length;
  const resolvedReports = reports.filter((r) => r.status === "resolved").length;
  const ignoredReports  = reports.filter((r) => r.status === "ignored").length;

  const handleConfirmBan = async () => {
    if (!banTarget) return;
    await banUser(banTarget.reportedUserId).unwrap().catch(() => undefined);
    setBanTarget(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Report Management"
        description="Review and act on reports from members regarding safety, spam, and harassment."
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Reports"      value={totalReports}    icon={ShieldAlert}   isLoading={isLoading} accent />
        <StatCard label="Pending Moderation" value={pendingReports}  icon={Clock}         isLoading={isLoading} />
        <StatCard label="Resolved Reports"   value={resolvedReports} icon={CheckCircle2}  isLoading={isLoading} />
        <StatCard label="Ignored Reports"    value={ignoredReports}  icon={XCircle}       isLoading={isLoading} />
      </div>

      {/* Reports Table */}
      <Card className="p-4 sm:p-5">
        <ReportsTable
          data={reports}
          isLoading={isLoading || isFetching}
          onRowClick={(r) => navigate(`/reports/${r.id}`)}
          onWarnClick={(r) => setWarnTarget(r)}
          onBanClick={(r) => setBanTarget(r)}
          onResolveClick={(r) => updateReport({ id: r.id, status: "resolved" })}
          onIgnoreClick={(r) => updateReport({ id: r.id, status: "ignored" })}
        />
      </Card>

      {/* Send Warning */}
      <SendWarningDialog
        userId={warnTarget?.reportedUserId ?? null}
        userName={warnTarget?.reportedUserName}
        open={Boolean(warnTarget)}
        onOpenChange={(o) => !o && setWarnTarget(null)}
      />

      {/* Ban Confirm */}
      <ConfirmDialog
        open={Boolean(banTarget)}
        onOpenChange={(o) => !o && setBanTarget(null)}
        title="Ban User & Resolve Reports"
        description={`Are you sure you want to permanently ban ${banTarget?.reportedUserName}? This will restrict their account access.`}
        confirmLabel="Ban User"
        destructive
        loading={isBanning}
        onConfirm={handleConfirmBan}
      />
    </div>
  );
}
