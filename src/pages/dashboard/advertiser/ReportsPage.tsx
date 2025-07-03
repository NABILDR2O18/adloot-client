import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { DatePickerWithRange } from "@/components/dashboard/DateRangePicker";
import { DateRange } from "react-day-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { Button } from "@/components/ui/button";
import { Download, Filter } from "lucide-react";

export default function ReportsPage() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
  });

  const campaignData = [
    {
      id: 1,
      name: "Summer Sale Promo",
      type: "Mobile App",
      impressions: 45892,
      clicks: 3241,
      conversions: 421,
      ctr: 7.06,
      cost: 1256.43,
    },
    {
      id: 2,
      name: "New User Acquisition",
      type: "Desktop Web",
      impressions: 32567,
      clicks: 2198,
      conversions: 312,
      ctr: 6.75,
      cost: 845.29,
    },
    {
      id: 3,
      name: "Brand Awareness",
      type: "Social Media",
      impressions: 58921,
      clicks: 4125,
      conversions: 529,
      ctr: 7.0,
      cost: 1578.67,
    },
    {
      id: 4,
      name: "Product Launch",
      type: "Mobile App",
      impressions: 27834,
      clicks: 1897,
      conversions: 243,
      ctr: 6.82,
      cost: 723.12,
    },
    {
      id: 5,
      name: "Holiday Special",
      type: "Desktop Web",
      impressions: 41265,
      clicks: 2876,
      conversions: 381,
      ctr: 6.97,
      cost: 1132.45,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-lg font-medium">Campaign Reports</h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <DatePickerWithRange
            date={date}
            setDate={setDate}
            className="w-full sm:w-auto"
          />
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="gap-1">
              <Filter size={16} /> Filter
            </Button>
            <Button size="sm" variant="outline" className="gap-1">
              <Download size={16} /> Export
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="min-h-[400px]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="text-xl">Performance Metrics</CardTitle>
                <CardDescription>
                  Campaign performance over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PerformanceChart />
              </CardContent>
            </Card>

            <MetricCard
              title="Total Impressions"
              value="248,532"
              change="+12.5%"
              trend="up"
              description="vs. previous period"
            />

            <MetricCard
              title="Total Clicks"
              value="16,425"
              change="+8.3%"
              trend="up"
              description="vs. previous period"
            />

            <MetricCard
              title="Conversion Rate"
              value="6.7%"
              change="-2.5%"
              trend="down"
              description="vs. previous period"
            />
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="min-h-[400px]">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Campaign Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campaign</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Impressions</TableHead>
                      <TableHead className="text-right">Clicks</TableHead>
                      <TableHead className="text-right">Conversions</TableHead>
                      <TableHead className="text-right">CTR (%)</TableHead>
                      <TableHead className="text-right">Cost ($)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaignData.map((campaign) => (
                      <TableRow key={campaign.id}>
                        <TableCell className="font-medium">
                          {campaign.name}
                        </TableCell>
                        <TableCell>{campaign.type}</TableCell>
                        <TableCell className="text-right">
                          {campaign.impressions.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {campaign.clicks.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {campaign.conversions.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {campaign.ctr.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          ${campaign.cost.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demographics" className="min-h-[400px]">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-xl">Demographic Analysis</CardTitle>
              <CardDescription>
                Audience breakdown by age, gender, location
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-80">
                <p className="text-muted-foreground">
                  Demographic charts will be displayed here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="min-h-[400px]">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-xl">
                Device & Platform Analysis
              </CardTitle>
              <CardDescription>
                Performance across different devices and platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-80">
                <p className="text-muted-foreground">
                  Device distribution charts will be displayed here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  description: string;
}

function MetricCard({
  title,
  value,
  change,
  trend,
  description,
}: MetricCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <div className="mt-1">
            <h3 className="text-2xl font-bold">{value}</h3>
            <p
              className={`text-sm flex items-center mt-1 ${
                trend === "up" ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend === "up" ? (
                <TrendingUp size={16} className="mr-1" />
              ) : (
                <TrendingDown size={16} className="mr-1" />
              )}
              {change}{" "}
              <span className="text-muted-foreground ml-1">{description}</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TrendingUp({ size = 24, className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
      <polyline points="17 6 23 6 23 12"></polyline>
    </svg>
  );
}

function TrendingDown({ size = 24, className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
      <polyline points="17 18 23 18 23 12"></polyline>
    </svg>
  );
}
