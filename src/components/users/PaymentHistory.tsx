import { Receipt } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DataTable, type Column } from "@/components/shared";
import { SectionCard } from "@/components/users/SectionCard";
import { PAYMENT_TYPE_LABELS } from "@/constants";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { PaymentRecord } from "@/types";

const STATUS_VARIANT: Record<
  PaymentRecord["status"],
  "success" | "warning" | "destructive"
> = {
  paid: "success",
  refunded: "warning",
  failed: "destructive",
};

export function PaymentHistory({ payments }: { payments: PaymentRecord[] }) {
  const columns: Column<PaymentRecord>[] = [
    {
      key: "date",
      header: "Date",
      cell: (p) => formatDate(p.date),
    },
    {
      key: "type",
      header: "Type",
      cell: (p) => (
        <Badge variant={p.type === "subscription" ? "default" : "secondary"}>
          {PAYMENT_TYPE_LABELS[p.type]}
        </Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (p) => (
        <Badge variant={STATUS_VARIANT[p.status]} className="capitalize">
          {p.status}
        </Badge>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      align: "right",
      cell: (p) => (
        <span className="font-medium">{formatCurrency(p.amount)}</span>
      ),
    },
  ];

  return (
    <SectionCard title="Payment History" icon={Receipt}>
      <DataTable
        columns={columns}
        data={payments}
        rowKey={(p) => p.id}
        emptyTitle="No payments yet"
        skeletonRows={4}
      />
    </SectionCard>
  );
}
