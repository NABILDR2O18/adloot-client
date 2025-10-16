/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  ChevronLeft,
  BarChart2,
  Target,
  Globe,
  CheckCircle,
  LineChartIcon,
  DollarSignIcon,
  Headset,
  BarChart,
  CircleX,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import api from "@/lib/axios";
import {
  Campaign,
  getCampaignStatusBadge,
} from "../dashboard/advertiser/CampaignsPage";
import {
  AdvertiserStats,
  AdvertiserStatsCard,
} from "../dashboard/advertiser/AdvertiserDashboard";
import { DatePickerWithRange } from "@/components/dashboard/DateRangePicker";
import { DateRange } from "react-day-picker";

type CampaignStats = {
  campaign: {
    id: number;
    name: string;
  };
  totals: {
    clicks: number;
    conversions: number;
    /** String percentage with 2 decimals, e.g. "12.34" */
    conversionRate: string;
    spend: number;
  };
  chart: {
    groupBy: "day" | "month" | "year";
    data: Array<{
      /** ISO-like date string matching the groupBy granularity */
      date: string;
      clicks: number;
      conversions: number;
    }>;
  };
  periodComparison: null | {
    currentClicks: number;
    previousClicks: number;
    /** Percentage change vs previous period (can be negative) */
    percentChange: number;
  };
};

