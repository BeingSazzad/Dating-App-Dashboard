import * as React from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, SearchInput } from "@/components/shared";
import { Card } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { UsersFilters, UsersTable, BanUserDialog } from "@/components/users";
import { useDebounce } from "@/hooks";
import { appConfig } from "@/config";
import type { SortDirection, UserFilters, UserListItem } from "@/types";
import { useGetAllUsersQuery } from "@/redux/apiSlices/admin/usersApi";

export function UsersPage() {
  const navigate = useNavigate();

  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const [filters, setFilters] = React.useState<UserFilters>({
    status: "all",
    gender: "all",
    subscription: "all",
  });
  const [sortBy, setSortBy] = React.useState<string>("joinedAt");
  const [sortDir, setSortDir] = React.useState<SortDirection>("desc");

  const [banTarget, setBanTarget] = React.useState<UserListItem | null>(null);

  const debouncedSearch = useDebounce(search, 300);

  React.useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filters, sortBy, sortDir]);

  const { data, isFetching } = useGetAllUsersQuery({
    page,
    limit: appConfig.defaultPageSize,
    searchTerms: debouncedSearch,
    gender: filters.gender === "all" ? undefined : filters.gender,
    status: filters.status === "all" ? undefined : filters.status,
    plan: filters.subscription === "all" ? undefined : filters.subscription,
  });

  const handleSortChange = (key: string) => {
    if (key === sortBy) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortDir("asc");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Browse, search, and manage every member on RATED."
      />

      <Card className="space-y-4 p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by name or location…"
          />
          <UsersFilters
            filters={filters}
            onChange={(patch) => setFilters((f) => ({ ...f, ...patch }))}
          />
        </div>

        <UsersTable
          data={data?.data ?? []}
          isLoading={isFetching}
          sortBy={sortBy}
          sortDir={sortDir}
          onSortChange={handleSortChange}
          onView={(u) => navigate(`/users/${u._id}`)}
          onEdit={(u) => navigate(`/users/${u._id}`)}
          onBan={(u) => setBanTarget(u)}
        />

        <Pagination
          page={page}
          pageSize={appConfig.defaultPageSize}
          total={data?.pagination?.total ?? 0} // Mapped to new API structure
          onPageChange={setPage}
        />
      </Card>

      <BanUserDialog
        userId={banTarget?._id ?? null} // Changed to _id
        userName={banTarget?.name ?? "N/A"}
        open={Boolean(banTarget)}
        onOpenChange={(o) => !o && setBanTarget(null)}
      />
    </div>
  );
}