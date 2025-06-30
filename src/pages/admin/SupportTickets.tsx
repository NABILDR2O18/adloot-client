/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, CheckCircle, CircleX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { pageSize } from "@/constants/limit.json";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { format } from "date-fns";
import { useUser } from "@/contexts/UserContext";

type ISupportTicket = {
  id: string;
  subject: string;
  type: "general" | "account" | "payment" | "technical" | "feature";
  status: "open" | "closed";
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "open":
      return (
        <Badge className="bg-yellow-500">
          <MessageSquare className="w-3 h-3 mr-1" />
          Open
        </Badge>
      );
    case "closed":
      return (
        <Badge className="bg-green-500">
          <CheckCircle className="w-3 h-3 mr-1" />
          Resolved
        </Badge>
      );
  }
};

export default function AdminSupportTickets() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status") || "";
  const role = searchParams.get("role") || "";
  const type = searchParams.get("type") || "";
  const currentPage = Number(searchParams.get("page")) || 1;
  const [tickets, setTickets] = useState<ISupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      const params = {
        type,
        status,
        role,
        page: currentPage,
        limit: pageSize,
      };
      const response = await api.get(`/${user?.role}/support/tickets`, {
        params,
      });
      if (response.status === 200) {
        setTickets(response?.data?.data?.tickets);
        setTotalPages(response.data?.data?.pagination?.totalPages);
      }
    } catch (error: any) {
      console.error("Error fetching support tickets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, status, type, role]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages)
      navigate(
        `/admin/support?page=${page}&status=${status}&type=${type}&role=${role}`
      );
  };

  return (
    <section>
      <div className="flex justify-end gap-2">
        <Select
          value={role ?? ""}
          onValueChange={(e) => {
            navigate(
              `/admin/support?status=${status}&page=1&type=${type}&role=${e}`
            );
          }}
        >
          <SelectTrigger className="md:w-[180px]">
            <SelectValue placeholder="Filter by user" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="publisher">Publisher</SelectItem>
            <SelectItem value="advertiser">Advertiser</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={type ?? ""}
          onValueChange={(e) => {
            navigate(
              `/admin/support?status=${status}&page=1&type=${e}&role=${role}`
            );
          }}
        >
          <SelectTrigger className="md:w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">General</SelectItem>
            <SelectItem value="account">Account</SelectItem>
            <SelectItem value="payment">Payment</SelectItem>
            <SelectItem value="technical">Technical Support</SelectItem>
            <SelectItem value="feature">Feature Request</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={status ?? ""}
          onValueChange={(e) => {
            navigate(
              `/admin/support?status=${e}&page=1&type=${type}&role=${role}`
            );
          }}
        >
          <SelectTrigger className="md:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
        {(status || type || role) && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              navigate("/admin/support");
            }}
          >
            <CircleX className="w-4 h-4" />
          </Button>
        )}
      </div>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Your Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-muted-foreground">Loading tickets...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No tickets created yet. Create a new support ticket to get
                  help.
                </div>
              ) : (
                tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{ticket.subject}</span>
                        {getStatusBadge(ticket.status)}
                      </div>
                      <p className="text-sm text-gray-600">{ticket?.subject}</p>
                      <p className="text-xs text-gray-500">
                        Ticket ID: {ticket.id} • Created:{" "}
                        {format(ticket.created_at, "yyyy-MM-dd'")}
                      </p>
                    </div>
                    <Button
                      onClick={() =>
                        navigate(`/${user?.role}/support/${ticket?.id}`)
                      }
                      variant="outline"
                      size="sm"
                    >
                      View Details
                    </Button>
                  </div>
                ))
              )}
            </div>
          )}
          <div className="flex justify-end mt-4">
            {tickets?.length > 0 && (
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
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
