/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Badge } from "@/components/ui/badge";
import { CreditCard, Eye, Plus, Download, Star, RefreshCw } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import api from "@/lib/axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useUser } from "@/contexts/UserContext";
import { format, parseISO } from "date-fns";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { pageSize } from "@/constants/limit.json";
import { useSettings } from "@/contexts/SettingsContext";

type IWithdrawalMethod = {
  id: number;
  user_id: string; // UUID
  payment_method: "paypal" | "payeer" | "crypto"; // extend if needed
  email_or_address: string; // email for PayPal/Payeer, address for crypto
  is_default: boolean;
  created_at: string; // ISO timestamp
};

type ITimelineEntry = {
  date: string; // ISO timestamp
  status: "submitted" | "processing" | "completed" | "cancelled"; // add more statuses as needed
};

type ITransaction = {
  id: string;
  user_id: string;
  amount: string; // could be number if parsed
  method_id: number;
  timeline: ITimelineEntry[];
  note: string | null;
  status: "pending" | "completed" | "rejected" | "chargeback" | "addon"; // extend with valid statuses
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  payment_method: string;
  email_or_address: string;
  is_default: boolean;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
    case "addon":
      return "bg-green-500";
    case "pending":
      return "bg-yellow-500";
    case "rejected":
    case "chargeback":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

export default function PublisherBillingPage() {
  const { settings } = useSettings();
  const { user, fetchUser } = useUser();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [walletLoading, setWalletLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<IWithdrawalMethod[]>([]);
  const [settingDefaultId, setSettingDefaultId] = useState<number | null>(null);
  const [history, setHistory] = useState<ITransaction[]>([]);
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const [totalPages, setTotalPages] = useState(1);
  const [withdrawalId, setWithdrawalId] = useState<string | null>(null);

  const fetchWithdrawalMethods = async () => {
    try {
      setWalletLoading(true);
      const response = await api.get("/publisher/withdrawal/methods");
      setPaymentMethods(response?.data?.data?.methods);
    } catch (error: any) {
      console.error("Error fetching withdraw methods:", error);
    } finally {
      setWalletLoading(false);
    }
  };

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: pageSize,
      };
      const res = await api.get("/publisher/withdrawal/requests", { params });
      if (res.data && res.data.success) {
        setHistory(res?.data?.data?.withdrawals);
        setTotalPages(res?.data?.data?.pagination?.totalPages);
      }
    } catch (error: any) {
      console.error("Error fetching history:", error);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawalMethods();
  }, []);

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handleSetDefault = async (id: number) => {
    setSettingDefaultId(id);
    try {
      await api.put(`/publisher/withdrawal/methods/${id}/default`);
      toast.success("Default withdrawal method updated!");
      fetchWithdrawalMethods(); // Refresh the list
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to set default method."
      );
    } finally {
      setSettingDefaultId(null);
    }
  };

  function maskEmailOrAddress(
    value: string,
    method: "paypal" | "payeer" | "crypto"
  ): string {
    if (!value) return "";

    if (method === "crypto" || method === "payeer") {
      // Show first 5 and last 5 characters
      return `${value.slice(0, 5)}***${value.slice(-5)}`;
    } else {
      // Assume it's an email
      const [name, domain] = value.split("@");
      if (!domain) return value;
      const visibleLength = Math.min(4, name.length);
      return `${name.slice(0, visibleLength)}***@${domain}`;
    }
  }

  const handleRequestWithdrawal = async () => {
    setWithdrawing(true);
    try {
      const res = await api.post("/publisher/withdrawal/request");
      if (res.status === 201) {
        fetchUser();
        toast.success("Withdrawal request submitted!");
      } else {
        toast.error(res.data?.message || "Failed to request withdrawal.");
      }
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to request withdrawal."
      );
    } finally {
      setWithdrawing(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages)
      navigate(`/publisher/dashboard/billing?page=${page}`);
  };

  const handleCancelRequest = async (id: string) => {
    setWithdrawalId(id);
    try {
      await api.put(`/publisher/withdrawal/methods/cancel/${id}`);
      toast.success("The withdraw request cancelled.");
      fetchHistory();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to set default method."
      );
    } finally {
      setWithdrawalId(null);
    }
  };

  return (
    <section className="space-y-4 md:space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2 md:pb-4">
            <CardTitle className="text-lg md:text-xl">
              Account Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-1 md:space-y-2">
                <p className="text-xs md:text-sm text-muted-foreground">
                  Available Balance
                </p>
                <p className="text-xl md:text-3xl font-bold">
                  ${user?.available_balance || "0.00"}
                </p>
              </div>
              <div className="space-y-1 md:space-y-2">
                <p className="text-xs md:text-sm text-muted-foreground">
                  Pending Balance
                </p>
                <p className="text-xl md:text-3xl font-semibold text-yellow-600">
                  ${user?.pending_balance || "0.00"}
                </p>
              </div>
              <div className="space-y-1 md:space-y-2">
                <p className="text-xs md:text-sm text-muted-foreground text-red-600">
                  Chargeback
                </p>
                <p className="text-xl md:text-3xl font-semibold text-red-500">
                  -${user?.chargeback_balance || "0.00"}
                </p>
              </div>
              <div className="space-y-1 md:space-y-2">
                <p className="text-xs md:text-sm text-muted-foreground">
                  Lifetime Earnings
                </p>
                <p className="text-xl md:text-3xl font-semibold text-gray-600">
                  ${user?.lifetime_earnings || "0.00"}
                </p>
              </div>
            </div>
            <div className="mt-4 md:mt-6 flex flex-wrap gap-2">
              <Button
                disabled={
                  withdrawing ||
                  Number(user?.available_balance) <
                    Number(settings?.min_withdrawal)
                }
                size={isMobile ? "sm" : "default"}
                onClick={handleRequestWithdrawal}
              >
                {withdrawing ? "Processing" : "Request Withdrawal"}
              </Button>
              <Button
                size={isMobile ? "sm" : "default"}
                variant="outline"
                onClick={() => navigate("/publisher/dashboard/support")}
                disabled={withdrawing}
              >
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader className="pb-2 md:pb-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg md:text-xl">
                Withdrawal Methods
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/publisher/dashboard/payment")}
              >
                <Plus size={16} className="mr-1" />
                <span className="text-sm">Add</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 overflow-auto max-h-[240px]">
            {walletLoading ? (
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              paymentMethods?.map((method) => (
                <div key={method.id} className="p-2 md:p-3 border rounded-md">
                  <div className="flex items-center justify-between gap-2">
                    <aside className="flex items-center gap-2">
                      <CreditCard size={isMobile ? 16 : 20} />
                      <p className="font-medium text-sm md:text-base capitalize">
                        {method?.payment_method}
                      </p>
                    </aside>
                    {method?.is_default ? (
                      <Badge variant="outline" className="text-xs">
                        Default
                      </Badge>
                    ) : (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleSetDefault(method.id)}
                        disabled={settingDefaultId === method.id}
                        title="Make default"
                      >
                        <Star
                          size={18}
                          className={
                            settingDefaultId === method.id ? "animate-spin" : ""
                          }
                        />
                      </Button>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">
                    {maskEmailOrAddress(
                      method?.email_or_address,
                      method?.payment_method
                    )}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2 md:pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg md:text-xl">
              Withdrawal History
            </CardTitle>
            {isMobile && (
              <Button variant="outline" size="sm">
                <Download size={16} className="mr-1" />
                <span className="text-sm">Export</span>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {historyLoading ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                history?.map((withdrawal) => (
                  <TableRow key={withdrawal.id}>
                    <TableCell>
                      {format(parseISO(withdrawal.created_at), "PPpp")}
                    </TableCell>
                    <TableCell className="capitalize">
                      {withdrawal.payment_method}
                    </TableCell>
                    <TableCell>${withdrawal.amount}</TableCell>
                    <TableCell>
                      <Badge
                        className={`${getStatusColor(
                          withdrawal.status
                        )} text-white`}
                      >
                        {withdrawal.status.charAt(0).toUpperCase() +
                          withdrawal.status.slice(1)}
                        {" - "}
                        {withdrawal.status === "rejected" &&
                          withdrawal?.note &&
                          withdrawal?.note}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            navigate(
                              `/publisher/dashboard/withdrawal/${withdrawal.id}`
                            )
                          }
                        >
                          <Eye size={18} />
                        </Button>
                        {withdrawal?.status === "pending" && (
                          <Button
                            variant="destructive"
                            size="sm"
                            className="text-xs"
                            onClick={() => handleCancelRequest(withdrawal.id)}
                          >
                            {withdrawalId && (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            )}
                            Cancel
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
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
    </section>
  );
}
