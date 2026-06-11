/* ------------------------------------------------------------------ */
/* Common / shared                                                     */
/* ------------------------------------------------------------------ */

export type ID = string;

export type SortDirection = "asc" | "desc";

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface SortParams<T = string> {
  sortBy: T;
  sortDir: SortDirection;
}

export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export type Currency = "USD" | "EUR" | "GBP" | "BDT";

/* ------------------------------------------------------------------ */
/* Auth                                                                */
/* ------------------------------------------------------------------ */

export interface AdminUser {
  id: ID;
  name: string;
  email: string;
  avatar?: string;
  role: "super_admin" | "admin" | "moderator";
}

export type AdminListItem = AdminUser;

export interface AuthState {
  user: AdminUser | null;
  token: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

/* ------------------------------------------------------------------ */
/* Users (dating-app members)                                          */
/* ------------------------------------------------------------------ */

export type Gender = "Man" | "Women" | "Non binary";

export type UserStatus = "active" | "delete";

export type SubscriptionTier =
  | "bronze"
  | "silver"
  | "gold"
  | "premium";

export interface WarningRecord {
  id: string;
  message: string;
  date: string;
  template?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  limits: string;
  isActive: boolean;
  type: "dating" | "ai";
  freeScans: number;
}

export interface ReportUserRef {
  _id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  status?: string
}

export interface UserReport {
  _id: string;
  id?: string;
  user?: ReportUserRef | null;
  reporterName?: string | null;
  reporterId?: string | null;
  reportedUser?: ReportUserRef | null;
  reportedUserName?: string | null;
  reportedUserId?: string | null;
  message?: string | null;
  reason?: string | null;
  details?: string | null;
  images?: string[] | null;
  imageUrl?: string | null;
  type?: string | null;
  status?: "active" | "pending" | "resolved" | "ignored" | string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  reportedAt?: string | null;
}

export type LookingFor = "relationship" | "casual" | "friends" | "marriage";

export interface UserListItem {
  _id: string;
  image?: string;
  status?: string;
  createdAt?: string;
  ai_score?: number;
  gender?: string;
  name?: string;
  address?: string;
  age?: number;          // Missing in current API response
  matches?: number;      // Missing in current API response
  subscription?: { name: string;[key: string]: any };

}

export interface MatchRecord {
  id: ID;
  name: string;
  avatar: string;
  matchedAt: string;
}

export interface AiScanRecord {
  id: ID;
  scannedAt: string;
  score: number;
  amount: number;
}

export interface SubscriptionRecord {
  id: ID;
  plan: SubscriptionTier;
  purchasedAt: string;
  expiresAt: string;
  amount: number;
}

export type PaymentType = "subscription" | "ai_score";

export interface PaymentRecord {
  id: ID;
  date: string;
  type: PaymentType;
  amount: number;
  status: "paid" | "refunded" | "failed";
}

export interface ReportRecord {
  id: ID;
  reporter: string;
  reason: string;
  reportedAt: string;
  resolved: boolean;
}

export interface UserDetail extends UserListItem {
  email?: string;
  contact?: string;
  lastLogin?: string;
  bio?: string;
  interests?: string[];
  intrests?: string[]; // API typo
  lookingFor?: LookingFor;
  looking_for?: string; // new from api
  education?: string;
  school?: string; // new from api
  profession?: string;
  job_title?: string; // new from api
  height?: number;                       // cm
  netWorth?: string;                     // e.g. "$20k – $100k"
  net_worth?: string; // new from api
  smoking?: "never" | "socially" | "regularly";
  drinking?: string; // changed to string for new api
  workout?: string; // changed to string for new api
  starSign?: string;
  star_sign?: string; // new from api
  languages?: string[];
  photos?: string[];
  gallery?: string[]; // new from api
  stats?: {
    totalMatches: number;
    totalLikes: number;
    totalConversations: number;
    aiScore: number;
    reportsReceived: number;
  };
  matchHistory?: MatchRecord[];
  aiScanHistory?: AiScanRecord[];
  subscriptionHistory?: SubscriptionRecord[];
  paymentHistory?: PaymentRecord[];
  reports?: ReportRecord[];
  warnings?: WarningRecord[];
}

export interface UserFilters {
  search?: string;
  status?: UserStatus | "all";
  gender?: Gender | "all";
  subscription?: SubscriptionTier | "all";
}

export type UsersQuery = PaginationParams &
  Partial<SortParams<keyof UserListItem>> &
  UserFilters;

/* ------------------------------------------------------------------ */
/* Dashboard                                                           */
/* ------------------------------------------------------------------ */

export interface DashboardKpis {
  totalUsers: number;
  verifiedUsers: number;
  premiumUsers: number;
  revenue: number;
  newUsersToday: number;
  activeUsersToday: number;
  averageAiScore: number;
  totalAiScans: number;
  // trend deltas (percent vs previous period)
  trends: {
    totalUsers: number;
    verifiedUsers: number;
    premiumUsers: number;
    revenue: number;
  };
}

export interface RevenueOverview {
  total: number;
  subscription: number;
  aiScore: number;
  monthly: { month: string; subscription: number; aiScore: number }[];
}

export interface UserGrowthPoint {
  month: string;
  users: number;
  premium: number;
}

/* ------------------------------------------------------------------ */
/* Subscriptions & transactions                                        */
/* ------------------------------------------------------------------ */

export type TransactionType = "subscription" | "ai_score";

export interface Transaction {
  id: ID;
  userId: ID;
  userName: string;
  userAvatar: string;
  type: TransactionType;
  amount: number;
  date: string;
}

export interface SubscriptionOverview {
  premiumUsers: number;
  revenue: number;
  monthlyRevenue: number;
}

/* ------------------------------------------------------------------ */
/* CMS & interests                                                     */
/* ------------------------------------------------------------------ */

export type CmsKey = "privacy_policy" | "terms" | "about_us";

export interface CmsContent {
  key: CmsKey;
  title: string;
  body: string;
  updatedAt: string;
}

export interface Interest {
  id: ID;
  name: string;
  createdAt: string;
  status: "active" | "inactive";
}

/* ------------------------------------------------------------------ */
/* Settings                                                            */
/* ------------------------------------------------------------------ */

export interface AppSettings {
  currency: Currency;
  safetyMode: boolean;
  autoBanThreshold: number;
  aiScoreVisibility: boolean;
}
