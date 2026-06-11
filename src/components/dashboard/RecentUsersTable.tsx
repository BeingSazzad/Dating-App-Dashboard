import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/shared";
import { StatusBadge, TierBadge } from "@/components/users/UserBadges";
import { useGetRecentUsersQuery } from "@/services";
import { initials, timeAgo } from "@/lib/utils";

export function RecentUsersTable() {
  const navigate = useNavigate();
  const { data, isLoading } = useGetRecentUsersQuery(6);

  const columns: Column<any>[] = [
    {
      key: "name",
      header: "User",
      cell: (u) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={u.avatar} alt={u.name} />
            <AvatarFallback>{initials(u.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-medium">{u.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {u.location}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "subscription",
      header: "Plan",
      cell: (u) => <TierBadge tier={u.subscription} />,
    },
    {
      key: "status",
      header: "Status",
      cell: (u) => <StatusBadge status={u.status} />,
    },
    {
      key: "joinedAt",
      header: "Joined",
      align: "right",
      cell: (u) => (
        <span className="text-sm text-muted-foreground">
          {timeAgo(u.joinedAt)}
        </span>
      ),
    },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Recent Users</CardTitle>
          <CardDescription>Latest sign-ups across the platform</CardDescription>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate("/users")}>
          View all
        </Button>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={data ?? []}
          rowKey={(u) => u._id}
          isLoading={isLoading}
          skeletonRows={6}
          onRowClick={(u) => navigate(`/users/${u._id}`)}
          emptyTitle="No recent users"
        />
      </CardContent>
    </Card>
  );
}
