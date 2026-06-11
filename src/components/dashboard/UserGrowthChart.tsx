import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
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
import { useGetUserGrowthDataQuery } from "@/redux/apiSlices/admin/dashboardApi";

const YEARS = [2025, 2026] as const;

export function UserGrowthChart() {
  const [year, setYear] = useState<number>(2026);
  const { data: userRes, isLoading } = useGetUserGrowthDataQuery({ userGrowthYear: year });
  const data = userRes?.data?.userGrowthArray;

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle>User Growth</CardTitle>
          <CardDescription>New user registrations</CardDescription>
        </div>
        <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
          <SelectTrigger className="h-8 w-[80px] text-xs shrink-0">
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
      </CardHeader>
      <CardContent>
        {isLoading || !data ? (
          // SKELETON LOADER FOR GRAPH
          <Skeleton className="h-[280px] w-full rounded-xl" />
        ) : (
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 8, right: 8, left: -8, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="gUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="100%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
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
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid hsl(var(--border))",
                    background: "hsl(var(--popover))",
                    color: "hsl(var(--popover-foreground))",
                    fontSize: 12,
                  }}
                  formatter={(value: number) => [value, "New Users"]}
                />
                <Area
                  type="monotone"
                  dataKey="new_users"
                  name="New Users"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#gUsers)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}