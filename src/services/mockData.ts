import type {
  AiScanRecord,
  DashboardKpis,
  Interest,
  MatchRecord,
  PaymentRecord,
  ReportRecord,
  RevenueOverview,
  SubscriptionRecord,
  Transaction,
  TransactionType,
  UserDetail,
  UserGrowthPoint,
  UserListItem,
  CmsContent,
  AppSettings,
  Gender,
  SubscriptionTier,
  UserStatus,
  WarningRecord,
  SubscriptionPlan,
  UserReport,
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
const pick = <T>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)];
const between = (min: number, max: number) =>
  Math.floor(rand() * (max - min + 1)) + min;

const FIRST = [
  "Aria", "Liam", "Noah", "Mia", "Ethan", "Zoe", "Leo", "Maya", "Kai", "Ivy",
  "Owen", "Luna", "Jude", "Nora", "Felix", "Theo", "Elle", "Reza", "Sana",
  "Dev", "Nadia", "Omar", "Yuki", "Priya", "Mateo", "Chloe", "Hana", "Arjun", "Lena",
];
const LAST = [
  "Carter", "Reyes", "Okafor", "Sato", "Khan", "Bennett", "Marin", "Voss", "Hale", "Ruiz",
  "Lindqvist", "Costa", "Nair", "Romano", "Park", "Sterling", "Abbas", "Webb", "Dahl", "Cruz",
];
const CITIES = [
  "New York, US", "London, UK", "Dubai, AE", "Paris, FR", "Tokyo, JP",
  "Berlin, DE", "Dhaka, BD", "Toronto, CA", "Singapore, SG", "Sydney, AU",
  "Lisbon, PT", "Austin, US", "Milan, IT", "Mumbai, IN", "Amsterdam, NL",
];
const INTERESTS_POOL = [
  "Travel", "Coffee", "Hiking", "Photography", "Cooking", "Yoga", "Music",
  "Art", "Fitness", "Reading", "Gaming", "Wine", "Dancing", "Startups",
  "Films", "Surfing", "Fashion", "Podcasts", "Dogs", "Cats",
];
const GENDERS: Gender[] = ["male", "female", "non_binary"];
const TIERS: SubscriptionTier[] = ["free", "subscriber"];
const STATUSES: UserStatus[] = ["active", "active", "active", "banned"];

const avatarFor = (seed: string) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}&backgroundColor=f1e5cc,e9d9b8,d9c39a`;
const photoFor = (seed: string) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/400/500`;

const isoDaysAgo = (days: number) =>
  new Date(Date.now() - days * 86_400_000).toISOString();

function tierPrice(tier: SubscriptionTier): number {
  return { free: 0, subscriber: 15.00 }[tier];
}

/* --- the canonical user list --------------------------------------- */
export const USERS: UserListItem[] = Array.from({ length: 124 }, (_, i) => {
  const name = `${pick(FIRST)} ${pick(LAST)}`;
  const seed = `${name}-${i}`;
  return {
    id: `usr_${(1000 + i).toString()}`,
    name,
    avatar: avatarFor(seed),
    age: between(19, 44),
    gender: pick(GENDERS),
    location: pick(CITIES),
    aiScore: Math.round((between(42, 98) / 10) * 10) / 10,
    matches: between(0, 320),
    subscription: pick(TIERS),
    status: pick(STATUSES),
    verified: rand() > 0.4,
    joinedAt: isoDaysAgo(between(1, 540)),
  };
});

/* --- dynamic warning history database ------------------------------- */
export const WARNINGS_DB: Record<string, WarningRecord[]> = {};

