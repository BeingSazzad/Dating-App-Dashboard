import { ConfirmDialog } from "@/components/shared";
import { useBanUserMutation } from "@/services";

interface BanUserDialogProps {
  userId: string | null;
  userName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BanUserDialog({
  userId,
  userName,
  open,
  onOpenChange,
}: BanUserDialogProps) {
  const [banUser, { isLoading }] = useBanUserMutation();

  const handleConfirm = async () => {
    if (!userId) return;
    await banUser(userId).unwrap().catch(() => undefined);
    onOpenChange(false);
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Ban this user?"
      description={`${
        userName ?? "This user"
      } will lose access to the app immediately. You can reinstate them later.`}
      confirmLabel="Ban user"
      destructive
      loading={isLoading}
      onConfirm={handleConfirm}
    />
  );
}
