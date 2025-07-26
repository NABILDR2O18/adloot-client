/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Plus,
  Edit,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  CircleX,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/axios";
import { pageSize } from "@/constants/limit.json";
import { useUser } from "@/contexts/UserContext";

type CampaignStatus = "active" | "rejected" | "pending" | "paused";
type CampaignCategory = "games" | "utilities" | "entertainment" | "finance";
type CountryTargetType = "all" | "specific";
type PayoutType = "cpi" | "cpa" | "cpe";
type CampaignType = "single" | "multi";

export interface CampaignEvent {
  id: number;
  name: string;
  token: string;
  payout: string; // assuming payout is sent as a string (e.g. "1.00")
}

interface UserInfo {
  id: string;
  full_name: string;
  user_company_name: string;
}

export interface Campaign {
  id: number;
  user_id: string;
  campaign_name: string;
  preview_url: string;
  tracking_url: string;
  category: CampaignCategory;
  country_target_type: CountryTargetType;
  payout_type: PayoutType;
  campaign_type: CampaignType;
  campaign_payout: string;

  platforms: string[];
  devices: string[];
  countries: string[];

  events_or_action: CampaignEvent[];

  daily_conversion_cap: string;
  monthly_conversion_cap: string;
  overall_conversion_cap: string;

  daily_click_cap: string;
  monthly_click_cap: string;
  overall_click_cap: string;

  daily_revenue_cap: string;
  monthly_revenue_cap: string;
  overall_revenue_cap: string;

  has_expiry: boolean;
  expiry_date: string | null;

  description: string | null;
  call_to_action: string | null;
  notifications: boolean;
  notes: string | null;
  primary_image: string;
  secondary_image: string;
  status: CampaignStatus;

  created_at: string;
  updated_at: string;

  user_full_name: string;
  user_company_name: string;
  user: UserInfo;

  spent: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  admin_percentage: number;

  stats: {
    totalSpent: number;
    totalClicks: number;
    cpc: string;
  };
}

// eslint-disable-next-line react-refresh/only-export-components
export const getCampaignStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Active
        </span>
      );
    case "rejected":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="w-3 h-3 mr-1" />
          Rejected
        </span>
      );
    case "paused":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <AlertCircle className="w-3 h-3 mr-1" />
          Paused
        </span>
      );
    case "pending":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </span>
      );
    default:
      return null;
  }
};

export default function CampaignsPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status") || "";
  const currentPage = Number(searchParams.get("page")) || 1;
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const params = {
        status,
        page: currentPage,
        limit: pageSize,
      };
      const response = await api.get("/advertiser/campaigns", { params });
      setCampaigns(response?.data?.data?.campaigns);
      setTotalPages(response.data.data.pagination.totalPages);
    } catch (error: any) {
      console.error("Error fetching campaigns:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages)
      navigate(`/advertiser/dashboard/campaigns?status=${status}&page=${page}`);
  };

  return (
    <section>
      {user?.available_balance <= 0 && (
        <div className="mt-6 bg-yellow-50 border border-yellow-200 p-4 rounded-md">
          <p className="font-semibold text-yellow-800">IMPORTANT!</p>
          <p className="font-medium text-yellow-800 mt-2">
            You can create campaign only when you will have funds in your
            account deposited.
          </p>
        </div>
      )}
      <aside className="flex justify-end mb-4 gap-2 mt-4">
        <Select
          value={status ?? ""}
          onValueChange={(e) => {
            navigate(`/advertiser/dashboard/campaigns?status=${e}&page=1`);
          }}
        >
          <SelectTrigger className="md:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
          </SelectContent>
        </Select>
        {status && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              navigate("/advertiser/dashboard/campaigns");
            }}
          >
            <CircleX className="w-4 h-4" />
          </Button>
        )}
        {user?.available_balance > 0 && (
          <Button
            onClick={() => navigate("/advertiser/dashboard/campaigns/create")}
            className="whitespace-nowrap"
          >
            <Plus className="h-4 w-4" /> Create
          </Button>
        )}
      </aside>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>All Campaigns</CardTitle>
        </CardHeader>
        <CardContent className="mt-2">
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Device</TableHead>
                  <TableHead className="text-right">Spent</TableHead>
                  <TableHead className="hidden md:table-cell text-right">
                    Clicks
                  </TableHead>
                  <TableHead className="hidden lg:table-cell text-right">
                    CPC
                  </TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns?.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">
                      {campaign?.campaign_name}
                    </TableCell>
                    <TableCell>
                      {getCampaignStatusBadge(campaign?.status)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {Array.isArray(campaign?.devices) &&
                      campaign.devices.length > 0
                        ? campaign.devices.join(", ")
                        : "No devices selected"}
                    </TableCell>
                    <TableCell className="text-right">
                      ${campaign?.stats?.totalSpent ?? 0}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-right">
                      {campaign?.stats?.totalClicks}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-right">
                      ${campaign?.stats?.cpc ?? 0}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        <Button
                          onClick={() =>
                            navigate(
                              `/advertiser/dashboard/campaigns/edit/${campaign.id}`
                            )
                          }
                          variant="ghost"
                          size="icon"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => {
                            navigate(
                              `/advertiser/dashboard/campaigns/${campaign?.id}`
                            );
                          }}
                          variant="ghost"
                          size="icon"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {campaigns?.length > 0 && (
            <Pagination className="mt-4 justify-end">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    className="text-xs"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage - 1);
                    }}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }).map((_, idx) => (
                  <PaginationItem key={idx}>
                    <PaginationLink
                      size="sm"
                      isActive={currentPage === idx + 1}
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(idx + 1);
                      }}
                    >
                      {idx + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                {totalPages > 3 && currentPage < totalPages - 1 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationNext
                    className="text-xs"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage + 1);
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
