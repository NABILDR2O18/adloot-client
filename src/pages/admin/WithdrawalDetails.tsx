/* eslint-disable @typescript-eslint/no-explicit-any */
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
  Plus,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

type ITimelineEntry = {
  date: string;
  status: string;
  note?: string | null;
};

type IUser = {
  full_name: string;
  email: string;
  role: string;
  status: string;
  available_balance: string;
  country: string | null;
};

type IMethod = {
  id: number;
  payment_method: string;
  email_or_address: string;
  is_default: boolean;
  created_at: string;
};

type IWithdrawalRequest = {
  id: string;
  user_id: string;
  amount: string;
  timeline: ITimelineEntry[];
  note: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  user: IUser;
  method: IMethod;
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
    case "chargeback":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="w-3 h-3 mr-1" />
          Chargeback
        </span>
      );
    case "addon":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <Plus className="w-3 h-3 mr-1" />
          Addon
        </span>
      );
    default:
      return null;
  }
};

export default function AdminWithdrawalDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState<IWithdrawalRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .get(`/admin/withdrawal/requests/${id}`)
      .then((res) => {
        if (res.data?.success) {
          setPayment(res.data.data);
        } else {
          setPayment(null);
        }
      })
      .catch(() => setPayment(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">Loading payment details...</div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-center">Payment not found</div>
        <Button className="mt-4" onClick={() => navigate(-1)}>
          Return to Payments
        </Button>
      </div>
    );
  }

  const handleApprove = async () => {
    if (!id) return;
    setApproving(true);
    try {
      const res = await api.put(`/admin/withdrawal/requests/${id}/approve`);
      if (res.data?.success) {
        toast.success("Withdrawal approved!");
        setPayment(res.data.data);
        setShowApproveDialog(false);
      } else {
        toast.error(res.data?.message || "Failed to approve withdrawal.");
      }
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to approve withdrawal."
      );
    } finally {
      setApproving(false);
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex justify-between md:flex-row flex-col gap-2">
        <Button
          variant="outline"
          className="flex items-center gap-1"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Payments</span>
        </Button>

        {payment?.status === "pending" && (
          <AlertDialog
            open={showApproveDialog}
            onOpenChange={setShowApproveDialog}
          >
            <AlertDialogTrigger asChild>
              <Button className="ml-2" disabled={approving}>
                {approving ? "Approving..." : "Approve"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Approve Withdrawal?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to approve this withdrawal request? This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={approving}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleApprove} disabled={approving}>
                  {approving ? "Approving..." : "Approve"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex justify-between">
            <span className="flex items-center justify-center gap-4">
              Withdrawal Details {getStatusBadge(payment.status)}
            </span>
            <span className="flex items-center font-medium">
              ${payment.amount}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="sm:grid grid-cols-2 gap-6">
            <div>
              <Label className="text-sm text-muted-foreground">User</Label>
              <div className="font-medium">{payment?.id}</div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">User</Label>
              <div className="font-medium">{payment.user?.full_name}</div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">
                User Email
              </Label>
              <div className="font-medium">{payment.user?.email}</div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">
                User Status
              </Label>
              <div className="font-medium capitalize">
                {payment.user?.status}
              </div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Method</Label>
              <div className="font-medium">
                {payment.method
                  ? `${payment.method.payment_method
                      .charAt(0)
                      .toUpperCase()}${payment.method.payment_method
                      .slice(1)
                      .toLowerCase()} (${payment.method.email_or_address})`
                  : "-"}
              </div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">
                Requested At
              </Label>
              <div className="font-medium">
                {payment.created_at
                  ? format(new Date(payment.created_at), "Pp")
                  : "-"}
              </div>
            </div>
            <div className="col-span-2">
              <Label className="text-sm text-muted-foreground">Note</Label>
              <div className="font-medium whitespace-pre-wrap">
                {payment.note || "No note"}
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
            Withdrawal Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payment?.timeline?.map((event, index) => (
              <div key={index} className="relative pl-8">
                {/* Connecting line */}
                {index < payment?.timeline.length - 1 && (
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
                    {event.note ||
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
        </CardContent>
      </Card>
    </section>
  );
}
