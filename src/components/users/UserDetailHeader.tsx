import { ArrowLeft, ShieldBan, } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  AiScorePill,
  StatusBadge,
} from "@/components/users/UserBadges";
import { GENDER_LABELS } from "@/constants";
import { initials } from "@/lib/utils";
import type { UserDetail, UserStatus } from "@/types";
import { getImageUrl } from "@/utils/getImageUrl";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

interface UserDetailHeaderProps {
  user: UserDetail;
  onBan: () => void;
  onWarn: () => void;
}

export function UserDetailHeader({ user, onBan, onWarn }: UserDetailHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2 text-muted-foreground"
        onClick={() => navigate("/users")}
      >
        <ArrowLeft className="h-4 w-4" /> Back to users
      </Button>

      <Card className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
        {/* Left — avatar + identity */}
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border border-border">
            <AvatarImage src={getImageUrl(user?.image || "")} alt={user.name ?? "User"} />
            <AvatarFallback className="text-lg">
              {initials(user.name ?? "N/A")}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-2xl font-semibold tracking-tight">
                {user.name ?? "N/A"}
              </h2>
              {user.status && <StatusBadge status={user.status as UserStatus} />}
            </div>
            <p className="text-sm text-muted-foreground">
              {user.age ?? "N/A"} · {user.gender ? (GENDER_LABELS[user.gender as keyof typeof GENDER_LABELS] || user.gender) : "N/A"} · {user.address ?? "N/A"}
            </p>
            {user?.subscription?.name ? (
              <Badge variant="default" className="inline-flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                {user.subscription.name}
              </Badge>
            ) : null}
          </div>
        </div>

        {/* Right — AI score + actions */}
        <div className="flex flex-wrap items-center gap-3">
          {/* AI Score prominent display */}
          <div className="flex flex-col items-center rounded-xl border border-border bg-muted/30 px-5 py-3 text-center">
            {user.ai_score !== undefined && user.ai_score !== null ? (
              <AiScorePill score={user.ai_score} />
            ) : (
              <span className="text-muted-foreground">N/A</span>
            )}
            <p className="mt-1 text-xs text-muted-foreground">AI Score</p>
          </div>

          {/* Warning button */}
          {/* <Button
            variant="outline"
            onClick={onWarn}
            className="gap-2 border-warning/40 text-warning hover:bg-warning/10 hover:text-warning"
          >
            <AlertTriangle className="h-4 w-4" />
            Warn user
          </Button> */}

          {/* Ban button */}
          {user.status === "delete" ? (
            <Button
              className="bg-green-500 hover:bg-green-600 text-white"
              onClick={onBan}
            >
              <ShieldBan className="h-4 w-4" />
              Unban this user
            </Button>
          ) : (
            <Button
              variant="destructive"
              onClick={onBan}
            >
              <ShieldBan className="h-4 w-4" />
              Ban user
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
