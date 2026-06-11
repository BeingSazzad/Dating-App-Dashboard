import * as React from "react";
import { useParams } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { EmptyState, LoadingState } from "@/components/shared";
import {
  AiScanHistory,
  BanUserDialog,
  SendWarningDialog,
  UserBasicInfo,
  UserDetailHeader,
  UserProfileInfo,
  UserReports,
} from "@/components/users";
import { useGetSingleUserQuery } from "@/redux/apiSlices/admin/usersApi";

export function UserDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: userRes, isLoading, isError, refetch } = useGetSingleUserQuery({ id: id ?? "" }, {
    // skip: !id,
  });
  const user = userRes?.data
  // console.log(user)
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

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* <MatchHistory matches={user.matchHistory || []} /> */}
        <AiScanHistory scans={user.aiScanHistory || []} />
        {/* <SubscriptionHistory records={user.subscriptionHistory || []} /> */}
        {/* <PaymentHistory payments={user.paymentHistory || []} /> */}
        <UserReports reports={user.reports || []} />
      </div>


      <BanUserDialog
        userId={user._id}
        userName={user.name ?? "User"}
        isBanned={user.status === "delete"}
        open={banOpen}
        onOpenChange={setBanOpen}
        refetch={refetch}
      />

      <SendWarningDialog
        userId={user._id}
        userName={user.name ?? "User"}
        open={warnOpen}
        onOpenChange={setWarnOpen}
      />
    </div>
  );
}