export default function CampaignDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [stats, setStats] = useState<CampaignStats | null>(null);

  const fetchStats = async (id: string) => {
    try {
      const params = {
        from: date?.from,
        to: date?.to,
      };
      const response = await api.get(`/admin/campaigns/${id}/stats`, {
        params,
      });
      setStats(response?.data?.data);
    } catch (error: any) {
      setStats(null);
    }
  };

  const fetchCampaign = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/campaigns/${id}`);
      await fetchStats(response?.data?.data?.campaign?.id);
      setCampaign(response?.data?.data?.campaign);
    } catch (error: any) {
      console.error("Error fetching campaigns:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaign();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-center">Campaign not found</div>
        <Button className="mt-4" onClick={() => navigate(-1)}>
          Return to Campaigns
        </Button>
      </div>
    );
  }

  return (
    <section className="space-y-4">
      {/* Stats*/}
      <div className="flex justify-between items-center gap-2">
        <Button
          variant="outline"
          className="flex items-center gap-1"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back to Campaigns</span>
        </Button>
        <aside className="flex items-center gap-2">
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
        </aside>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-4">
        <AdvertiserStatsCard
          title="Total Clicks"
          value={stats?.totals?.clicks?.toLocaleString() || "0"}
          delta=""
          icon={<BarChart className="text-blue-500" />}
        />
        <AdvertiserStatsCard
          title="Total Conversions"
          value={stats?.totals?.conversions?.toLocaleString() || "0"}
          delta=""
          icon={<LineChartIcon className="text-purple-500" />}
        />
        <AdvertiserStatsCard
          title="Conversion Rate"
          value={`${stats?.totals?.conversionRate || "0.00"}%`}
          delta=""
          icon={<LineChartIcon className="text-purple-500" />}
        />
        <AdvertiserStatsCard
          title="Total Spend"
          value={`$${stats?.totals?.spend || "0.00"}`}
          delta=""
          icon={<DollarSignIcon className="text-purple-500" />}
        />
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-4 md:w-auto md:inline-flex">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          {campaign.payout_type === "cpa" && (
            <TabsTrigger value="events">Events</TabsTrigger>
          )}
          <TabsTrigger value="targeting">Targeting</TabsTrigger>
          <TabsTrigger value="creatives">Creatives</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Campaign Details
                  {getCampaignStatusBadge(campaign.status)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Advertiser
                    </Label>
                    <div className="font-medium">
                      {campaign.user?.user_company_name ||
                        campaign?.user?.full_name}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Campaign ID
                    </Label>
                    <div className="font-medium">{campaign.id}</div>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Payout Type
                    </Label>
                    <div className="font-medium uppercase">
                      {campaign.payout_type}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Payout Amount
                    </Label>
                    <div className="font-medium">
                      ${campaign.campaign_payout}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Daily Cap
                    </Label>
                    <div className="font-medium">
                      {campaign?.daily_conversion_cap === "0"
                        ? "No limit"
                        : campaign?.daily_conversion_cap}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Monthly Cap
                    </Label>
                    <div className="font-medium">
                      {campaign?.monthly_conversion_cap === "0"
                        ? "No limit"
                        : campaign?.monthly_conversion_cap}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Created
                    </Label>
                    <div className="font-medium">
                      {format(new Date(campaign.created_at), "PPP")}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Last Updated
                    </Label>
                    <div className="font-medium">
                      {format(new Date(campaign.updated_at), "PPP")}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-sm text-muted-foreground">
                      Description
                    </Label>
                    <p className="mt-1">{campaign.description}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-sm text-muted-foreground">
                      Call to Action
                    </Label>
                    <p className="mt-1">{campaign.call_to_action}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-sm text-muted-foreground">
                      Notes
                    </Label>
                    <p className="mt-1">{campaign.notes}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Campaign Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>Expiry</span>
                      </div>
                      <p className="text-lg font-medium mt-1">
                        {campaign.expiry_date
                          ? format(new Date(campaign.expiry_date), "PPP")
                          : "No expiry"}
                      </p>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="flex items-center text-sm text-gray-500">
                        <Target className="w-4 h-4 mr-1" />
                        <span>Type</span>
                      </div>
                      <p className="text-lg font-medium mt-1 uppercase">
                        {campaign.campaign_type || "Single"}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                    <div className="flex items-center text-sm text-gray-500">
                      <Globe className="w-4 h-4 mr-1" />
                      <span>Preview URL</span>
                    </div>
                    <a
                      href={campaign.preview_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all mt-1 block"
                    >
                      {campaign.preview_url}
                    </a>
                  </div>

                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                    <div className="flex items-center text-sm text-gray-500">
                      <BarChart2 className="w-4 h-4 mr-1" />
                      <span>Tracking URL</span>
                    </div>
                    <p className="break-all mt-1">{campaign.tracking_url}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {campaign.payout_type === "cpa" && (
          <TabsContent value="events" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Events</CardTitle>
                <CardDescription>
                  Track conversion events and their payouts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event Name</TableHead>
                      <TableHead className="text-right">Payout</TableHead>
                      <TableHead>Tracking Token</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaign.events_or_action?.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">
                          {event.name}
                        </TableCell>
                        <TableCell className="text-right">
                          ${event.payout}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {event.token}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="targeting" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Targeting</CardTitle>
              <CardDescription>
                Platform, device, and geographic targeting settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Platforms</h3>
                  <div className="space-y-2">
                    {(campaign?.platforms || []).map((platform) => (
                      <div key={platform} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="capitalize">{platform}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Devices</h3>
                  <div className="space-y-2">
                    {(campaign?.devices || []).map((device) => (
                      <div key={device} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="capitalize">{device}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Geographic Targeting</h3>
                  {campaign?.country_target_type === "all" ? (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-blue-500" />
                      <span>Global Campaign</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {(campaign?.countries || []).map((country) => (
                        <div key={country} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="uppercase">{country}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="creatives" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Creatives</CardTitle>
              <CardDescription>
                Campaign images and creative assets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {campaign?.primary_image && (
                  <div className="border rounded-lg p-4 space-y-4">
                    <div className="font-medium text-sm">Main Image</div>
                    <div className="aspect-square w-full relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                      <img
                        src={campaign?.primary_image}
                        alt="Existing main campaign image"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                )}
                {campaign?.secondary_image && (
                  <div className="border rounded-lg p-4 space-y-4">
                    <div className="font-medium text-sm">Main Image</div>
                    <div className="aspect-square w-full relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                      <img
                        src={campaign?.secondary_image}
                        alt="Existing main campaign image"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}
