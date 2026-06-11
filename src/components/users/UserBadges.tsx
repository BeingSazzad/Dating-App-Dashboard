import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TIER_LABELS, USER_STATUS_LABELS } from "@/constants";
import { cn } from "@/lib/utils";
import type { SubscriptionTier, UserStatus } from "@/types";

/* ------------------------------------------------------------------ */
/* Status badge                                                         */
/* ------------------------------------------------------------------ */

const STATUS_VARIANT: Record<UserStatus, "success" | "destructive"> = {
  active: "success",
  delete: "destructive",
};

export function StatusBadge({ status }: { status: UserStatus }) {
  return (
    <Badge variant={STATUS_VARIANT[status]}>
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          status === "active" && "bg-success",
          status === "delete" && "bg-destructive",
        )}
      />
      {USER_STATUS_LABELS[status]}
    </Badge>
  );
}

/* ------------------------------------------------------------------ */
/* Tier badge                                                           */
/* ------------------------------------------------------------------ */

export function TierBadge({ tier }: { tier: SubscriptionTier }) {
  return (
    <Badge variant="default">
      <Sparkles className="h-3 w-3" />
      {TIER_LABELS[tier]}
    </Badge>
  );
}

/* ------------------------------------------------------------------ */
/* AI Score pill — scale 0–10                                           */
/* ------------------------------------------------------------------ */

export function AiScorePill({ score }: { score: number }) {
  // Score is 0–10. Normalise to 0–100 for the ring circumference.
  const pct = Math.min(Math.max(score / 10, 0), 1); // 0..1
  const circumference = 2 * Math.PI * 15; // r=15 → 94.25
  const dash = pct * circumference;

  const ringColor =
    score >= 8
      ? "hsl(var(--success))"
      : score >= 5
        ? "hsl(var(--warning))"
        : "hsl(var(--destructive))";

  const textTone =
    score >= 8
      ? "text-success"
      : score >= 5
        ? "text-warning"
        : "text-destructive";

  return (
    <span className="inline-flex items-center gap-1.5">
      {/* Mini ring chart */}
      <span className="relative grid h-8 w-8 shrink-0 place-items-center">
        <svg viewBox="0 0 36 36" className="h-8 w-8 -rotate-90">
          <circle
            cx="18"
            cy="18"
            r="15"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="4"
          />
          <circle
            cx="18"
            cy="18"
            r="15"
            fill="none"
            stroke={ringColor}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference}`}
          />
        </svg>
        {/* tiny score number centred inside ring */}
        <span
          className={cn(
            "absolute text-[9px] font-bold tabular-nums leading-none",
            textTone,
          )}
        >
          {score.toFixed(1)}
        </span>
      </span>
      {/* large readable score label */}
      <span className={cn("text-sm font-bold tabular-nums", textTone)}>
        {score.toFixed(1)}<span className="text-[10px] font-medium text-muted-foreground">/10</span>
      </span>
    </span>
  );
}
