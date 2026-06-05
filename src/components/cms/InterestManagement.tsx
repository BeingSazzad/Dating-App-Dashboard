import * as React from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ConfirmDialog,
  DataTable,
  type Column,
} from "@/components/shared";
import { InterestFormDialog } from "@/components/cms/InterestFormDialog";
import {
  useDeleteInterestMutation,
  useGetInterestsQuery,
} from "@/services";
import { formatDate } from "@/lib/utils";
import type { Interest } from "@/types";

export function InterestManagement() {
  const { data, isLoading } = useGetInterestsQuery();
  const [deleteInterest, { isLoading: deleting }] = useDeleteInterestMutation();

  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Interest | null>(null);
  const [toDelete, setToDelete] = React.useState<Interest | null>(null);

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (interest: Interest) => {
    setEditing(interest);
    setFormOpen(true);
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    await deleteInterest(toDelete.id).unwrap().catch(() => undefined);
    setToDelete(null);
  };

  const columns: Column<Interest>[] = [
    {
      key: "name",
      header: "Name",
      cell: (i) => <span className="font-medium">{i.name}</span>,
    },
    {
      key: "createdAt",
      header: "Created Date",
      cell: (i) => (
        <span className="text-muted-foreground">{formatDate(i.createdAt)}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (i) => (
        <Badge
          variant={i.status === "active" ? "success" : "muted"}
          className="capitalize"
        >
          {i.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      cell: (i) => (
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Edit interest"
            onClick={() => openEdit(i)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Delete interest"
            className="text-destructive hover:text-destructive"
            onClick={() => setToDelete(i)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Interest Management</CardTitle>
          <CardDescription>
            Interests sync to the mobile app instantly.
          </CardDescription>
        </div>
        <Button onClick={openAdd}>
          <Plus className="h-4 w-4" /> Add interest
        </Button>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={data ?? []}
          rowKey={(i) => i.id}
          isLoading={isLoading}
          emptyTitle="No interests yet"
          emptyDescription="Add the first interest members can pick from."
        />
      </CardContent>

      <InterestFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        interest={editing}
      />
      <ConfirmDialog
        open={Boolean(toDelete)}
        onOpenChange={(o) => !o && setToDelete(null)}
        title="Delete interest?"
        description={`"${toDelete?.name}" will be removed from the app.`}
        confirmLabel="Delete"
        destructive
        loading={deleting}
        onConfirm={handleDelete}
      />
    </Card>
  );
}
