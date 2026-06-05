import * as React from "react";
import { Check, Pencil, Plus, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Modal as Dialog,
  ModalContent as DialogContent,
  ModalDescription as DialogDescription,
  ModalFooter as DialogFooter,
  ModalHeader as DialogHeader,
  ModalTitle as DialogTitle,
} from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/shared";
import {
  useGetPlansQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
} from "@/services";
import { formatCurrency } from "@/lib/utils";
import type { SubscriptionPlan } from "@/types";

/* ------------------------------------------------------------------ */
/* Plan dialog (Add / Edit)                                             */
/* ------------------------------------------------------------------ */
interface PlanDialogProps {
  plan?: SubscriptionPlan | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

function PlanDialog({ plan, open, onOpenChange }: PlanDialogProps) {
  const isEdit = Boolean(plan);
  const [name, setName] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [limits, setLimits] = React.useState("");
  const [featuresRaw, setFeaturesRaw] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setName(plan?.name ?? "");
      setPrice(plan?.price?.toString() ?? "");
      setLimits(plan?.limits ?? "");
      setFeaturesRaw(plan?.features?.join("\n") ?? "");
    }
  }, [open, plan]);

  const [createPlan, { isLoading: creating }] = useCreatePlanMutation();
  const [updatePlan, { isLoading: updating }] = useUpdatePlanMutation();
  const isLoading = creating || updating;

  const handleSave = async () => {
    const payload = {
      name: name.trim(),
      price: parseFloat(price) || 0,
      limits: limits.trim(),
      features: featuresRaw
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean),
    };
    if (isEdit && plan) {
      await updatePlan({ id: plan.id, ...payload }).unwrap().catch(() => undefined);
    } else {
      await createPlan(payload).unwrap().catch(() => undefined);
    }
    onOpenChange(false);
  };

  const valid = name.trim().length > 0 && parseFloat(price) >= 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit plan" : "Create new plan"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the plan details below."
              : "Add a new subscription tier to the platform."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="plan-name">Plan name</Label>
              <Input
                id="plan-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Premium"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="plan-price">Price ($)</Label>
              <Input
                id="plan-price"
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="15.00"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="plan-limits">Limits summary</Label>
            <Input
              id="plan-limits"
              value={limits}
              onChange={(e) => setLimits(e.target.value)}
              placeholder="e.g. 15 scans/mo"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="plan-features">
              Features{" "}
              <span className="text-xs text-muted-foreground">(one per line)</span>
            </Label>
            <textarea
              id="plan-features"
              rows={4}
              className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={featuresRaw}
              onChange={(e) => setFeaturesRaw(e.target.value)}
              placeholder={"Unlimited Likes\n15 AI Scans/mo\nDirect Messaging"}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading || !valid}>
            {isLoading ? "Saving…" : isEdit ? "Save changes" : "Create plan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/* Plans tab                                                            */
/* ------------------------------------------------------------------ */
export function PlansTab() {
  const { data: plans, isLoading } = useGetPlansQuery();
  const [updatePlan] = useUpdatePlanMutation();
  const [deletePlan] = useDeletePlanMutation();

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<SubscriptionPlan | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<SubscriptionPlan | null>(null);

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (p: SubscriptionPlan) => {
    setEditing(p);
    setDialogOpen(true);
  };

  const handleToggle = (p: SubscriptionPlan) => {
    updatePlan({ id: p.id, isActive: !p.isActive });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deletePlan(deleteTarget.id).unwrap().catch(() => undefined);
    setDeleteTarget(null);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">Subscription plans</p>
          <p className="text-sm text-muted-foreground">
            Manage the tiers available to your members.
          </p>
        </div>
        <Button onClick={openCreate} size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> Add plan
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-44 w-full rounded-xl" />
            ))
          : plans?.map((plan) => (
              <Card
                key={plan.id}
                className={`relative flex flex-col gap-4 p-5 transition-opacity ${
                  plan.isActive ? "" : "opacity-50"
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold">{plan.name}</p>
                    <p className="text-2xl font-bold tabular-nums flex items-baseline gap-1.5">
                      {formatCurrency(plan.price)}
                      <span className="text-xs font-normal text-muted-foreground font-sans">
                        ({plan.limits})
                      </span>
                    </p>
                  </div>
                  <Badge variant={plan.isActive ? "success" : "muted"}>
                    {plan.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>

                {/* Features */}
                <ul className="flex-1 space-y-1.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* Actions */}
                <div className="flex items-center gap-2 border-t border-border pt-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-xs"
                    onClick={() => openEdit(plan)}
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-xs"
                    onClick={() => handleToggle(plan)}
                  >
                    {plan.isActive ? (
                      <ToggleRight className="h-3.5 w-3.5 text-success" />
                    ) : (
                      <ToggleLeft className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                    {plan.isActive ? "Deactivate" : "Activate"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto gap-1.5 text-xs text-destructive hover:text-destructive"
                    onClick={() => setDeleteTarget(plan)}
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </Button>
                </div>
              </Card>
            ))}
      </div>

      <PlanDialog
        plan={editing}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete plan?"
        description={`"${deleteTarget?.name}" will be permanently removed and members on this plan may lose access.`}
        confirmLabel="Delete plan"
        destructive
        onConfirm={handleDelete}
      />
    </>
  );
}
