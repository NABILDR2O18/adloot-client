import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  History,
  ChevronLeft,
  Calendar,
  Clock,
  Check,
  X,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import api from "@/lib/axios";

type TimelineStatus = "submitted" | "pending" | "completed" | string;
type DepositStatus = "submitted" | "pending" | "completed" | string;
type DepositType = "deposit" | "deposit" | string;
type DepositMethod = "paypal" | string;
type UserRole = "advertiser" | "publisher" | string;
type UserStatus = "active" | "inactive" | "deleted" | "unverified" | string;

type DepositTimeline = {
  date: string; // ISO date string
  note: string;
  status: TimelineStatus;
  paypal_order_id?: string;
};

type DepositUser = {
  full_name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
};

type IDeposit = {
  id: string;
  user_id: string;
  amount: string; // If it's stored as a string e.g., "200.00"
  method: DepositMethod;
  timeline: DepositTimeline[];
  note: string;
  status: DepositStatus;
  type: DepositType;
  paypal_order_id: string;
  created_at: string;
  updated_at: string;
  user: DepositUser;
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

export default function DepositDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deposit, setDeposit] = useState<IDeposit | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .get(`/admin/deposits/${id}`)
      .then((res) => {
        if (res.data?.success) {
          setDeposit(res.data.data);
        } else {
          setDeposit(null);
        }
      })
      .catch(() => setDeposit(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">Loading Deposit details...</div>
      </div>
    );
  }

  if (!deposit) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-center">deposit not found</div>
        <Button className="mt-4" onClick={() => navigate(-1)}>
          Return to deposits
        </Button>
      </div>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex justify-between md:flex-row flex-col gap-2">
        <Button
          variant="outline"
          className="flex items-center gap-1"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to deposits</span>
        </Button>
      </div>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex justify-between">
            <span className="flex items-center justify-center gap-4">
              Deposit Details {getStatusBadge(deposit?.status)}
            </span>
            <span className="flex items-center font-medium">
              ${deposit?.amount}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="sm:grid grid-cols-2 gap-6">
            <div>
              <Label className="text-sm text-muted-foreground">User</Label>
              <div className="font-medium">{deposit?.id}</div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">User</Label>
              <div className="font-medium">{deposit?.user?.full_name}</div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">
                User Email
              </Label>
              <div className="font-medium">{deposit?.user?.email}</div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">
                User Status
              </Label>
              <div className="font-medium capitalize">
                {deposit.user?.status}
              </div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Method</Label>
              <div className="font-medium">{deposit?.method}</div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">
                Requested At
              </Label>
              <div className="font-medium">
                {deposit?.created_at
                  ? format(new Date(deposit.created_at), "Pp")
                  : "-"}
              </div>
            </div>
            <div className="col-span-2">
              <Label className="text-sm text-muted-foreground">Note</Label>
              <div className="font-medium whitespace-pre-wrap">
                {deposit?.note || "No note"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <History className="w-5 h-5 mr-2" />
            Deposit Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {deposit?.timeline?.map((event, index) => (
              <div key={index} className="relative pl-8">
                {/* Connecting line */}
                {index < deposit?.timeline.length - 1 && (
                  <div className="absolute left-[10px] top-6 w-0.5 h-full bg-gray-200 -ml-px"></div>
                )}
                {/* Status dot */}
                <div
                  className={`absolute left-0 w-5 h-5 rounded-full flex items-center justify-center ${getStatusColor(
                    event?.status
                  )}`}
                >
                  {getStatusIcon(event?.status)}
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
                      {event?.date ? format(parseISO(event?.date), "PP") : ""}
                    </div>
                    {/* If you have time, show it */}
                    {event?.date && (
                      <div className="flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        {format(parseISO(event?.date), "p")}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
