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
import { useGetRevenueOverviewQuery } from "@/services";
import { formatCurrency } from "@/lib/utils";

const YEARS = [2025, 2026] as const;

export function RevenueOverviewCard() {
  const [year, setYear] = useState<number>(2026);
  const timeRange = "Monthly";

  const { data, isLoading } = useGetRevenueOverviewQuery({ timeRange, year });

  return (
    <Card className="lg:col-span-2">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle>Revenue Overview</CardTitle>
          <CardDescription>Subscription vs AI Scan revenue breakdown</CardDescription>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {/* Year Selector */}
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
          <Skeleton className="h-[280px] w-full" />
        ) : (
          <>
            {/* Total banner */}
            <div className="mb-4 flex items-baseline gap-2">
              <span className="font-display text-2xl font-semibold">
                {formatCurrency(data.total)}
              </span>
              <span className="text-xs text-muted-foreground">
                total · {year}
              </span>
            </div>
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.monthly}
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
                    tickFormatter={(v) => `$${v / 1000}k`}
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
                    formatter={(value: number, name) => [
                      formatCurrency(value),
                      name === "subscription" ? "Subscription" : "AI Scan",
                    ]}
                  />
                  <Legend
                    iconType="circle"
                    formatter={(v) => (
                      <span className="text-foreground font-semibold ml-1">
                        {v === "subscription" ? "Subscription" : "AI Scan"}
                      </span>
                    )}
                    wrapperStyle={{ fontSize: 12 }}
                  />
                  <Bar
                    dataKey="subscription"
                    stackId="rev"
                    fill="hsl(var(--primary))"
                    radius={[0, 0, 0, 0]}
                    maxBarSize={36}
                  />
                  <Bar
                    dataKey="aiScore"
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
