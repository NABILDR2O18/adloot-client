/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/dashboard/DateRangePicker";
import { DateRange } from "react-day-picker";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import {
  DollarSign,
  AlertCircle,
  CheckCircle,
  Wallet,
  CreditCard,
  Users,
  CircleX,
} from "lucide-react";
import api from "@/lib/axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

type DashboardStats = {
  availableAdvertiserBalance: number;
  availablePublisherBalance: number;
  totalPublisherEarnings: number;
  totalRevenue: number;
  totalPublishers: number;
  totalAdvertisers: number;
  chart: {
    groupBy: string;
    publisher: {
      date: string; // ISO date string
      count: number;
    }[];
    advertiser: {
      date: string; // ISO date string
      count: number;
    }[];
  };
  lastPublisherLogins: {
    id: string;
    full_name: string;
    email: string;
    last_login: string;
  }[];
  lastAdvertiserLogins: {
    id: string;
    full_name: string;
    email: string;
    last_login: string;
  }[];
};

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  const fetchStats = async () => {
    try {
      setLoading(true);
      const params = {
        from: date?.from,
        to: date?.to,
      };
      const response = await api.get("/admin/stats", { params });
      setStats(response?.data?.data);
    } catch (error: any) {
      console.error("Error fetching apps:", error);
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

  // Merge publisher and advertiser registration data by date
  const userChartData = stats?.chart
    ? Array.from(
        new Set([
          ...stats.chart.publisher.map((d) => d.date),
          ...stats.chart.advertiser.map((d) => d.date),
        ])
      )
        .sort()
        .map((date) => ({
          date: new Date(date).toLocaleDateString(),
          Publishers:
            stats.chart.publisher.find((d) => d.date === date)?.count || 0,
          Advertisers:
            stats.chart.advertiser.find((d) => d.date === date)?.count || 0,
        }))
    : [];

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 mb-8">
        <StatsCard
          title="Total Revenue"
          value={`$${stats?.totalRevenue?.toLocaleString()}`}
          delta="+12.5%"
          icon={<DollarSign className="text-green-500" />}
        />
        <StatsCard
          title="Total Advertisers"
          value={`${stats?.totalAdvertisers?.toLocaleString()}`}
          delta="+8.2%"
          icon={<Users className="text-blue-500" />}
        />
        <StatsCard
          title="Total Publishers"
          value={`${stats?.totalPublishers?.toLocaleString()}`}
          delta="+15.3%"
          icon={<Users className="text-purple-500" />}
        />
        <StatsCard
          title="Available Advertiser Balance"
          value={`$${stats?.availableAdvertiserBalance?.toLocaleString()}`}
          delta="+8.2%"
          icon={<Wallet className="text-blue-500" />}
        />
        <StatsCard
          title="Available Publisher Balance"
          value={`$${stats?.availablePublisherBalance?.toLocaleString()}`}
          delta="+15.3%"
          icon={<CreditCard className="text-purple-500" />}
        />
        <StatsCard
          title="Total Publisher Earnings"
          value={`$${stats?.totalPublisherEarnings?.toLocaleString()}`}
          delta="+5.7%"
          icon={<DollarSign className="text-orange-500" />}
        />
      </div>

      <div className="grid grid-cols-1 gap-8 mb-8">
        <Card>
          <CardHeader className="flex justify-between items-center md:flex-row flex-col gap-4">
            <CardTitle className="text-xl">User registration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={userChartData}
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
                    dataKey="Publishers"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    name="Publishers"
                  />
                  <Line
                    type="monotone"
                    dataKey="Advertisers"
                    stroke="#10B981"
                    strokeWidth={2}
                    name="Advertisers"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Recent Publisher Signups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.lastPublisherLogins?.map((item) => (
                <div
                  key={`publisher-${item?.id}`}
                  className="flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-medium">Publisher #{item?.id}</h3>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(item?.last_login), "Pp")}
                    </p>
                  </div>
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Active
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Recent Advertiser Signups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.lastAdvertiserLogins?.map((item) => (
                <div
                  key={`publisher-${item?.id}`}
                  className="flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-medium">Publisher #{item?.id}</h3>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(item?.last_login), "Pp")}
                    </p>
                  </div>
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Active
                    </span>
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
  icon: React.ReactNode;
  negative?: boolean;
}

function StatsCard({
  title,
  value,
  delta,
  icon,
  negative = false,
}: StatsCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            {icon}
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-bold">{value}</h3>
            {/* <span
              className={cn(
                "text-sm font-medium",
                negative ? "text-red-600" : "text-green-600"
              )}
            >
              {delta}
            </span> */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