/* --- detail builder ------------------------------------------------ */
export function buildUserDetail(base: UserListItem): UserDetail {
  const matchHistory: MatchRecord[] = Array.from(
    { length: Math.min(8, Math.max(2, Math.floor(base.matches / 12))) },
    (_, i) => {
      const n = `${pick(FIRST)} ${pick(LAST)}`;
      return {
        id: `mt_${base.id}_${i}`,
        name: n,
        avatar: avatarFor(`${n}-m${i}`),
        matchedAt: isoDaysAgo(between(1, 200)),
      };
    },
  );

  const aiScanHistory: AiScanRecord[] = Array.from(
    { length: between(2, 7) },
    (_, i) => ({
      id: `scan_${base.id}_${i}`,
      scannedAt: isoDaysAgo(between(1, 300)),
      score: Math.round((between(40, 99) / 10) * 10) / 10,
      amount: 20.00,
    }),
  );

  const subscriptionHistory: SubscriptionRecord[] =
    base.subscription === "free"
      ? []
      : Array.from({ length: between(1, 4) }, (_, i) => {
          const purchased = between(30 * (i + 1), 30 * (i + 1) + 25);
          return {
            id: `sub_${base.id}_${i}`,
            plan: base.subscription,
            purchasedAt: isoDaysAgo(purchased),
            expiresAt: isoDaysAgo(purchased - 30),
            amount: tierPrice(base.subscription),
          };
        });

  const paymentHistory: PaymentRecord[] = [
    ...subscriptionHistory.map((s, i) => ({
      id: `pay_s_${base.id}_${i}`,
      date: s.purchasedAt,
      type: "subscription" as const,
      amount: s.amount,
      status: "paid" as const,
    })),
    ...aiScanHistory.map((s, i) => ({
      id: `pay_a_${base.id}_${i}`,
      date: s.scannedAt,
      type: "ai_score" as const,
      amount: s.amount,
      status: "paid" as const,
    })),
  ].sort((a, b) => +new Date(b.date) - +new Date(a.date));

  const reportCount = base.status === "banned" ? between(4, 9) : between(0, 3);
  const reports: ReportRecord[] = Array.from({ length: reportCount }, (_, i) => ({
    id: `rep_${base.id}_${i}`,
    reporter: `${pick(FIRST)} ${pick(LAST)}`,
    reason: pick([
      "Inappropriate photos",
      "Harassment",
      "Spam / promotion",
      "Fake profile",
      "Offensive language",
    ]),
    reportedAt: isoDaysAgo(between(1, 120)),
    resolved: base.status === "banned" ? true : rand() > 0.5,
  }));

  if (!WARNINGS_DB[base.id]) {
    WARNINGS_DB[base.id] = base.status === "banned" ? [
      {
        id: `warn_${base.id}_1`,
        message: "You have been reported for inappropriate behavior. Continued violations will lead to an account ban.",
        date: isoDaysAgo(5),
        template: "Harassment warning"
      }
    ] : [];
  }

  return {
    ...base,
    email: `${base.name.toLowerCase().replace(/\s+/g, ".")}@ratedapp.io`,
    phone: `+1 ${between(200, 989)} ${between(100, 999)} ${between(1000, 9999)}`,
    lastLogin: isoDaysAgo(between(0, 14)),
    bio: "Looking for genuine connection and good conversation. Big on weekend adventures, terrible at small talk, great at making coffee.",
    interests: Array.from(new Set(Array.from({ length: 5 }, () => pick(INTERESTS_POOL)))),
    lookingFor: pick(["relationship", "casual", "friends", "marriage"] as const),
    education: pick(["BSc Design", "MBA", "BA Literature", "PhD Physics", "Self-taught"]),
    profession: pick(["Product Designer", "Founder", "Doctor", "Engineer", "Photographer", "Teacher"]),
    height: between(155, 195),
    netWorth: pick(["<$10k", "$10k – $50k", "$50k – $100k", "$100k – $500k", "$500k+"]),
    smoking: pick(["never", "socially", "regularly"] as const),
    drinking: pick(["never", "socially", "regularly"] as const),
    workout: pick(["never", "sometimes", "often", "daily"] as const),
    starSign: pick(["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]),
    languages: Array.from(new Set(Array.from({ length: between(1, 3) }, () => pick(["English", "Arabic", "French", "Spanish", "Hindi", "Urdu", "Mandarin", "Bengali"])))),
    photos: Array.from({ length: 4 }, (_, i) => photoFor(`${base.id}-p${i}`)),
    stats: {
      totalMatches: base.matches,
      totalLikes: base.matches * between(2, 5),
      totalConversations: between(5, 420),
      aiScore: base.aiScore,
      reportsReceived: reportCount,
    },
    matchHistory,
    aiScanHistory,
    subscriptionHistory,
    paymentHistory,
    reports,
    warnings: WARNINGS_DB[base.id],
  };
}

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

/* --- dashboard KPIs ------------------------------------------------ */
export function buildKpis(timeframe: string = "All Time"): DashboardKpis {
  const validTimeframes = ["Today", "Last 7 Days", "This Month", "Last Month", "This Year", "All Time"];
  let resolvedTimeframe = timeframe;
  if (!validTimeframes.includes(timeframe)) {
    const lower = timeframe.toLowerCase();
    if (lower.includes("today")) resolvedTimeframe = "Today";
    else if (lower.includes("7")) resolvedTimeframe = "Last 7 Days";
    else if (lower.includes("this month") || lower.includes("this_month")) resolvedTimeframe = "This Month";
    else if (lower.includes("last month") || lower.includes("last_month")) resolvedTimeframe = "Last Month";
    else if (lower.includes("this year") || lower.includes("this_year")) resolvedTimeframe = "This Year";
    else resolvedTimeframe = "All Time";
  }

  // Filter users who joined in this timeframe
  const filteredUsers = USERS.filter((u) => isDateInTimeframe(u.joinedAt, resolvedTimeframe));
  const totalUsers = resolvedTimeframe === "All Time" ? USERS.length : filteredUsers.length;
  const verifiedUsers = filteredUsers.filter((u) => u.verified).length;
  const premiumUsers = filteredUsers.filter((u) => u.subscription !== "free").length;

  // Calculate revenue from transactions in this timeframe
  const filteredTxns = TRANSACTIONS.filter((t) => isDateInTimeframe(t.date, resolvedTimeframe));
  const revenue = filteredTxns.reduce((sum, t) => sum + t.amount, 0);

  const newUsersToday = USERS.filter((u) => isDateInTimeframe(u.joinedAt, "Today")).length;
  const activeUsersToday = Math.round(totalUsers * 0.45) + 5;

  const scoreUsers = resolvedTimeframe === "All Time" ? USERS : filteredUsers;
  const averageAiScore = scoreUsers.length > 0
    ? Math.round((scoreUsers.reduce((s, u) => s + u.aiScore, 0) / scoreUsers.length) * 10) / 10
    : 0.0;

  const totalAiScans = Math.round(revenue * 0.35) + 5;
  const trendMultiplier = resolvedTimeframe === "Today" ? 0.15 : resolvedTimeframe === "Last 7 Days" ? 0.65 : 1.0;

  return {
    totalUsers: resolvedTimeframe === "All Time" ? USERS.length : totalUsers,
    verifiedUsers: resolvedTimeframe === "All Time" ? USERS.filter(u => u.verified).length : verifiedUsers,
    premiumUsers: resolvedTimeframe === "All Time" ? USERS.filter(u => u.subscription !== "free").length : premiumUsers,
    revenue: Math.round(revenue || USERS.reduce((s, u) => s + tierPrice(u.subscription) * 3, 0) + 4200),
    newUsersToday,
    activeUsersToday: Math.max(activeUsersToday, newUsersToday),
    averageAiScore,
    totalAiScans,
    trends: {
      totalUsers: Math.round(12.4 * trendMultiplier * 10) / 10,
      verifiedUsers: Math.round(8.1 * trendMultiplier * 10) / 10,
      premiumUsers: Math.round(19.7 * trendMultiplier * 10) / 10,
      revenue: Math.round(23.5 * trendMultiplier * 10) / 10,
    }
  };
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/* --- revenue overview --------------------------------------------- */
export function buildRevenueOverview(timeRange: string = "Monthly", year?: number): RevenueOverview {
  let txns = TRANSACTIONS;
  if (year) {
    txns = txns.filter(t => new Date(t.date).getFullYear() === year);
  }

  if (timeRange === "Daily") {
    // Show last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const dayTxns = txns.filter(t => {
        const td = new Date(t.date);
        return td.getFullYear() === d.getFullYear() && td.getMonth() === d.getMonth() && td.getDate() === d.getDate();
      });
      const subscription = dayTxns.filter(t => t.type === "subscription").reduce((s, t) => s + t.amount, 0);
      const aiScore = dayTxns.filter(t => t.type === "ai_score").reduce((s, t) => s + t.amount, 0);
      return { month: label, subscription: Math.round(subscription), aiScore: Math.round(aiScore) };
    });
    const total = last7Days.reduce((s, d) => s + d.subscription + d.aiScore, 0);
    const sub = last7Days.reduce((s, d) => s + d.subscription, 0);
    const ai = last7Days.reduce((s, d) => s + d.aiScore, 0);
    return { total, subscription: sub, aiScore: ai, monthly: last7Days };
  }

  if (timeRange === "Weekly") {
    // Show last 6 weeks
    const weeks = Array.from({ length: 6 }, (_, i) => {
      const label = `Wk ${i + 1}`;
      const now = new Date();
      const end = new Date(now.getTime() - (5 - i) * 7 * 86_400_000);
      const start = new Date(end.getTime() - 7 * 86_400_000);
      const weekTxns = txns.filter(t => {
        const td = new Date(t.date);
        return td >= start && td <= end;
      });
      const subscription = weekTxns.filter(t => t.type === "subscription").reduce((s, t) => s + t.amount, 0);
      const aiScore = weekTxns.filter(t => t.type === "ai_score").reduce((s, t) => s + t.amount, 0);
      return { month: label, subscription: Math.round(subscription), aiScore: Math.round(aiScore) };
    });
    const total = weeks.reduce((s, w) => s + w.subscription + w.aiScore, 0);
    const sub = weeks.reduce((s, w) => s + w.subscription, 0);
    const ai = weeks.reduce((s, w) => s + w.aiScore, 0);
    return { total, subscription: sub, aiScore: ai, monthly: weeks };
  }

  // Monthly
  const monthly = MONTHS.map((m, idx) => {
    const monthTxns = txns.filter(t => {
      const td = new Date(t.date);
      return td.getMonth() === idx;
    });
    const subscription = monthTxns.filter(t => t.type === "subscription").reduce((s, t) => s + t.amount, 0);
    const aiScore = monthTxns.filter(t => t.type === "ai_score").reduce((s, t) => s + t.amount, 0);
    return { month: m, subscription: Math.round(subscription), aiScore: Math.round(aiScore) };
  });

  const total = monthly.reduce((s, m) => s + m.subscription + m.aiScore, 0);
  const sub = monthly.reduce((s, m) => s + m.subscription, 0);
  const ai = monthly.reduce((s, m) => s + m.aiScore, 0);
  return { total, subscription: sub, aiScore: ai, monthly };
}

