import * as React from "react";
import { PageHeader } from "@/components/shared";
import {
  AiScoringTab,
  PlansTab,
  SubscriptionOverviewCards,
  TransactionsTable,
} from "@/components/subscriptions";

const TABS = [
  { id: "ledger", label: "Ledger & Stats" },
  { id: "plans", label: "Plan Management" },
  { id: "ai", label: "AI Scoring" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function SubscriptionsPage() {
  const [tab, setTab] = React.useState<TabId>("ledger");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscriptions"
        description="Revenue overview, transaction ledger, plan management, and AI scoring pricing."
      />

      {/* Tab bar */}
      <div className="flex items-center gap-1 rounded-xl border border-border bg-muted/40 p-1 w-fit">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      {tab === "ledger" && (
        <div className="space-y-6">
          <SubscriptionOverviewCards />
          <TransactionsTable />
        </div>
      )}

      {tab === "plans" && (
        <div className="space-y-6">
          <PlansTab />
        </div>
      )}

      {tab === "ai" && (
        <div className="space-y-6">
          <AiScoringTab />
        </div>
      )}
    </div>
  );
}
