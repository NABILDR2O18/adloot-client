import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

const PayPalCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px]">
      <XCircle className="w-12 h-12 text-red-500 mb-4" />
      <h2 className="text-xl font-semibold mb-2">Payment Issue</h2>
      <p className="mb-6 text-gray-600 text-center">
        Your PayPal payment wasn't completed, please check your balance and
        contact with paypal.
      </p>
      <Button onClick={() => navigate("/advertiser/dashboard/billing")}>
        Back to Billing
      </Button>
    </div>
  );
};

export default PayPalCancel;
