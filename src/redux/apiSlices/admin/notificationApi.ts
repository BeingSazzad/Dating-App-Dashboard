import { api } from "@/redux/api/baseApi";

export interface NotificationItem {
    _id: string;
    title: string;
    receiver: string[];
    message: string;
    filePath?: string;
    isRead: boolean;
    readers: string[];
    createdAt: string;
    updatedAt: string;
}

interface NotificationsResponse {
    success: boolean;
    message: string;
    pagination: {
        total: number;
        limit: number;
        page: number;
        totalPage: number;
    };
    data: {
        unreadCount: number;
        data: NotificationItem[];
    };
}

const notificationApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getNotifications: builder.query<NotificationsResponse, void>({
            query: () => "/notification",
            providesTags: ["Notification"],
        }),
        readNotification: builder.mutation<void, { id: string }>({
            query: ({ id }) => ({
                url: `/notification/${id}`,
                method: "PATCH",
            }),
            invalidatesTags: ["Notification"],
        }),
        readAllNotifications: builder.mutation<void, void>({
            query: () => ({
                url: `/notification`,
                method: "PATCH",
            }),
            invalidatesTags: ["Notification"],
        }),
    }),
    overrideExisting: true,
});

export const {
    useGetNotificationsQuery,
    useReadNotificationMutation,
    useReadAllNotificationsMutation
} = notificationApi;

export default notificationApi;
