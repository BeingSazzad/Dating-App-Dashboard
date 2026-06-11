import { Eye, MoreHorizontal, ShieldBan, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import { DataTable, type Column } from "@/components/shared";
import {
  AiScorePill,
  StatusBadge,
} from "@/components/users/UserBadges";
import { formatDate, initials } from "@/lib/utils";
import type { SortDirection, UserListItem, UserStatus } from "@/types";
import { Badge } from "../ui/badge";

interface UsersTableProps {
  data: UserListItem[];
  isLoading?: boolean;
  sortBy?: string;
  sortDir?: SortDirection;
  onSortChange: (key: string) => void;
  onView: (user: UserListItem) => void;
  onEdit: (user: UserListItem) => void;
  onBan: (user: UserListItem) => void;
}

export function UsersTable({
  data,
  isLoading,
  sortBy,
  sortDir,
  onSortChange,
  onView,
  onBan,
}: UsersTableProps) {
  const columns: Column<UserListItem>[] = [
    {
      key: "name",
      header: "Name",
      sortable: true,
      cell: (u) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={u.image} alt={u.name ?? "User"} />
            <AvatarFallback>{initials(u?.name || "N/A")}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{u.name ?? "N/A"}</span>
        </div>
      ),
    },
    {
      key: "age",
      header: "Age",
      sortable: true,
      align: "center",
      cell: (u) => u.age ?? "N/A",
    },
    {
      key: "gender",
      header: "Gender",
      cell: (u) => (
        <span className="text-muted-foreground">
          {u.gender || "N/A"}
        </span>
      ),
    },
    {
      key: "location",
      header: "Location",
      sortable: true,
      cell: (u) => <span className="text-muted-foreground">{u.address ?? "N/A"}</span>,
    },
    {
      key: "aiScore",
      header: "AI Score",
      sortable: true,
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
      key: "matches",
      header: "Matches",
      sortable: true,
      align: "center",
      cell: (u) => u.matches ?? "N/A",
    },
    {
      key: "subscription",
      header: "Subscription",
      sortable: true,
      cell: (u) => u?.subscription?.name ? (
        <Badge variant={'default'} className="inline-flex items-center gap-1">
          <Sparkles className="h-3 w-3" />
          {u.subscription.name}
        </Badge>
      ) : (
        "N/A"
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      cell: (u) => u.status ? <StatusBadge status={u.status as UserStatus} /> : "N/A",
    },
    {
      key: "joinedAt",
      header: "Joined",
      sortable: true,
      cell: (u) => (
        <span className="text-muted-foreground">
          {u.createdAt ? formatDate(u.createdAt) : "N/A"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      cell: (u) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Row actions"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            onClick={(e) => e.stopPropagation()}
          >
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onView(u)}>
              <Eye className="h-4 w-4" /> View profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {u.status === "delete" ? (
              <DropdownMenuItem
                className="text-green-600 focus:bg-green-50 focus:text-green-600"
                onClick={() => onBan(u)}
              >
                <ShieldBan className="h-4 w-4" /> Unban user
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                variant="destructive"
                onClick={() => onBan(u)}
              >
                <ShieldBan className="h-4 w-4" /> Ban user
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      rowKey={(u) => u._id}
      isLoading={isLoading}
      sortBy={sortBy}
      sortDir={sortDir}
      onSortChange={onSortChange}
      onRowClick={onView}
      emptyTitle="No users found"
      emptyDescription="Try adjusting your search or filters."
    />
  );
}