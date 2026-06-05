# RATED · Admin Dashboard

A production-ready admin dashboard for **RATED**, an AI-powered dating app.
Built with React + TypeScript + Vite, styled with Tailwind CSS and a
shadcn-style component layer, and powered by Redux Toolkit + RTK Query.

> _Know your score. Match your level._

---

## Tech stack

| Concern        | Choice                                            |
| -------------- | ------------------------------------------------- |
| Framework      | React 18 + TypeScript (strict)                    |
| Build tool     | Vite 6                                             |
| Styling        | Tailwind CSS v3 + CSS variables (shadcn convention) |
| Components     | Radix primitives + `class-variance-authority`     |
| State / data   | Redux Toolkit + RTK Query                         |
| Routing        | React Router v6                                   |
| Charts         | Recharts                                          |
| Icons          | lucide-react                                      |

All data is served from an in-memory **mock layer** (`src/services/mockData.ts`)
through RTK Query `queryFn` endpoints, so the app runs with zero backend.
Swapping to a real API later is a localized change — see _Connecting a real API_.

---

## Getting started

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
```

Other scripts:

```bash
npm run build    # type-check (tsc -b) + production bundle
npm run preview  # preview the production build
npm run lint     # type-check only
```

### Demo login

The login screen is pre-filled and runs in demo mode — **any** email and
password will sign you in.

---

## Project structure

```
src/
├─ assets/            brand image assets
├─ components/
│  ├─ ui/             low-level primitives (Button, Input, Modal, Table, …)
│  ├─ shared/         composed building blocks (DataTable, StatCard, PageHeader, …)
│  ├─ layout/         Sidebar, Topbar, DashboardLayout, MobileSidebar
│  ├─ dashboard/      KPI cards, charts, recent users
│  ├─ users/          users table, filters, and the 8 detail sections
│  ├─ subscriptions/  overview cards + transactions table
│  ├─ cms/            content editor + interest management
│  └─ settings/       general, profile, and password forms
├─ config/            app config + navigation definition
├─ constants/         enum label maps
├─ hooks/             useAuth, useDebounce, useMediaQuery
├─ lib/               cn() + formatting helpers
├─ pages/             route entry points only (auth + dashboard)
├─ router/            route table + auth guards
├─ services/          RTK Query api + endpoints + mock data
├─ store/             Redux store, slices, typed hooks
├─ styles/            global CSS + design tokens
└─ types/             all domain types
```

**Design principle:** pages compose feature components; they hold routing-level
state only. Feature components are reusable and self-contained, and primitives
never reach into feature logic.

---

## Features

- **Dashboard** — KPI cards (total / verified / premium users, revenue), a
  secondary stats strip, a revenue-overview bar chart, a user-growth area
  chart, and a recent-users table.
- **Users** — searchable, sortable, filterable, paginated data table with
  per-row View / Edit / Ban actions.
- **User details** — basic info, profile info, activity stats, and match,
  AI-scan, subscription, payment, and report histories.
- **Subscriptions** — revenue overview cards plus a filterable transactions
  ledger (subscription + AI-score purchases).
- **CMS** — rich-text editing for Privacy Policy, Terms, and About Us, plus
  full CRUD interest management.
- **Settings** — platform pricing & currency, admin profile, and password
  change.
- **Auth** — login & register with a persisted session and route guards.
- Fully responsive with a mobile sidebar drawer.

---

## Connecting a real API

1. Open `src/services/api.ts` and replace `fakeBaseQuery()` with
   `fetchBaseQuery({ baseUrl: appConfig.apiBaseUrl })`.
2. In each file under `src/services/endpoints/`, swap the mock `queryFn`
   implementations for `query` definitions that return request descriptors.
3. Set `VITE_API_BASE_URL` in a `.env` file and flip `useMockData` to `false`
   in `src/config/index.ts`.

The component layer consumes typed hooks (`useGetUsersQuery`, etc.) and needs
no changes.

---

## Notes

- The rich-text editor is a dependency-free `contentEditable` implementation.
  For richer needs (tables, images, markdown) swap in TipTap — the
  `value` / `onChange` contract is unchanged.
- Avatars are generated via DiceBear and photos via Picsum, so no image assets
  are bundled.
