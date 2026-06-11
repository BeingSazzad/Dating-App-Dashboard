import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import { useGetRevenueDataQuery } from "@/redux/apiSlices/admin/dashboardApi";

const YEARS = [2025, 2026] as const;

export function RevenueOverviewCard() {
  const [year, setYear] = useState<number>(2026);

  const { data: revRes, isLoading } = useGetRevenueDataQuery({ revenueYear: year });
  const data = revRes?.data?.revenueArray; // Array of monthly data

  // Calculate dynamic total from the provided array
  const totalRevenue = data?.reduce((acc: number, curr: any) => acc + curr.total, 0) || 0;

  return (
    <Card className="lg:col-span-2">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle>Revenue Overview</CardTitle>
          <CardDescription>Subscription vs AI Scan revenue breakdown</CardDescription>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
            <SelectTrigger className="h-8 w-[80px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {YEARS.map((y) => (
                <SelectItem key={y} value={String(y)} className="text-xs">
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading || !data ? (
          // SKELETON LOADER FOR GRAPH
          <div className="flex flex-col space-y-4">
            <Skeleton className="h-[32px] w-[120px]" />
            <Skeleton className="h-[240px] w-full rounded-xl" />
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-baseline gap-2">
              <span className="font-display text-2xl font-semibold">
                {formatCurrency(totalRevenue)}
              </span>
              <span className="text-xs text-muted-foreground">
                total · {year}
              </span>
            </div>
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{ top: 8, right: 8, left: -8, bottom: 0 }}
                  barGap={4}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    stroke="hsl(var(--muted-foreground))"
                    interval={0}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    stroke="hsl(var(--muted-foreground))"
                    tickFormatter={(v) => `$${v}`}
                  />
                  <Tooltip
                    cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid hsl(var(--border))",
                      background: "hsl(var(--popover))",
                      color: "hsl(var(--popover-foreground))",
                      fontSize: 12,
                    }}
                    formatter={(value: number, name: string) => [
                      formatCurrency(value),
                      name === "sub_revenue" ? "Subscription" : "AI Scan",
                    ]}
                  />
                  <Legend
                    iconType="circle"
                    formatter={(v) => (
                      <span className="text-foreground font-semibold ml-1">
                        {v === "sub_revenue" ? "Subscription" : "AI Scan"}
                      </span>
                    )}
                    wrapperStyle={{ fontSize: 12 }}
                  />
                  <Bar
                    dataKey="sub_revenue"
                    stackId="rev"
                    fill="hsl(var(--primary))"
                    radius={[0, 0, 0, 0]}
                    maxBarSize={36}
                  />
                  <Bar
                    dataKey="scan_revenue"
                    stackId="rev"
                    fill="hsl(38 40% 25%)"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={36}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}