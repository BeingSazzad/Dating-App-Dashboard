import {
  Image as ImageIcon,
  Loader2,
  ShieldAlert,
  User,
} from "lucide-react";
import {
  Modal as Dialog,
  ModalContent as DialogContent,
  ModalDescription as DialogDescription,
  ModalFooter as DialogFooter,
  ModalHeader as DialogHeader,
  ModalTitle as DialogTitle,
} from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AiScorePill, StatusBadge, TierBadge } from "@/components/users";
import { useGetUserQuery } from "@/services";
import { formatDate, initials } from "@/lib/utils";
import type { UserReport } from "@/types";

interface ReportDetailsDialogProps {
  report: UserReport | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onResolveClick: (report: UserReport) => void;
  onIgnoreClick: (report: UserReport) => void;
  onWarnClick: (report: UserReport) => void;
  onBanClick: (report: UserReport) => void;
  onImageClick: (url: string) => void;
}

export function ReportDetailsDialog({
  report,
  open,
  onOpenChange,
  onResolveClick,
  onIgnoreClick,
  onWarnClick,
  onBanClick,
  onImageClick,
}: ReportDetailsDialogProps) {
  const { data: reportedUser, isLoading: isLoadingUser } = useGetUserQuery(
    report?.reportedUserId || "",
    { skip: !report }
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-primary" />
            Report Details
          </DialogTitle>
          <DialogDescription>
            Review report details and take actions directly.
          </DialogDescription>
        </DialogHeader>

        {report && (
          <div className="space-y-4 my-2">
            {/* Report Information */}
            <div className="space-y-2.5 rounded-lg border p-4 bg-muted/20">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-mono">
                  ID: {report.id}
                </span>
                <Badge
                  variant={
                    report.status === "pending"
                      ? "warning"
                      : report.status === "resolved"
                        ? "success"
                        : "muted"
                  }
                >
                  {report.status}
                </Badge>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Reason</span>
                <div className="font-semibold text-sm mt-0.5">{report.reason}</div>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Details</span>
                <p className="text-sm text-foreground leading-relaxed mt-1 whitespace-pre-line italic">
                  "{report.details || "No comments provided by reporter."}"
                </p>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-2 mt-2">
                <span>Reporter: <strong>{report.reporterName}</strong></span>
                <span>{formatDate(report.reportedAt)}</span>
              </div>
            </div>

            {/* Proof Image Section (if available) */}
            {report.imageUrl && (
              <div className="space-y-2 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <ImageIcon className="h-3.5 w-3.5" /> Proof Image
                </span>
                <button
                  type="button"
                  onClick={() => onImageClick(report.imageUrl!)}
                  className="w-full text-left focus:outline-none hover:opacity-90 transition-opacity rounded overflow-hidden"
                >
                  <img src={report.imageUrl} alt="Proof" className="max-w-full h-auto rounded border" />
                </button>
              </div>
            )}

            {/* Reported User Profile snippet */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" />
                Reported User Profile
              </span>

              {isLoadingUser ? (
                <div className="flex items-center justify-center p-6 border rounded-lg">
                  <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" />
                  <span className="text-sm text-muted-foreground">Loading profile...</span>
                </div>
              ) : reportedUser ? (
                <div className="rounded-lg border p-4 bg-card space-y-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border border-border">
                      <AvatarImage src={reportedUser.avatar} alt={reportedUser.name} />
                      <AvatarFallback className="text-sm">{initials(reportedUser.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-bold text-sm text-foreground">{reportedUser.name}</h4>
                      <p className="text-xs text-muted-foreground capitalize">
                        {reportedUser.age} years old • {reportedUser.gender.replace("_", " ")} • {reportedUser.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={reportedUser.status} />
                    <TierBadge tier={reportedUser.subscription} />
                    <AiScorePill score={reportedUser.aiScore} />
                  </div>

                  {reportedUser.bio && (
                    <p className="text-xs text-muted-foreground italic leading-relaxed border-t border-border/60 pt-2.5 mt-2">
                      "{reportedUser.bio}"
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-destructive">Could not load profile details.</p>
              )}
            </div>
          </div>
        )}

        <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between sm:items-center">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Close
          </Button>

          {report && report.status === "pending" && (
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onIgnoreClick(report)}
                className="text-muted-foreground"
              >
                Ignore
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onResolveClick(report)}
                className="text-success hover:bg-success/5 border-success/30 hover:border-success/60"
              >
                Resolve
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onWarnClick(report)}
                className="text-warning hover:bg-warning/5 border-warning/30 hover:border-warning/60"
              >
                Warn
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onBanClick(report)}
              >
                Ban
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
