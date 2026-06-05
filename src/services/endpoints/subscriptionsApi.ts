import { api } from "@/services/api";
import { delay } from "@/lib/utils";
import { TRANSACTIONS, USERS, PLANS } from "@/services/mockData";
import type {
  Paginated,
  SubscriptionOverview,
  SubscriptionPlan,
  Transaction,
  TransactionType,
} from "@/types";

interface TxnQuery {
  page: number;
  pageSize: number;
  type?: TransactionType | "all";
  search?: string;
}

interface PlanPayload {
  name: string;
  price: number;
  features: string[];
  limits: string;
  type: "dating" | "ai";
  freeScans: number;
}

export const subscriptionsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSubscriptionOverview: builder.query<SubscriptionOverview, void>({
      queryFn: async () => {
        await delay();
        const premiumUsers = USERS.filter((u) => u.subscription !== "free").length;
        const revenue = TRANSACTIONS.reduce((s, t) => s + t.amount, 0);
        const monthly = TRANSACTIONS.filter(
          (t) => +new Date(t.date) > Date.now() - 30 * 86_400_000,
        ).reduce((s, t) => s + t.amount, 0);
        return {
          data: {
            premiumUsers,
            revenue: Math.round(revenue),
            monthlyRevenue: Math.round(monthly),
          },
        };
      },
      providesTags: ["Transaction"],
    }),

    getTransactions: builder.query<Paginated<Transaction>, TxnQuery>({
      queryFn: async (q) => {
        await delay();
        let rows = [...TRANSACTIONS];
        if (q.type && q.type !== "all")
          rows = rows.filter((t) => t.type === q.type);
        if (q.search) {
          const s = q.search.toLowerCase();
          rows = rows.filter((t) => t.userName.toLowerCase().includes(s));
        }
        const total = rows.length;
        const start = (q.page - 1) * q.pageSize;
        return {
          data: {
            data: rows.slice(start, start + q.pageSize),
            total,
            page: q.page,
            pageSize: q.pageSize,
          },
        };
      },
      providesTags: ["Transaction"],
    }),

    // ── Plans CRUD ─────────────────────────────────────────────────────
    getPlans: builder.query<SubscriptionPlan[], void>({
      queryFn: async () => {
        await delay(200);
        return { data: [...PLANS] };
      },
      providesTags: ["Plan"],
    }),

    createPlan: builder.mutation<SubscriptionPlan, PlanPayload>({
      queryFn: async (payload) => {
        await delay(300);
        const newPlan: SubscriptionPlan = {
          id: `plan_${Date.now()}`,
          ...payload,
          isActive: true,
        };
        PLANS.push(newPlan);
        return { data: newPlan };
      },
      invalidatesTags: ["Plan"],
    }),

    updatePlan: builder.mutation<SubscriptionPlan, { id: string } & Partial<PlanPayload & { isActive: boolean }>>({
      queryFn: async ({ id, ...patch }) => {
        await delay(300);
        const plan = PLANS.find((p) => p.id === id);
        if (!plan) return { error: { status: 404, data: "Plan not found" } };
        Object.assign(plan, patch);
        return { data: { ...plan } };
      },
      invalidatesTags: ["Plan"],
    }),

    deletePlan: builder.mutation<{ id: string }, string>({
      queryFn: async (id) => {
        await delay(300);
        const idx = PLANS.findIndex((p) => p.id === id);
        if (idx !== -1) PLANS.splice(idx, 1);
        return { data: { id } };
      },
      invalidatesTags: ["Plan"],
    }),
  }),
});

export const {
  useGetSubscriptionOverviewQuery,
  useGetTransactionsQuery,
  useGetPlansQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
} = subscriptionsApi;
