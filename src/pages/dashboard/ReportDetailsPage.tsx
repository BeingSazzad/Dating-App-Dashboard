import * as React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  Ban,
  CheckCircle2,
  ExternalLink,
  Image as ImageIcon,
  Loader2,
  ShieldAlert,
  User,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import {
  Modal as Dialog,
  ModalContent as DialogContent,
  ModalHeader as DialogHeader,
  ModalTitle as DialogTitle,
  ModalFooter as DialogFooter,
} from "@/components/ui/modal";
import { AiScorePill, StatusBadge, TierBadge } from "@/components/users";
import { ConfirmDialog, EmptyState, PageHeader } from "@/components/shared";
import { SendWarningDialog } from "@/components/users";
import {
  useGetReportsQuery,
  useUpdateReportMutation,
  useBanUserFromReportMutation,
} from "@/services";
import { useGetUserQuery } from "@/services";
import { formatDate, initials } from "@/lib/utils";

const STATUS_STYLE: Record<string, string> = {
  pending:  "bg-amber-500/10 text-amber-600 border-amber-500/30",
  resolved: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  ignored:  "bg-muted text-muted-foreground border-border",
};

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">
        {label}
      </p>
      <div className="text-sm text-foreground">{value}</div>
    </div>
  );
}

export function ReportDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: reports = [], isLoading } = useGetReportsQuery();
  const [updateReport] = useUpdateReportMutation();
  const [banUser, { isLoading: isBanning }] = useBanUserFromReportMutation();

  const report = reports.find((r) => r.id === id);

  const [warnOpen, setWarnOpen] = React.useState(false);
  const [banOpen, setBanOpen] = React.useState(false);
  const [imageOpen, setImageOpen] = React.useState(false);

  const { data: reportedUser, isLoading: isLoadingUser } = useGetUserQuery(
    report?.reportedUserId ?? "",
    { skip: !report }
  );

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        Loading report…
      </div>
    );
  }

  if (!report) {
    return (
      <EmptyState
        icon={ShieldAlert}
        title="Report not found"
        description="This report may have been removed or the link is incorrect."
      />
    );
  }

  const handleResolve = async () => {
    await updateReport({ id: report.id, status: "resolved" });
    navigate("/reports");
  };

  const handleIgnore = async () => {
    await updateReport({ id: report.id, status: "ignored" });
    navigate("/reports");
  };

  const handleBan = async () => {
    await banUser(report.reportedUserId).unwrap().catch(() => undefined);
    setBanOpen(false);
    navigate("/reports");
  };

  return (
    <div className="space-y-6">
      {/* Back + Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/reports")}
          className="h-8 w-8 shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader
          title="Report Details"
          description={`Reviewing report ${report.id}`}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">

        {/* ── Left: Report info + Proof ──────────────────────────── */}
        <div className="space-y-5 lg:col-span-3">

          {/* Report Card */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">{report.id}</span>
              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLE[report.status] ?? ""}`}
              >
                {report.status}
              </span>
            </div>

            <InfoRow label="Reason" value={<span className="font-semibold">{report.reason}</span>} />
            <InfoRow
              label="Details"
              value={
                <p className="italic text-foreground/80 leading-relaxed">
                  "{report.details || "No comments provided by reporter."}"
                </p>
              }
            />

            <div className="flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
              <span>
                Reporter:{" "}
                <strong className="text-foreground">{report.reporterName}</strong>
              </span>
              <span>{formatDate(report.reportedAt)}</span>
            </div>
          </Card>

          {/* Proof Image */}
          {report.imageUrl && (
            <Card className="p-5 space-y-3">
              <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <ImageIcon className="h-3.5 w-3.5" />
                Proof Image
              </p>
              <button
                type="button"
                onClick={() => setImageOpen(true)}
                className="group relative block w-full overflow-hidden rounded-lg border border-border focus:outline-none"
              >
                <img
                  src={report.imageUrl}
                  alt="Proof"
                  className="h-56 w-full object-cover transition-opacity group-hover:opacity-80"
                />
                <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="rounded-full bg-black/60 px-3 py-1.5 text-sm text-white flex items-center gap-1.5">
                    <ExternalLink className="h-4 w-4" />
                    View full size
                  </span>
                </span>
              </button>
            </Card>
          )}
        </div>

        {/* ── Right: Reported user + Actions ────────────────────── */}
        <div className="space-y-5 lg:col-span-2">

          {/* Reported User */}
          <Card className="p-5 space-y-4">
            <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              <User className="h-3.5 w-3.5" />
              Reported User
            </p>

            {isLoadingUser ? (
              <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                Loading profile…
              </div>
            ) : reportedUser ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border border-border">
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
                  <p className="border-t border-border/60 pt-3 text-xs text-muted-foreground italic leading-relaxed">
                    "{reportedUser.bio}"
                  </p>
                )}

                <Link
                  to={`/users/${reportedUser.id}`}
                  className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  View full profile
                </Link>
              </div>
            ) : (
              <p className="text-sm text-destructive">Could not load profile.</p>
            )}
          </Card>

          {/* Actions */}
          {report.status === "pending" && (
            <Card className="p-5 space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Actions
              </p>
              <div className="grid grid-cols-1 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start text-muted-foreground"
                  onClick={handleIgnore}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Ignore Report
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start text-emerald-600 border-emerald-500/40 hover:bg-emerald-50"
                  onClick={handleResolve}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Mark as Resolved
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start text-amber-600 border-amber-500/40 hover:bg-amber-50"
                  onClick={() => setWarnOpen(true)}
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Send Warning
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="justify-start"
                  onClick={() => setBanOpen(true)}
                >
                  <Ban className="mr-2 h-4 w-4" />
                  Ban User
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* ── Dialogs ─────────────────────────────────────────────── */}

      {/* Full image */}
      <Dialog open={imageOpen} onOpenChange={setImageOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Proof Image</DialogTitle>
          </DialogHeader>
          {report.imageUrl && (
            <img src={report.imageUrl} alt="Proof" className="w-full h-auto rounded-lg" />
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setImageOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Warn */}
      <SendWarningDialog
        userId={report.reportedUserId}
        userName={report.reportedUserName}
        open={warnOpen}
        onOpenChange={setWarnOpen}
      />

      {/* Ban confirm */}
      <ConfirmDialog
        open={banOpen}
        onOpenChange={setBanOpen}
        title="Ban User"
        description={`Permanently ban ${report.reportedUserName}? This will restrict their access and resolve this report.`}
        confirmLabel="Ban User"
        destructive
        loading={isBanning}
        onConfirm={handleBan}
      />
    </div>
  );
}
