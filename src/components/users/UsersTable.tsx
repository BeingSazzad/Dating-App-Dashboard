import { Eye, MoreHorizontal, Pencil, ShieldBan } from "lucide-react";
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
  TierBadge,
} from "@/components/users/UserBadges";
import { GENDER_LABELS } from "@/constants";
import { formatDate, initials } from "@/lib/utils";
import type { SortDirection, UserListItem } from "@/types";

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
  onEdit,
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
            <AvatarImage src={u.avatar} alt={u.name} />
            <AvatarFallback>{initials(u.name)}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{u.name}</span>
        </div>
      ),
    },
    {
      key: "age",
      header: "Age",
      sortable: true,
      align: "center",
      cell: (u) => u.age,
    },
    {
      key: "gender",
      header: "Gender",
      cell: (u) => (
        <span className="text-muted-foreground">{GENDER_LABELS[u.gender]}</span>
      ),
    },
    {
      key: "location",
      header: "Location",
      sortable: true,
      cell: (u) => <span className="text-muted-foreground">{u.location}</span>,
    },
    {
      key: "aiScore",
      header: "AI Score",
      sortable: true,
      align: "center",
      cell: (u) => (
        <div className="flex justify-center">
          <AiScorePill score={u.aiScore} />
        </div>
      ),
    },
    {
      key: "matches",
      header: "Matches",
      sortable: true,
      align: "center",
      cell: (u) => u.matches,
    },
    {
      key: "subscription",
      header: "Subscription",
      sortable: true,
      cell: (u) => <TierBadge tier={u.subscription} />,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      cell: (u) => <StatusBadge status={u.status} />,
    },
    {
      key: "joinedAt",
      header: "Joined",
      sortable: true,
      cell: (u) => (
        <span className="text-muted-foreground">{formatDate(u.joinedAt)}</span>
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
            <DropdownMenuItem onClick={() => onEdit(u)}>
              <Pencil className="h-4 w-4" /> Edit user
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onBan(u)}
              disabled={u.status === "banned"}
            >
              <ShieldBan className="h-4 w-4" /> Ban user
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      rowKey={(u) => u.id}
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
