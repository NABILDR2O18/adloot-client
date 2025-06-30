
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/dashboard/DateRangePicker";
import { DateRange } from "react-day-picker";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  FileDown, 
  BarChart2, 
  Download,
  TrendingDown,
  TrendingUp,
  ArrowRight,
  Wallet,
  CreditCard
} from "lucide-react";

export default function ReportsManagement() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
  });

  // Sample financial metrics
  const financialMetrics = [
    {
      title: "Total Advertiser Deposits",
      value: "$127,850.00",
      change: "+8.3%",
      trend: "up"
    },
    {
      title: "Advertiser Available Balance",
      value: "$43,250.00",
      change: "+5.2%", 
      trend: "up"
    },
    {
      title: "Publisher Review Balance",
      value: "$15,720.00",
      change: "+12.8%",
      trend: "up"
    },
    {
      title: "Total Publisher Earnings",
      value: "$85,243.00",
      change: "+9.5%",
      trend: "up"
    }
  ];

  // Sample report metrics
  const reportMetrics = [
    {
      name: "Revenue Report",
      description: "Total earnings and revenue breakdown by sources",
      lastRun: "Today, 09:15 AM",
      trend: "up",
      change: "+12.5%"
    },
    {
      name: "Publisher Performance",
      description: "Publisher metrics, conversions and earnings",
      lastRun: "Yesterday, 05:30 PM",
      trend: "up",
      change: "+8.3%"
    },
    {
      name: "Advertiser Campaigns",
      description: "Campaign performance, ROI and conversion metrics",
      lastRun: "Today, 10:00 AM",
      trend: "down",
      change: "-3.2%"
    },
    {
      name: "Offer Conversion Rates",
      description: "Offer performance and conversion rates by country",
      lastRun: "Yesterday, 02:45 PM",
      trend: "up",
      change: "+5.7%"
    },
    {
      name: "User Acquisition",
      description: "New user signups and platform growth metrics",
      lastRun: "Today, 08:30 AM",
      trend: "up",
      change: "+15.2%"
    }
  ];

  const getTrendIcon = (trend: string) => {
    if (trend === "up") {
      return <TrendingUp className="h-5 w-5 text-green-500" />;
    } else {
      return <TrendingDown className="h-5 w-5 text-red-500" />;
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <h2 className="text-lg font-medium">System Reports</h2>
          <DatePickerWithRange date={date} setDate={setDate} />
        </div>
        <Button className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700">
          <FileDown size={16} />
          <span>Export All Reports</span>
        </Button>
      </div>
      
      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {financialMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-500">{metric.title}</p>
                  {index % 2 === 0 ? 
                    <Wallet className="text-blue-500" /> : 
                    <CreditCard className="text-purple-500" />
                  }
                </div>
                <div className="flex items-baseline justify-between">
                  <h3 className="text-2xl font-bold">{metric.value}</h3>
                  <span className="text-sm font-medium text-green-600">
                    {metric.change}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center justify-between">
              <span>Revenue Breakdown</span>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Download size={14} />
                <span>CSV</span>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PerformanceChart />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center justify-between">
              <span>Conversion Metrics</span>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Download size={14} />
                <span>CSV</span>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PerformanceChart />
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Available Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Last Generated</TableHead>
                <TableHead>Trend</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportMetrics.map((report, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium flex items-center">
                    <BarChart2 className="mr-2 h-5 w-5 text-purple-500" />
                    {report.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{report.description}</TableCell>
                  <TableCell>{report.lastRun}</TableCell>
                  <TableCell className="flex items-center">
                    {getTrendIcon(report.trend)}
                    <span className={`ml-1 ${report.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                      {report.change}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">View Report</Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Download size={14} />
                        <span>Export</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <div className="mt-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Scheduled Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["Daily Revenue Summary", "Weekly Publisher Performance", "Monthly Advertiser ROI"].map((report, index) => (
                <div key={index} className="flex justify-between items-center p-4 border rounded-md">
                  <div>
                    <h3 className="font-medium">{report}</h3>
                    <p className="text-sm text-muted-foreground">
                      Next run: {index === 0 ? "Tomorrow, 00:00 AM" : index === 1 ? "Monday, 00:00 AM" : "June 1, 00:00 AM"}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ArrowRight size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
