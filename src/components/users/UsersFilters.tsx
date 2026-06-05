import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GENDER_LABELS,
  TIER_LABELS,
  USER_STATUS_LABELS,
} from "@/constants";
import type { Gender, SubscriptionTier, UserFilters } from "@/types";

interface UsersFiltersProps {
  filters: UserFilters;
  onChange: (patch: Partial<UserFilters>) => void;
}

export function UsersFilters({ filters, onChange }: UsersFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select
        value={filters.status ?? "all"}
        onValueChange={(v) => onChange({ status: v as UserFilters["status"] })}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          {(
            Object.keys(USER_STATUS_LABELS) as (keyof typeof USER_STATUS_LABELS)[]
          ).map((k) => (
            <SelectItem key={k} value={k}>
              {USER_STATUS_LABELS[k]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.gender ?? "all"}
        onValueChange={(v) => onChange({ gender: v as Gender | "all" })}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Gender" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All genders</SelectItem>
          {(Object.keys(GENDER_LABELS) as Gender[]).map((k) => (
            <SelectItem key={k} value={k}>
              {GENDER_LABELS[k]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.subscription ?? "all"}
        onValueChange={(v) =>
          onChange({ subscription: v as SubscriptionTier | "all" })
        }
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Subscription" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All plans</SelectItem>
          {(Object.keys(TIER_LABELS) as SubscriptionTier[]).map((k) => (
            <SelectItem key={k} value={k}>
              {TIER_LABELS[k]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
