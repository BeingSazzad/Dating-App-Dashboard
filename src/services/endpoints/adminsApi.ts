import { api } from "@/services/api";
import { delay } from "@/lib/utils";
import { ADMINS } from "@/services/mockData";
import type { AdminListItem } from "@/types";

interface CreateAdminPayload {
  name: string;
  email: string;
  role: AdminListItem["role"];
}

interface UpdateAdminPayload {
  id: string;
  role: AdminListItem["role"];
}

export const adminsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAdmins: builder.query<AdminListItem[], void>({
      queryFn: async () => {
        await delay();
        return { data: [...ADMINS] };
      },
      providesTags: ["Admin"],
    }),

    createAdmin: builder.mutation<AdminListItem, CreateAdminPayload>({
      queryFn: async ({ name, email, role }) => {
        await delay(500);
        const newAdmin: AdminListItem = {
          id: `adm_${(ADMINS.length + 1).toString()}`,
          name,
          email,
          role,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
        };
        ADMINS.push(newAdmin);
        return { data: newAdmin };
      },
      invalidatesTags: ["Admin"],
    }),

    updateAdmin: builder.mutation<AdminListItem, UpdateAdminPayload>({
      queryFn: async ({ id, role }) => {
        await delay(400);
        const adminIndex = ADMINS.findIndex((a) => a.id === id);
        if (adminIndex === -1) {
          return { error: { status: 404, data: "Admin not found" } };
        }
        ADMINS[adminIndex] = { ...ADMINS[adminIndex], role };
        return { data: { ...ADMINS[adminIndex] } };
      },
      invalidatesTags: ["Admin"],
    }),

    deleteAdmin: builder.mutation<{ id: string }, string>({
      queryFn: async (id) => {
        await delay(400);
        const index = ADMINS.findIndex((a) => a.id === id);
        if (index !== -1) {
          ADMINS.splice(index, 1);
        }
        return { data: { id } };
      },
      invalidatesTags: ["Admin"],
    }),
  }),
});

export const {
  useGetAdminsQuery,
  useCreateAdminMutation,
  useUpdateAdminMutation,
  useDeleteAdminMutation,
} = adminsApi;
