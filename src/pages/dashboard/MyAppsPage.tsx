/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
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
  LayoutGrid,
  Plus,
  Edit,
  Send,
  AppWindow,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  CircleX,
  ArchiveX,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { TestPostbackModal } from "@/components/dashboard/TestPostbackModal";
import { AppDetailsModal } from "@/components/dashboard/AppDetailsModal";
import { toast } from "react-hot-toast";
import api from "@/lib/axios";
import { pageSize } from "@/constants/limit.json";
import { Promotion } from "./AppSettings";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AppViewModal from "./AppViewModal";

// eslint-disable-next-line react-refresh/only-export-components
export const getAppStatusBadge = (status: string) => {
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

export type IApp = {
  id: number;
  name: string;
  user_id: string;
  platform: "both" | "desktop" | "mobile";
  website_url: string;
  top_text: string;
  description: string;
  logo: string | null;
  currency_name_singular: string;
  currency_name_plural: string;
  conversion_rate: string;
  split_to_user: string;
  currency_reward_rounding: "no-decimals" | "one-decimal" | "two-decimal"; // adjust if there are more options
  postback_url: string;
  postback_secret: string;
  postback_retries: number;
  design_primary_color: string;
  design_secondary_color: string;
  currency_logo: string;
  api_key: string;
  promotion: Promotion[];
  status: "active" | "rejected" | "pending" | "paused";
  created_at: string;
  updated_at: string;
  user_full_name: string;
  user_email: string;
  user: {
    id: string;
    full_name: string;
    email: string;
  };
};

export default function MyAppsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<IApp | null>(null);
  const [apps, setApps] = useState<IApp[]>([]);
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status") || "";
  const currentPage = Number(searchParams.get("page")) || 1;
  const [totalPages, setTotalPages] = useState(1);
  const [isUpdating, setIsUpdating] = useState<number | null>(null);

  const fetchApps = async () => {
    try {
      setLoading(true);
      const params = {
        status,
        page: currentPage,
        limit: pageSize,
      };
      const response = await api.get("/publisher/apps", { params });
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
  }, [status, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages)
      navigate(`/publisher/dashboard/my-apps?status=${status}&page=${page}`);
  };

  const onDelete = async (id: number) => {
    try {
      const response = await api.delete(`/publisher/apps/${id}`);
      if (response?.status === 200) {
        toast.success("App has been deleted.");
        fetchApps();
      }
    } catch (error) {
      toast.error("Error deleting app:", error);
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
    <section className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">
            My Applications
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your applications and track their performance
          </p>
        </div>
        <aside className="flex justify-end mb-4 gap-2">
          <Select
            value={status ?? ""}
            onValueChange={(e) => {
              navigate(`/publisher/dashboard/my-apps?status=${e}&page=1`);
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
                navigate("/publisher/dashboard/my-apps");
              }}
            >
              <CircleX className="w-4 h-4" />
            </Button>
          )}
          <Button
            onClick={() => navigate("/publisher/dashboard/new-app")}
            className="flex items-center gap-2"
          >
            <Plus size={18} />
            <span>Create App</span>
          </Button>
        </aside>
      </div>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <AppWindow size={18} />
            Your Applications
          </CardTitle>
        </CardHeader>
        <CardContent>
          {apps.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                You haven't created any apps yet.
              </p>
              <Button
                onClick={() => navigate("/publisher/dashboard/new-app")}
                variant="outline"
                className="mt-4"
              >
                Create Your First App
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Currency</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Date Added</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apps.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{app?.name}</TableCell>
                      <TableCell className="capitalize">
                        {app.currency_name_plural}
                      </TableCell>
                      <TableCell>{getAppStatusBadge(app.status)}</TableCell>
                      <TableCell className="capitalize">
                        {app.platform === "both"
                          ? "Desktop/Mobile"
                          : app.platform}
                      </TableCell>
                      <TableCell>
                        {new Date(app.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
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
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Test postback"
                            onClick={() => {
                              setSelectedApp(app);
                              setIsTestModalOpen(true);
                            }}
                          >
                            <Send size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              navigate(`/publisher/dashboard/app/${app.id}`)
                            }
                            title="Edit app"
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            onClick={() => {
                              setIsUpdating(app?.id);
                              onDelete(app?.id);
                            }}
                            variant="ghost"
                            size="icon"
                            title="Delete"
                          >
                            <ArchiveX size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          {apps?.length > 0 && (
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

      <TestPostbackModal
        isOpen={isTestModalOpen}
        onClose={() => {
          setIsTestModalOpen(false);
          setSelectedApp(null);
        }}
        app={selectedApp}
      />

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
