/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "@/lib/axios";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AccountVerify() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const otpId = searchParams.get("id");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");
  const [showResend, setShowResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState("");
  const [resendError, setResendError] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!otpId) {
        setStatus("error");
        setMessage("Invalid or missing verification link.");
        setShowResend(true);
        return;
      }
      setStatus("loading");
      try {
        const res = await api.post("/auth/verify", { otpId });
        if (res.data && res.data.success) {
          setStatus("success");
          setMessage(
            "Your account has been verified and set for review. Once we approve it, you'll hear back within 2 days."
          );
        } else {
          setStatus("error");
          setMessage(res.data?.message || "Verification failed.");
          setShowResend(true);
        }
      } catch (err: any) {
        setStatus("error");
        setMessage(
          err.response?.data?.message ||
            "Verification failed. The link may have expired or already been used."
        );
        setShowResend(true);
      }
    };
    verifyEmail();
  }, [otpId]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    setResendSuccess("");
    setResendError("");
    setResendLoading(true);
    try {
      const res = await api.post("/auth/resend-verification", { email });
      if (res.status === 200 && res.data.success) {
        setResendSuccess(
          "A new verification link has been sent to your email."
        );
      } else {
        setResendError(
          res.data?.message || "Failed to send verification email."
        );
      }
    } catch (err: any) {
      setResendError(
        err.response?.data?.message ||
          "Failed to send verification email. Please try again."
      );
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-muted">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="flex flex-col items-center justify-center py-10">
          {status === "loading" && (
            <>
              <Loader2 className="h-10 w-10 animate-spin text-purple-600 mb-4" />
              <div className="text-lg font-medium">Verifying your email...</div>
            </>
          )}
          {status === "success" && (
            <>
              <CheckCircle className="h-12 w-12 text-green-500 mb-2" />
              <div className="text-xl font-semibold mb-2">Email Verified!</div>
              <div className="mb-4 text-gray-600 text-center">{message}</div>
              <Button
                onClick={() => navigate("/", { replace: true })}
                className="bg-purple-600 text-white"
              >
                Back to Home
              </Button>
            </>
          )}
          {status === "error" && (
            <>
              <XCircle className="h-12 w-12 text-red-500 mb-2" />
              <div className="text-xl font-semibold mb-2">
                Verification Failed
              </div>
              <div className="mb-4 text-gray-600 text-center">{message}</div>
              <Button onClick={() => navigate("/")} variant="outline">
                Back to Home
              </Button>
              {showResend && (
                <form
                  onSubmit={handleResend}
                  className="w-full mt-6 flex flex-col items-center gap-3"
                >
                  <Label
                    htmlFor="resend-email"
                    className="text-gray-700 text-center"
                  >
                    Enter your email to request a new verification link:
                  </Label>
                  <Input
                    id="resend-email"
                    type="email"
                    placeholder="johndoe@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full"
                  />
                  <Button
                    type="submit"
                    className="w-full bg-purple-600 text-white"
                    disabled={resendLoading}
                  >
                    {resendLoading ? "Sending..." : "Resend Verification Email"}
                  </Button>
                  {resendSuccess && (
                    <div className="text-green-600 text-sm text-center">
                      {resendSuccess}
                    </div>
                  )}
                  {resendError && (
                    <div className="text-red-600 text-sm text-center">
                      {resendError}
                    </div>
                  )}
                </form>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