/* --- user growth points ------------------------------------------- */
export function buildUserGrowth(year?: number): UserGrowthPoint[] {
  const selectedYear = year || 2026;
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  // Base count: users who joined before the selected year
  const baseUsers = USERS.filter(u => new Date(u.joinedAt).getFullYear() < selectedYear);
  const baseTotal = baseUsers.length;
  const basePremium = baseUsers.filter(u => u.subscription !== "free").length;

  // Monthly growth seeds for consistent visuals
  const monthlyNewUsers = [18, 22, 28, 35, 42, 38, 45, 52, 48, 55, 50, 44];
  const monthlyNewPremium = [5, 7, 9, 11, 14, 12, 15, 17, 16, 18, 17, 14];

  return MONTHS.map((m, idx) => {
    // For the current year, future months project forward; past months use real + seed data
    const isFuture = selectedYear === currentYear && idx > currentMonth;

    if (isFuture) {
      // Project forward with slight growth for future months
      const growthFactor = 1 + (idx - currentMonth) * 0.03;
      const lastRealMonth = currentMonth;
      const cumulativeSeed = monthlyNewUsers.slice(0, lastRealMonth + 1).reduce((a, b) => a + b, 0);
      const projectedTotal = Math.round((baseTotal + cumulativeSeed) * growthFactor);
      const cumulativePremiumSeed = monthlyNewPremium.slice(0, lastRealMonth + 1).reduce((a, b) => a + b, 0);
      const projectedPremium = Math.round((basePremium + cumulativePremiumSeed) * growthFactor);
      return { month: m, users: projectedTotal, premium: projectedPremium };
    }

    // Real/seeded cumulative count for past months
    const realJoined = USERS.filter(u => {
      const d = new Date(u.joinedAt);
      if (d.getFullYear() < selectedYear) return true;
      if (d.getFullYear() === selectedYear && d.getMonth() <= idx) return true;
      return false;
    }).length;

    const seedBoost = monthlyNewUsers.slice(0, idx + 1).reduce((a, b) => a + b, 0);
    const totalCount = Math.max(realJoined, baseTotal + seedBoost);

    const realPremium = USERS.filter(u => {
      const d = new Date(u.joinedAt);
      if (d.getFullYear() < selectedYear) return u.subscription !== "free";
      if (d.getFullYear() === selectedYear && d.getMonth() <= idx) return u.subscription !== "free";
      return false;
    }).length;

    const premiumSeedBoost = monthlyNewPremium.slice(0, idx + 1).reduce((a, b) => a + b, 0);
    const premiumCount = Math.max(realPremium, basePremium + premiumSeedBoost);

    return { month: m, users: totalCount, premium: premiumCount };
  });
}

