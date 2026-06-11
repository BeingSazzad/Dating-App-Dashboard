import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Eye,
  MoreHorizontal,
  XCircle,
  ShieldBan,
} from "lucide-react";
import { DataTable, type Column } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import { formatDate } from "@/lib/utils";
import type { UserReport } from "@/types";

interface ReportsTableProps {
  data: UserReport[];
  isLoading: boolean;
  onRowClick: (report: UserReport) => void;
  onWarnClick: (report: UserReport) => void;
  onBanClick: (report: UserReport) => void;
  onResolveClick: (report: UserReport) => void;
  onIgnoreClick: (report: UserReport) => void;
}

export function ReportsTable({
  data,
  isLoading,
  onRowClick,
  onWarnClick,
  onBanClick,
  onResolveClick,
  onIgnoreClick,
}: ReportsTableProps) {
  const navigate = useNavigate();
  const getReportId = (r: UserReport) => r._id ?? r.id ?? "N/A";
  const getReporterName = (r: UserReport) =>
    r.user?.name ?? r.reporterName ?? "N/A";
  const getReporterId = (r: UserReport) =>
    r.user?._id ?? r.reporterId ?? "N/A";
  const getReportedUserName = (r: UserReport) =>
    r?.reportedUser?.name ?? r.reportedUserName ?? "N/A";
  const getReportedUserId = (r: UserReport) =>
    r.reportedUser?._id ?? r.reportedUserId ?? "N/A";
  const getDate = (r: UserReport) =>
    r.createdAt ?? r.reportedAt ?? null;
  const getStatus = (r: UserReport) =>
    r.status ?? "N/A";

  const columns: Column<UserReport>[] = [
    {
      key: "_id",
      header: "Report ID",
      cell: (r) => <span className="font-mono text-xs text-muted-foreground">{getReportId(r)}</span>,
    },
    {
      key: "user",
      header: "Reporter",
      sortable: true,
      cell: (r) => <span className="font-medium">{getReporterName(r)}</span>,
    },
    {
      key: "reportedUser",
      header: "Reported User",
      sortable: true,
      cell: (r) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/users/${getReportedUserId(r)}`);
          }}
          className="font-semibold text-primary hover:underline"
        >
          {getReportedUserName(r)}
        </button>
      ),
    },
    {
      key: "message",
      header: "Message",
      sortable: true,
      cell: (r) => <span className="max-w-[320px] truncate text-sm text-muted-foreground">{r.message ?? "N/A"}</span>,
    },
    {
      key: "images",
      header: "Images",
      cell: (r) => <span className="text-muted-foreground">{r.images?.length ?? 0}</span>,
    },
    {
      key: "type",
      header: "Type",
      cell: (r) => <Badge variant="outline">{r.type ?? "N/A"}</Badge>,
    },
    {
      key: "createdAt",
      header: "Date",
      sortable: true,
      cell: (r) => <span className="text-muted-foreground">{getDate(r) ? formatDate(getDate(r) as string) : "N/A"}</span>,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      cell: (r) => {
        const status = getStatus(r);
        if (status === "pending" || status === "active") {
          return (
            <Badge variant="warning">
              <Clock className="h-3 w-3 animate-pulse" />
              Active
            </Badge>
          );
        }
        if (status === "resolved") {
          return (
            <Badge variant="success">
              <CheckCircle2 className="h-3 w-3" />
              Resolved
            </Badge>
          );
        }
        return (
          <Badge variant="muted">
            <XCircle className="h-3 w-3" />
            {status || "N/A"}
          </Badge>
        );
      },
    },
    {
      key: "actions",
      header: "",
      align: "right",
      cell: (r) => (
        <div className="flex items-center gap-1.5 justify-end" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onWarnClick(r)}
            disabled={getStatus(r) !== "pending" && getStatus(r) !== "active"}
            className="text-warning hover:bg-warning/10"
            title="Warn User"
            aria-label="Warn User"
          >
            <AlertTriangle className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Row actions">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Moderation Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigate(`/users/${getReporterId(r)}`)}>
                <Eye className="h-4 w-4" /> View Reporter Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(`/users/${getReportedUserId(r)}`)}>
                <Eye className="h-4 w-4" /> View Reported Profile
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => onResolveClick(r)}
                disabled={getStatus(r) !== "pending" && getStatus(r) !== "active"}
              >
                <CheckCircle2 className="h-4 w-4 text-success" /> Resolve Report
              </DropdownMenuItem>

              {/* <DropdownMenuItem
                onClick={() => onIgnoreClick(r)}
                disabled={getStatus(r) !== "pending" && getStatus(r) !== "active"}
              >
                <XCircle className="h-4 w-4 text-muted-foreground" /> Ignore Report
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => onWarnClick(r)}
                disabled={getStatus(r) !== "pending" && getStatus(r) !== "active"}
              >
                <AlertTriangle className="h-4 w-4 text-warning" /> Warn User
              </DropdownMenuItem> */}

              <DropdownMenuSeparator />

              {r.reportedUser?.status === "delete" ? (
                <DropdownMenuItem
                  className="text-green-600 focus:bg-green-50 focus:text-green-600"
                  onClick={() => onBanClick(r)}
                  disabled={getStatus(r) !== "pending" && getStatus(r) !== "active"}
                >
                  <ShieldBan className="h-4 w-4" /> Unban User
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => onBanClick(r)}
                  disabled={getStatus(r) !== "pending" && getStatus(r) !== "active"}
                >
                  <ShieldBan className="h-4 w-4" /> Ban User
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      rowKey={(r) => r._id ?? r.id ?? "report-unknown"}
      isLoading={isLoading}
      onRowClick={onRowClick}
      emptyTitle="No reports in queue"
      emptyDescription="Everything is clean! No member reports currently pending."
    />
  );
}
