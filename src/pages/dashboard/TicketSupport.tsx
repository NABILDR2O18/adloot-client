/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/axios";
import toast from "react-hot-toast";
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

export default function TicketSupport() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status") || "all";
  const type = searchParams.get("type") || "";
  const currentPage = Number(searchParams.get("page")) || 1;
  const [tickets, setTickets] = useState<ISupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitLoading, setSubmitIsLoading] = useState(false);
  const [openTicket, setOpenTicket] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    type: "",
  });

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      const params = {
        type,
        status: status === "all" ? "" : status,
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
  }, [currentPage, status, type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitIsLoading(true);

    try {
      const response = await api.post(
        `/${user?.role}/support/ticket/initiate`,
        formData
      );

      if (response.status === 201) {
        setFormData({
          subject: "",
          message: "",
          type: "",
        });
        setOpenTicket(false);
        fetchTickets();
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Error creating ticket, try again later!"
      );
    } finally {
      setSubmitIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages)
      navigate(
        `/${user?.role}/dashboard/support?page=${page}&status=${status}&type=${type}`
      );
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Support Tickets</h1>
        <Button onClick={() => setOpenTicket(true)}>New Ticket</Button>
      </div>
      <div className="flex justify-end">
        <Select
          value={status}
          onValueChange={(e) => {
            navigate(
              `/${user?.role}/dashboard/support?status=${e}&page=1&type=${type}`
            );
          }}
        >
          <SelectTrigger className="md:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
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
                        navigate(
                          `/${user?.role}/dashboard/support/${ticket?.id}`
                        )
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

      <Dialog
        open={openTicket}
        onOpenChange={(e) => {
          if (e === false)
            setFormData({
              subject: "",
              message: "",
              type: "",
            });
          setOpenTicket(e);
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Support Ticket</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ticketType">Ticket Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger id="ticketType">
                  <SelectValue placeholder="Select ticket type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Inquiry</SelectItem>
                  <SelectItem value="account">Account Issue</SelectItem>
                  <SelectItem value="payment">Payment Problem</SelectItem>
                  <SelectItem value="technical">Technical Support</SelectItem>
                  <SelectItem value="feature">Feature Request</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(value) =>
                  setFormData({ ...formData, subject: value.target.value })
                }
                placeholder="Brief description of the issue"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Detailed description of your issue..."
                required
                value={formData.message}
                onChange={(value) =>
                  setFormData({ ...formData, message: value.target.value })
                }
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                disabled={isSubmitLoading}
                onClick={() => {
                  setOpenTicket(false);
                  setFormData({
                    subject: "",
                    message: "",
                    type: "",
                  });
                }}
                variant="outline"
                type="button"
              >
                Cancel
              </Button>
              <Button disabled={isSubmitLoading} type="submit">
                Submit Ticket
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
