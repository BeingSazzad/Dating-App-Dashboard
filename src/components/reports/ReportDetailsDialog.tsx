import * as React from "react";
import {
  Image as ImageIcon,
  Loader2,
  ShieldAlert,
  User,
  X,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Ban,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AiScorePill, StatusBadge, TierBadge } from "@/components/users";
import { useGetUserQuery } from "@/services";
import { formatDate, initials } from "@/lib/utils";
import type { UserReport } from "@/types";

interface Props {
  report: UserReport | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onResolveClick: (report: UserReport) => void;
  onIgnoreClick: (report: UserReport) => void;
  onWarnClick: (report: UserReport) => void;
  onBanClick: (report: UserReport) => void;
  onImageClick: (url: string) => void;
}

const STATUS_STYLE: Record<string, string> = {
  pending:  "bg-amber-500/10 text-amber-600 border-amber-500/30",
  resolved: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  ignored:  "bg-muted text-muted-foreground border-border",
};

export function ReportDetailsDialog({
  report,
  open,
  onOpenChange,
  onResolveClick,
  onIgnoreClick,
  onWarnClick,
  onBanClick,
  onImageClick,
}: Props) {
  const { data: reportedUser, isLoading: isLoadingUser } = useGetUserQuery(
    report?.reportedUserId || "",
    { skip: !report }
  );

  /* Close on Escape */
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onOpenChange]);

  if (!open || !report) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity"
        onClick={() => onOpenChange(false)}
      />

      {/* Slide-in Panel */}
      <aside className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-background shadow-2xl ring-1 ring-border/60 transition-transform">

        {/* ── Header ─────────────────────────────────────── */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-primary" />
            <span className="font-semibold text-sm">Report Details</span>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ── Scrollable Body ─────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

          {/* Report Card */}
          <div className="rounded-lg border bg-muted/20 p-4 space-y-3">
            {/* ID + Status */}
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] text-muted-foreground">
                {report.id}
              </span>
              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize ${STATUS_STYLE[report.status] ?? ""}`}
              >
                {report.status}
              </span>
            </div>

            {/* Reason */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">
                Reason
              </p>
              <p className="text-sm font-semibold">{report.reason}</p>
            </div>

            {/* Details */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">
                Details
              </p>
              <p className="text-sm text-foreground/80 leading-relaxed italic">
                "{report.details || "No comments provided by reporter."}"
              </p>
            </div>

            {/* Reporter + Date */}
            <div className="flex items-center justify-between border-t border-border/60 pt-2.5 text-xs text-muted-foreground">
              <span>
                Reporter: <strong className="text-foreground">{report.reporterName}</strong>
              </span>
              <span>{formatDate(report.reportedAt)}</span>
            </div>
          </div>

          {/* Proof Image — compact thumbnail */}
          {report.imageUrl && (
            <div className="space-y-1.5">
              <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <ImageIcon className="h-3.5 w-3.5" />
                Proof Image
              </p>
              <button
                type="button"
                onClick={() => onImageClick(report.imageUrl!)}
                className="group relative block w-full overflow-hidden rounded-lg border border-border focus:outline-none"
              >
                <img
                  src={report.imageUrl}
                  alt="Proof"
                  className="h-40 w-full object-cover transition-opacity group-hover:opacity-80"
                />
                <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="rounded-full bg-black/60 px-3 py-1 text-xs text-white flex items-center gap-1">
                    <ExternalLink className="h-3 w-3" /> View full
                  </span>
                </span>
              </button>
            </div>
          )}

          {/* Reported User Profile */}
          <div className="space-y-1.5">
            <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              <User className="h-3.5 w-3.5" />
              Reported User
            </p>

            {isLoadingUser ? (
              <div className="flex items-center justify-center gap-2 rounded-lg border p-6 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                Loading profile…
              </div>
            ) : reportedUser ? (
              <div className="rounded-lg border bg-card p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-11 w-11 border border-border">
                    <AvatarImage src={reportedUser.avatar} alt={reportedUser.name} />
                    <AvatarFallback>{initials(reportedUser.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-sm">{reportedUser.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {reportedUser.age} yrs · {reportedUser.gender.replace("_", " ")} · {reportedUser.location}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <StatusBadge status={reportedUser.status} />
                  <TierBadge tier={reportedUser.subscription} />
                  <AiScorePill score={reportedUser.aiScore} />
                </div>

                {reportedUser.bio && (
                  <p className="border-t border-border/60 pt-2.5 text-xs text-muted-foreground italic leading-relaxed">
                    "{reportedUser.bio}"
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-destructive">Could not load profile.</p>
            )}
          </div>
        </div>

        {/* ── Footer Actions ──────────────────────────────── */}
        <div className="border-t px-5 py-4">
          {report.status === "pending" ? (
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onIgnoreClick(report)}
                className="text-muted-foreground"
              >
                <XCircle className="mr-1.5 h-4 w-4" />
                Ignore
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onResolveClick(report)}
                className="text-emerald-600 border-emerald-500/40 hover:bg-emerald-50"
              >
                <CheckCircle2 className="mr-1.5 h-4 w-4" />
                Resolve
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onWarnClick(report)}
                className="text-amber-600 border-amber-500/40 hover:bg-amber-50"
              >
                <AlertTriangle className="mr-1.5 h-4 w-4" />
                Warn User
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onBanClick(report)}
              >
                <Ban className="mr-1.5 h-4 w-4" />
                Ban User
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          )}
        </div>
      </aside>
    </>
  );
}
