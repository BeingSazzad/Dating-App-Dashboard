import { api } from "@/redux/api/baseApi";

const usersApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllUsers: builder.query({
            query: ({ searchTerms, gender, status, plan, page, limit = 10, sortDir, sortBy }) => {
                return {
                    url: '/user',
                    method: 'GET',
                    params: {
                        searchTerms,
                        gender,
                        status,
                        plan,
                        page,
                        limit,
                        sortDir,
                        sortBy
                    }
                }
            }
        }),
        getSingleUser: builder.query({
            query: ({ id }) => {
                return {
                    url: `/user/match/${id}`,
                    method: 'GET',
                }
            }
        }),
        banUser: builder.mutation({
            query: ({ id }) => {
                // console.log(id)
                return {
                    url: `/user/ban-unban/${id}`,
                    method: 'PATCH',
                }
            }
        }),
    }),
});

export const { useGetAllUsersQuery, useGetSingleUserQuery, useBanUserMutation } = usersApi;