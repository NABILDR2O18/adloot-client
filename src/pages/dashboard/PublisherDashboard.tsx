/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/dashboard/DateRangePicker";
import { DateRange } from "react-day-picker";
import {
  RecentEarningsTable,
  RecentEarning,
} from "@/components/dashboard/RecentEarningsTable";
import { cn } from "@/lib/utils";
import api from "@/lib/axios";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Button } from "@/components/ui/button";
import { CircleX } from "lucide-react";

type PublisherStats = {
  todaysRevenue: number;
  thisMonthRevenue: number;
  lastMonthRevenue: number;
  totalRevenue: number;
  recentEarnings: RecentEarning[];
  chart: {
    groupBy: string;
    data: {
      date: string;
      revenue: number;
    }[];
  };
};

export default function PublisherDashboard() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [stats, setStats] = useState<PublisherStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const params = {
        from: date?.from,
        to: date?.to,
      };
      const response = await api.get("/publisher/stats", { params });
      setStats(response?.data?.data);
    } catch (error: any) {
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const chartData = stats?.chart?.data || [];

  return (
    <section>
      <div className="flex justify-end items-center gap-2">
        <DatePickerWithRange date={date} setDate={setDate} />
        {(date?.from || date?.to) && (
          <Button
            onClick={() => {
              setDate({
                from: undefined,
                to: undefined,
              });
            }}
            variant="destructive"
            size="sm"
          >
            <CircleX className="w-4 h-4" />
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-4">
        <StatsCard
          title="Today's Revenue"
          value={`$${stats?.todaysRevenue?.toFixed(2) || "0.00"}`}
          delta=""
        />
        <StatsCard
          title="This Month"
          value={`$${stats?.thisMonthRevenue?.toFixed(2) || "0.00"}`}
          delta=""
        />
        <StatsCard
          title="Last Month"
          value={`$${stats?.lastMonthRevenue?.toFixed(2) || "0.00"}`}
          delta=""
        />
        <StatsCard
          title="Total Revenue"
          value={`$${stats?.totalRevenue?.toFixed(2) || "0.00"}`}
          delta=""
        />
      </div>

      <Card className="mb-8">
        <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-0">
          <div>
            <CardTitle className="text-xl">Performance Metrics</CardTitle>
            <p className="text-sm text-muted-foreground">
              {stats?.chart?.groupBy === "day"
                ? "Daily"
                : stats?.chart?.groupBy === "month"
                ? "Monthly"
                : "Yearly"}{" "}
              earnings
            </p>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 0,
                  right: 0,
                  left: -20,
                  bottom: 10,
                }}
              >
                <CartesianGrid />
                <XAxis dataKey="date" tick={{ fill: "#6B7280" }} />
                <YAxis allowDecimals={false} tick={{ fill: "#6B7280" }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6366f1"
                  strokeWidth={2}
                  name="Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Recent Earnings</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentEarningsTable earnings={stats?.recentEarnings || []} />
        </CardContent>
      </Card>
    </section>
  );
}

interface StatsCardProps {
  title: string;
  value: string;
  delta: string;
  negative?: boolean;
}

function StatsCard({ title, value, delta, negative = false }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-bold">{value}</h3>
            <span
              className={cn(
                "text-sm font-medium",
                negative ? "text-red-600" : "text-green-600"
              )}
            >
              {delta}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
