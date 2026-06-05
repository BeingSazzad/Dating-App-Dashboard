import { ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared";
import { SectionCard } from "@/components/users/SectionCard";
import { formatDate } from "@/lib/utils";
import type { ReportRecord } from "@/types";

export function UserReports({ reports }: { reports: ReportRecord[] }) {
  return (
    <SectionCard
      title="Reports"
      icon={ShieldAlert}
      action={
        <Badge variant={reports.length ? "warning" : "muted"}>
          {reports.length} total
        </Badge>
      }
    >
      {reports.length === 0 ? (
        <EmptyState
          title="No reports"
          description="This user has a clean record."
        />
      ) : (
        <ul className="divide-y divide-border">
          {reports.map((r) => (
            <li
              key={r.id}
              className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0"
            >
              <div className="space-y-0.5">
                <p className="text-sm font-medium">{r.reason}</p>
                <p className="text-xs text-muted-foreground">
                  Reported by {r.reporter} · {formatDate(r.reportedAt)}
                </p>
              </div>
              <Badge variant={r.resolved ? "success" : "warning"}>
                {r.resolved ? "Resolved" : "Open"}
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}
