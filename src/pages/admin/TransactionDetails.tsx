/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  ChevronLeft,
  CheckCircle,
  Clock,
  Copy,
  Plus,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { getPromotionBonusMultiplier } from "@/utils/getPromotionBonus";
import { calculateCampaignDistribution } from "@/utils/calculateCampaignDistribution";

type ITransactionDetail = {
  id: number;
  status: string;
  event_token: string;
  is_pub_triggered: boolean;
  retries: number;
  publisher_cut: string;
  publisher_user_cut: string;
  created_at: string;
  app: {
    id: number;
    name: string;
    platform: string;
    website_url: string;
    conversion_rate: string;
    currency_name_plural: string;
    currency_name_singular: string;
    currency_reward_rounding: string;
    split_to_user?: string;
    promotions: [
      {
        id: string;
        status: "active" | "complete";
        multiplier: string;
        name: string;
        start: string;
        end: string;
      }
    ];
  };
  campaign: {
    id: number;
    name: string;
    category: string;
    payout_type: string;
    payout: string;
    status: string;
    admin_percentage?: string;
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
  promotion?: {
    id: string;
    name: string;
    start: string;
    end: string;
    status: string;
    multiplier: string;
  } | null;
  event?: {
    id: number;
    name: string;
    token: string;
    payout: string;
  } | null;
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Completed
        </span>
      );
    case "pending":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </span>
      );
    case "approval":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
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
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
          {status}
        </span>
      );
  }
};

