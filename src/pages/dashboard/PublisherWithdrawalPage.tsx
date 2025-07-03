/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronLeft, CreditCard } from "lucide-react";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { Separator } from "@/components/ui/separator";

export default function PublisherWithdrawalPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { id } = useParams();
  // Form states
  const [userId, setUserId] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [payeerWallet, setPayeerWallet] = useState("");
  const [cryptoWallet, setCryptoWallet] = useState("");
  const [loading, setLoading] = useState(false);

  // Generic handler
  const handleAddMethod = async (
    payment_method: string,
    email_or_address: string
  ) => {
    setLoading(true);
    try {
      const res = await api.post(`/${user?.role}/withdrawal/methods/create`, {
        payment_method,
        email_or_address,
        user_id: userId,
      });
      if (res.data?.success) {
        toast.success("Withdrawal method added!");
        // Optionally clear the form
        if (payment_method === "paypal") setPaypalEmail("");
        if (payment_method === "payeer") setPayeerWallet("");
        if (payment_method === "crypto") setCryptoWallet("");
        navigate(-1);
      } else {
        toast.error(res.data?.message || "Failed to add withdrawal method.");
      }
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          "Something went wrong while adding the withdrawal method."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <button
        className="flex items-center text-muted-foreground hover:text-foreground mb-4"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        <span>Back</span>
      </button>
      <div className="grid md:grid-cols-3 gap-8">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Add Withdrawal Method</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible defaultValue="paypal">
              {/* PayPal */}
              <AccordionItem value="paypal">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <CreditCard size={20} /> PayPal
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-1 py-4">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAddMethod("paypal", paypalEmail);
                    }}
                  >
                    {id && (
                      <>
                        <Label htmlFor="user-id">User ID</Label>
                        <Input
                          required
                          id="user-id"
                          placeholder="Enter user id"
                          className="mt-1 mb-4"
                          value={userId}
                          onChange={(e) => setUserId(e.target.value)}
                        />
                      </>
                    )}
                    <Label htmlFor="paypal-email">Email address</Label>
                    <Input
                      required
                      id="paypal-email"
                      type="email"
                      placeholder="Enter your PayPal email"
                      className="mt-1"
                      value={paypalEmail}
                      onChange={(e) => setPaypalEmail(e.target.value)}
                    />
                    <aside className="flex justify-end">
                      <Button
                        size="sm"
                        className="mt-4 text-sm"
                        type="submit"
                        disabled={loading}
                      >
                        Add
                      </Button>
                    </aside>
                  </form>
                </AccordionContent>
              </AccordionItem>

              {/* Payeer */}
              <AccordionItem value="payeer">
                <AccordionTrigger className="flex gap-2 items-center">
                  <div className="flex items-center gap-2">
                    <CreditCard size={20} /> Payeer
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-1 py-4">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAddMethod("payeer", payeerWallet);
                    }}
                  >
                    {id && (
                      <>
                        <Label htmlFor="user-id">User ID</Label>
                        <Input
                          required
                          id="user-id"
                          placeholder="Enter user id"
                          className="mt-1 mb-4"
                          value={userId}
                          onChange={(e) => setUserId(e.target.value)}
                        />
                      </>
                    )}
                    <Label htmlFor="payeer-wallet">Payeer code</Label>
                    <Input
                      required
                      id="payeer-wallet"
                      placeholder="Enter your payeer code"
                      className="mt-1"
                      value={payeerWallet}
                      onChange={(e) => setPayeerWallet(e.target.value)}
                    />
                    <aside className="flex justify-end">
                      <Button
                        size="sm"
                        className="mt-4 text-sm"
                        type="submit"
                        disabled={loading}
                      >
                        Add
                      </Button>
                    </aside>
                  </form>
                </AccordionContent>
              </AccordionItem>

              {/* Crypto */}
              <AccordionItem value="crypto">
                <AccordionTrigger className="flex gap-2 items-center">
                  <div className="flex items-center gap-2">
                    <CreditCard size={20} /> Crypto
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-1 py-4">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAddMethod("crypto", cryptoWallet);
                    }}
                  >
                    {id && (
                      <>
                        <Label htmlFor="user-id">User ID</Label>
                        <Input
                          required
                          id="user-id"
                          placeholder="Enter user id"
                          className="mt-1 mb-4"
                          value={userId}
                          onChange={(e) => setUserId(e.target.value)}
                        />
                      </>
                    )}
                    <Label htmlFor="crypto-wallet">
                      Wallet address (USDT - TRC20)
                    </Label>
                    <Input
                      required
                      id="crypto-wallet"
                      placeholder="Enter your usdt wallet address (trc20)"
                      className="mt-1"
                      value={cryptoWallet}
                      onChange={(e) => setCryptoWallet(e.target.value)}
                    />
                    <aside className="flex justify-end">
                      <Button
                        size="sm"
                        className="mt-4 text-sm"
                        type="submit"
                        disabled={loading}
                      >
                        Add
                      </Button>
                    </aside>
                  </form>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
        {!id && (
          <Card>
            <CardHeader>
              <CardTitle>Withdrawal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold">Important Notes</h3>
              <ul className="mt-2 list-disc pl-6 text-gray-500 space-y-1">
                <li>
                  Withdrawals are processed every 15th and 30th of the month.
                </li>
                <li>Minimum withdrawal amount is $100.00.</li>
              </ul>
              <Separator className="my-4" />
              <h3 className="font-semibold">
                Processing time depends on the withdrawal method:
              </h3>
              <ul className="mt-2 list-disc pl-6 text-gray-500 space-y-1">
                <li>PayPal: 1–2 business days</li>
                <li>Payeer: 1–2 business days</li>
                <li>USDT (TRC20): 1–24 hours after confirmation</li>
              </ul>
              <Separator className="my-4" />
              <div className="py-4">
                <h3 className="font-semibold">Fees</h3>
                <div className="flex justify-between items-center text-gray-500 mt-2">
                  <p>Payeer:</p>
                  <p>1%</p>
                </div>
                <div className="flex justify-between items-center text-gray-500 mt-2">
                  <p>PayPal:</p>
                  <p>PayPal: 2.9% + $0.30</p>
                </div>
                <div className="flex justify-between items-center text-gray-500 mt-2">
                  <p> USDT (TRC20):</p>
                  <p>1% + network fee</p>
                </div>
              </div>
              <Separator className="my-4" />
              <p className=" text-gray-500">
                For any issues with withdrawals, please contact our support
                team.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
