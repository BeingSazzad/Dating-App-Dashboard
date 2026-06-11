import type {
  Gender,
  LookingFor,
  PaymentType,
  SubscriptionTier,
  UserStatus,
} from "@/types";

export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  active: "Active",
  delete: "Inactive",
};

export const GENDER_LABELS: Record<Gender, string> = {
  Man: "Man",
  Women: "Women",
  "Non binary": "Non binary",
};

export const TIER_LABELS: Record<SubscriptionTier, string> = {
  bronze: "Bronze",
  silver: "Silver",
  gold: "Gold",
  premium: "Premium",
};

export const LOOKING_FOR_LABELS: Record<LookingFor, string> = {
  relationship: "Relationship",
  casual: "Casual",
  friends: "Friends",
  marriage: "Marriage",
};

export const PAYMENT_TYPE_LABELS: Record<PaymentType, string> = {
  subscription: "Subscription",
  ai_score: "AI Scan",
};

export const CURRENCY_OPTIONS = [
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "BDT", label: "BDT (৳)" },
] as const;
