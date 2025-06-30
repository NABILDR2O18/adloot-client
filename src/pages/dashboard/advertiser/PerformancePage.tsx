
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/dashboard/DateRangePicker";
import { DateRange } from "react-day-picker";
import { BarChart2, LineChart, TrendingDown, TrendingUp, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { PerformanceChart } from "@/components/dashboard/advertiser/PerformanceChart";
import { PerformanceBreakdownChart } from "@/components/dashboard/advertiser/PerformanceBreakdownChart";

export default function PerformancePage() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <h2 className="text-lg font-medium">Performance Analytics</h2>
          <DatePickerWithRange date={date} setDate={setDate} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Ad Spend"
          value="$12,489"
          delta="+8.3%"
          icon={<BarChart2 className="text-blue-500" />}
        />
        <StatsCard
          title="Total Impressions"
          value="256,842"
          delta="+12.5%"
          icon={<Users className="text-green-500" />}
        />
        <StatsCard
          title="Total Clicks"
          value="18,492"
          delta="+9.2%"
          icon={<TrendingUp className="text-purple-500" />}
        />
        <StatsCard
          title="Average CPC"
          value="$0.67"
          delta="-2.5%"
          negative={true}
          icon={<LineChart className="text-orange-500" />}
        />
      </div>
      
      <Tabs defaultValue="overview" className="mb-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="by-campaign">By Campaign</TabsTrigger>
          <TabsTrigger value="by-device">By Device</TabsTrigger>
          <TabsTrigger value="by-geography">By Geography</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-0">
              <div>
                <CardTitle className="text-xl">Campaign Performance</CardTitle>
                <p className="text-sm text-muted-foreground">Daily spend and conversions</p>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <PerformanceChart />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="by-campaign">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Performance by Campaign</CardTitle>
              <p className="text-sm text-muted-foreground">Comparison of all active campaigns</p>
            </CardHeader>
            <CardContent>
              <PerformanceBreakdownChart />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="by-device">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Performance by Device</CardTitle>
              <p className="text-sm text-muted-foreground">Mobile vs tablet vs desktop</p>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] flex items-center justify-center">
                <p className="text-muted-foreground">Select date range to view device performance breakdown</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="by-geography">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Performance by Geography</CardTitle>
              <p className="text-sm text-muted-foreground">Regional performance data</p>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] flex items-center justify-center">
                <p className="text-muted-foreground">Select date range to view geographic performance breakdown</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Top Performing Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Mobile Game Promo {item}</h3>
                    <p className="text-sm text-muted-foreground">CPI Campaign</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${(Math.random() * 500 + 500).toFixed(2)}</p>
                    <p className="text-xs text-green-600">
                      <TrendingUp className="inline h-3 w-3 mr-1" />
                      {(Math.random() * 10 + 5).toFixed(1)}%
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
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Desktop Banner Ad {item}</h3>
                    <p className="text-sm text-muted-foreground">CPC Campaign</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${(Math.random() * 200 + 100).toFixed(2)}</p>
                    <p className="text-xs text-red-600">
                      <TrendingDown className="inline h-3 w-3 mr-1" />
                      {(Math.random() * 5 + 2).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface StatsCardProps {
  title: string;
  value: string;
  delta: string;
  negative?: boolean;
  icon?: React.ReactNode;
}

function StatsCard({ title, value, delta, negative = false, icon }: StatsCardProps) {
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
            <span className={cn(
              "text-sm font-medium",
              negative ? "text-red-600" : "text-green-600"
            )}>
              {delta}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
