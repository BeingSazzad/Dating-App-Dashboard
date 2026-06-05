import { api } from "@/services/api";
import { delay } from "@/lib/utils";
import { INTERESTS } from "@/services/mockData";
import type { Interest } from "@/types";

export const interestsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getInterests: builder.query<Interest[], void>({
      queryFn: async () => {
        await delay();
        return { data: [...INTERESTS] };
      },
      providesTags: ["Interest"],
    }),
    createInterest: builder.mutation<Interest, { name: string }>({
      queryFn: async ({ name }) => {
        await delay(400);
        const item: Interest = {
          id: `int_${Date.now()}`,
          name,
          createdAt: new Date().toISOString(),
          status: "active",
        };
        INTERESTS.unshift(item);
        return { data: item };
      },
      invalidatesTags: ["Interest"],
    }),
    updateInterest: builder.mutation<Interest, Interest>({
      queryFn: async (next) => {
        await delay(400);
        const idx = INTERESTS.findIndex((i) => i.id === next.id);
        if (idx === -1) return { error: { status: 404, data: "Not found" } };
        INTERESTS[idx] = next;
        return { data: next };
      },
      invalidatesTags: ["Interest"],
    }),
    deleteInterest: builder.mutation<{ id: string }, string>({
      queryFn: async (id) => {
        await delay(400);
        const idx = INTERESTS.findIndex((i) => i.id === id);
        if (idx !== -1) INTERESTS.splice(idx, 1);
        return { data: { id } };
      },
      invalidatesTags: ["Interest"],
    }),
  }),
});

export const {
  useGetInterestsQuery,
  useCreateInterestMutation,
  useUpdateInterestMutation,
  useDeleteInterestMutation,
} = interestsApi;
