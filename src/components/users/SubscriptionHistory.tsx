import { CreditCard } from "lucide-react";
import { DataTable, type Column } from "@/components/shared";
import { SectionCard } from "@/components/users/SectionCard";
import { TierBadge } from "@/components/users/UserBadges";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { SubscriptionRecord } from "@/types";

export function SubscriptionHistory({
  records,
}: {
  records: SubscriptionRecord[];
}) {
  const columns: Column<SubscriptionRecord>[] = [
    {
      key: "plan",
      header: "Plan Name",
      cell: (r) => <TierBadge tier={r.plan} />,
    },
    {
      key: "purchasedAt",
      header: "Purchase Date",
      cell: (r) => formatDate(r.purchasedAt),
    },
    {
      key: "expiresAt",
      header: "Expire Date",
      cell: (r) => formatDate(r.expiresAt),
    },
    {
      key: "amount",
      header: "Amount Paid",
      align: "right",
      cell: (r) => (
        <span className="font-medium">{formatCurrency(r.amount)}</span>
      ),
    },
  ];

  return (
    <SectionCard title="Subscription History" icon={CreditCard}>
      <DataTable
        columns={columns}
        data={records}
        rowKey={(r) => r.id}
        emptyTitle="No subscriptions yet"
        skeletonRows={3}
      />
    </SectionCard>
  );
}
