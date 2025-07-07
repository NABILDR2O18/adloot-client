/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import api from "@/lib/axios";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAuthModal } from "@/contexts/AuthModalContext";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OTP_LENGTH = 6;
const OTP_TIMER = 600; // 10 minutes in seconds

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { openLogin, openSignup } = useAuthModal();

  // OTP timer state
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Start timer when OTP is sent
  const startTimer = () => {
    setTimer(OTP_TIMER);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Step 1: Send OTP
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setMsg(null);
    setError(null);
    try {
      await api.post("/auth/password/otp", { email });
      setMsg("OTP sent to your email.");
      setStep(2);
      setOtp("");
      startTimer();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const OtpSchema = z.object({
    otp: z.string().min(6, "OTP must be 6 digits"),
  });

  const otpForm = useForm<z.infer<typeof OtpSchema>>({
    resolver: zodResolver(OtpSchema),
    defaultValues: { otp: "" },
  });

  // Step 2: Verify OTP
  const handleVerifyOtp = async (data: { otp: string }) => {
    setOtp(data.otp);
    setLoading(true);
    setMsg(null);
    setError(null);
    try {
      await api.post("/auth/password/otp/verify", { email, otp: data.otp });
      setMsg("OTP verified. Please set your new password.");
      setStep(3);
      if (timerRef.current) clearInterval(timerRef.current);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    setError(null);
    if (newPassword !== confirm) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
    try {
      await api.post("/auth/password/forget", {
        email,
        otp,
        newPassword,
      });
      setMsg(
        "Password reset successfully. You can now log in, redirecting ..."
      );
      setStep(1);
      setEmail("");
      setOtp("");
      setNewPassword("");
      setConfirm("");
      setTimeout(() => {
        setMsg(null);
        openLogin();
      }, 2000);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  // Format timer as mm:ss
  const formatTimer = (t: number) => {
    const m = Math.floor(t / 60)
      .toString()
      .padStart(2, "0");
    const s = (t % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <section className="h-screen grid grid-cols-1 md:grid-cols-2 overflow-hidden">
      <div className="flex items-center justify-center bg-muted">
        <div className="max-w-md w-full mx-auto">
          <Button
            variant="outline"
            className="flex items-center gap-1"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
          <Card className="w-full shadow-lg mt-2">
            <CardHeader>
              <CardTitle>
                {step === 1 && "Forgot Password"}
                {step === 2 && "Verify OTP"}
                {step === 3 && "Reset Password"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {step === 1 && (
                <form className="space-y-4" onSubmit={handleSendOtp}>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  {msg && <div className="text-green-600 text-sm">{msg}</div>}
                  {error && <div className="text-red-600 text-sm">{error}</div>}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Sending..." : "Send OTP"}
                  </Button>
                </form>
              )}
              {step === 2 && (
                <Form {...otpForm}>
                  <form
                    className="space-y-4"
                    onSubmit={otpForm.handleSubmit(handleVerifyOtp)}
                  >
                    <FormField
                      control={otpForm.control}
                      name="otp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>One-Time OTP</FormLabel>
                          <FormControl>
                            <InputOTP maxLength={OTP_LENGTH} {...field}>
                              <InputOTPGroup className="flex w-full justify-between gap-2">
                                {[...Array(OTP_LENGTH)].map((_, idx) => (
                                  <InputOTPSlot
                                    key={idx}
                                    index={idx}
                                    className="w-12 h-12 text-center text-xl border rounded-md"
                                  />
                                ))}
                              </InputOTPGroup>
                            </InputOTP>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {timer > 0
                          ? `OTP expires in ${formatTimer(timer)}`
                          : "OTP expired"}
                      </span>
                      {timer === 0 && (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => handleSendOtp()}
                          disabled={loading}
                        >
                          Resend OTP
                        </Button>
                      )}
                    </div>
                    {msg && <div className="text-green-600 text-sm">{msg}</div>}
                    {error && (
                      <div className="text-red-600 text-sm">{error}</div>
                    )}
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={
                        loading ||
                        otpForm.watch("otp").length !== OTP_LENGTH ||
                        timer === 0
                      }
                    >
                      {loading ? "Verifying..." : "Verify OTP"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full"
                      onClick={() => setStep(1)}
                      disabled={loading}
                    >
                      Back
                    </Button>
                  </form>
                </Form>
              )}
              {step === 3 && (
                <form className="space-y-4" onSubmit={handleResetPassword}>
                  <Input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                  />
                  {msg && <div className="text-green-600 text-sm">{msg}</div>}
                  {error && <div className="text-red-600 text-sm">{error}</div>}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Resetting..." : "Reset Password"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <img
        className="h-full w-full object-cover pointer-events-none"
        src="/forget-password.png"
        alt="AdLoot - The next-gen ad network connecting advertisers with high-converting global traffic"
      />
    </section>
  );
};

export default ForgetPassword;
