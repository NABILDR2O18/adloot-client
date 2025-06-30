/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, Fragment } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Search,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Eye,
  Ban,
  Loader2,
  Copy,
  Check,
  AlertCircle,
  Clock,
  Edit,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "react-hot-toast";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import api from "@/lib/axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { pageSize } from "@/constants/limit.json";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useUser } from "@/contexts/UserContext";
import { useSettings } from "@/contexts/SettingsContext";

// eslint-disable-next-line react-refresh/only-export-components
export const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Active
        </span>
      );
    case "suspended":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="w-3 h-3 mr-1" />
          Suspended
        </span>
      );
    case "unverified":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <AlertCircle className="w-3 h-3 mr-1" />
          Unverified
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

interface PlatformUser {
  id: string;
  email: string;
  role: "admin" | "publisher" | "advertiser";
  full_name?: string;
  company_name?: string;
  website_or_app?: string;
  phone?: string;
  country?: string;
  address?: string;
  city?: string;
  state_province?: string;
  status?: "active" | "suspended" | "pending" | "unverified";
}

export default function PublishersManagement() {
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status") || "all";
  const currentPage = Number(searchParams.get("page")) || 1;
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    companyName: "",
    website: "",
    phoneNumber: "",
  });
  const [editUser, setEditUser] = useState(false);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const params = {
        role: "publisher",
        search: searchTerm,
        status: status === "all" ? "" : status,
        page: currentPage,
        limit: pageSize,
      };

      const response = await api.get("/admin/users", { params });
      setUsers(response.data.data?.users);
      setTotalPages(response.data.data.pagination.totalPages);
    } catch (error: any) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm, status]);

  const handleCopyId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
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

  const handleViewUser = (user: PlatformUser) => {
    navigate(`/admin/publishers/${user.id}`);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages)
      navigate(`/admin/publishers?status=${status}&page=${page}`);
  };

  const handleStatusChange = async (userId: string, status: string) => {
    setIsUpdating(userId);
    try {
      const response = await api.put(`/admin/users/${userId}/status`, {
        status,
        emailNotify: settings?.email_alerts,
      });
      if (response.status === 200) {
        toast.success(`User ${status} successfully`);
        fetchUsers();
      }
    } catch (error: any) {
      console.error("Error updating user status:", error);
      toast.error("Failed to update user status");
    } finally {
      setIsUpdating(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
      const response = await api.put(
        `/admin/users/${isUpdating}/update`,
        formData
      );
      if (response.status === 200) {
        setEditUser(false);
        fetchUsers();
        toast.success(`User details updated successfully.`);
      }
    } catch (error: any) {
      console.error("Error updating user details:", error);
      toast.error("Failed to update user details");
    } finally {
      setUpdateLoading(false);
      setIsUpdating(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Fragment>
      <Card>
        <CardHeader className="pb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
          <CardTitle>Publishers</CardTitle>
          <aside className="flex items-center gap-4">
            <div className="relative w-full md:w-auto">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                placeholder="Search publishers..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={status}
              onValueChange={(e) => {
                navigate(`/admin/publishers?status=${e}&page=1`);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </aside>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="overflow-hidden">
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!isLoading &&
                users.length > 0 &&
                users?.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <span>{formatId(user.id)}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 hover:bg-gray-100"
                          onClick={() => handleCopyId(user.id)}
                        >
                          {copiedId === user.id ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4 text-gray-500" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>{user.full_name || "-"}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.company_name || "-"}</TableCell>
                    <TableCell>{user.phone || "-"}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell>
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
                            onClick={() => handleViewUser(user)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            <span>View Details</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setEditUser(true);
                              setFormData({
                                name: user?.full_name,
                                email: user.email,
                                companyName: user.company_name,
                                website: user?.website_or_app,
                                phoneNumber: user?.phone,
                              });
                              setIsUpdating(user?.id);
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit User</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {user.status === "active" && (
                            <DropdownMenuItem
                              className="text-red-600"
                              disabled={isUpdating === user.id}
                              onClick={() =>
                                handleStatusChange(user.id, "suspended")
                              }
                            >
                              {isUpdating === user.id ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Ban className="mr-2 h-4 w-4" />
                              )}
                              <span>Suspend User</span>
                            </DropdownMenuItem>
                          )}
                          {user.status === "suspended" && (
                            <DropdownMenuItem
                              className="text-green-600"
                              disabled={isUpdating === user.id}
                              onClick={() =>
                                handleStatusChange(user.id, "active")
                              }
                            >
                              {isUpdating === user.id ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <CheckCircle className="mr-2 h-4 w-4" />
                              )}
                              <span>Activate User</span>
                            </DropdownMenuItem>
                          )}
                          {user.status === "pending" && (
                            <Fragment>
                              <DropdownMenuItem
                                className="text-green-600"
                                disabled={isUpdating === user.id}
                                onClick={() =>
                                  handleStatusChange(user.id, "active")
                                }
                              >
                                {isUpdating === user.id ? (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                )}
                                <span>Approve User</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                disabled={isUpdating === user.id}
                                onClick={() =>
                                  handleStatusChange(user.id, "rejected")
                                }
                              >
                                {isUpdating === user.id ? (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                  <Ban className="mr-2 h-4 w-4" />
                                )}
                                <span>Reject User</span>
                              </DropdownMenuItem>
                            </Fragment>
                          )}
                          {user.status === "unverified" && (
                            <>
                              <DropdownMenuItem
                                className="text-green-600"
                                disabled={isUpdating === user.id}
                                onClick={() =>
                                  handleStatusChange(user.id, "active")
                                }
                              >
                                {isUpdating === user.id ? (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                )}
                                <span>Approve User</span>
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              {!isLoading && users?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    <div className="flex flex-col items-center">
                      <Ban className="h-8 w-8 text-gray-400" />
                      <span className="text-sm text-gray-500">
                        No record found
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-400">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto" />
                    Loading...
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
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

      {/* Edit user */}
      <Dialog
        open={editUser}
        onOpenChange={(e) => {
          setEditUser(e);
          if (e === false) setIsUpdating(null);
        }}
      >
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-gray-900">
              Edit User Info
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-900">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleInputChange}
                className="transition-colors border-transparent focus:border-purple-600 focus:!ring-0 text-gray-900 bg-gray-100"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-gray-900">
                Company Name
              </Label>
              <Input
                id="companyName"
                name="companyName"
                placeholder="Google, Facebook, etc."
                value={formData.name}
                onChange={handleInputChange}
                className="transition-colors border-transparent focus:border-purple-600 focus:!ring-0 text-gray-900 bg-gray-100"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-900">
                Work Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@company.com"
                value={formData.email}
                onChange={handleInputChange}
                className="transition-colors border-transparent focus:border-purple-600 focus:!ring-0 text-gray-900 bg-gray-100"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website" className="text-gray-900">
                Website or App URL
              </Label>
              <Input
                id="website"
                name="website"
                type="url"
                placeholder="https://yourwebsite.com"
                value={formData.website}
                onChange={handleInputChange}
                className="transition-colors border-transparent focus:border-purple-600 focus:!ring-0 text-gray-900 bg-gray-100"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-gray-900">
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="transition-colors border-transparent focus:border-purple-600 focus:!ring-0 text-gray-900 bg-gray-100"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              disabled={updateLoading}
            >
              {updateLoading ? "Saving" : "Save"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}
