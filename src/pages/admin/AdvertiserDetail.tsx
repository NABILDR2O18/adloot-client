/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "react-hot-toast";
import {
  Mail,
  Phone,
  DollarSign,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ChevronLeft,
  Building,
  Globe,
  CreditCard,
  ArrowRight,
  User2Icon,
  Building2,
  RefreshCw,
} from "lucide-react";
import { getStatusBadge } from "./AdvertisersManagement";
import api from "@/lib/axios";
import { IUser } from "@/contexts/UserContext";
import { useSettings } from "@/contexts/SettingsContext";
import CampaignsManagement from "./CampaignsManagement";

export default function AdvertiserDetail() {
  const { settings } = useSettings();
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [balanceLoading, setUpdateBalanceLoading] = useState(false);
  const [userDetails, setUserDetails] = useState<IUser | null>(null);

  const [balanceAmount, setBalanceAmount] = useState("");
  const [balanceAction, setBalanceAction] = useState("addon");

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/admin/users/${id}`);
      if (response.status === 200) {
        setUserDetails(response.data?.data?.user);
      }
    } catch (error: any) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleStatusChange = async (userId: string, status: string) => {
    try {
      const response = await api.put(`/admin/users/${userId}/status`, {
        status,
        emailNotify: settings?.email_alerts,
      });
      if (response.status === 200) {
        toast.success(`User ${status} successfully`);
        fetchUser();
      }
    } catch (error: any) {
      console.error("Error updating user status:", error);
      toast.error("Failed to update user status");
    }
  };

  const handleUpdateBalance = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!balanceAmount || isNaN(parseFloat(balanceAmount))) {
      toast.error("Please enter a valid amount", {
        position: "top-right",
      });
      return;
    }
    setUpdateBalanceLoading(true);
    try {
      const response = await api.post(`/admin/deposits/chargebackOrAddon`, {
        user_id: id,
        amount: balanceAmount,
        type: balanceAction,
      });
      if (response.status === 201) {
        setBalanceAmount("");
        fetchUser();
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    } finally {
      setUpdateBalanceLoading(false);
    }
  };

  return (
    <section>
      <div className="mb-6">
        <button
          className="flex items-center text-muted-foreground hover:text-foreground mb-4"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          <span>Back to Advertisers</span>
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xl">
              {userDetails?.company_name?.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {userDetails?.company_name}
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>{userDetails?.id}</span>
                {getStatusBadge(userDetails?.status)}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => handleStatusChange(id, "active")}
              className="flex items-center gap-1"
              disabled={userDetails?.status === "active"}
            >
              <CheckCircle className="h-4 w-4" />
              <span>Activate</span>
            </Button>
            <Button
              onClick={() => handleStatusChange(id, "suspended")}
              className="flex items-center gap-1"
              disabled={userDetails?.status === "suspended"}
            >
              <XCircle className="h-4 w-4" />
              <span>Suspend</span>
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700 flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>Create Report</span>
            </Button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs defaultValue="overview">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Overview</CardTitle>
                  <CardDescription>
                    Campaign performance and conversions over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <PerformanceChart />
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <User2Icon className="h-4 w-4 text-muted-foreground" />
                      <span>{userDetails?.full_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{userDetails?.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span>{userDetails?.company_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{userDetails?.phone ?? "-"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span>{userDetails?.website_or_app ?? "-"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>{userDetails?.address ?? "-"}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Financial Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        Current Balance:
                      </span>
                      <span className="font-bold text-lg text-green-600">
                        ${userDetails?.available_balance ?? 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        Cashback Balance:
                      </span>
                      <span>${userDetails?.chargeback_balance ?? 0}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="campaigns">
              <CampaignsManagement adId={id} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Balance Management Card */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Balance Management</CardTitle>
              <CardDescription>
                Adjust publisher's account balance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Current Balance</Label>
                    <span className="font-bold text-green-600">
                      ${userDetails?.available_balance ?? 0}
                    </span>
                  </div>
                  <Separator />
                </div>

                <form onSubmit={handleUpdateBalance} className="space-y-2">
                  <Label>Adjust Balance</Label>
                  <div className="flex gap-2">
                    <aside className="relative w-full">
                      <DollarSign
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <Input
                        type="number"
                        placeholder="Amount"
                        className="pl-10"
                        value={balanceAmount}
                        onChange={(e) => setBalanceAmount(e.target.value)}
                      />
                    </aside>
                    <select
                      className="px-3 py-2 border rounded-md bg-background"
                      value={balanceAction}
                      onChange={(e) => setBalanceAction(e.target.value)}
                    >
                      <option value="addon">Add</option>
                      <option value="cashback">Subtract</option>
                    </select>
                  </div>
                  <Button
                    className="w-full"
                    disabled={
                      !balanceAmount ||
                      isNaN(parseFloat(balanceAmount)) ||
                      balanceLoading
                    }
                  >
                    {balanceLoading && (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    )}
                    Update Balance
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Generate Statement
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <AlertTriangle className="mr-2 h-4 w-4 text-amber-500" />
                Flag for Review
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
