
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, CreditCard, Eye, Plus, ChevronRight, Download } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const sampleWithdrawals = [
  {
    id: "w001",
    date: "2025-04-15",
    period: "March 2025",
    amount: "$1,250.75",
    status: "completed",
    method: "Payeer"
  },
  {
    id: "w002",
    date: "2025-04-02",
    period: "February 2025",
    amount: "$875.50",
    status: "pending",
    method: "PayPal"
  },
  {
    id: "w003",
    date: "2025-03-18",
    period: "January 2025",
    amount: "$1,430.25",
    status: "completed",
    method: "Payeer"
  },
  {
    id: "w004",
    date: "2025-03-05",
    period: "December 2024",
    amount: "$790.00",
    status: "failed",
    method: "Crypto"
  },
];

const sampleChargebacks = [
  {
    id: "cb001",
    date: "2025-04-10",
    orderId: "ORD-12345",
    amount: "$150.00",
    reason: "Product not as described",
    status: "pending"
  },
  {
    id: "cb002",
    date: "2025-03-28",
    orderId: "ORD-12240",
    amount: "$75.25",
    reason: "Unauthorized transaction",
    status: "resolved"
  },
  {
    id: "cb003",
    date: "2025-03-15",
    orderId: "ORD-11982",
    amount: "$220.50",
    reason: "Product not received",
    status: "disputed"
  },
];

const paymentMethods = [
  {
    id: "pm001",
    type: "payeer",
    name: "Payeer",
    details: "Account ending in 4321",
    isDefault: true
  },
  {
    id: "pm002",
    type: "paypal",
    name: "PayPal",
    details: "user@example.com",
    isDefault: false
  },
];

export default function BillingPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "resolved":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "failed":
      case "disputed":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getMethodIcon = (type: string) => {
    switch (type) {
      case "bank":
        return <Building size={isMobile ? 16 : 20} />;
      case "paypal":
      case "crypto":
      default:
        return <CreditCard size={isMobile ? 16 : 20} />;
    }
  };

  const handleWithdraw = () => {
    navigate("/publisher/dashboard/payment");
  };

  const handleContactSupport = (withdrawalId?: string, period?: string) => {
    const subject = withdrawalId ? `Payment Issue with Withdrawal #${withdrawalId}` : "Billing Support Request";
    const description = period ? `I need assistance with my payment for the period of ${period}.` : "";

    navigate("/publisher/dashboard/support", {
      state: {
        createTicket: true,
        ticketSubject: subject,
        ticketMessage: description,
        ticketType: "payment"
      }
    });
  };

  // Mobile card view for tables
  const renderWithdrawalCard = (withdrawal: any) => (
    <Card key={withdrawal.id} className="mb-4">
      <CardContent className="pt-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-semibold">{withdrawal.period}</div>
            <div className="text-sm text-muted-foreground">{withdrawal.date}</div>
            <div className="text-sm">{withdrawal.method}</div>
          </div>
          <div className="text-right">
            <div className="font-bold">{withdrawal.amount}</div>
            <Badge className={`${getStatusColor(withdrawal.status)} text-white mt-1`}>
              {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
            </Badge>
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          {withdrawal.status === "failed" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleContactSupport(withdrawal.id, withdrawal.period)}
            >
              Support
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/publisher/dashboard/withdrawal/${withdrawal.id}`)}
            className="flex items-center"
          >
            Details <ChevronRight size={16} className="ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderChargebackCard = (chargeback: any) => (
    <Card key={chargeback.id} className="mb-4">
      <CardContent className="pt-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-semibold">{chargeback.orderId}</div>
            <div className="text-sm text-muted-foreground">{chargeback.date}</div>
            <div className="text-sm truncate max-w-[180px]">{chargeback.reason}</div>
          </div>
          <div className="text-right">
            <div className="font-bold">{chargeback.amount}</div>
            <Badge className={`${getStatusColor(chargeback.status)} text-white mt-1`}>
              {chargeback.status.charAt(0).toUpperCase() + chargeback.status.slice(1)}
            </Badge>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleContactSupport(chargeback.id, `Chargeback: ${chargeback.orderId}`)}
          >
            Dispute
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2 md:pb-4">
            <CardTitle className="text-lg md:text-xl">Account Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-1 md:space-y-2">
                <p className="text-xs md:text-sm text-muted-foreground">Available Balance</p>
                <p className="text-xl md:text-3xl font-bold">$3,547.25</p>
              </div>
              <div className="space-y-1 md:space-y-2">
                <p className="text-xs md:text-sm text-muted-foreground">Pending Balance</p>
                <p className="text-xl md:text-3xl font-semibold text-yellow-600">$750.00</p>
              </div>
              <div className="space-y-1 md:space-y-2">
                <p className="text-xs md:text-sm text-muted-foreground text-red-600">Chargeback</p>
                <p className="text-xl md:text-3xl font-semibold text-red-500">-$149.95</p>
              </div>
              <div className="space-y-1 md:space-y-2">
                <p className="text-xs md:text-sm text-muted-foreground">Lifetime Earnings</p>
                <p className="text-xl md:text-3xl font-semibold text-gray-600">$12,890.75</p>
              </div>
            </div>
            <div className="mt-4 md:mt-6 flex flex-wrap gap-2">
              <Button size={isMobile ? "sm" : "default"} onClick={handleWithdraw}>Request Withdrawal</Button>
              <Button size={isMobile ? "sm" : "default"} variant="outline" onClick={() => handleContactSupport()}>Contact Support</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader className="pb-2 md:pb-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg md:text-xl">Withdrawal Methods</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/publisher/dashboard/payment')}>
                <Plus size={16} className="mr-1" />
                <span className="text-sm">Add</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {paymentMethods.map((method) => (
              <div key={method.id} className="flex items-start gap-2 p-2 md:p-3 border rounded-md">
                <div className="mt-1">{getMethodIcon(method.type)}</div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="font-medium text-sm md:text-base">{method.name}</p>
                    {method.isDefault && (
                      <Badge variant="outline" className="text-xs">Default</Badge>
                    )}
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground">{method.details}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2 md:pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg md:text-xl">Withdrawal History</CardTitle>
            {isMobile && (
              <Button variant="outline" size="sm">
                <Download size={16} className="mr-1" />
                <span className="text-sm">Export</span>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isMobile ? (
            <div className="space-y-2">
              {sampleWithdrawals.map(renderWithdrawalCard)}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleWithdrawals.map((withdrawal) => (
                    <TableRow key={withdrawal.id}>
                      <TableCell>{withdrawal.date}</TableCell>
                      <TableCell>{withdrawal.period}</TableCell>
                      <TableCell>{withdrawal.method}</TableCell>
                      <TableCell>{withdrawal.amount}</TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(withdrawal.status)} text-white`}>
                          {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {withdrawal.status === "failed" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleContactSupport(withdrawal.id, withdrawal.period)}
                            >
                              Support
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/publisher/dashboard/withdrawal/${withdrawal.id}`)}
                          >
                            <Eye size={18} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
