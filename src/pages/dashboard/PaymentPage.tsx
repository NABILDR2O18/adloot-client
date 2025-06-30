
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Building, CreditCard, Copy } from "lucide-react";
import { toast } from "react-hot-toast";

export default function PaymentPage() {
  const navigate = useNavigate();
  const [activeMethod, setActiveMethod] = useState<string>("bank");

  const handleCopyAddress = () => {
    navigator.clipboard.writeText("3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5");
    toast.success("Address copied to clipboard!");
  };

  const handleAddMethod = () => {
    toast.success("Payment method added successfully!");
    navigate("/dashboard/billing");
  };

  return (
    <div className="max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>Add Withdrawal Method</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible defaultValue="paypal">

            <AccordionItem value="paypal">
              <AccordionTrigger className="flex gap-2 items-center">
                <CreditCard size={20} className="mr-2" /> PayPal
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="paypal-email">PayPal Email</Label>
                    <Input id="paypal-email" type="email" placeholder="Enter your PayPal email" />
                  </div>
                  <Button onClick={handleAddMethod} className="mt-2">Add PayPal Account</Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="crypto">
              <AccordionTrigger className="flex gap-2 items-center">
                <CreditCard size={20} className="mr-2" /> Cryptocurrency
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Select Cryptocurrency</Label>
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                          <input 
                            type="radio" 
                            id="payeer" 
                            name="crypto" 
                            value="payeer" 
                            className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                            defaultChecked
                          />
                          <Label htmlFor="payeer">Payeer</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="radio" 
                            id="bitcoin" 
                            name="crypto" 
                            value="bitcoin" 
                            className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                            defaultChecked
                          />
                          <Label htmlFor="bitcoin">Bitcoin (BTC)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="radio" 
                            id="ethereum" 
                            name="crypto" 
                            value="ethereum" 
                            className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                          />
                          <Label htmlFor="ethereum">Ethereum (ETH)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="radio" 
                            id="usdt" 
                            name="crypto" 
                            value="usdt" 
                            className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                          />
                          <Label htmlFor="usdt">Tether (USDT)</Label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="wallet-address">Wallet Address</Label>
                      <Input id="wallet-address" placeholder="Enter your wallet address" />
                    </div>
                  </div>
                  <Button onClick={handleAddMethod} className="mt-2">Add Crypto Wallet</Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
