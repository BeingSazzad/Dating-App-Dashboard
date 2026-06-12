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
import { formatCurrency } from "@/lib/utils";
import {
  useCreatePlanMutation,
  useDeletePlanMutation,
  useGetASubscriptionsQuery,
  useUpdatePlanMutation,
} from "@/redux/apiSlices/admin/subscriptionApi";
import { toast } from "sonner";

type PlanType = "bronze" | "silver" | "gold" | "premium";
type PlanUseFor = "app" | "scan";
type PlanStatus = "active" | "inactive";

interface SubscriptionPlanItem {
  _id: string;
  name: string;
  price: number;
  type: PlanType | string;
  badge?: string | null;
  use_for: PlanUseFor;
  features: string[];
  paymentId?: string | null;
  referenceId?: string | null;
  recurring?: string | null;
  status: PlanStatus | string;
  interval?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

interface PlanDialogProps {
  plan?: SubscriptionPlanItem | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  type: PlanUseFor;
}

function PlanDialog({ plan, open, onOpenChange, type }: PlanDialogProps) {
  const isEdit = Boolean(plan);
  const [name, setName] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [planType, setPlanType] = React.useState<PlanType>("gold");
  const [badge, setBadge] = React.useState("");
  const [useFor, setUseFor] = React.useState<PlanUseFor>(type);
  const [featuresRaw, setFeaturesRaw] = React.useState("");
  const [paymentId, setPaymentId] = React.useState("");
  const [referenceId, setReferenceId] = React.useState("");
  const [recurring, setRecurring] = React.useState("month");
  const [interval, setInterval] = React.useState("1");

  React.useEffect(() => {
    if (!open) return;

    setName(plan?.name ?? "");
    setPrice(plan?.price?.toString() ?? "");
    setPlanType((plan?.type as PlanType) ?? "gold");
    setBadge(plan?.badge ?? "");
    setUseFor(plan?.use_for ?? type);
    setFeaturesRaw(plan?.features?.join("\n") ?? "");
    setPaymentId(plan?.paymentId ?? "");
    setReferenceId(plan?.referenceId ?? "");
    setRecurring(plan?.recurring ?? "month");
    setInterval(plan?.interval?.toString() ?? "1");
  }, [open, plan, type]);

  const [createPlan, { isLoading: creating }] = useCreatePlanMutation();
  const [updatePlan, { isLoading: updating }] = useUpdatePlanMutation();
  const isLoading = creating || updating;

  const handleSave = async () => {
    const payload = {
      name: name.trim(),
      price: parseFloat(price) || 0,
      type: planType,
      use_for: useFor,
      badge: badge.trim(),
      features: featuresRaw
        .split("\n")
        .map((feature) => feature.trim())
        .filter(Boolean),
      paymentId: paymentId.trim(),
      referenceId: referenceId.trim(),
      recurring: recurring.trim(),
      interval: parseInt(interval, 10) || 1,
    };

    try {
      if (isEdit && plan) {
        toast.promise(await updatePlan({ id: plan._id, ...payload }).unwrap(), {
          loading: "Updating plan...",
          success: () => {
            onOpenChange(false);
            return "Plan updated successfully"
          },
          error: "Failed to update plan"
        })
      } else {
        toast.promise(createPlan(payload).unwrap(), {
          loading: "Creating plan...",
          success: () => {
            onOpenChange(false);
            return "Plan created successfully"
          },
          error: "Failed to create plan"
        })
      }
    }
    catch (error: any) {
      toast.error(error?.data?.message || "Failed to create plan")
    }

  };

  const valid =
    name.trim().length > 0 &&
    parseFloat(price) >= 0 &&
    paymentId.trim().length > 0 &&
    referenceId.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit plan" : "Create new plan"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the plan details below."
              : "Add a new subscription package to the platform."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="plan-name">Plan name</Label>
            <Input
              id="plan-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Scan Now"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="plan-price">Price</Label>
            <Input
              id="plan-price"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="49.99"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="plan-type">Type</Label>
            <select
              id="plan-type"
              className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={planType}
              onChange={(e) => setPlanType(e.target.value as PlanType)}
            >
              <option value="bronze">Bronze</option>
              <option value="silver">Silver</option>
              <option value="gold">Gold</option>
              <option value="premium">Premium</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="plan-use-for">Use for</Label>
            <select
              id="plan-use-for"
              className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={useFor}
              onChange={(e) => setUseFor(e.target.value as PlanUseFor)}
            >
              <option value="app">App</option>
              <option value="scan">Scan</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="plan-badge">Badge</Label>
            <Input
              id="plan-badge"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="Most Popular"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="plan-recurring">Recurring</Label>
            <Input
              id="plan-recurring"
              value={recurring}
              onChange={(e) => setRecurring(e.target.value)}
              placeholder="month"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="plan-payment-id">Payment ID</Label>
            <Input
              id="plan-payment-id"
              value={paymentId}
              onChange={(e) => setPaymentId(e.target.value)}
              placeholder="pay_123456789"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="plan-reference-id">Reference ID</Label>
            <Input
              id="plan-reference-id"
              value={referenceId}
              onChange={(e) => setReferenceId(e.target.value)}
              placeholder="ref_987654321"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="plan-interval">Interval</Label>
            <Input
              id="plan-interval"
              type="number"
              min="1"
              value={interval}
              onChange={(e) => setInterval(e.target.value)}
              placeholder="1"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="plan-features">
              Features <span className="text-xs text-muted-foreground">(one per line)</span>
            </Label>
            <textarea
              id="plan-features"
              rows={5}
              className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={featuresRaw}
              onChange={(e) => setFeaturesRaw(e.target.value)}
              placeholder={"Unlimited Likes\nPriority Support\nAdvanced Search Filters"}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading || !valid}>
            {isLoading ? "Saving..." : isEdit ? "Save changes" : "Create plan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface PlansTabProps {
  type: PlanUseFor;
}

export function PlansTab({ type }: PlansTabProps) {
  const { data: allPlans, isLoading } = useGetASubscriptionsQuery({ type });
  const [updatePlan] = useUpdatePlanMutation();
  const [deletePlan] = useDeletePlanMutation();

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<SubscriptionPlanItem | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<SubscriptionPlanItem | null>(null);

  const plans: SubscriptionPlanItem[] = allPlans?.data ?? [];
  const isAppTab = type === "app";

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (plan: SubscriptionPlanItem) => {
    setEditing(plan);
    setDialogOpen(true);
  };

  const handleToggle = (plan: SubscriptionPlanItem) => {
    const nextStatus = plan.status === "active" ? "inactive" : "active";
    try {
      toast.promise(updatePlan({ id: plan._id, status: nextStatus }).unwrap(), {
        loading: "Updating plan...",
        success: (res: any) => {
          return res?.message || "Plan updated successfully"
        },
        error: "Failed to update plan",
      })
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update plan")
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    toast.promise(deletePlan(deleteTarget._id).unwrap(), {
      loading: "Deleting plan...",
      success: "Plan deleted successfully",
      error: "Failed to delete plan",
    })
    setDeleteTarget(null);
  };

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-medium">
            {isAppTab ? "App subscription plans" : "AI scan plans"}
          </p>
          <p className="text-sm text-muted-foreground">
            {isAppTab
              ? "Manage membership packages for the app experience."
              : "Manage packages that unlock AI scan access."}
          </p>
        </div>
        <Button onClick={openCreate} size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> Add plan
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-56 w-full rounded-xl" />
          ))
          : plans.map((plan) => (
            <Card
              key={plan._id}
              className={`relative flex flex-col gap-4 p-5 transition-opacity ${plan.status === "active" ? "" : "opacity-50"
                }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate font-semibold">{plan.name}</p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <p className="text-2xl font-bold tabular-nums">
                      {formatCurrency(plan.price)}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {plan.recurring ? `/${plan.recurring}` : ""}
                    </span>
                  </div>
                </div>
                <Badge variant={plan.status === "active" ? "success" : "muted"}>
                  {plan.status === "active" ? "Active" : "Inactive"}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-2">
                {plan.badge ? (
                  <Badge variant="outline" className="rounded-full">
                    {plan.badge}
                  </Badge>
                ) : null}
                <Badge variant="outline" className="rounded-full">
                  {plan.type}
                </Badge>
                <Badge variant="outline" className="rounded-full">
                  {plan.use_for}
                </Badge>
                {typeof plan.interval === "number" ? (
                  <Badge variant="outline" className="rounded-full">
                    interval {plan.interval}
                  </Badge>
                ) : null}
              </div>

              <div className="rounded-lg border border-border/60 bg-muted/20 p-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-primary" />
                  <span>{plan.paymentId ? "Payment metadata set" : "No payment metadata"}</span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-primary" />
                  <span>{plan.referenceId ? "Reference metadata set" : "No reference metadata"}</span>
                </div>
              </div>

              <ul className="flex-1 space-y-1.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

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
                  {plan.status === "active" ? (
                    <ToggleRight className="h-3.5 w-3.5 text-success" />
                  ) : (
                    <ToggleLeft className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                  {plan.status === "active" ? "Deactivate" : "Activate"}
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

      <PlanDialog plan={editing} open={dialogOpen} onOpenChange={setDialogOpen} type={type} />

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
