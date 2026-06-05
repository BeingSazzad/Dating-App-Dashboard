import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

/**
 * Base API slice. Uses `fakeBaseQuery` so endpoints resolve from mock data.
 * To go live, swap `fakeBaseQuery()` for `fetchBaseQuery({ baseUrl })` and
 * replace each endpoint's `queryFn` with a `query` definition.
 */
export const api = createApi({
  reducerPath: "api",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["User", "Interest", "Cms", "Settings", "Transaction", "Dashboard", "Plan", "Report", "Admin"],
  endpoints: () => ({}),
});
