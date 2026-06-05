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

  const columns: Column<UserReport>[] = [
    {
      key: "id",
      header: "Report ID",
      cell: (r) => <span className="font-mono text-xs text-muted-foreground">{r.id}</span>,
    },
    {
      key: "reporterName",
      header: "Reporter",
      sortable: true,
      cell: (r) => <span className="font-medium">{r.reporterName}</span>,
    },
    {
      key: "reportedUserName",
      header: "Reported User",
      sortable: true,
      cell: (r) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/users/${r.reportedUserId}`);
          }}
          className="font-semibold text-primary hover:underline"
        >
          {r.reportedUserName}
        </button>
      ),
    },
    {
      key: "reason",
      header: "Reason",
      sortable: true,
      cell: (r) => {
        const variantMap: Record<UserReport["reason"], "default" | "destructive" | "warning" | "outline"> = {
          "Fake profile": "outline",
          Harassment: "destructive",
          Spam: "warning",
          "Inappropriate content": "default",
        };
        return <Badge variant={variantMap[r.reason]}>{r.reason}</Badge>;
      },
    },
    {
      key: "reportedAt",
      header: "Date",
      sortable: true,
      cell: (r) => <span className="text-muted-foreground">{formatDate(r.reportedAt)}</span>,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      cell: (r) => {
        if (r.status === "pending") {
          return (
            <Badge variant="warning">
              <Clock className="h-3 w-3 animate-pulse" />
              Pending
            </Badge>
          );
        }
        if (r.status === "resolved") {
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
            Ignored
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
            disabled={r.status !== "pending"}
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
              <DropdownMenuItem onClick={() => navigate(`/users/${r.reporterId}`)}>
                <Eye className="h-4 w-4" /> View Reporter Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(`/users/${r.reportedUserId}`)}>
                <Eye className="h-4 w-4" /> View Reported Profile
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => onResolveClick(r)}
                disabled={r.status !== "pending"}
              >
                <CheckCircle2 className="h-4 w-4 text-success" /> Resolve Report
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => onIgnoreClick(r)}
                disabled={r.status !== "pending"}
              >
                <XCircle className="h-4 w-4 text-muted-foreground" /> Ignore Report
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => onWarnClick(r)}
                disabled={r.status !== "pending"}
              >
                <AlertTriangle className="h-4 w-4 text-warning" /> Warn User
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                variant="destructive"
                onClick={() => onBanClick(r)}
                disabled={r.status !== "pending"}
              >
                <ShieldBan className="h-4 w-4" /> Ban User
              </DropdownMenuItem>
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
      rowKey={(r) => r.id}
      isLoading={isLoading}
      onRowClick={onRowClick}
      emptyTitle="No reports in queue"
      emptyDescription="Everything is clean! No member reports currently pending."
    />
  );
}
