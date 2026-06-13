import { api } from "@/redux/api/baseApi";

const settingsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        updateAdminProfile: builder.mutation({
            query: (data) => {
                return {
                    method: 'PATCH',
                    url: '/admin',
                    body: data,
                };
            },
            invalidatesTags: ['profile'],
        }),
        getAdminsList: builder.query({
            query: () => {
                return {
                    method: 'GET',
                    url: '/admin',
                };
            },
            providesTags: ['admins'],
        }),
        deleteAdmin: builder.mutation({
            query: (id) => {
                return {
                    method: 'DELETE',
                    url: `/admin/${id}`,
                };
            },
            invalidatesTags: ['admins'],
        }),
        createAdmin: builder.mutation({
            query: (data) => {
                return {
                    method: 'POST',
                    url: '/admin',
                    body: data,
                };
            },
            invalidatesTags: ['admins'],
        }),
        updateAdmin: builder.mutation({
            query: ({ id, data }) => {
                return {
                    method: 'PATCH',
                    url: `/admin/${id}`,
                    body: data,
                };
            },
            invalidatesTags: ['admins'],
        }),
    }),
})

export const {
    useUpdateAdminProfileMutation,
    useGetAdminsListQuery,
    useDeleteAdminMutation,
    useCreateAdminMutation,
    useUpdateAdminMutation,
} = settingsApi;
