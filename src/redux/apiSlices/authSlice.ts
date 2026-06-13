
import { api } from '../api/baseApi';
const authSlice = api.injectEndpoints({
    endpoints: (builder) => ({
        otpVerify: builder.mutation({
            query: (data) => {
                return {
                    method: 'POST',
                    url: '/auth/verify-email',
                    body: data,
                };
            },
        }),

        resendOtp: builder.mutation({
            query: (data) => {
                return {
                    method: 'POST',
                    url: '/auth/resend-otp',
                    body: data,
                };
            },
        }),

        login: builder.mutation({
            query: (data) => {
                return {
                    method: 'POST',
                    url: '/auth/login',
                    body: data,
                };
            },
            invalidatesTags: ['profile'],
        }),

        forgetPassword: builder.mutation({
            query: (data) => {
                return {
                    method: 'POST',
                    url: '/auth/forget-password',
                    body: data,
                };
            },
        }),

        resetPassword: builder.mutation({
            query: (value) => ({
                url: '/auth/reset-password',
                headers: { authorization: localStorage.getItem('resetToken') ?? undefined },
                method: 'POST',
                body: value,
            }),
        }),

        changePassword: builder.mutation({
            query: (data) => {
                return {
                    method: 'POST',
                    url: '/auth/change-password',
                    body: data,
                };
            },
        }),

        signup: builder.mutation({
            query: (data) => {
                return {
                    method: 'POST',
                    url: '/user',
                    body: data,
                };
            },
        }),

        updateProfile: builder.mutation({
            query: (data) => {
                return {
                    method: 'PATCH',
                    url: '/user/profile',
                    body: data,
                };
            },
            invalidatesTags: ['profile'],
        }),

        getProfile: builder.query({
            query: () => ({
                url: "/user/profile",
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["profile"],
        }),
    }),
});

export const {
    useOtpVerifyMutation,
    useLoginMutation,
    useSignupMutation,
    useForgetPasswordMutation,
    useResetPasswordMutation,
    useChangePasswordMutation,
    useUpdateProfileMutation,
    useGetProfileQuery,
    useResendOtpMutation,
} = authSlice;
