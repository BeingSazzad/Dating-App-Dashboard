import { api } from "@/services/api";
import { delay } from "@/lib/utils";
import type { AdminUser, LoginPayload, RegisterPayload } from "@/types";

const DEMO_ADMIN: AdminUser = {
  id: "adm_1",
  name: "Avery Sterling",
  email: "admin@ratedapp.io",
  role: "super_admin",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AdminAvery&backgroundColor=e9d9b8",
};

interface AuthResult {
  user: AdminUser;
  token: string;
}

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResult, LoginPayload>({
      queryFn: async ({ email }) => {
        await delay(600);
        return {
          data: { user: { ...DEMO_ADMIN, email }, token: "demo-token-rated" },
        };
      },
    }),
    register: builder.mutation<AuthResult, RegisterPayload>({
      queryFn: async ({ name, email }) => {
        await delay(600);
        return {
          data: {
            user: { ...DEMO_ADMIN, name, email },
            token: "demo-token-rated",
          },
        };
      },
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