export default function TransactionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState<ITransactionDetail | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [approveLoading, setApproveLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .get(`/admin/transactions/${id}`)
      .then((res) => {
        if (res.data?.success) {
          setTransaction(res.data.data);
        } else {
          setTransaction(null);
        }
      })
      .catch(() => setTransaction(null))
      .finally(() => setLoading(false));
  }, [id]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">Loading transaction details...</div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-center">Transaction not found</div>
        <Button className="mt-4" onClick={() => navigate(-1)}>
          Return to Transactions
        </Button>
      </div>
    );
  }

  const handleApproveTransaction = async (id: string | number) => {
    setApproveLoading(true);
    try {
      const res = await api.put(`/admin/transactions/${id}/approve`);
      if (res.status === 200) {
        toast.success("Transaction approved");
        navigate(-1);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Something went wrong!");
    } finally {
      setApproveLoading(false);
    }
  };

  const handleRejectTransaction = async (id: string | number) => {
    setRejectLoading(true);
    try {
      const res = await api.put(`/admin/transactions/${id}/reject`);
      if (res.status === 200) {
        toast.success("Transaction rejected");
        navigate(-1);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Something went wrong!");
    } finally {
      setRejectLoading(false);
    }
  };

  const promo = getPromotionBonusMultiplier(transaction?.app?.promotions);
  const shares = calculateCampaignDistribution(
    Number(
      transaction.campaign?.payout_type === "cpe"
        ? transaction?.event?.payout
        : transaction?.campaign?.payout
    ),
    Number(transaction?.campaign?.admin_percentage),
    Number(transaction?.app?.split_to_user),
    promo
  );

  return (
    <section className="space-y-4">
      <div className="flex justify-between md:flex-row flex-col gap-2">
        <Button
          variant="outline"
          className="flex items-center gap-1"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </Button>

        {transaction?.status === "approval" && (
          <div className="flex justify-center items-center gap-2">
            <Button
              disabled={approveLoading || rejectLoading}
              onClick={() => handleApproveTransaction(transaction?.id)}
              className="bg-purple-600 hover:bg-purple-500"
            >
              {approveLoading && <RefreshCw className="h-4 w-4 animate-spin" />}
              Approve
            </Button>
            <Button
              disabled={approveLoading || rejectLoading}
              onClick={() => handleRejectTransaction(transaction?.id)}
              variant="destructive"
            >
              {rejectLoading && <RefreshCw className="h-4 w-4 animate-spin" />}
              Reject
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between">
            <span className="flex items-center gap-4">
              Transaction Details {getStatusBadge(transaction.status)}
            </span>
            <span className="flex items-center font-semibold">
              ID: {transaction.id}
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-gray-100 ml-1"
                onClick={() => handleCopyId(transaction.id)}
              >
                {copiedId === transaction.id ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4 text-gray-500" />
                )}
              </Button>
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="font-semibold text-base underline">
                App Details:
              </Label>
              <ul className="mt-3 md:pl-4 list-disc list-inside space-y-1 text-sm">
                <li>
                  <span className="font-semibold">ID:</span>{" "}
                  {transaction.app?.id}
                </li>
                <li>
                  <span className="font-semibold">Name:</span>{" "}
                  {transaction.app?.name}
                </li>
                <li>
                  <span className="font-semibold">Platform:</span>{" "}
                  {transaction.app?.platform}
                </li>
                <li>
                  <span className="font-semibold">Website:</span>{" "}
                  {transaction.app?.website_url}
                </li>
                <li>
                  <span className="font-semibold">Conversion rate:</span>{" "}
                  {transaction.app?.conversion_rate}
                </li>
                <li>
                  <span className="font-semibold">Currency:</span>{" "}
                  {transaction.app?.currency_name_plural}
                </li>
                <li>
                  <span className="font-semibold">User Split:</span>{" "}
                  {transaction.app?.split_to_user}%
                </li>
              </ul>
            </div>

            <div>
              <Label className="font-semibold text-base underline">
                Campaign Details:
              </Label>
              <ul className="mt-3 md:pl-4 list-disc list-inside space-y-1 text-sm">
                <li>
                  <span className="font-semibold">ID:</span>{" "}
                  {transaction.campaign?.id}
                </li>
                <li>
                  <span className="font-semibold">Name:</span>{" "}
                  {transaction?.campaign?.name}
                </li>
                <li>
                  <span className="font-semibold">Category:</span>{" "}
                  {transaction.campaign?.category}
                </li>
                <li>
                  <span className="font-semibold">Type:</span>{" "}
                  <span className="uppercase">
                    {transaction.campaign?.payout_type}
                  </span>
                </li>
                <li>
                  <span className="font-semibold">Admin Percentage:</span>{" "}
                  {transaction.campaign?.admin_percentage}%
                </li>
                <li>
                  <span className="font-semibold">Status:</span>{" "}
                  <span className="capitalize">
                    {transaction.campaign?.status}
                  </span>
                </li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <Label className="font-semibold text-base underline">
                Click (User) Details:
              </Label>
              <ul className="mt-3 md:pl-4 list-disc list-inside space-y-1 text-sm">
                <li>
                  <span className="font-semibold">ID:</span>{" "}
                  {transaction.click?.id}
                </li>
                <li>
                  <span className="font-semibold">IP:</span>{" "}
                  {transaction?.click?.ip_address}
                </li>
                <li>
                  <span className="font-semibold">User Agent:</span>{" "}
                  {transaction.click?.user_agent}
                </li>
                <li>
                  <span className="font-semibold">Browser:</span>{" "}
                  <span>{transaction.click?.browser}</span>
                </li>
                <li>
                  <span className="font-semibold">OS:</span>{" "}
                  {transaction.click?.os}
                </li>
                <li>
                  <span className="font-semibold">Device Type:</span>{" "}
                  <span>{transaction.click?.device_type}</span>
                </li>
                <li>
                  <span className="font-semibold">Clicked At:</span>{" "}
                  <span>
                    {transaction.click?.created_at
                      ? format(new Date(transaction.click.created_at), "Pp")
                      : "N/A"}
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <Label className="font-semibold text-base underline">
                Transaction other Details:
              </Label>
              <ul className="mt-3 md:pl-4 list-disc list-inside space-y-1 text-sm">
                <li>
                  <span className="font-semibold">Created at:</span>{" "}
                  {transaction?.created_at
                    ? format(new Date(transaction?.created_at), "Pp")
                    : "N/A"}
                </li>
                <li>
                  <span className="font-semibold">Publisher Postback:</span>{" "}
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                    {transaction?.is_pub_triggered ? "Trigged" : "Pending"}
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <Label className="font-semibold text-base underline">
                Payout Details:
              </Label>
              <ul className="mt-3 md:pl-4 list-disc list-inside space-y-1 text-sm">
                <li>
                  <span className="font-semibold">Total:</span> $
                  {transaction?.campaign?.payout}
                </li>
                <li>
                  <span className="font-semibold">Admin:</span> $
                  {shares?.adminShare}
                </li>
                <li>
                  <span className="font-semibold">Publisher:</span> $
                  {shares?.publisherCut}
                </li>
                <li>
                  <span className="font-semibold">User:</span> $
                  {shares?.userShare}
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {transaction.promotion && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-green-500" />
              Promotion Applied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm">
                <span className="font-semibold">Name:</span>{" "}
                {transaction?.promotion?.name}
              </div>
              <div className="text-sm">
                <span className="font-semibold">Multiplier:</span>{" "}
                <Badge>{transaction?.promotion?.multiplier}%</Badge>
              </div>
              <div className="text-sm">
                <span className="font-semibold">Multiplier:</span>{" "}
                <Badge className="capitalize">
                  {transaction?.promotion?.status}
                </Badge>
              </div>
              <div className="text-sm">
                <span className="font-semibold">Start Date:</span>{" "}
                <span>
                  {transaction.click?.created_at
                    ? format(new Date(transaction?.promotion?.start), "Pp")
                    : "N/A"}
                </span>
              </div>
              <div className="text-sm">
                <span className="font-semibold">End Date:</span>{" "}
                <span>
                  {transaction.click?.created_at
                    ? format(new Date(transaction?.promotion?.end), "Pp")
                    : "N/A"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
