import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, Check, X, AlertTriangle } from "lucide-react";
import api from "@/lib/axios";
import { format, parseISO } from "date-fns";

type ITimelineEntry = {
  date: string; // ISO timestamp
  status: string;
  description?: string;
  note?: string;
};

type IWithdrawalMethod = {
  id: number;
  user_id: string;
  payment_method: "paypal" | "payeer" | "crypto";
  email_or_address: string;
  is_default: boolean;
  created_at: string;
};

type IWithdrawal = {
  id: string;
  user_id: string;
  amount: string;
  method_id: number;
  timeline: ITimelineEntry[];
  note: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  method: IWithdrawalMethod | null;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
    case "addon":
      return "bg-green-500";
    case "pending":
    case "processing":
      return "bg-yellow-500";
    case "rejected":
    case "chargeback":
    case "failed":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <Check className="h-5 w-5 text-white" />;
    case "pending":
    case "processing":
    case "submitted":
      return <Clock className="h-5 w-5 text-white" />;
    case "rejected":
    case "chargeback":
    case "failed":
      return <X className="h-5 w-5 text-white" />;
    default:
      return <AlertTriangle className="h-5 w-5 text-white" />;
  }
};

export default function WithdrawalDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [withdrawal, setWithdrawal] = useState<IWithdrawal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchWithdrawal = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/publisher/withdrawal/requests/${id}`);
        if (res.data?.success) {
          setWithdrawal(res.data.data);
        } else {
          setWithdrawal(null);
        }
      } catch {
        setWithdrawal(null);
      } finally {
        setLoading(false);
      }
    };
    fetchWithdrawal();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!withdrawal) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-xl">Withdrawal not found</p>
      </div>
    );
  }

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Withdrawal Details</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Back
          </Button>
          <Button onClick={() => navigate("/publisher/dashboard/support")}>
            Contact Support
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Details</CardTitle>
            <Badge className={getStatusColor(withdrawal.status)}>
              {withdrawal.status.charAt(0).toUpperCase() +
                withdrawal.status.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">ID</p>
              <p className="font-medium">{withdrawal?.id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date & Time</p>
              <p className="font-medium">
                {format(parseISO(withdrawal.created_at), "PPpp")}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className="font-medium text-lg">${withdrawal.amount}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Method</p>
              <p className="font-medium capitalize">
                {withdrawal.method
                  ? `${withdrawal.method.payment_method} (${withdrawal.method.email_or_address})`
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-medium capitalize">
                {withdrawal.status.charAt(0).toUpperCase() +
                  withdrawal.status.slice(1)}
              </p>
            </div>
          </div>

          {withdrawal.note && (
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-2">Note</p>
              <p>{withdrawal.note}</p>
            </div>
          )}

          {/* Timeline Section */}
          <div className="pt-4 border-t">
            <h3 className="font-medium mb-4">Transaction Timeline</h3>
            <div className="space-y-4">
              {withdrawal?.timeline?.map((event, index) => (
                <div key={index} className="relative pl-8">
                  {/* Connecting line */}
                  {index < withdrawal.timeline.length - 1 && (
                    <div className="absolute left-[10px] top-6 w-0.5 h-full bg-gray-200 -ml-px"></div>
                  )}
                  {/* Status dot */}
                  <div
                    className={`absolute left-0 w-5 h-5 rounded-full flex items-center justify-center ${getStatusColor(
                      event.status
                    )}`}
                  >
                    {getStatusIcon(event.status)}
                  </div>
                  <div>
                    <p className="font-medium">
                      {event.description ||
                        event.status.charAt(0).toUpperCase() +
                          event.status.slice(1)}
                      {event?.note && <p>({event?.note})</p>}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        {event.date ? format(parseISO(event.date), "PP") : ""}
                      </div>
                      {/* If you have time, show it */}
                      {event.date && (
                        <div className="flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          {format(parseISO(event.date), "p")}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {withdrawal.status === "rejected" ? (
            <div className="bg-red-50 p-4 rounded-md border border-red-200">
              <p className="text-red-600 mb-2 font-medium">
                This withdrawal failed
              </p>
              <p className="text-sm text-red-500 mb-4">
                There was a problem processing this withdrawal. Please contact
                support for assistance.
              </p>
              <Button onClick={() => navigate("/publisher/dashboard/support")}>
                Contact Support
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </section>
  );
}
