import { api } from "@/services/api";
import { delay } from "@/lib/utils";
import { REPORTS, USERS } from "@/services/mockData";
import type { UserReport } from "@/types";

interface UpdateReportPayload {
  id: string;
  status: "resolved" | "ignored";
}

export const reportsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getReports: builder.query<UserReport[], void>({
      queryFn: async () => {
        await delay();
        return { data: [...REPORTS] };
      },
      providesTags: ["Report"],
    }),

    updateReport: builder.mutation<UserReport, UpdateReportPayload>({
      queryFn: async ({ id, status }) => {
        await delay(300);
        const report = REPORTS.find((r) => r.id === id);
        if (!report) return { error: { status: 404, data: "Not found" } };
        report.status = status;
        return { data: { ...report } };
      },
      invalidatesTags: ["Report"],
    }),

    banUserFromReport: builder.mutation<{ reportedUserId: string }, string>({
      queryFn: async (reportedUserId) => {
        await delay(300);
        // Ban the user in the USERS list
        const u = USERS.find((x) => x.id === reportedUserId);
        if (u) u.status = "banned";
        // Resolve all their pending reports
        REPORTS.forEach((r) => {
          if (r.reportedUserId === reportedUserId && r.status === "pending") {
            r.status = "resolved";
          }
        });
        return { data: { reportedUserId } };
      },
      invalidatesTags: ["Report", "User"],
    }),
  }),
});

export const {
  useGetReportsQuery,
  useUpdateReportMutation,
  useBanUserFromReportMutation,
} = reportsApi;
