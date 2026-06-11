import { api } from "../api/baseApi";

const notificationSlice = api.injectEndpoints({
    endpoints: (builder) => ({
        getNotification: builder.query({
            query: ({query}:{query?:string}) => ({
                url: `/notificaiton?`+query,
            }),
        }),

        changeStatusNotification: builder.mutation({
            query: ({id}:{id:string}) => ({
                method: "PATCH",
                url: `/notificaiton/${id}/seen`,
            }),
        }),
        readAllNotification: builder.mutation({
            query: () => ({
                method: "PATCH",
                url: `/notificaiton/read-all`,
            }),
        })
    }),
})

export const { useGetNotificationQuery, useChangeStatusNotificationMutation, useReadAllNotificationMutation } = notificationSlice