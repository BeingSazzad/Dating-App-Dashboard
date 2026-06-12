import { api } from "@/redux/api/baseApi";

const subsriptionApi = api.injectEndpoints({
    endpoints: (build) => ({
        getAllSubscribers: build.query({
            query: ({ page, limit, searchTerms }) => ({
                url: "/subscription/subscribers",
                params: { page, limit, searchTerms },
            }),
        }),
        getSubscriptionStats: build.query({
            query: () => ({
                url: "/subscription/statics",
                method: "GET",
            }),
        }),
        getASubscriptions: build.query({
            query: ({ type = "app" }: { type: string }) => ({
                url: "/package",
                method: "GET",
                params: { type },
            }),
            providesTags: ["subscription"]
        }),
        createPlan: build.mutation({
            query: (body) => ({
                url: "/package",
                method: "POST",
                body,
            }),
            invalidatesTags: ["subscription"]
        }),
        updatePlan: build.mutation({
            query: ({ id, ...body }) => ({
                url: `/package/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["subscription"]

        }),
        deletePlan: build.mutation({
            query: (id) => ({
                url: `/package/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["subscription"]
        }),

    }),
});

export const { useGetAllSubscribersQuery, useGetSubscriptionStatsQuery, useGetASubscriptionsQuery, useCreatePlanMutation, useUpdatePlanMutation, useDeletePlanMutation } = subsriptionApi;