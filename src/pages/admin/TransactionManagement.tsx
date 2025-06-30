import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

type ITransactionDetail = {
  id: number;
  status: "approval" | "pending" | "completed";
  event_token: string;
  is_pub_triggered: boolean;
  retries: number;
  publisher_cut: string;
  publisher_user_cut: string;
  created_at: string;
  app: {
    id: number;
    name: string;
    platform: "both" | "desktop" | "mobile";
    website_url: string;
    conversion_rate: string;
    currency_name_plural: string;
    currency_name_singular: string;
    currency_reward_rounding: string;
    split_to_user: string;
  };
  campaign: {
    id: number;
    name: string;
    category: string;
    payout_type: "cpi" | "cpa" | "cpe";
    payout: string;
    status: "active" | "rejected" | "pending" | "paused" | "completed";
    admin_percentage: string;
  };
  click: {
    id: number;
    ip_address: string;
    user_agent: string;
    browser: string;
    os: string;
    device_type: string;
    created_at: string;
  };
  promotion: {
    id: string;
    name: string;
    start: string;
    end: string;
    status: string;
    multiplier: string;
  };
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
    case "approval":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3 mr-1" />
          Approval
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

export default function TransactionManagement() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status") || "";
  const [transactions, setTransactions] = useState<ITransactionDetail[]>([]);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const currentPage = Number(searchParams.get("page")) || 1;
  const [totalPages, setTotalPages] = useState(1);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: pageSize,
        status,
      };
      const res = await api.get("/admin//transactions", { params });
      if (res.data && res.data.success) {
        setTransactions(res.data.data.transactions);
        setTotalPages(res.data.data.pagination.totalPages);
      }
    } catch (error) {
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages)
      navigate(`/admin/transaction?page=${page}`);
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

  return (
    <section>
      <div className="flex flex-col md:flex-row justify-end items-start md:items-center mb-4 gap-2">
        <Select
          value={status || ""}
          onValueChange={(e) => {
            navigate(`/admin/transaction?page=${1}&status=${e}`);
          }}
        >
          <SelectTrigger className="md:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="approval">Approval</SelectItem>
          </SelectContent>
        </Select>
        {status && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              navigate("/admin/transaction");
            }}
          >
            <CircleX className="w-4 h-4" />
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Click Id</TableHead>
                <TableHead>Campaign</TableHead>
                <TableHead>App</TableHead>
                <TableHead>Payout</TableHead>
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
              ) : transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    No transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                transactions?.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {transaction?.id}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-gray-100 ml-1"
                        onClick={() => handleCopyId(transaction?.id)}
                      >
                        {copiedId === transaction?.id ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4 text-gray-500" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>{transaction?.click?.id}</TableCell>
                    <TableCell>{transaction?.campaign?.name}</TableCell>
                    <TableCell>{transaction?.app?.name}</TableCell>
                    <TableCell className="capitalize">
                      ${transaction?.campaign?.payout}
                    </TableCell>
                    <TableCell>{getStatusBadge(transaction.status)} </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          navigate(`/admin/transaction/${transaction.id}`);
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
