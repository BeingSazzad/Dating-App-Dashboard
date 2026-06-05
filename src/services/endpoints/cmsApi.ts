import { api } from "@/services/api";
import { delay } from "@/lib/utils";
import { CMS } from "@/services/mockData";
import type { CmsContent, CmsKey } from "@/types";

export const cmsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCmsContent: builder.query<CmsContent[], void>({
      queryFn: async () => {
        await delay();
        return { data: CMS };
      },
      providesTags: ["Cms"],
    }),
    updateCmsContent: builder.mutation<CmsContent, { key: CmsKey; body: string }>({
      queryFn: async ({ key, body }) => {
        await delay(500);
        const item = CMS.find((c) => c.key === key);
        if (!item) return { error: { status: 404, data: "Not found" } };
        item.body = body;
        item.updatedAt = new Date().toISOString();
        return { data: item };
      },
      invalidatesTags: ["Cms"],
    }),
  }),
});

export const { useGetCmsContentQuery, useUpdateCmsContentMutation } = cmsApi;
