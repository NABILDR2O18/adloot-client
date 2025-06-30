/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, Fragment } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import verticals from "@/constants/verticals.json";
import {
  ExternalLink,
  Calendar,
  DollarSign,
  CircleX,
  MoreHorizontal,
  Eye,
  Loader2,
  CheckCircle,
  Ban,
} from "lucide-react";
import { format } from "date-fns";
import {
  Campaign,
  getCampaignStatusBadge,
} from "../dashboard/advertiser/CampaignsPage";
import { useNavigate, useSearchParams } from "react-router-dom";
import { pageSize } from "@/constants/limit.json";
import api from "@/lib/axios";
import toast from "react-hot-toast";

export default function OffersManagement() {
  const navigate = useNavigate();
  const [selectedOffer, setSelectedOffer] = useState<Campaign | null>(null);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status") || "active";
  const vertical = searchParams.get("vertical") || "";
  const currentPage = Number(searchParams.get("page")) || 1;
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isUpdating, setIsUpdating] = useState<number | null>(null);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const params = {
        status,
        category: vertical,
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
    fetchOffers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, vertical, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages)
      navigate(
        `/admin/offers?status=${status}&vertical=${vertical}&page=${page}`
      );
  };

  const handleStatusChange = async (id: number, status: string) => {
    setIsUpdating(id);
    try {
      const response = await api.patch(`/admin/campaigns/${id}/status`, {
        status,
      });
      if (response.status === 200) {
        toast.success(`Campaign ${status} successfully`);
        fetchOffers();
      }
    } catch (error: any) {
      console.error("Error updating campaign status:", error);
      toast.error("Failed to update campaign status");
    } finally {
      setIsUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <Card>
        <CardHeader className="!max-h-max">
          <CardTitle>Manage Offers</CardTitle>
          <CardDescription>
            View and manage all campaign offers from advertisers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end gap-4 mb-4">
            <Select
              value={status ?? ""}
              onValueChange={(e) => {
                navigate(
                  `/admin/offers?status=${e}&vertical=${vertical}&page=1`
                );
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
            <Select
              value={vertical ?? ""}
              onValueChange={(e) => {
                navigate(`/admin/offers?status=${status}&vertical=${e}&page=1`);
              }}
            >
              <SelectTrigger className="md:w-[180px]">
                <SelectValue placeholder="Filter by vertical" />
              </SelectTrigger>
              <SelectContent>
                {verticals.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {(status || vertical) && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  navigate("/admin/offers");
                }}
              >
                <CircleX className="w-4 h-4" />
              </Button>
            )}
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Vertical</TableHead>
                  <TableHead>Payout</TableHead>
                  <TableHead>Daily Cap</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      No offers found
                    </TableCell>
                  </TableRow>
                ) : (
                  campaigns?.map((offer) => (
                    <TableRow key={offer.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium capitalize">
                            {offer.campaign_name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            ID: {offer.id}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {offer.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="uppercase">
                        ${offer.campaign_payout} ({offer?.payout_type})
                      </TableCell>
                      <TableCell>{offer.daily_conversion_cap}</TableCell>
                      <TableCell>
                        {getCampaignStatusBadge(offer?.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Button
                            onClick={() => {
                              setSelectedOffer(offer);
                              setShowPreviewDialog(true);
                            }}
                            size="sm"
                            variant="outline"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              {offer.status === "pending" && (
                                <Fragment>
                                  <DropdownMenuItem
                                    className="text-green-600"
                                    disabled={isUpdating === offer.id}
                                    onClick={() =>
                                      handleStatusChange(offer.id, "active")
                                    }
                                  >
                                    {isUpdating === offer.id ? (
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                      <CheckCircle className="mr-2 h-4 w-4" />
                                    )}
                                    <span>Approve</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    disabled={isUpdating === offer.id}
                                    onClick={() =>
                                      handleStatusChange(offer.id, "rejected")
                                    }
                                  >
                                    {isUpdating === offer.id ? (
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                      <Ban className="mr-2 h-4 w-4" />
                                    )}
                                    <span>Reject</span>
                                  </DropdownMenuItem>
                                </Fragment>
                              )}
                              {offer.status === "active" && (
                                <DropdownMenuItem
                                  className="text-gray-600"
                                  disabled={isUpdating === offer.id}
                                  onClick={() =>
                                    handleStatusChange(offer.id, "paused")
                                  }
                                >
                                  {isUpdating === offer.id ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  ) : (
                                    <Ban className="mr-2 h-4 w-4" />
                                  )}
                                  <span>Pause</span>
                                </DropdownMenuItem>
                              )}
                              {offer.status === "paused" && (
                                <DropdownMenuItem
                                  className="text-green-600"
                                  disabled={isUpdating === offer.id}
                                  onClick={() =>
                                    handleStatusChange(offer.id, "active")
                                  }
                                >
                                  {isUpdating === offer.id ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  ) : (
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                  )}
                                  <span>Approve</span>
                                </DropdownMenuItem>
                              )}
                              {offer.status === "rejected" && (
                                <DropdownMenuItem
                                  className="text-green-600"
                                  disabled={isUpdating === offer.id}
                                  onClick={() =>
                                    handleStatusChange(offer.id, "active")
                                  }
                                >
                                  {isUpdating === offer.id ? (
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
                  ))
                )}
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

      {/* Preview Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader className="!max-h-max">
            <DialogTitle>Offer Preview</DialogTitle>
            <DialogDescription>
              Review offer details and creative materials
            </DialogDescription>
          </DialogHeader>

          {selectedOffer && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    {selectedOffer.campaign_name}
                  </h3>
                  {getCampaignStatusBadge(selectedOffer?.status)}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Advertiser</Label>
                    <div className="mt-1">
                      {selectedOffer.user?.full_name ||
                        selectedOffer?.user?.user_company_name}
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Vertical</Label>
                    <div className="mt-1">
                      <Badge variant="secondary">
                        {selectedOffer?.category}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Payout</Label>
                    <div className="mt-1 flex items-center">
                      <DollarSign className="h-4 w-4 mr-1 text-green-500" />
                      <span className="font-medium text-green-500">
                        {selectedOffer?.campaign_payout} (
                        {selectedOffer?.payout_type})
                      </span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">
                      Campaign Type
                    </Label>
                    <div className="mt-1">
                      <Badge variant="secondary">
                        {selectedOffer.campaign_type || "single"}
                      </Badge>
                    </div>
                  </div>
                </div>

                {selectedOffer.description && (
                  <div>
                    <Label className="text-muted-foreground">Description</Label>
                    <p className="mt-1">{selectedOffer.description}</p>
                  </div>
                )}

                {selectedOffer.call_to_action && (
                  <div>
                    <Label className="text-muted-foreground">
                      Call to Action
                    </Label>
                    <p className="mt-1">{selectedOffer.call_to_action}</p>
                  </div>
                )}

                {selectedOffer.notes && (
                  <div>
                    <Label className="text-muted-foreground">Notes</Label>
                    <p className="mt-1">{selectedOffer.notes}</p>
                  </div>
                )}
              </div>

              <Separator />

              {/* Targeting Information */}
              {selectedOffer?.platforms?.[0] && (
                <div className="space-y-4">
                  <h4 className="font-medium">Targeting</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Platforms</Label>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {selectedOffer.platforms?.map((platform) => (
                          <Badge key={platform} variant="secondary">
                            {platform}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Devices</Label>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {selectedOffer?.devices?.map((device) => (
                          <Badge key={device} variant="secondary">
                            {device}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-muted-foreground">Countries</Label>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {selectedOffer?.country_target_type === "all" ? (
                          <Badge variant="secondary">Global</Badge>
                        ) : (
                          selectedOffer?.countries?.map((country) => (
                            <Badge key={country} variant="secondary">
                              {country.toUpperCase()}
                            </Badge>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <Separator />

              {/* Events (for CPA/CPE campaigns) */}
              {selectedOffer?.events_or_action &&
                selectedOffer?.events_or_action?.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-medium">Events</h4>
                    <div className="grid gap-4">
                      {selectedOffer?.events_or_action?.map((event) => (
                        <div
                          key={event.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <div className="font-medium">{event.name}</div>
                            <div className="text-sm text-muted-foreground">
                              Token: {event.token}
                            </div>
                          </div>
                          <div className="text-green-500 font-medium">
                            ${event.payout}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              <Separator />

              {/* Tracking & URLs */}
              <div className="space-y-4">
                <h4 className="font-medium">URLs & Tracking</h4>
                <div className="grid gap-4">
                  <div>
                    <Label className="text-muted-foreground">Preview URL</Label>
                    <div className="mt-1 flex items-center gap-2">
                      <Input value={selectedOffer.preview_url} readOnly />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          window.open(selectedOffer.preview_url, "_blank")
                        }
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {selectedOffer.tracking_url && (
                    <div>
                      <Label className="text-muted-foreground">
                        Tracking URL
                      </Label>
                      <div className="mt-1 flex items-center gap-2">
                        <Input value={selectedOffer.tracking_url} readOnly />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            window.open(selectedOffer.tracking_url, "_blank")
                          }
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Caps & Limits */}
              <div className="space-y-4">
                <h4 className="font-medium">Caps & Limits</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Daily Cap</Label>
                    <div className="mt-1 font-medium">
                      {selectedOffer.daily_conversion_cap === "0"
                        ? "No limit"
                        : selectedOffer.daily_conversion_cap}
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Monthly Cap</Label>
                    <div className="mt-1 font-medium">
                      {selectedOffer.monthly_conversion_cap === "0"
                        ? "No limit"
                        : selectedOffer.monthly_conversion_cap}
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Total Cap</Label>
                    <div className="mt-1 font-medium">
                      {selectedOffer.overall_conversion_cap === "0"
                        ? "No limit"
                        : selectedOffer.overall_conversion_cap}
                    </div>
                  </div>
                  {selectedOffer?.daily_click_cap && (
                    <div>
                      <Label className="text-muted-foreground">
                        Daily Click Cap
                      </Label>
                      <div className="mt-1 font-medium">
                        {selectedOffer?.daily_click_cap}
                      </div>
                    </div>
                  )}
                  {selectedOffer?.monthly_click_cap && (
                    <div>
                      <Label className="text-muted-foreground">
                        Monthly Click Cap
                      </Label>
                      <div className="mt-1 font-medium">
                        {selectedOffer?.monthly_click_cap}
                      </div>
                    </div>
                  )}
                  {selectedOffer?.daily_revenue_cap && (
                    <div>
                      <Label className="text-muted-foreground">
                        Daily Revenue Cap
                      </Label>
                      <div className="mt-1 font-medium">
                        ${selectedOffer?.daily_revenue_cap}
                      </div>
                    </div>
                  )}
                  {selectedOffer?.monthly_revenue_cap && (
                    <div>
                      <Label className="text-muted-foreground">
                        Monthly Revenue Cap
                      </Label>
                      <div className="mt-1 font-medium">
                        ${selectedOffer?.monthly_revenue_cap}
                      </div>
                    </div>
                  )}
                  {selectedOffer?.overall_revenue_cap && (
                    <div>
                      <Label className="text-muted-foreground">
                        Total Revenue Cap
                      </Label>
                      <div className="mt-1 font-medium">
                        ${selectedOffer.overall_revenue_cap}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Creative Materials */}
              <div className="space-y-4">
                <h4 className="font-medium">Creative Materials</h4>
                <div className="grid grid-cols-2 gap-4">
                  {selectedOffer?.primary_image && (
                    <div>
                      <Label className="text-muted-foreground">
                        Main Image
                      </Label>
                      <div className="mt-2 aspect-square rounded-lg border overflow-hidden">
                        <img
                          src={selectedOffer?.primary_image}
                          alt="Main creative"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  )}
                  {selectedOffer?.secondary_image && (
                    <div>
                      <Label className="text-muted-foreground">
                        Secondary Image
                      </Label>
                      <div className="mt-2 aspect-square rounded-lg border overflow-hidden">
                        <img
                          src={selectedOffer?.secondary_image}
                          alt="Secondary creative"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Dates */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Created:{" "}
                  {format(new Date(selectedOffer.created_at), "MMM d, yyyy")}
                </div>
                {selectedOffer.expiry_date && (
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Expires:{" "}
                    {format(new Date(selectedOffer.expiry_date), "MMM d, yyyy")}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
