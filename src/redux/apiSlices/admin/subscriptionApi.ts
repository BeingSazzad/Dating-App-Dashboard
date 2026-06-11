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

    }),
});

export const { useGetAllSubscribersQuery, useGetSubscriptionStatsQuery, } = subsriptionApi;