/* --- transactions -------------------------------------------------- */
// Generate rich transaction history spanning 2025 and 2026 (all months)
function makeTransactions(): Transaction[] {
  const txns: Transaction[] = [];
  let id = 5000;

  // 2025 — all 12 months, 8-18 txns per month
  for (let month = 0; month < 12; month++) {
    const count = between(8, 18);
    for (let j = 0; j < count; j++) {
      const u = USERS[between(0, USERS.length - 1)];
      const type: TransactionType = rand() > 0.45 ? "subscription" : "ai_score";
      const day = between(1, 28);
      txns.push({
        id: `txn_${id++}`,
        userId: u.id,
        userName: u.name,
        userAvatar: u.avatar,
        type,
        amount: type === "subscription" ? 15.00 : 20.00,
        date: new Date(2025, month, day).toISOString(),
      });
    }
  }

  // 2026 — months Jan through current month, 10-20 txns per month
  const currentMonth = new Date().getMonth();
  for (let month = 0; month <= currentMonth; month++) {
    const count = between(10, 20);
    for (let j = 0; j < count; j++) {
      const u = USERS[between(0, USERS.length - 1)];
      const type: TransactionType = rand() > 0.45 ? "subscription" : "ai_score";
      const maxDay = month === currentMonth ? new Date().getDate() : 28;
      const day = between(1, maxDay);
      txns.push({
        id: `txn_${id++}`,
        userId: u.id,
        userName: u.name,
        userAvatar: u.avatar,
        type,
        amount: type === "subscription" ? 15.00 : 20.00,
        date: new Date(2026, month, day).toISOString(),
      });
    }
  }

  return txns.sort((a, b) => +new Date(b.date) - +new Date(a.date));
}
export const TRANSACTIONS: Transaction[] = makeTransactions();

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

