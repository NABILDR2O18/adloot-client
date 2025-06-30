/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/dashboard/DateRangePicker";
import { DateRange } from "react-day-picker";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";
import {
  BarChart,
  BarChart2,
  CircleX,
  DollarSignIcon,
  Headset,
  LineChart as LineChartIcon,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";

type CampaignPerformance = {
  id: number;
  name: string;
  clicks: number;
  percentChange: number;
};

type AdvertiserStats = {
  totalCampaigns: number;
  totalClicks: number;
  totalConversions: number;
  conversionRate: string;
  totalSpend: number;
  supportTickets: number;
  topFiveCampaigns: CampaignPerformance[];
  underFiveCampaigns: CampaignPerformance[];
  chart: {
    groupBy: string;
    data: {
      date: string;
      clicks: number;
      conversions: number;
    }[];
  };
};

export default function AdvertiserDashboard() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [stats, setStats] = useState<AdvertiserStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const params = {
        from: date?.from,
        to: date?.to,
      };
      const response = await api.get("/advertiser/stats", { params });
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 mt-4">
        <StatsCard
          title="Total Campaigns"
          value={stats?.totalCampaigns?.toLocaleString() || "0"}
          delta=""
          icon={<BarChart2 className="text-green-500" />}
        />
        <StatsCard
          title="Total Clicks"
          value={stats?.totalClicks?.toLocaleString() || "0"}
          delta=""
          icon={<BarChart className="text-blue-500" />}
        />
        <StatsCard
          title="Total Conversions"
          value={stats?.totalConversions?.toLocaleString() || "0"}
          delta=""
          icon={<LineChartIcon className="text-purple-500" />}
        />
        <StatsCard
          title="Conversion Rate"
          value={`${stats?.conversionRate || "0.00"}%`}
          delta=""
          icon={<LineChartIcon className="text-purple-500" />}
        />
        <StatsCard
          title="Total Spend"
          value={`$${stats?.totalSpend || "0.00"}`}
          delta=""
          icon={<DollarSignIcon className="text-purple-500" />}
        />
        <StatsCard
          title="Total Support Tickets"
          value={stats?.supportTickets?.toString() ?? "0"}
          delta=""
          icon={<Headset className="text-purple-500" />}
        />
      </div>

      <Card className="mb-8">
        <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-0">
          <div>
            <CardTitle className="text-xl">Campaign Performance</CardTitle>
            <p className="text-sm text-muted-foreground">
              {stats?.chart?.groupBy === "day"
                ? "Daily"
                : stats?.chart?.groupBy === "month"
                ? "Monthly"
                : "Yearly"}{" "}
              clicks and conversions
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
                  dataKey="clicks"
                  stroke="#6366f1"
                  strokeWidth={2}
                  name="Clicks"
                />
                <Line
                  type="monotone"
                  dataKey="conversions"
                  stroke="#10B981"
                  strokeWidth={2}
                  name="Conversions"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Top Performing Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.topFiveCampaigns?.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{item.clicks} clicks</p>
                    <p
                      className={`text-xs ${
                        item.percentChange >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {item.percentChange >= 0 ? (
                        <TrendingUp className="inline h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="inline h-3 w-3 mr-1" />
                      )}
                      {item.percentChange.toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Underperforming Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.underFiveCampaigns?.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{item.clicks} clicks</p>
                    <p
                      className={`text-xs ${
                        item.percentChange >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {item.percentChange >= 0 ? (
                        <TrendingUp className="inline h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="inline h-3 w-3 mr-1" />
                      )}
                      {item.percentChange.toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

interface StatsCardProps {
  title: string;
  value: string;
  delta: string;
  negative?: boolean;
  icon?: React.ReactNode;
}

function StatsCard({
  title,
  value,
  delta,
  negative = false,
  icon,
}: StatsCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            {icon}
          </div>
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
