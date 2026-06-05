import type {
  Gender,
  LookingFor,
  PaymentType,
  SubscriptionTier,
  UserStatus,
} from "@/types";

export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  active: "Active",
  banned: "Banned",
};

export const GENDER_LABELS: Record<Gender, string> = {
  male: "Male",
  female: "Female",
  non_binary: "Non-binary",
};

export const TIER_LABELS: Record<SubscriptionTier, string> = {
  free: "Free",
  subscriber: "Complete Access",
};

export const LOOKING_FOR_LABELS: Record<LookingFor, string> = {
  relationship: "Relationship",
  casual: "Casual",
  friends: "Friends",
  marriage: "Marriage",
};

export const PAYMENT_TYPE_LABELS: Record<PaymentType, string> = {
  subscription: "Complete Access",
  ai_score: "Scan Only",
};

export const CURRENCY_OPTIONS = [
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "BDT", label: "BDT (৳)" },
] as const;
