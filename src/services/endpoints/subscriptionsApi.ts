import { api } from "@/services/api";
import { delay } from "@/lib/utils";
import { PLANS } from "@/services/mockData";
import type {


  SubscriptionPlan,

} from "@/types";



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
  useGetPlansQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
} = subscriptionsApi;
