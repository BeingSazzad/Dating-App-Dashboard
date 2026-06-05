import * as React from "react";
import { Loader2 } from "lucide-react";
import {
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateInterestMutation,
  useUpdateInterestMutation,
} from "@/services";
import type { Interest } from "@/types";

interface InterestFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  interest: Interest | null;
}

export function InterestFormDialog({
  open,
  onOpenChange,
  interest,
}: InterestFormDialogProps) {
  const isEdit = Boolean(interest);
  const [create, { isLoading: creating }] = useCreateInterestMutation();
  const [update, { isLoading: updating }] = useUpdateInterestMutation();

  const [name, setName] = React.useState("");
  const [status, setStatus] = React.useState<Interest["status"]>("active");

  React.useEffect(() => {
    if (open) {
      setName(interest?.name ?? "");
      setStatus(interest?.status ?? "active");
    }
  }, [open, interest]);

  const isSaving = creating || updating;
  const canSave = name.trim().length > 0 && !isSaving;

  const handleSave = async () => {
    if (!canSave) return;
    if (isEdit && interest) {
      await update({ ...interest, name: name.trim(), status })
        .unwrap()
        .catch(() => undefined);
    } else {
      await create({ name: name.trim() }).unwrap().catch(() => undefined);
    }
    onOpenChange(false);
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="max-w-md">
        <ModalHeader>
          <ModalTitle>{isEdit ? "Edit interest" : "Add interest"}</ModalTitle>
        </ModalHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="interest-name">Name</Label>
            <Input
              id="interest-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Hiking"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
            />
          </div>

          {isEdit && (
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as Interest["status"])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <ModalFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!canSave}>
            {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
            {isEdit ? "Save" : "Add interest"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
