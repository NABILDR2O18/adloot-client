/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, Fragment } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Search,
  Plus,
  MoreHorizontal,
  CheckCircle,
  Eye,
  Loader2,
  Ban,
  CircleX,
  LayoutGrid,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getAppStatusBadge } from "../dashboard/MyAppsPage";
import { pageSize } from "@/constants/limit.json";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { AppDetailsModal } from "@/components/dashboard/AppDetailsModal";
import AppViewModal from "../dashboard/AppViewModal";

type AppStatus = "pending" | "active" | "rejected" | "paused"; // extend as needed
type Platform = "desktop" | "mobile" | "both";
type CurrencyRounding = "no-decimals" | "one-decimal" | "two-decimals"; // extend based on allowed values

interface AppUser {
  id: string;
  full_name: string;
  email: string;
}

export interface IAppData {
  id: string;
  user_id: string;
  name: string;
  platform: Platform;
  website_url: string;
  top_text: string;
  description: string;
  logo: string | null;
  currency_name_singular: string;
  currency_name_plural: string;
  conversion_rate: string;
  split_to_user: string;
  currency_reward_rounding: CurrencyRounding;
  postback_url: string;
  postback_secret: string;
  postback_retries: number;
  design_primary_color: string;
  design_secondary_color: string;
  currency_logo: string;
  api_key: string;
  promotion: any[]; // define specific type if known
  status: AppStatus;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  user_full_name: string;
  user_email: string;
  user: AppUser;
}

