import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { DataTable, type Column } from "@/components/shared";
import { appConfig } from "@/config";
import { formatCurrency, formatDate, initials } from "@/lib/utils";
import { useGetAllSubscribersQuery } from "@/redux/apiSlices/admin/subscriptionApi";
import { getImageUrl } from "@/utils/getImageUrl";

type SubscriberUser = {
  _id?: string | null;
  image?: string | null;
  contact?: string | null;
  name?: string | null;
  address?: string | null;
};

type SubscriberTransaction = {
  _id?: string | null;
  name?: string | null;
  price?: number | null;
  user?: SubscriberUser | null;
  createdAt?: string | null;
};

type SubscribersResponse = {
  success?: boolean;
  message?: string;
  pagination?: {
    total?: number | null;
    limit?: number | null;
    page?: number | null;
    totalPage?: number | null;
  };
  data?: SubscriberTransaction[] | null;
};

export function TransactionsTable() {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  // const [search, setSearch] = React.useState("");
  // const debouncedSearch = useDebounce(search, 300);

  // React.useEffect(() => {
  //   setPage(1);
  // }, [debouncedSearch]);

  const { data, isFetching } = useGetAllSubscribersQuery({
    page,
    limit: 10,
    // searchTerms: debouncedSearch,
  }) as { data?: SubscribersResponse; isFetching: boolean };

  const rows = data?.data ?? [];

  const columns: Column<SubscriberTransaction>[] = [
    {
      key: "user",
      header: "User",
      cell: (t) => {
        const userName = t.user?.name ?? "N/A";
        const userImage = t.user?.image ? getImageUrl(t.user?.image) : undefined;

        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={userImage} alt={userName} />
              <AvatarFallback>{userName === "N/A" ? "N/A" : initials(userName)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <span className="block truncate font-medium">{userName}</span>
              <span className="block truncate text-xs text-muted-foreground">
                {t.user?.contact ?? "N/A"}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      key: "name",
      header: "Subscription",
      cell: (t) => t.name ?? "N/A",
    },
    {
      key: "price",
      header: "Price",
      align: "right",
      cell: (t) => (
        <span className="font-medium">
          {typeof t.price === "number" ? formatCurrency(t.price) : "N/A"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Date",
      align: "right",
      cell: (t) => (
        <span className="text-muted-foreground">
          {t.createdAt ? formatDate(t.createdAt) : "N/A"}
        </span>
      ),
    },
    {
      key: "user",
      header: "Address",
      cell: (t) => t.user?.address ?? "N/A",
    },
  ];

  return (
    <Card className="space-y-4 p-4 sm:p-5">
      <div>
        <h3 className="font-display text-lg font-semibold tracking-tight">
          Transaction History
        </h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          View and trace all user payments and subscription purchases.
        </p>
      </div>

      {/* <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by user..."
        />
      </div> */}

      <DataTable
        columns={columns}
        data={rows}
        rowKey={(t) => t._id ?? `${t.name ?? "subscription"}-${t.createdAt ?? "unknown"}`}
        isLoading={isFetching}
        onRowClick={(t) => {
          const userId = t.user?._id;
          if (userId) {
            navigate(`/users/${userId}`);
          }
        }}
        emptyTitle="No transactions found"
      />

      <Pagination
        page={page}
        pageSize={appConfig.defaultPageSize}
        total={data?.pagination?.total ?? 0}
        onPageChange={setPage}
      />
    </Card>
  );
}
