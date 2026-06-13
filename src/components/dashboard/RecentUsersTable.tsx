import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable, type Column } from "@/components/shared";
import { AiScorePill, StatusBadge } from "@/components/users/UserBadges";
import { formatDate, initials } from "@/lib/utils";
import { useGetAllUsersQuery } from "@/redux/apiSlices/admin/usersApi";
import { getImageUrl } from "@/utils/getImageUrl";
import type { UserListItem, UserStatus } from "@/types";

export function RecentUsersTable() {
  const navigate = useNavigate();
  const { data, isLoading, isFetching } = useGetAllUsersQuery({
    page: 1,
    limit: 5,
  });

  const recentUsers = data?.data ?? [];

  const columns: Column<UserListItem>[] = useMemo(
    () => [
      {
        key: "name",
        header: "User",
        cell: (u) => (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={getImageUrl(u.image)} alt={u.name ?? "User"} />
              <AvatarFallback>{initials(u.name ?? "N/A")}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-medium">{u.name ?? "N/A"}</p>
              <p className="truncate text-xs text-muted-foreground">
                {u.address ?? "N/A"}
              </p>
            </div>
          </div>
        ),
      },
      {
        key: "age",
        header: "Age",
        align: "center",
        cell: (u) => u.age ?? "N/A",
      },
      {
        key: "ai_score",
        header: "AI Score",
        align: "center",
        cell: (u) => (
          <div className="flex justify-center">
            {u.ai_score !== undefined && u.ai_score !== null ? (
              <AiScorePill score={u.ai_score} />
            ) : (
              "N/A"
            )}
          </div>
        ),
      },
      {
        key: "subscription",
        header: "Plan",
        cell: (u) =>
          u.subscription?.name ? (
            <Badge variant="default" className="inline-flex items-center gap-1">
              {u.subscription.name}
            </Badge>
          ) : (
            "N/A"
          ),
      },
      {
        key: "status",
        header: "Status",
        cell: (u) => (u.status ? <StatusBadge status={u.status as UserStatus} /> : "N/A"),
      },
      {
        key: "joinedAt",
        header: "Joined",
        align: "right",
        cell: (u) => (
          <span className="text-sm text-muted-foreground">
            {u.createdAt ? formatDate(u.createdAt) : "N/A"}
          </span>
        ),
      },
    ],
    [],
  );

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 border-b border-border/60 bg-muted/20">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5 text-primary" />
            Recent Users
          </CardTitle>
          <CardDescription>Latest sign-ups across the platform</CardDescription>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate("/users")} className="gap-2">
          View all
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="p-0">
        <DataTable
          columns={columns}
          data={recentUsers}
          rowKey={(u) => u._id}
          isLoading={isLoading || isFetching}
          skeletonRows={5}
          onRowClick={(u) => navigate(`/users/${u._id}`)}
          emptyTitle="No recent users"
          emptyDescription="New user sign-ups will appear here automatically."
        />
      </CardContent>
    </Card>
  );
}
