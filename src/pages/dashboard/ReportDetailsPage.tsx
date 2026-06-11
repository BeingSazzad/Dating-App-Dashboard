import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { EmptyState, PageHeader } from "@/components/shared";
import { SendWarningDialog, BanUserDialog } from "@/components/users";
import { useUpdateReportMutation } from "@/services";
import { formatDate, initials } from "@/lib/utils";
import { useGetSingleReportQuery } from "@/redux/apiSlices/admin/reportsApi";
import type { UserReport } from "@/types";
import { getImageUrl } from "@/utils/getImageUrl";

const STATUS_STYLE: Record<string, string> = {
  active: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  pending: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  resolved: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  ignored: "bg-muted text-muted-foreground border-border",
};

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <div className="text-sm text-foreground">{value}</div>
    </div>
  );
}

export function ReportDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: reportRes, isLoading, refetch } = useGetSingleReportQuery(
    { id: id ?? "" },
    { skip: !id }
  );
  const report: UserReport | null = reportRes?.data ?? null;

  const [updateReport] = useUpdateReportMutation();

  const [warnOpen, setWarnOpen] = React.useState(false);
  const [banOpen, setBanOpen] = React.useState(false);
  const [imageOpen, setImageOpen] = React.useState(false);

  const reportId = report?._id ?? report?.id ?? "N/A";
  const reporter = report?.user ?? null;
  const reportedUser = report?.reportedUser ?? null;
  const reporterName = reporter?.name ?? "N/A";
  const reportedUserName = reportedUser?.name ?? "N/A";
  const reportedUserId = reportedUser?._id ?? "";
  const images = report?.images ?? [];
  const createdAt = report?.createdAt ?? report?.reportedAt ?? null;
  const status = report?.status ?? "N/A";

  const handleResolve = async () => {
    if (!report?._id) return;
    await updateReport({ id: report._id, status: "resolved" });
    navigate("/reports");
  };

  const handleIgnore = async () => {
    if (!report?._id) return;
    await updateReport({ id: report._id, status: "ignored" });
    navigate("/reports");
  };

  // Ban is handled by BanUserDialog

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        Loading report...
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

  return (
    <div className="space-y-6">
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
          description={`Reviewing report ${reportId}`}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="space-y-5 lg:col-span-3">
          <Card className="space-y-4 p-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">{reportId}</span>
              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLE[status] ?? ""}`}
              >
                {status}
              </span>
            </div>

            <InfoRow
              label="Type"
              value={<span className="font-semibold">{report.type ?? "N/A"}</span>}
            />
            <InfoRow
              label="Message"
              value={
                <p className="leading-relaxed italic text-foreground/80">
                  "{report.message ?? "N/A"}"
                </p>
              }
            />
            <InfoRow
              label="Reporter"
              value={
                <span>
                  {reporterName}
                  {reporter?.email ? ` · ${reporter.email}` : ""}
                </span>
              }
            />
            <InfoRow
              label="Reported User"
              value={
                <span>
                  {reportedUserName}
                  {reportedUser?.email ? ` · ${reportedUser.email}` : ""}
                </span>
              }
            />

            <div className="flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
              <span>Created: {createdAt ? formatDate(createdAt) : "N/A"}</span>
              <span>Updated: {report.updatedAt ? formatDate(report.updatedAt) : "N/A"}</span>
            </div>
          </Card>

          <Card className="space-y-3 p-5">
            <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              <ImageIcon className="h-3.5 w-3.5" />
              Images
            </p>

            {images.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {images.map((src, index) => (
                  <button
                    key={`${src}-${index}`}
                    type="button"
                    onClick={() => setImageOpen(true)}
                    className="group relative overflow-hidden rounded-lg border border-border focus:outline-none"
                  >
                    <img
                      src={getImageUrl(src)}
                      alt={`Report image ${index + 1}`}
                      className="h-48 w-full object-cover transition-opacity group-hover:opacity-80"
                    />
                    <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                      <span className="flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-sm text-white">
                        <ExternalLink className="h-4 w-4" />
                        View full size
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">N/A</p>
            )}
          </Card>
        </div>

        <div className="space-y-5 lg:col-span-2">
          <Card className="space-y-4 p-5">
            <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              <User className="h-3.5 w-3.5" />
              Users
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border border-border">
                  <AvatarImage src={reporter?.image ?? ""} alt={reporterName} />
                  <AvatarFallback>{initials(reporterName)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold text-sm">Reporter</p>
                  <p className="text-xs text-muted-foreground">
                    {reporterName}
                    {reporter?.status ? ` · ${reporter.status}` : ""}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border border-border">
                  <AvatarImage src={reportedUser?.image ?? ""} alt={reportedUserName} />
                  <AvatarFallback>{initials(reportedUserName)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold text-sm">Reported User</p>
                  <p className="text-xs text-muted-foreground">
                    {reportedUserName}
                    {reportedUser?.status ? ` · ${reportedUser.status}` : ""}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="space-y-3 p-5">
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
                className="justify-start border-emerald-500/40 text-emerald-600 hover:bg-emerald-50"
                onClick={handleResolve}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Mark as Resolved
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="justify-start border-amber-500/40 text-amber-600 hover:bg-amber-50"
                onClick={() => setWarnOpen(true)}
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                Send Warning
              </Button>
              {reportedUser?.status === "delete" ? (
                <Button
                  className="justify-start bg-green-500 text-white hover:bg-green-600"
                  size="sm"
                  onClick={() => setBanOpen(true)}
                >
                  <Ban className="mr-2 h-4 w-4" />
                  Unban User
                </Button>
              ) : (
                <Button
                  variant="destructive"
                  size="sm"
                  className="justify-start"
                  onClick={() => setBanOpen(true)}
                >
                  <Ban className="mr-2 h-4 w-4" />
                  Ban User
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>

      <Dialog open={imageOpen} onOpenChange={setImageOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Report Images</DialogTitle>
          </DialogHeader>
          {images.length > 0 ? (
            <div className="grid gap-3">
              {images.map((src, index) => (
                <img
                  key={`${src}-modal-${index}`}
                  src={src}
                  alt={`Report image ${index + 1}`}
                  className="h-auto w-full rounded-lg"
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">N/A</p>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setImageOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <SendWarningDialog
        userId={reportedUserId || null}
        userName={reportedUserName}
        open={warnOpen}
        onOpenChange={setWarnOpen}
      />

      <BanUserDialog
        userId={reportedUserId || null}
        userName={reportedUserName}
        isBanned={reportedUser?.status === "delete"}
        open={banOpen}
        onOpenChange={setBanOpen}
        refetch={refetch}
      />
    </div>
  );
}