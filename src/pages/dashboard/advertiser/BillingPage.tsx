/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { pageSize } from "@/constants/limit.json";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CreditCard,
  Wallet,
  Plus,
  Download,
  ArrowUp,
  ArrowDown,
  CircleDollarSign,
  Bitcoin,
  ArrowRight,
  RefreshCw,
  Check,
  Copy,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
} from "lucide-react";
import { toast } from "react-hot-toast";
import api from "@/lib/axios";
import { useUser } from "@/contexts/UserContext";
import { format } from "date-fns";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type PaymentTimelineEntry = {
  date: string; // ISO date string
  note: string;
  status: "submitted" | "pending" | "completed" | string;
  paypal_order_id?: string;
};

export type DepositTransaction = {
  id: string;
  user_id: string;
  amount: string; // consider using number if you always parse it
  method: "paypal" | string;
  timeline: PaymentTimelineEntry[];
  note: string;
  status: "submitted" | "pending" | "completed" | string;
  type: "deposit" | string;
  paypal_order_id: string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
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

export default function BillingPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const [isAddFundsDialogOpen, setIsAddFundsDialogOpen] = useState(false);
  const [addFundLoading, setAddFundLoading] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("paypal");
  const [loading, setLoading] = useState(false);
  const [deposits, setDeposits] = useState<DepositTransaction[]>([]);
  const [totalDeposits, setTotalDeposits] = useState<string | null>(null);
  const [monthlySpend, setMonthlySpend] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [statementLoading, setStatementLoading] = useState(false);

  const fetchDeposits = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: pageSize,
      };
      const response = await api.get("/advertiser/deposits", { params });
      if (response?.status === 200) {
        setDeposits(response?.data?.data?.deposits);
        setTotalDeposits(response?.data?.data?.totalDeposit);
        setMonthlySpend(response?.data?.data?.monthlySpend);
        setTotalPages(response.data.data.pagination.totalPages);
      }
    } catch (error: any) {
      console.error("Error fetching campaigns:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handleDeposit = async () => {
    if (!depositAmount) {
      return toast?.error("Enter amount to continue.");
    }
    setAddFundLoading(true);
    try {
      const response = await api.post(`/advertiser/deposit/paypal/order`, {
        amount: depositAmount,
        method: selectedPaymentMethod,
      });
      if (response?.status === 200) {
        const approvalLink = response?.data?.data?.links.find(
          (l) => l.rel === "approve"
        )?.href;
        if (approvalLink) {
          window.location.href = approvalLink;
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message ?? "Something went wrong");
    } finally {
      setAddFundLoading(false);
    }
  };

  const formatId = (id: string) => {
    return `${id.substring(0, 8)}...`;
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case "paypal":
        return <CircleDollarSign size={20} className="text-[#0070ba]" />;
      case "payeer":
        return <Wallet size={20} className="text-[#018fd0]" />;
      case "crypto":
      case "bitcoin":
        return <Bitcoin size={20} className="text-[#f7931a]" />;
      default:
        return <CreditCard size={20} />;
    }
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

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages)
      navigate(`/advertiser/dashboard/billing?page=${page}`);
  };

  const handleDownloadStatement = async () => {
    try {
      setStatementLoading(true);
      const params = {};
      const response = await api.get(
        "/advertiser/deposits/download/statement",
        {
          params,
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        response.headers["content-disposition"]
          ?.split("filename=")[1]
          ?.replace(/"/g, "") || "deposits_statement.csv"
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setStatementLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle className="text-2xl text-purple-600">
              Account Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-2 bg-gradient-to-br from-purple-50 to-white p-4 rounded-lg border border-purple-100">
                <p className="text-sm text-muted-foreground">Current Balance</p>
                <p className="text-3xl font-bold text-purple-600">
                  ${user?.available_balance ?? 0}
                </p>
              </div>
              <div className="space-y-2 bg-gradient-to-br from-amber-50 to-white p-4 rounded-lg border border-amber-100">
                <p className="text-sm text-muted-foreground">Monthly Spend</p>
                <p className="text-3xl font-bold text-amber-600">
                  ${monthlySpend ?? 0}
                </p>
              </div>
              <div className="space-y-2 bg-gradient-to-br from-blue-50 to-white p-4 rounded-lg border border-blue-100">
                <p className="text-sm text-muted-foreground">Total Deposited</p>
                <p className="text-3xl font-bold text-gray-600">
                  ${totalDeposits ?? 0}
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Dialog
                open={isAddFundsDialogOpen}
                onOpenChange={setIsAddFundsDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Add Funds
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader className="min-h-max">
                    <DialogTitle>Add Funds</DialogTitle>
                    <DialogDescription>
                      Add funds to your advertiser account to run campaigns
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="amount" className="text-sm font-medium">
                        Amount
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-gray-500">
                          $
                        </span>
                        <Input
                          id="amount"
                          type="number"
                          className="pl-8"
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                          min="50"
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        Minimum deposit: $50.00
                      </p>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-medium">
                        Payment Method
                      </label>
                      <div
                        className={`flex items-center space-x-3 border rounded-md p-3 cursor-pointer ${
                          selectedPaymentMethod === "paypal"
                            ? "border-purple-500 bg-purple-50"
                            : "border-gray-200"
                        }`}
                        onClick={() => setSelectedPaymentMethod("paypal")}
                      >
                        <input
                          type="radio"
                          id="paypal"
                          name="paymentMethod"
                          checked={selectedPaymentMethod === "paypal"}
                          onChange={() => setSelectedPaymentMethod("paypal")}
                          className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                        />
                        <label
                          htmlFor="paypal"
                          className="flex-1 cursor-pointer"
                        >
                          <div className="font-medium">PayPal</div>
                          <div className="text-sm text-gray-500">
                            Pay via PayPal
                          </div>
                        </label>
                        <div className="flex items-center">
                          {getPaymentMethodIcon("paypal")}
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="ghost"
                      onClick={() => setIsAddFundsDialogOpen(false)}
                      disabled={addFundLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      disabled={addFundLoading}
                      onClick={handleDeposit}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      {addFundLoading && (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      )}
                      Add
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button
                disabled={statementLoading}
                variant="outline"
                onClick={handleDownloadStatement}
              >
                {statementLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Download size={16} className="mr-2" />
                )}
                Download Statement
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-purple-600">
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="deposits">
            <TabsList className="mb-4">
              <TabsTrigger value="deposits" className="flex items-center gap-2">
                <ArrowUp size={16} /> Deposits
              </TabsTrigger>
            </TabsList>

            <TabsContent value="deposits">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading && (
                    <TableRow>
                      <TableCell colSpan={6}>
                        {" "}
                        <div className="flex justify-center items-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                  {!loading &&
                    deposits?.map((deposit) => (
                      <TableRow key={deposit.id}>
                        <TableCell>
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
                        <TableCell>
                          {deposit?.created_at
                            ? format(new Date(deposit.created_at), "Pp") // 'Pp' shows date and time in localized format
                            : ""}
                        </TableCell>
                        <TableCell className="capitalize">
                          {deposit?.method}
                        </TableCell>
                        <TableCell>${deposit?.amount}</TableCell>
                        <TableCell className="capitalize">
                          {deposit?.type}
                        </TableCell>
                        <TableCell>{getStatusBadge(deposit?.status)}</TableCell>
                        <TableCell className="flex justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              navigate(
                                `/advertiser/dashboard/transactions/${deposit?.id}`
                              );
                            }}
                          >
                            <Eye />
                          </Button>
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
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
