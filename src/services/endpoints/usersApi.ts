import { api } from "@/services/api";
import { delay } from "@/lib/utils";
import { USERS, buildUserDetail, WARNINGS_DB } from "@/services/mockData";
import type { Paginated, UserDetail, UserListItem, UsersQuery, WarningRecord } from "@/types";

interface SendWarningPayload {
  userId: string;
  message: string;
  template?: string;
}

export const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<Paginated<UserListItem>, UsersQuery>({
      queryFn: async (q) => {
        await delay();
        let rows = [...USERS];

        if (q.search) {
          const s = q.search.toLowerCase();
          rows = rows.filter(
            (u) =>
              u.name.toLowerCase().includes(s) ||
              u.location.toLowerCase().includes(s),
          );
        }
        if (q.status && q.status !== "all")
          rows = rows.filter((u) => u.status === q.status);
        if (q.gender && q.gender !== "all")
          rows = rows.filter((u) => u.gender === q.gender);
        if (q.subscription && q.subscription !== "all")
          rows = rows.filter((u) => u.subscription === q.subscription);

        if (q.sortBy) {
          const dir = q.sortDir === "desc" ? -1 : 1;
          rows.sort((a, b) => {
            const av = a[q.sortBy!];
            const bv = b[q.sortBy!];
            if (typeof av === "number" && typeof bv === "number")
              return (av - bv) * dir;
            return String(av).localeCompare(String(bv)) * dir;
          });
        }

        const total = rows.length;
        const start = (q.page - 1) * q.pageSize;
        return {
          data: {
            data: rows.slice(start, start + q.pageSize),
            total,
            page: q.page,
            pageSize: q.pageSize,
          },
        };
      },
      providesTags: ["User"],
    }),

    getUser: builder.query<UserDetail, string>({
      queryFn: async (id) => {
        await delay();
        const base = USERS.find((u) => u.id === id);
        if (!base)
          return { error: { status: 404, data: "User not found" } };
        return { data: buildUserDetail(base) };
      },
      providesTags: (_r, _e, id) => [{ type: "User", id }],
    }),

    banUser: builder.mutation<{ id: string }, string>({
      queryFn: async (id) => {
        await delay();
        const u = USERS.find((x) => x.id === id);
        if (u) u.status = "banned";
        return { data: { id } };
      },
      invalidatesTags: ["User"],
    }),

    sendWarning: builder.mutation<WarningRecord, SendWarningPayload>({
      queryFn: async ({ userId, message, template }) => {
        await delay(300);
        const warning: WarningRecord = {
          id: `warn_${userId}_${Date.now()}`,
          message,
          date: new Date().toISOString(),
          template,
        };
        // Persist into the in-memory warnings DB so it shows on reload
        if (!WARNINGS_DB[userId]) WARNINGS_DB[userId] = [];
        WARNINGS_DB[userId].unshift(warning);
        return { data: warning };
      },
      invalidatesTags: (_r, _e, { userId }) => [{ type: "User", id: userId }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useBanUserMutation,
  useSendWarningMutation,
} = usersApi;
