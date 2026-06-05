import { api } from "@/services/api";
import { delay } from "@/lib/utils";
import {
  buildKpis,
  buildRevenueOverview,
  buildUserGrowth,
  USERS,
} from "@/services/mockData";
import type { DashboardKpis, RevenueOverview, UserGrowthPoint, UserListItem } from "@/types";

export const dashboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getKpis: builder.query<DashboardKpis, string | void>({
      queryFn: async (timeframe) => {
        await delay();
        return { data: buildKpis(timeframe ?? "All Time") };
      },
      providesTags: ["Dashboard"],
    }),
    getRevenueOverview: builder.query<
      RevenueOverview,
      { timeRange?: string; year?: number } | void
    >({
      queryFn: async (params) => {
        await delay();
        return {
          data: buildRevenueOverview(
            params?.timeRange ?? "Monthly",
            params?.year,
          ),
        };
      },
    }),
    getUserGrowth: builder.query<UserGrowthPoint[], number | void>({
      queryFn: async (year) => {
        await delay();
        return { data: buildUserGrowth(year ?? 2026) };
      },
    }),
    getRecentUsers: builder.query<UserListItem[], number | void>({
      queryFn: async (limit) => {
        await delay();
        const sorted = [...USERS].sort(
          (a, b) => +new Date(b.joinedAt) - +new Date(a.joinedAt),
        );
        return { data: sorted.slice(0, (limit as number) ?? 6) };
      },
      providesTags: ["User"],
    }),
  }),
});

export const {
  useGetKpisQuery,
  useGetRevenueOverviewQuery,
  useGetUserGrowthQuery,
  useGetRecentUsersQuery,
} = dashboardApi;
