import { api } from "@/redux/api/baseApi";

export interface FaqItem {
  _id: string;
  question: string;
  answer: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DisclaimerItem {
  _id?: string;
  type: "terms" | "privacy" | "about" | "work" | string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface InterestItem {
  _id: string;
  name: string;
  status: "active" | "inactive" | string;
  createdAt?: string;
  updatedAt?: string;
}

type FaqPayload = {
  question: string;
  answer: string;
};

type DisclaimerPayload = {
  type: "terms" | "privacy" | "about" | "work" | string;
  content: string;
};

type InterestPayload = {
  name: string;
};

const cmsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getFAQ: build.query<{ success?: boolean; message?: string; data: FaqItem[] }, void>({
      query: () => ({
        url: "/faq",
        method: "GET",
      }),
      providesTags: ["cms"],
    }),
    createFAQ: build.mutation<unknown, FaqPayload>({
      query: (body) => ({
        url: "/faq",
        method: "POST",
        body,
      }),
      invalidatesTags: ["cms"],
    }),
    updateFAQ: build.mutation<unknown, { id: string } & FaqPayload>({
      query: ({ id, ...body }) => ({
        url: `/faq/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["cms"],
    }),
    deleteFAQ: build.mutation<unknown, string>({
      query: (id) => ({
        url: `/faq/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["cms"],
    }),
    createDisclaimer: build.mutation<unknown, DisclaimerPayload>({
      query: (body) => ({
        url: "/disclaimer",
        method: "POST",
        body,
      }),
      invalidatesTags: ["disclaimer"],
    }),
    getDisclaimer: build.query<
      { success?: boolean; message?: string; data: DisclaimerItem[] | DisclaimerItem | null },
      { type: "terms" | "privacy" }
    >({
      query: ({ type }) => ({
        url: "/disclaimer",
        method: "GET",
        params: { type },
      }),
      providesTags: ["disclaimer"],
    }),
    createInterests: build.mutation<unknown, InterestPayload>({
      query: (body) => ({
        url: "/interest",
        method: "POST",
        body,
      }),
      invalidatesTags: ["interest"],
    }),
    getInterests: build.query<{ success?: boolean; message?: string; data: InterestItem[] }, void>({
      query: () => ({
        url: "/interest",
        method: "GET",
      }),
      providesTags: ["interest"],
    }),
    updateInterests: build.mutation<unknown, { id: string } & InterestPayload>({
      query: ({ id, ...body }) => ({
        url: `/interest/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["interest"],
    }),
    deleteInterests: build.mutation<unknown, string>({
      query: (id) => ({
        url: `/interest/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["interest"],
    }),
  }),
});

export const {
  useGetFAQQuery,
  useCreateFAQMutation,
  useUpdateFAQMutation,
  useDeleteFAQMutation,
  useGetDisclaimerQuery,
  useCreateDisclaimerMutation,
  useGetInterestsQuery,
  useCreateInterestsMutation,
  useUpdateInterestsMutation,
  useDeleteInterestsMutation,
} = cmsApi;