export default function AppsManagement() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status") || "";
  const platform = searchParams.get("platform") || "";
  const currentPage = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const [totalPages, setTotalPages] = useState(1);
  const [apps, setApps] = useState<IAppData[]>([]);
  const [searchTerm, setSearchTerm] = useState(search);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<IAppData | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const fetchApps = async () => {
    try {
      setLoading(true);
      const params = {
        status,
        page: currentPage,
        limit: pageSize,
        platform,
        search,
      };
      const response = await api.get("/admin/apps", { params });
      setApps(response?.data?.data?.apps);
      setTotalPages(response.data.data.pagination.totalPages);
    } catch (error: any) {
      console.error("Error fetching apps:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, currentPage, platform, search]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleStatusChange = async (id: string, status: string) => {
    setIsUpdating(id);
    try {
      const response = await api.patch(`/admin/apps/${id}/status`, {
        status,
      });
      if (response.status === 200) {
        toast.success(`App ${status} successfully`);
        fetchApps();
      }
    } catch (error: any) {
      console.error("Error updating app status:", error);
      toast.error("Failed to update app status");
    } finally {
      setIsUpdating(null);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages)
      navigate(
        `/admin/apps?status=${status}&platform=${platform}&&page=${page}`
      );
  };

  return (
    <section>
      {!id && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <div className="w-full sm:w-72 flex items-center gap-2">
            <Input
              placeholder="Search apps"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
            <Button
              size="icon"
              onClick={() => {
                navigate(`/admin/apps?search=${searchTerm}`);
              }}
              className="min-w-[40px]"
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <Select
              value={status ?? ""}
              onValueChange={(e) => {
                navigate(
                  `/admin/apps?status=${e}&platform=${platform}&&page=1`
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
              value={platform ?? ""}
              onValueChange={(e) => {
                navigate(`/admin/apps?status=${status}&platform=${e}&&page=1`);
              }}
            >
              <SelectTrigger className="md:w-[180px]">
                <SelectValue placeholder="Filter by platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="both">Desktop/mobile</SelectItem>
                <SelectItem value="desktop">Desktop</SelectItem>
                <SelectItem value="mobile">Mobile</SelectItem>
              </SelectContent>
            </Select>
            {(status || platform || search) && (
              <Button
                variant="destructive"
                onClick={() => {
                  navigate("/admin/apps");
                  if (search) setSearchTerm("");
                }}
              >
                <CircleX className="w-3 h-3" />
              </Button>
            )}
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1"
              onClick={() => navigate(`/admin/apps/create`)}
            >
              <Plus size={16} />
              <span>Add App</span>
            </Button>
          </div>
        </div>
      )}

      <Card>
        <CardContent className="pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>App Name</TableHead>
                {!id && (
                  <>
                    <TableHead>Publisher</TableHead>
                    <TableHead>Platform</TableHead>
                  </>
                )}
                <TableHead>Status</TableHead>
                {!id && (
                  <>
                    <TableHead>Added</TableHead>
                  </>
                )}

                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apps?.map((app) => (
                <TableRow key={app?.id}>
                  <TableCell className="font-medium">{app?.name}</TableCell>
                  {!id && (
                    <>
                      <TableCell>{app?.user?.full_name}</TableCell>
                      <TableCell>{app.platform}</TableCell>
                    </>
                  )}

                  <TableCell>{getAppStatusBadge(app.status)}</TableCell>
                  {!id && (
                    <TableCell>
                      {new Date(app.created_at).toLocaleDateString()}
                    </TableCell>
                  )}
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="View details"
                        onClick={() => {
                          setSelectedApp(app);
                          setIsDetailsModalOpen(true);
                        }}
                      >
                        <LayoutGrid size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="View app offers"
                        onClick={() => {
                          setSelectedApp(app);
                          setIsViewModalOpen(true);
                        }}
                      >
                        <Eye size={16} />
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
                          <DropdownMenuItem
                            onClick={() => {
                              navigate(`/admin/apps/edit/${app?.id}`);
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            <span>Edit App</span>
                          </DropdownMenuItem>
                          {app?.status === "pending" && (
                            <Fragment>
                              <DropdownMenuItem
                                className="text-green-600"
                                disabled={isUpdating === app?.id}
                                onClick={() =>
                                  handleStatusChange(app?.id, "active")
                                }
                              >
                                {isUpdating === app?.id ? (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                )}
                                <span>Approve</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                disabled={isUpdating === app?.id}
                                onClick={() =>
                                  handleStatusChange(app?.id, "rejected")
                                }
                              >
                                {isUpdating === app?.id ? (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                  <Ban className="mr-2 h-4 w-4" />
                                )}
                                <span>Reject</span>
                              </DropdownMenuItem>
                            </Fragment>
                          )}
                          {app?.status === "active" && (
                            <DropdownMenuItem
                              className="text-gray-600"
                              disabled={isUpdating === app?.id}
                              onClick={() =>
                                handleStatusChange(app?.id, "paused")
                              }
                            >
                              {isUpdating === app?.id ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Ban className="mr-2 h-4 w-4" />
                              )}
                              <span>Pause</span>
                            </DropdownMenuItem>
                          )}
                          {app?.status === "paused" && (
                            <DropdownMenuItem
                              className="text-green-600"
                              disabled={isUpdating === app?.id}
                              onClick={() =>
                                handleStatusChange(app?.id, "active")
                              }
                            >
                              {isUpdating === app?.id ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <CheckCircle className="mr-2 h-4 w-4" />
                              )}
                              <span>Approve</span>
                            </DropdownMenuItem>
                          )}
                          {app?.status === "rejected" && (
                            <DropdownMenuItem
                              className="text-green-600"
                              disabled={isUpdating === app?.id}
                              onClick={() =>
                                handleStatusChange(app?.id, "active")
                              }
                            >
                              {isUpdating === app?.id ? (
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

          {totalPages > 1 && (
            <Pagination className="justify-end mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage - 1);
                    }}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <PaginationItem key={idx}>
                    <PaginationLink
                      href="#"
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
                <PaginationItem>
                  <PaginationNext
                    href="#"
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

      <AppDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedApp(null);
        }}
        app={selectedApp}
      />

      <AppViewModal
        isOpen={isViewModalOpen}
        onClose={function (): void {
          setSelectedApp(null);
          setIsViewModalOpen(false);
        }}
        app={selectedApp}
      />
    </section>
  );
}
