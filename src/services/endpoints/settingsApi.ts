import { api } from "@/services/api";
import { delay } from "@/lib/utils";
import { SETTINGS } from "@/services/mockData";
import type { AppSettings } from "@/types";

export const settingsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query<AppSettings, void>({
      queryFn: async () => {
        await delay();
        return { data: { ...SETTINGS } };
      },
      providesTags: ["Settings"],
    }),
    updateSettings: builder.mutation<AppSettings, Partial<AppSettings>>({
      queryFn: async (patch) => {
        await delay(500);
        Object.assign(SETTINGS, patch);
        return { data: { ...SETTINGS } };
      },
      invalidatesTags: ["Settings"],
    }),
  }),
});

export const { useGetSettingsQuery, useUpdateSettingsMutation } = settingsApi;
