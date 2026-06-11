import { ConfirmDialog } from "@/components/shared";
import { useBanUserMutation } from "@/redux/apiSlices/admin/usersApi";
import { toast } from "sonner";

interface BanUserDialogProps {
  userId: string | null;
  userName: string | null;
  isBanned?: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  refetch: () => void;
}

export function BanUserDialog({
  userId,
  userName,
  isBanned,
  open,
  onOpenChange,
  refetch
}: BanUserDialogProps) {
  const [banUser, { isLoading }] = useBanUserMutation();

  const handleConfirm = async () => {
    if (!userId) return;
    toast.promise(banUser({ id: userId }).unwrap(), {
      loading: isBanned ? "Unbanning user..." : "Banning user...",
      success: (res) => {
        onOpenChange(false);
        refetch()
        return res?.message || (isBanned ? "User unbanned successfully" : "User banned successfully");
      },
      error: (error: any) => error?.data?.message || (isBanned ? "Failed to unban user" : "Failed to ban user")
    })
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isBanned ? "Unban this user?" : "Ban this user?"}
      description={
        isBanned 
          ? `${userName ?? "This user"} will regain access to the app.`
          : `${userName ?? "This user"} will lose access to the app immediately. You can reinstate them later.`
      }
      confirmLabel={isBanned ? "Unban user" : "Ban user"}
      destructive={!isBanned}
      loading={isLoading}
      onConfirm={handleConfirm}
    />
  );
}
