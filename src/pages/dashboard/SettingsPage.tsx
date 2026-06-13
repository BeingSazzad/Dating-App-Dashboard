import * as React from "react";
import { Loader2, Plus, Trash2, UserCog } from "lucide-react";
import { toast } from "sonner";
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
} from "@/components/settings";
import { initials } from "@/lib/utils";
import {
  useCreateAdminMutation,
  useDeleteAdminMutation,
  useGetAdminsListQuery,
  useUpdateAdminMutation,
} from "@/redux/apiSlices/admin/settingsApi";
import { useGetProfileQuery } from "@/redux/apiSlices/authSlice";
import { getImageUrl } from "@/utils/getImageUrl";

const TABS = [
  { id: "profile", label: "Profile & Password" },
  { id: "admins", label: "Admin Role Management" },
  // { id: "config", label: "System Config" },
] as const;

type TabId = (typeof TABS)[number]["id"];
type AdminRole = "SUPER_ADMIN" | "ADMIN";

interface AdminRow {
  _id: string;
  name: string;
  role: AdminRole;
  email: string;
  image?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AdminFormState {
  name: string;
  email: string;
  password: string;
  role: AdminRole;
  imageFile: File | null;
  imagePreview: string;
}

const emptyForm: AdminFormState = {
  name: "",
  email: "",
  password: "",
  role: "ADMIN",
  imageFile: null,
  imagePreview: "",
};


function roleLabel(role: string | null | undefined) {
  return role
    ?.toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ") || "--";
}

export function SettingsPage() {
  const [tab, setTab] = React.useState<TabId>("profile");

  const { data: profileResponse } = useGetProfileQuery({});
  const profile = profileResponse?.data ?? null;

  const {
    data: adminsResponse,
    isLoading: adminsLoading,
    isFetching: adminsFetching,
    refetch: refetchAdmins,
  } = useGetAdminsListQuery({});
  const admins = (adminsResponse?.data ?? []) as AdminRow[];
  console.log(admins)

  const [createAdmin, { isLoading: isCreating }] = useCreateAdminMutation();
  const [updateAdmin, { isLoading: isUpdating }] = useUpdateAdminMutation();
  const [deleteAdmin, { isLoading: isDeleting }] = useDeleteAdminMutation();

  const [editorOpen, setEditorOpen] = React.useState(false);
  const [editingAdmin, setEditingAdmin] = React.useState<AdminRow | null>(null);
  const [adminForm, setAdminForm] = React.useState<AdminFormState>(emptyForm);
  const [deleteTarget, setDeleteTarget] = React.useState<AdminRow | null>(null);

  const openCreateAdmin = () => {
    setEditingAdmin(null);
    setAdminForm(emptyForm);
    setEditorOpen(true);
  };

  const openEditAdmin = (admin: AdminRow) => {
    setEditingAdmin(admin);
    setAdminForm({
      name: admin.name,
      email: admin.email,
      password: "",
      role: admin.role,
      imageFile: null,
      imagePreview: getImageUrl(admin.image || ""),
    });
    setEditorOpen(true);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setAdminForm((current) => ({
      ...current,
      imageFile: file,
      imagePreview: preview,
    }));

    event.target.value = "";
  };

  const handleSubmitAdmin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = new FormData();
    payload.append("name", adminForm.name.trim());
    payload.append("email", adminForm.email.trim());
    payload.append("password", adminForm.password);
    payload.append("role", adminForm.role);
    if (adminForm.imageFile) {
      payload.append("image", adminForm.imageFile);
    }

    try {
      if (editingAdmin) {
        toast.promise(updateAdmin({ id: editingAdmin._id, data: payload }).unwrap(), {
          loading: "Updating admin...",
          success: (res) => {
            console.log(res)
            setEditorOpen(false);
            setEditingAdmin(null);
            setAdminForm(emptyForm);
            return res?.data?.message || "Admin updated successfully.";
          },
          error: (err) => {
            return err?.data?.message ?? "Failed to update admin."
          },
        });
        return;
      }

      toast.promise(createAdmin(payload).unwrap(), {
        loading: "Creating admin...",
        success: (res) => {
          console.log(res)
          setEditorOpen(false);
          setAdminForm(emptyForm);
          return res?.data?.message || "Admin created successfully.";
        },
        error: (err) => {
          console.log(err)
          return err?.data?.message ?? "Failed to create admin."
        },
      });
    } catch (error) {
      if (error) {
        console.log(error)
        toast.error("Failed to update admin.")
      } else {
        toast.error("Failed to update admin.")
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    toast.promise(deleteAdmin(deleteTarget._id).unwrap(), {
      loading: "Deleting admin...",
      success: () => {
        setDeleteTarget(null);
        refetchAdmins();
        return "Admin deleted successfully.";
      },
      error: "Failed to delete admin.",
    });
  };

  const columns: Column<AdminRow>[] = [
    {
      key: "name",
      header: "Admin User",
      cell: (admin) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={getImageUrl(admin.image || "")} alt={admin.name} />
            <AvatarFallback>{initials(admin.name)}</AvatarFallback>
          </Avatar>
          <div>
            <span className="font-semibold text-sm block">{admin.name}</span>
            <span className="text-xs text-muted-foreground">{admin.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role Level",
      cell: (admin) => (
        <Badge variant={admin.role === "SUPER_ADMIN" ? "default" : "secondary"}>
          {roleLabel(admin.role)}
        </Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (admin) => (
        <Badge variant={admin.status === "active" ? "success" : "secondary"}>
          {admin.status ?? "active"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      cell: (admin) => (
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => openEditAdmin(admin)}>
            Edit
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setDeleteTarget(admin)}
            className="text-destructive hover:bg-destructive/10"
            aria-label={`Delete ${admin.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage the signed-in profile, security, system preferences, and administrative accounts."
      />

      <div className="flex items-center gap-1 rounded-xl border border-border bg-muted/40 p-1 w-fit">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${tab === item.id
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* {tab === "config" && (
        <div className="space-y-6">
          <GeneralSettingsForm />
        </div>
      )} */}

      {tab === "profile" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <AdminProfileForm user={profile} />
          <ChangePasswordForm />
        </div>
      )}

      {tab === "admins" && (
        <Card className="space-y-4 p-4 sm:p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <UserCog className="h-5 w-5 text-primary" />
                Administrative Accounts
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                Create, edit, and remove backend admin accounts.
              </CardDescription>
            </div>
            <Button onClick={openCreateAdmin} className="gap-2 self-start sm:self-auto">
              <Plus className="h-4 w-4" />
              Add Administrator
            </Button>
          </div>

          <DataTable
            columns={columns}
            data={admins}
            rowKey={(admin) => admin._id}
            isLoading={adminsLoading || adminsFetching}
            emptyTitle="No administrators found"
            emptyDescription="Create the first admin account to populate this list."
          />
        </Card>
      )}

      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleSubmitAdmin}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserCog className="h-5 w-5 text-primary" />
                {editingAdmin ? "Edit Administrator" : "Add New Administrator"}
              </DialogTitle>
              <DialogDescription>
                {editingAdmin
                  ? "Update the admin profile and access role."
                  : "Create a new admin account using the supplied form data."}
              </DialogDescription>
            </DialogHeader>

            <div className="my-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-name">Name</Label>
                <Input
                  id="admin-name"
                  value={adminForm.name}
                  onChange={(e) => setAdminForm((current) => ({ ...current, name: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-email">Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  value={adminForm.email}
                  onChange={(e) => setAdminForm((current) => ({ ...current, email: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <Input
                  id="admin-password"
                  type="password"
                  value={adminForm.password}
                  onChange={(e) => setAdminForm((current) => ({ ...current, password: e.target.value }))}
                  required={!editingAdmin}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-role">Role</Label>
                <Select
                  value={adminForm.role}
                  onValueChange={(value) => setAdminForm((current) => ({ ...current, role: value as AdminRole }))}
                >
                  <SelectTrigger id="admin-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-image">Profile Image</Label>
                <Input
                  id="admin-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {adminForm.imagePreview ? (
                  <div className="flex items-center gap-3 pt-1">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={getImageUrl(adminForm.imagePreview || "")} alt={adminForm.name || "Admin"} />
                      <AvatarFallback>{initials(adminForm.name || "Admin")}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">Selected image preview</span>
                  </div>
                ) : null}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setEditorOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  isCreating ||
                  isUpdating ||
                  !adminForm.name.trim() ||
                  !adminForm.email.trim() ||
                  (!editingAdmin && !adminForm.password.trim())
                }
              >
                {(isCreating || isUpdating) && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
                {editingAdmin ? "Update Admin" : "Create Admin"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Admin"
        description={`Are you sure you want to delete ${deleteTarget?.name}? This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
        loading={isDeleting}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
