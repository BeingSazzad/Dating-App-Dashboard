import { api } from "@/redux/api/baseApi";

const dashboardApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getDashboardStats: builder.query<any, void>({
            query: () => ({ url: '/user/overall-statics' }),
        }),
        getRevenueData: builder.query<any, { revenueYear: number }>({
            query: ({ revenueYear }) => ({
                url: `/user/revenue-and-user-growth`, method: 'GET', params: { revenueYear },
                transformResponse: (response: any) => response?.data?.revenueArray,
            }),
        }),
        getUserGrowthData: builder.query<any, { userGrowthYear: number }>({
            query: ({ userGrowthYear }) => ({
                url: `/user/revenue-and-user-growth`, method: 'GET', params: { userGrowthYear },
                transformResponse: (response: any) => response?.data?.userGrowthArray,
            }),
        })
    }),
})

export const { useGetDashboardStatsQuery, useGetRevenueDataQuery, useGetUserGrowthDataQuery } = dashboardApi;