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

type PaymentTimelineEntry = {
  date: string;
  note: string;
  status: "submitted" | "pending" | "completed";
  paypal_order_id?: string;
};

type UserInfo = {
  full_name: string;
  email: string;
  role: "advertiser" | "publisher" | string;
  status: "active" | "inactive" | "deleted" | "unverified" | string;
};

type IPaymentRecord = {
  id: string;
  user_id: string;
  amount: string; // If you're storing as string, e.g., "200.00"
  method: "paypal" | string;
  timeline: PaymentTimelineEntry[];
  note: string;
  status: "submitted" | "pending" | "completed" | string;
  type: "deposit" | "withdrawal" | string;
  paypal_order_id: string;
  created_at: string;
  updated_at: string;
  user: UserInfo;
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
    default:
      return null;
  }
};

export default function Deposits() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status") || "";
  const type = searchParams.get("type") || "";
  const search = searchParams.get("search") || "";
  const [searchInput, setSearchInput] = useState(search); // for input box
  const [withdrawals, setWithdrawals] = useState<IPaymentRecord[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const currentPage = Number(searchParams.get("page")) || 1;
  const [totalPages, setTotalPages] = useState(1);

  const fetchDeposits = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: pageSize,
        status,
        search,
        type,
      };
      const res = await api.get("/admin/deposits", { params });
      if (res.data && res.data.success) {
        setWithdrawals(res.data.data.deposits);
        setTotalPages(res.data.data.pagination.totalPages);
      }
    } catch (error) {
      setWithdrawals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, currentPage, search, type]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages)
      navigate(`/admin/deposits?page=${page}`);
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
              navigate(`/admin/deposits?search=${searchInput}&page=${1}`);
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
                navigate(`/admin/deposits?search=${searchInput}&page=${1}`);
              }
            }}
          />
        </div>
        <Select
          value={type || ""}
          onValueChange={(e) => {
            navigate(`/admin/deposits?page=${1}&type=${e}&status=${status}`);
          }}
        >
          <SelectTrigger className="md:w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="deposit">Deposit</SelectItem>
            <SelectItem value="cashback">Cashback</SelectItem>
            <SelectItem value="addon">Addon</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={status || ""}
          onValueChange={(e) => {
            navigate(`/admin/deposits?page=${1}&type=${type}&status=${e}`);
          }}
        >
          <SelectTrigger className="md:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        {(status || search || type) && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              navigate("/admin/deposits");
              setSearchInput("");
            }}
          >
            <CircleX className="w-4 h-4" />
          </Button>
        )}
      </div>

      <Card>
        <CardHeader className="pb-0">
          <CardTitle>All Deposits</CardTitle>
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
                <TableHead>Type</TableHead>
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
                    No deposits yet.
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
                      {withdrawal?.method ?? "-"}
                    </TableCell>
                    <TableCell className="capitalize">
                      {withdrawal?.type}
                    </TableCell>
                    <TableCell>{getStatusBadge(withdrawal.status)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          navigate(`/admin/deposits/${withdrawal.id}`);
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
