import * as React from "react";
import {
  Loader2,
  Plus,
  Trash2,
  UserCheck,
} from "lucide-react";
import {
  ConfirmDialog,
  DataTable,
  PageHeader,
  type Column,
} from "@/components/shared";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import {
  Modal as Dialog,
  ModalContent as DialogContent,
  ModalDescription as DialogDescription,
  ModalFooter as DialogFooter,
  ModalHeader as DialogHeader,
  ModalTitle as DialogTitle,
} from "@/components/ui/modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AdminProfileForm,
  ChangePasswordForm,
  GeneralSettingsForm,
} from "@/components/settings";
import {
  useGetAdminsQuery,
  useCreateAdminMutation,
  useUpdateAdminMutation,
  useDeleteAdminMutation,
} from "@/services";
import { useAuth } from "@/hooks";
import { initials } from "@/lib/utils";
import type { AdminListItem } from "@/types";

const TABS = [
  { id: "profile", label: "Profile & Password" },
  { id: "admins", label: "Admin Role Management" },
  { id: "config", label: "System Config" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const ROLE_VARIANTS: Record<AdminListItem["role"], "default" | "success" | "secondary"> = {
  super_admin: "default", // primary purple
  admin: "success",      // green
  moderator: "secondary",  // gray/muted
};

const ROLE_LABELS: Record<AdminListItem["role"], string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  moderator: "Moderator",
};

export function SettingsPage() {
  const { user: currentUser } = useAuth();
  const [tab, setTab] = React.useState<TabId>("profile");

  // Admins API
  const { data: admins = [], isLoading, isFetching } = useGetAdminsQuery();
  const [createAdmin, { isLoading: isCreating }] = useCreateAdminMutation();
  const [updateAdmin] = useUpdateAdminMutation();
  const [deleteAdmin, { isLoading: isDeleting }] = useDeleteAdminMutation();

  // Add Admin dialog state
  const [addOpen, setAddOpen] = React.useState(false);
  const [addForm, setAddForm] = React.useState<{ name: string; email: string; role: AdminListItem["role"] }>({
    name: "",
    email: "",
    role: "moderator",
  });

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = React.useState<AdminListItem | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.name.trim() || !addForm.email.trim()) return;
    await createAdmin(addForm)
      .unwrap()
      .catch(() => undefined);
    setAddForm({ name: "", email: "", role: "moderator" });
    setAddOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await deleteAdmin(deleteTarget.id)
      .unwrap()
      .catch(() => undefined);
    setDeleteTarget(null);
  };

  const columns: Column<AdminListItem>[] = [
    {
      key: "name",
      header: "Admin User",
      cell: (a) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={a.avatar} alt={a.name} />
            <AvatarFallback>{initials(a.name)}</AvatarFallback>
          </Avatar>
          <div>
            <span className="font-semibold text-sm block">{a.name}</span>
            {a.id === currentUser?.id && (
              <span className="text-[10px] bg-primary/10 text-primary font-bold px-1.5 py-0.5 rounded">You</span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "email",
      header: "Email Address",
      cell: (a) => <span className="text-muted-foreground text-sm font-mono">{a.email}</span>,
    },
    {
      key: "role",
      header: "Role Level",
      cell: (a) => {
        const disabled = a.id === currentUser?.id; // Prevent updating own role
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={disabled}>
              <button className={`focus:outline-none ${disabled ? "cursor-default" : "cursor-pointer hover:opacity-80"}`}>
                <Badge variant={ROLE_VARIANTS[a.role]} className="capitalize">
                  {ROLE_LABELS[a.role]}
                </Badge>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Change Role Level</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => updateAdmin({ id: a.id, role: "super_admin" })}>
                Super Admin
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateAdmin({ id: a.id, role: "admin" })}>
                Admin
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateAdmin({ id: a.id, role: "moderator" })}>
                Moderator
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      key: "actions",
      header: "",
      align: "right",
      cell: (a) => {
        const isSelf = a.id === currentUser?.id;
        return (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setDeleteTarget(a)}
            disabled={isSelf}
            className="text-destructive hover:bg-destructive/10 disabled:opacity-30"
            aria-label="Remove Admin"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="System rules, configuration settings, and administrator account privileges."
      />

      {/* Tab bar */}
      <div className="flex items-center gap-1 rounded-xl border border-border bg-muted/40 p-1 w-fit">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Config Tab content */}
      {tab === "config" && (
        <div className="space-y-6">
          <GeneralSettingsForm />
        </div>
      )}

      {/* Profile & Password Tab content */}
      {tab === "profile" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <AdminProfileForm />
          <ChangePasswordForm />
        </div>
      )}

      {/* Admin Management Tab content */}
      {tab === "admins" && (
        <Card className="p-4 sm:p-5 space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-primary" />
                Administrative Accounts
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                Assign and moderate system backend credentials.
              </CardDescription>
            </div>
            <Button onClick={() => setAddOpen(true)} className="gap-2 self-start sm:self-auto">
              <Plus className="h-4 w-4" /> Add Administrator
            </Button>
          </div>

          <DataTable
            columns={columns}
            data={admins}
            rowKey={(a) => a.id}
            isLoading={isLoading || isFetching}
            emptyTitle="No administrators configured"
            emptyDescription="Unusual state. Ensure your local mock data is populated."
          />
        </Card>
      )}

      {/* Add Admin Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleCreate}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-primary" />
                Add New Administrator
              </DialogTitle>
              <DialogDescription>
                Assign system moderation capabilities by generating a new team profile.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 my-4">
              <div className="space-y-2">
                <Label htmlFor="new-admin-name">Full Name</Label>
                <Input
                  id="new-admin-name"
                  placeholder="e.g. Robin Hood"
                  value={addForm.name}
                  onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-admin-email">Email Address</Label>
                <Input
                  id="new-admin-email"
                  type="email"
                  placeholder="e.g. robin@ratedapp.io"
                  value={addForm.email}
                  onChange={(e) => setAddForm((f) => ({ ...f, email: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-admin-role">System Role Level</Label>
                <Select
                  value={addForm.role}
                  onValueChange={(v) => setAddForm((f) => ({ ...f, role: v as AdminListItem["role"] }))}
                >
                  <SelectTrigger id="new-admin-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super_admin">Super Admin (Full Access)</SelectItem>
                    <SelectItem value="admin">Admin (System Config & Users)</SelectItem>
                    <SelectItem value="moderator">Moderator (Reports & Warns)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setAddOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating || !addForm.name.trim() || !addForm.email.trim()}>
                {isCreating && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
                Create Account
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Admin Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Revoke Admin Access"
        description={`Are you sure you want to delete ${deleteTarget?.name}'s administrator privileges? They will no longer be able to log in.`}
        confirmLabel="Revoke Access"
        destructive
        loading={isDeleting}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
