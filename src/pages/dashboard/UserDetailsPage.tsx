import * as React from "react";
import { useParams } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { EmptyState, LoadingState } from "@/components/shared";
import {
  AiScanHistory,
  BanUserDialog,
  MatchHistory,
  PaymentHistory,
  SendWarningDialog,
  SubscriptionHistory,
  UserActivityInfo,
  UserBasicInfo,
  UserDetailHeader,
  UserProfileInfo,
  UserReports,
} from "@/components/users";
import { useGetUserQuery } from "@/services";

export function UserDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: user, isLoading, isError } = useGetUserQuery(id ?? "", {
    skip: !id,
  });

  const [banOpen, setBanOpen] = React.useState(false);
  const [warnOpen, setWarnOpen] = React.useState(false);

  if (isLoading) return <LoadingState label="Loading profile…" />;

  if (isError || !user) {
    return (
      <EmptyState
        icon={AlertTriangle}
        title="User not found"
        description="This profile may have been removed or the link is incorrect."
      />
    );
  }

  return (
    <div className="space-y-6">
      <UserDetailHeader
        user={user}
        onBan={() => setBanOpen(true)}
        onWarn={() => setWarnOpen(true)}
      />

      <UserBasicInfo user={user} />
      <UserProfileInfo user={user} />
      <UserActivityInfo user={user} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <MatchHistory matches={user.matchHistory} />
        <AiScanHistory scans={user.aiScanHistory} />
        <SubscriptionHistory records={user.subscriptionHistory} />
        <PaymentHistory payments={user.paymentHistory} />
      </div>

      <UserReports reports={user.reports} />

      <BanUserDialog
        userId={user.id}
        userName={user.name}
        open={banOpen}
        onOpenChange={setBanOpen}
      />

      <SendWarningDialog
        userId={user.id}
        userName={user.name}
        open={warnOpen}
        onOpenChange={setWarnOpen}
      />
    </div>
  );
}
