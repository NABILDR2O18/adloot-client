import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, Check, X, AlertTriangle } from "lucide-react";
import api from "@/lib/axios";
import { format, parseISO } from "date-fns";
import { DepositTransaction } from "./BillingPage";

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
    case "addon":
      return "bg-green-500";
    case "pending":
    case "rejected":
    default:
      return "bg-gray-500";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <Check className="h-5 w-5 text-white" />;
    case "pending":
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

export default function TransactionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deposit, setDeposit] = useState<DepositTransaction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchWithdrawal = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/advertiser/deposits/${id}`);
        if (res.data?.success) {
          setDeposit(res.data.data?.deposit);
        } else {
          setDeposit(null);
        }
      } catch {
        setDeposit(null);
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

  if (!deposit) {
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
          <Button onClick={() => navigate("/advertiser/dashboard/support")}>
            Contact Support
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Details</CardTitle>
            <Badge className={getStatusColor(deposit?.status)}>
              <span className="capitalize">{deposit?.status}</span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">ID</p>
              <p className="font-medium">{deposit?.id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date & Time</p>
              <p className="font-medium">
                {format(parseISO(deposit?.created_at), "PPpp")}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className="font-medium text-lg">${deposit?.amount}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Method</p>
              <p className="font-medium capitalize">
                {deposit.method ? deposit?.method : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-medium capitalize">
                {deposit?.status?.charAt(0)?.toUpperCase() +
                  deposit?.status?.slice(1)}
              </p>
            </div>
          </div>

          {deposit.note && (
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-2">Note</p>
              <p>{deposit.note}</p>
            </div>
          )}

          {/* Timeline Section */}
          <div className="pt-4 border-t">
            <h3 className="font-medium mb-4">Transaction Timeline</h3>
            <div className="space-y-4">
              {deposit?.timeline?.map((event, index) => (
                <div key={index} className="relative pl-8">
                  {/* Connecting line */}
                  {index < deposit.timeline.length - 1 && (
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
                      {event?.note ||
                        event.status.charAt(0).toUpperCase() +
                          event.status.slice(1)}
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

          {deposit.status === "rejected" ? (
            <div className="bg-red-50 p-4 rounded-md border border-red-200">
              <p className="text-red-600 mb-2 font-medium">
                This deposit failed
              </p>
              <p className="text-sm text-red-500 mb-4">
                There was a problem processing this deposit. Please contact
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
