import { api } from "@/redux/api/baseApi";

export const reportsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        reportsStatistics: builder.query<any, void>({
            query: () => {
                return {
                    url: "/support/report-statics",
                    method: "GET",
                }
            },
            providesTags: ["reportsStatistics"],
        }),
        getAllReports: builder.query<any, void>({
            query: () => {
                return {
                    url: "/support?type=report",
                    method: "GET",
                }
            },
        }),
        getSingleReport: builder.query<any, { id: any }>({
            query: ({ id }) => {
                return {
                    url: `/support/${id}`,
                    method: "GET",
                }
            },
        })
    })
})

export const { useReportsStatisticsQuery, useGetAllReportsQuery, useGetSingleReportQuery } = reportsApi;