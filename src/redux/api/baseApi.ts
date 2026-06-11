import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


export const api = createApi({
    reducerPath: 'baseApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://10.10.7.9:5001/api/v1',
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }

            return headers;
        },
    }),
    tagTypes: [
        'Chat-Rooms',
        'Chat-Messages',
        "profile",
        "reportsStatistics"
    ],
    endpoints: () => ({}),
});


export const imageUrl = 'http://10.10.7.9:5001/api/v1/files';
export const socketUrl = 'http://10.10.7.9:5001/api/v1';
