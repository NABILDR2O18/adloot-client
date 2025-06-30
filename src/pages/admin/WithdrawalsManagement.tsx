import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { pageSize } from "@/constants/limit.json";
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
  CheckCircle,
  XCircle,
  Clock,
  Check,
  Copy,
  CircleX,
  Eye,
  Plus,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { format } from "date-fns";

type ITimelineEntry = {
  date: string; // ISO timestamp
  status: "submitted" | "processing" | "completed" | "cancelled"; // add more statuses as needed
};

type IUser = {
  full_name: string;
  email: string;
  role: "publisher" | "admin" | "user"; // extend with other roles if applicable
  status: "active" | "inactive" | "banned"; // extend as needed
  available_balance: string;
  country: string | null;
};

type IMethod = {
  id: number;
  payment_method: "paypal" | "bank_transfer" | "crypto"; // extend with other methods
  email_or_address: string;
  is_default: boolean;
  created_at: string; // ISO date string
};

type IWithdrawalRequest = {
  id: string;
  user_id: string;
  amount: string;
  timeline: ITimelineEntry[];
  note: string | null;
  status: "pending" | "processing" | "completed" | "rejected"; // extend as needed
  created_at: string;
  updated_at: string;
  user: IUser;
  method: IMethod;
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Completed
        </span>
      );
    case "pending":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </span>
      );
    case "rejected":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="w-3 h-3 mr-1" />
          Rejected
        </span>
      );
    case "chargeback":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="w-3 h-3 mr-1" />
          Chargeback
        </span>
      );
    case "addon":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <Plus className="w-3 h-3 mr-1" />
          Addon
        </span>
      );
    default:
      return null;
  }
};

export default function WithdrawalsManagement() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status") || "";
  const search = searchParams.get("search") || "";
  const [searchInput, setSearchInput] = useState(search); // for input box
  const [withdrawals, setWithdrawals] = useState<IWithdrawalRequest[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const currentPage = Number(searchParams.get("page")) || 1;
  const [totalPages, setTotalPages] = useState(1);

  const fetchWithdrawals = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: pageSize,
        status,
        search,
      };
      const res = await api.get("/admin/withdrawal/requests", { params });
      if (res.data && res.data.success) {
        setWithdrawals(res.data.data.withdrawals);
        setTotalPages(res.data.data.pagination.totalPages);
      }
    } catch (error) {
      setWithdrawals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, currentPage, search]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages)
      navigate(`/admin/withdrawal?page=${page}`);
  };

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

  return (
    <section>
      <div className="flex flex-col md:flex-row justify-end items-start md:items-center mb-4 gap-2">
        <div className="relative w-full md:w-auto">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
            size={18}
            onClick={() => {
              navigate(`/admin/withdrawal?search=${searchInput}&page=${1}`);
            }}
          />
          <Input
            placeholder="Type to search ..."
            className="pl-10"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e?.key === "Enter") {
                navigate(`/admin/withdrawal?search=${searchInput}&page=${1}`);
              }
            }}
          />
        </div>
        <Select
          value={status || ""}
          onValueChange={(e) => {
            navigate(`/admin/withdrawal?page=${1}&status=${e}`);
          }}
        >
          <SelectTrigger className="md:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="chargeback">Chargeback</SelectItem>
            <SelectItem value="addon">Addon</SelectItem>
          </SelectContent>
        </Select>
        {(status || search) && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              navigate("/admin/withdrawal");
              setSearchInput("");
            }}
          >
            <CircleX className="w-4 h-4" />
          </Button>
        )}
      </div>

      <Card>
        <CardHeader className="pb-0">
          <CardTitle>All Withdrawals</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8}>
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : withdrawals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    No withdrawals found.
                  </TableCell>
                </TableRow>
              ) : (
                withdrawals.map((withdrawal) => (
                  <TableRow key={withdrawal.id}>
                    <TableCell>
                      {`${withdrawal?.id.substring(0, 8)}...`}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-gray-100 ml-1"
                        onClick={() => handleCopyId(withdrawal?.id)}
                      >
                        {copiedId === withdrawal?.id ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4 text-gray-500" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      {withdrawal?.created_at
                        ? format(new Date(withdrawal.created_at), "Pp") // 'Pp' shows date and time in localized format
                        : ""}
                    </TableCell>
                    <TableCell>{withdrawal.user?.full_name || "-"}</TableCell>
                    <TableCell>
                      <div className="flex items-center font-medium">
                        ${withdrawal.amount}
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">
                      {withdrawal?.method?.payment_method ?? "-"}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(withdrawal.status)}{" "}
                      <span className="text-xs">
                        {withdrawal.status === "rejected" &&
                          withdrawal?.note &&
                          withdrawal?.note}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          navigate(`/admin/withdrawal/${withdrawal.id}`);
                        }}
                      >
                        <Eye />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
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
    </section>
  );
}
