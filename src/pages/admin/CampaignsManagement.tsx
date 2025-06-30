/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
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
  Eye,
  CircleX,
  MoreHorizontal,
  Ban,
  Loader2,
  CheckCircle,
  Check,
  Copy,
} from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/axios";
import { pageSize } from "@/constants/limit.json";
import {
  Campaign,
  getCampaignStatusBadge,
} from "../dashboard/advertiser/CampaignsPage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";
import { useSettings } from "@/contexts/SettingsContext";

export default function CampaignsManagement() {
  const { id } = useParams();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status") || "";
  const currentPage = Number(searchParams.get("page")) || 1;
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isUpdating, setIsUpdating] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const params = {
        status,
        page: currentPage,
        limit: pageSize,
      };
      const response = await api.get("/admin/campaigns", { params });
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
  }, [status, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages)
      navigate(`/admin/campaigns?status=${status}&page=${page}`);
  };

  const handleStatusChange = async (id: number, status: string) => {
    setIsUpdating(id);
    try {
      const response = await api.patch(`/admin/campaigns/${id}/status`, {
        status,
        admin_percentage: settings?.admin_campaign_percentage,
      });
      if (response.status === 200) {
        toast.success(`Campaign ${status} successfully`);
        fetchCampaigns();
      }
    } catch (error: any) {
      console.error("Error updating campaign status:", error);
      toast.error("Failed to update campaign status");
    } finally {
      setIsUpdating(null);
    }
  };

  const handleCopyId = async (id: number) => {
    try {
      await navigator.clipboard.writeText(id?.toString());
      setCopiedId(id);
      toast.success("ID copied to clipboard");
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      toast.error("Failed to copy ID");
    }
  };

  const formatId = (id: string) => {
    return `${id.substring(0, 8)}...`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <section>
      {!id && (
        <aside className="flex justify-end mb-4 gap-2">
          <Select
            value={status ?? ""}
            onValueChange={(e) => {
              navigate(`/admin/campaigns?status=${e}&page=1`);
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
                navigate("/admin/campaigns");
              }}
            >
              <CircleX className="w-4 h-4" />
            </Button>
          )}
          <Button
            onClick={() => navigate("/admin/campaigns/create")}
            className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1"
          >
            <Plus className="h-4 w-4" /> Create
          </Button>
        </aside>
      )}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>All Campaigns</CardTitle>
        </CardHeader>
        <CardContent className="mt-2">
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Campaign</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Advertiser
                  </TableHead>
                  {!id && (
                    <>
                      <TableHead className="text-right">Type</TableHead>
                      <TableHead className="hidden lg:table-cell">
                        Payout
                      </TableHead>
                      <TableHead className="hidden lg:table-cell">
                        Caps
                      </TableHead>
                    </>
                  )}

                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns?.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <span>{campaign.id}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 hover:bg-gray-100"
                          onClick={() => handleCopyId(campaign.id)}
                        >
                          {copiedId === campaign.id ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4 text-gray-500" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {campaign?.campaign_name ?? "-"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {campaign?.user?.full_name || campaign?.user_company_name}
                    </TableCell>
                    {!id && (
                      <>
                        <TableCell className="text-right uppercase text-sm">
                          {campaign?.payout_type}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-left text-xs">
                          {campaign?.campaign_payout}$ <br />
                          per {campaign?.payout_type}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-xs">
                          {campaign?.daily_conversion_cap === "0"
                            ? `Daily: Unlimited`
                            : `Daily: ${campaign?.daily_conversion_cap}`}{" "}
                          <br />
                          {campaign?.monthly_conversion_cap === "0"
                            ? `Monthly: Unlimited`
                            : `Monthly: ${campaign?.monthly_conversion_cap}`}
                          <br />
                          {campaign?.overall_conversion_cap === "0"
                            ? `Total: Unlimited`
                            : `Total: ${campaign?.overall_conversion_cap}`}
                        </TableCell>
                      </>
                    )}
                    <TableCell>
                      {getCampaignStatusBadge(campaign?.status)}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                navigate(`/admin/campaigns/${campaign?.id}`);
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              <span>View Details</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                navigate(
                                  `/admin/campaigns/edit/${campaign.id}`
                                );
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              <span>Edit Campaign</span>
                            </DropdownMenuItem>
                            {campaign.status === "pending" && (
                              <Fragment>
                                <DropdownMenuItem
                                  className="text-green-600"
                                  disabled={isUpdating === campaign.id}
                                  onClick={() =>
                                    handleStatusChange(campaign.id, "active")
                                  }
                                >
                                  {isUpdating === campaign.id ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  ) : (
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                  )}
                                  <span>Approve</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  disabled={isUpdating === campaign.id}
                                  onClick={() =>
                                    handleStatusChange(campaign.id, "rejected")
                                  }
                                >
                                  {isUpdating === campaign.id ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  ) : (
                                    <Ban className="mr-2 h-4 w-4" />
                                  )}
                                  <span>Reject</span>
                                </DropdownMenuItem>
                              </Fragment>
                            )}
                            {campaign.status === "active" && (
                              <DropdownMenuItem
                                className="text-gray-600"
                                disabled={isUpdating === campaign.id}
                                onClick={() =>
                                  handleStatusChange(campaign.id, "paused")
                                }
                              >
                                {isUpdating === campaign.id ? (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                  <Ban className="mr-2 h-4 w-4" />
                                )}
                                <span>Pause</span>
                              </DropdownMenuItem>
                            )}
                            {campaign.status === "paused" && (
                              <DropdownMenuItem
                                className="text-green-600"
                                disabled={isUpdating === campaign.id}
                                onClick={() =>
                                  handleStatusChange(campaign.id, "active")
                                }
                              >
                                {isUpdating === campaign.id ? (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                )}
                                <span>Approve</span>
                              </DropdownMenuItem>
                            )}
                            {campaign.status === "rejected" && (
                              <DropdownMenuItem
                                className="text-green-600"
                                disabled={isUpdating === campaign.id}
                                onClick={() =>
                                  handleStatusChange(campaign.id, "active")
                                }
                              >
                                {isUpdating === campaign.id ? (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                )}
                                <span>Approve</span>
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {totalPages > 1 && (
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
