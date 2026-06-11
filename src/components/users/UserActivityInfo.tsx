import {
  Flame,
  Gauge,
  Heart,
  MessageSquare,
  ShieldAlert,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SectionCard } from "@/components/users/SectionCard";
import { formatCompact } from "@/lib/utils";
import type { UserDetail } from "@/types";

export function UserActivityInfo({ user }: { user: UserDetail }) {
  const items: { label: string; value: string; icon: LucideIcon }[] = [
    {
      label: "Total Matches",
      value: user.stats?.totalMatches !== undefined ? formatCompact(user.stats.totalMatches) : "N/A",
      icon: Flame,
    },
    {
      label: "Total Likes",
      value: user.stats?.totalLikes !== undefined ? formatCompact(user.stats.totalLikes) : "N/A",
      icon: Heart,
    },
    {
      label: "Total Conversations",
      value: user.stats?.totalConversations !== undefined ? formatCompact(user.stats.totalConversations) : "N/A",
      icon: MessageSquare,
    },
    {
      label: "Current AI Score",
      value: user.ai_score !== undefined && user.ai_score !== null ? user.ai_score.toString() : "N/A",
      icon: Gauge,
    },
    {
      label: "Reports Received",
      value: user.stats?.reportsReceived !== undefined ? user.stats.reportsReceived.toString() : "N/A",
      icon: ShieldAlert,
    },
  ];

  return (
    <SectionCard title="Activity Information" icon={Flame}>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {items.map((it) => (
          <div
            key={it.label}
            className="rounded-lg border border-border bg-muted/30 p-4"
          >
            <it.icon className="h-4 w-4 text-primary" />
            <p className="mt-3 font-display text-2xl font-semibold">
              {it.value}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{it.label}</p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
