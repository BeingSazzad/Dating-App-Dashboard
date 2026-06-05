import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable, SearchInput, type Column } from "@/components/shared";
import { PAYMENT_TYPE_LABELS } from "@/constants";
import { useGetTransactionsQuery } from "@/services";
import { useDebounce } from "@/hooks";
import { appConfig } from "@/config";
import { formatCurrency, formatDate, initials } from "@/lib/utils";
import type { Transaction, TransactionType } from "@/types";

export function TransactionsTable() {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const [type, setType] = React.useState<TransactionType | "all">("all");
  const [search, setSearch] = React.useState("");
  const debouncedSearch = useDebounce(search, 300);

  React.useEffect(() => {
    setPage(1);
  }, [type, debouncedSearch]);

  const { data, isFetching } = useGetTransactionsQuery({
    page,
    pageSize: appConfig.defaultPageSize,
    type,
    search: debouncedSearch,
  });

  const columns: Column<Transaction>[] = [
    {
      key: "userName",
      header: "User",
      cell: (t) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={t.userAvatar} alt={t.userName} />
            <AvatarFallback>{initials(t.userName)}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{t.userName}</span>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      cell: (t) => (
        <Badge variant={t.type === "subscription" ? "default" : "secondary"}>
          {PAYMENT_TYPE_LABELS[t.type]}
        </Badge>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      align: "right",
      cell: (t) => (
        <span className="font-medium">{formatCurrency(t.amount)}</span>
      ),
    },
    {
      key: "date",
      header: "Date",
      align: "right",
      cell: (t) => (
        <span className="text-muted-foreground">{formatDate(t.date)}</span>
      ),
    },
  ];

  return (
    <Card className="space-y-4 p-4 sm:p-5">
      <div>
        <h3 className="font-display text-lg font-semibold tracking-tight">Transaction History</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          View and trace all user payments and subscription purchases.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by user…"
        />
        <Select
          value={type}
          onValueChange={(v) => setType(v as TransactionType | "all")}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="subscription">Subscription</SelectItem>
            <SelectItem value="ai_score">AI Score</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        rowKey={(t) => t.id}
        isLoading={isFetching}
        onRowClick={(t) => navigate(`/users/${t.userId}`)}
        emptyTitle="No transactions found"
      />

      <Pagination
        page={page}
        pageSize={appConfig.defaultPageSize}
        total={data?.total ?? 0}
        onPageChange={setPage}
      />
    </Card>
  );
}
