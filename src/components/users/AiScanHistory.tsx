import { ScanLine } from "lucide-react";
import { DataTable, type Column } from "@/components/shared";
import { SectionCard } from "@/components/users/SectionCard";
import { AiScorePill } from "@/components/users/UserBadges";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { AiScanRecord } from "@/types";

export function AiScanHistory({ scans }: { scans: AiScanRecord[] }) {
  const columns: Column<AiScanRecord>[] = [
    {
      key: "scannedAt",
      header: "Scan Date",
      cell: (s) => formatDate(s.scannedAt),
    },
    {
      key: "score",
      header: "AI Score",
      align: "center",
      cell: (s) => (
        <div className="flex justify-center">
          <AiScorePill score={s.score} />
        </div>
      ),
    },
    {
      key: "amount",
      header: "Amount Charged",
      align: "right",
      cell: (s) => (
        <span className="font-medium">{formatCurrency(s.amount)}</span>
      ),
    },
  ];

  return (
    <SectionCard title="AI Scan History" icon={ScanLine}>
      <DataTable
        columns={columns}
        data={scans}
        rowKey={(s) => s.id}
        emptyTitle="No AI scans yet"
        skeletonRows={4}
      />
    </SectionCard>
  );
}
