import type {
  Interest,

  CmsContent,
  AppSettings,
  WarningRecord,
  SubscriptionPlan,
  AdminListItem,
} from "@/types";

/* --- tiny seeded PRNG so data is stable across reloads ------------- */
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20260101);
const between = (min: number, max: number) =>
  Math.floor(rand() * (max - min + 1)) + min;


const INTERESTS_POOL = [
  "Travel", "Coffee", "Hiking", "Photography", "Cooking", "Yoga", "Music",
  "Art", "Fitness", "Reading", "Gaming", "Wine", "Dancing", "Startups",
  "Films", "Surfing", "Fashion", "Podcasts", "Dogs", "Cats",
];

const isoDaysAgo = (days: number) =>
  new Date(Date.now() - days * 86_400_000).toISOString();




/* --- dynamic warning history database ------------------------------- */
export const WARNINGS_DB: Record<string, WarningRecord[]> = {};

/* --- detail builder ------------------------------------------------ */


/* --- helper to test date in timeframe ------------------------------- */
export function isDateInTimeframe(dateStr: string, timeframe: string): boolean {
  const date = new Date(dateStr);
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (timeframe) {
    case "Today":
      return date >= startOfDay;
    case "Last 7 Days": {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 86_400_000);
      return date >= sevenDaysAgo;
    }
    case "This Month": {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      return date >= startOfMonth;
    }
    case "Last Month": {
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
      return date >= startOfLastMonth && date <= endOfLastMonth;
    }
    case "This Year": {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      return date >= startOfYear;
    }
    case "All Time":
    default:
      return true;
  }
}






/* --- subscription plans list database ----------------------------- */
export let PLANS: SubscriptionPlan[] = [
  {
    id: "plan_complete",
    name: "Complete Access",
    price: 15.00,
    features: [
      "Premium AI face scan",
      "Personalized rating",
      "Full dating experience",
      "Match with your level",
      "Shareable rating card"
    ],
    limits: "One-time payment",
    isActive: true,
    type: "dating",
    freeScans: 0,
  },
  {
    id: "plan_scan",
    name: "Scan Only",
    price: 20.00,
    features: [
      "Premium AI face scan",
      "Personalized rating",
      "No dating access"
    ],
    limits: "Per scan",
    isActive: true,
    type: "ai",
    freeScans: 0,
  },
];



/* --- admin users database ----------------------------------------- */
export let ADMINS: AdminListItem[] = [
  {
    id: "adm_1",
    name: "Alex Rivera",
    email: "alex@ratedapp.io",
    role: "super_admin",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  },
  {
    id: "adm_2",
    name: "Sam Taylor",
    email: "sam@ratedapp.io",
    role: "admin",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam",
  },
  {
    id: "adm_3",
    name: "Jordan Lee",
    email: "jordan@ratedapp.io",
    role: "moderator",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan",
  },
];

/* --- interests ----------------------------------------------------- */
export const INTERESTS: Interest[] = INTERESTS_POOL.map((name, i) => ({
  id: `int_${100 + i}`,
  name,
  createdAt: isoDaysAgo(between(30, 600)),
  status: rand() > 0.15 ? "active" : "inactive",
}));

/* --- cms ----------------------------------------------------------- */
export const CMS: CmsContent[] = [
  {
    key: "privacy_policy",
    title: "Privacy Policy",
    body: "<h2>Privacy Policy</h2><p>RATED collects and processes personal data to provide matchmaking and AI-scoring services. We never sell your data to third parties.</p><p>You may request deletion of your account and associated data at any time from the app settings.</p>",
    updatedAt: isoDaysAgo(12),
  },
  {
    key: "terms",
    title: "Terms & Conditions",
    body: "<h2>Terms &amp; Conditions</h2><p>By using RATED you agree to behave respectfully toward other members. Harassment, impersonation, and fraudulent activity result in immediate suspension.</p>",
    updatedAt: isoDaysAgo(30),
  },
  {
    key: "about_us",
    title: "About Us",
    body: "<h2>About RATED</h2><p>RATED helps people <em>know their score</em> and <em>match their level</em>. We blend human chemistry with an AI compatibility score to surface meaningful connections.</p>",
    updatedAt: isoDaysAgo(5),
  },
];

/* --- settings ------------------------------------------------------ */
export const SETTINGS: AppSettings = {
  currency: "USD",
  safetyMode: true,
  autoBanThreshold: 3,
  aiScoreVisibility: true,
};