/* --- safety reports database -------------------------------------- */
export let REPORTS: UserReport[] = [
  {
    id: "rep_201",
    reporterName: "Chloe Bennett",
    reporterId: "usr_1026",
    reportedUserName: "Liam Carter",
    reportedUserId: "usr_1001",
    reason: "Harassment",
    details: "Sent multiple abusive and inappropriate messages after a mismatch.",
    reportedAt: isoDaysAgo(2),
    status: "pending",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=60",
  },
  {
    id: "rep_202",
    reporterName: "Owen Lindqvist",
    reporterId: "usr_1010",
    reportedUserName: "Aria Dahl",
    reportedUserId: "usr_1000",
    reason: "Fake profile",
    details: "Photos seem to be of a well-known celebrity, not a real user.",
    reportedAt: isoDaysAgo(5),
    status: "pending",
    imageUrl: null,
  },
  {
    id: "rep_203",
    reporterName: "Theo Ruiz",
    reporterId: "usr_1016",
    reportedUserName: "Leo Voss",
    reportedUserId: "usr_1006",
    reason: "Spam",
    details: "Promoting their external commercial website and social links in chat.",
    reportedAt: isoDaysAgo(7),
    status: "resolved",
    imageUrl: null,
  },
  {
    id: "rep_204",
    reporterName: "Mia Sterling",
    reporterId: "usr_1003",
    reportedUserName: "Owen Hale",
    reportedUserId: "usr_1012",
    reason: "Inappropriate content",
    details: "Bio and profile description containing offensive slurs.",
    reportedAt: isoDaysAgo(10),
    status: "pending",
    imageUrl: null,
  }
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
