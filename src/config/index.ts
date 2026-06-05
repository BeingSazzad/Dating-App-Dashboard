/** App-wide configuration. Values can be backed by env vars in production. */
export const appConfig = {
  name: "RATED",
  tagline: "Know your score. Match your level.",
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? "/api",
  useMockData: true,
  defaultPageSize: 10,
  pageSizeOptions: [10, 25, 50],
} as const;
