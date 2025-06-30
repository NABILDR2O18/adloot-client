/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "@/lib/axios";
import toast from "react-hot-toast";

const PayPalSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("token");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const completeSession = async () => {
      if (!orderId) {
        toast.error("Missing PayPal order ID.");
        setLoading(false);
        return;
      }
      try {
        const res = await api.post(
          "/advertiser/deposit/paypal/order/complete",
          {
            orderId,
          }
        );
        if (res.data?.success) {
          toast.success("Deposit successful!");
          setTimeout(
            () => (window.location.href = "/advertiser/dashboard/billing"),
            1500
          );
        } else {
          toast.error(res.data?.message || "Deposit failed.");
        }
      } catch (err: any) {
        toast.error(
          err?.response?.data?.message ||
            "Deposit failed. Please contact support."
        );
      } finally {
        setLoading(false);
      }
    };
    completeSession();
  }, [orderId]);

  return (
    <div className="flex flex-col items-center justify-center py-8">
      {loading ? (
        <>
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
          <div className="mt-4">Completing your PayPal deposit...</div>
        </>
      ) : (
        <div>Redirecting...</div>
      )}
    </div>
  );
};

export default PayPalSuccess;
