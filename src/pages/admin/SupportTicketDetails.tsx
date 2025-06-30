/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle,
  RefreshCcw,
  Send,
  TicketCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate, useParams } from "react-router-dom";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { useUser } from "@/contexts/UserContext";
import { useSettings } from "@/contexts/SettingsContext";

type Message = {
  message: string;
  is_admin: boolean;
  sender_id: string;
  timestamp: string; // ISO date string
};

type User = {
  id: string;
  name: string;
  email: string;
};

type Ticket = {
  id: string;
  subject: string;
  type: "general" | "account" | "payment" | "technical" | "feature";
  status: "open" | "closed";
  messages: Message[];
  created_at: string;
  updated_at: string;
  user: User;
};

export default function TicketDetailPage() {
  const { settings } = useSettings();
  const { user } = useUser();
  const navigate = useNavigate();
  const { id } = useParams();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSendLoading, setSendLoading] = useState(false);
  const [isSolveLoading, setSolveLoading] = useState(false);

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/${user?.role}/support/tickets/${id}`);
      if (response.status === 200) {
        setTicket(response.data?.data?.ticket);
      }
    } catch (error: any) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return navigate(-1);
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSend = async () => {
    if (!input.trim()) return;
    try {
      setSendLoading(true);
      const newMessage = {
        message: input.trim(),
        is_admin: true,
        sender_id: ticket?.user.id,
        timestamp: new Date().toISOString(),
      };

      const response = await api.post(`/${user?.role}/support/ticket/message`, {
        ticketId: id,
        message: input.trim(),
        isAdmin: true,
      });

      if (response.status === 200) {
        setTicket((prev) =>
          prev
            ? {
                ...prev,
                messages: [...prev.messages, newMessage],
              }
            : prev
        );
        setInput("");
      } else {
        toast.error("Failed to send message");
      }
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast.error("Error sending message");
    } finally {
      setSendLoading(false);
    }
  };

  const handleStatusChange = async (ticketId: string, status: string) => {
    setSolveLoading(true);
    try {
      const response = await api.patch(
        `/${user.role}/support/ticket/${ticketId}/status`,
        {
          status,
          emailNotify: settings?.email_alerts,
        }
      );
      if (response.status === 200) {
        toast.success(`Ticket marked as solved.`);
        navigate(-1);
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to mark the ticket as solved"
      );
    } finally {
      setSolveLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <section>
      <div className="flex justify-end">
        {ticket.status === "open" ? (
          <Button
            onClick={() => handleStatusChange(id, "closed")}
            disabled={isLoading || isSolveLoading}
            className="flex items-center"
          >
            <TicketCheck className="w-4 h-4" />
            Closed
          </Button>
        ) : (
          <Button
            onClick={() => handleStatusChange(id, "open")}
            disabled={isLoading || isSolveLoading}
            className="flex items-center"
          >
            <CheckCircle className="w-4 h-4" />
            Re-open
          </Button>
        )}
      </div>

      <Card className="h-[80vh] flex flex-col overflow-hidden mt-4">
        <div className="md:p-4 p-2 border-b flex items-center justify-between">
          <Button
            onClick={() => navigate(-1)}
            disabled={isLoading}
            variant="outline"
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Tickets
          </Button>
          <Button onClick={fetchUser} size="sm" disabled={isLoading}>
            <RefreshCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-1 space-y-4 bg-muted">
          {ticket?.messages?.map((msg, index) => {
            const prevMsg = ticket.messages[index - 1];
            const isNewGroup = !prevMsg || prevMsg.is_admin !== msg.is_admin;

            return (
              <div
                key={index}
                className={`flex ${
                  msg.is_admin ? "justify-start" : "justify-end"
                } ${isNewGroup ? "mt-3" : "mt-3"}`}
              >
                <div
                  className={`max-w-xs md:max-w-md p-3 rounded-xl text-sm ${
                    msg.is_admin
                      ? "bg-white text-primary rounded-bl-none"
                      : "bg-primary text-primary-foreground rounded-br-none"
                  }`}
                >
                  <p>{msg.message}</p>
                  <p className="text-xs mt-1 opacity-70 text-right">
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            );
          })}
        </ScrollArea>

        {/* Input */}
        {ticket.status !== "closed" && (
          <CardContent className="p-4 border-t bg-background flex items-center gap-2">
            <Input
              placeholder="Type your message..."
              className="flex-1"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={isSendLoading}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isSendLoading}
            >
              <Send className="w-4 h-4 mr-1" />
              Send
            </Button>
          </CardContent>
        )}
      </Card>
    </section>
  );
}
