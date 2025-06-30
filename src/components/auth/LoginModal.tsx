import { useAuthModal } from "@/contexts/AuthModalContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { useUser } from "@/contexts/UserContext";
import type { AxiosError } from "axios";
import { setCookie } from "nookies";
import { useNavigate } from "react-router-dom";

export default function LoginModal() {
  const { isLoginOpen, closeLogin, openSignup } = useAuthModal();
  const { setUser } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post("/auth/login", { email, password });

      if (response.status === 200) {
        const data = response.data;
        closeLogin();
        toast.success("Welcome back!");
        const userData = data.data.user;

        const expiresAt = data.data.expiresAt; // e.g. "2024-06-15T12:34:56.000Z"

        setCookie(null, "session", data.data.token, {
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax",
          path: "/",
          expires: new Date(expiresAt),
        });

        setUser({
          id: userData.id,
          email: userData.email,
          role: userData.role,
          full_name: userData.full_name,
          company_name: userData.company_name,
          website_or_app: userData.website_or_app,
          phone: userData.phone,
          country: userData.country,
          address: userData.address,
          city: userData.city,
          state_province: userData.state_province,
          status: userData.status,
        });

        // Use React Router navigation instead of window.location.href
        if (userData.role === "advertiser") {
          navigate("/advertiser/dashboard", { replace: true });
        } else if (userData.role === "publisher") {
          navigate("/publisher/dashboard", { replace: true });
        } else if (userData.role === "admin") {
          navigate("/admin/dashboard", { replace: true });
        }
      }
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const switchToSignup = () => {
    closeLogin();
    openSignup();
  };

  return (
    <Dialog open={isLoginOpen} onOpenChange={closeLogin}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-gray-900">
            Log in to AdLoot
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-900">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="transition-colors border-transparent focus:border-purple-600 focus:!ring-0 text-gray-900 bg-gray-100"
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-gray-900">
                Password
              </Label>
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto text-sm text-purple-600"
              >
                Forgot password?
              </Button>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="transition-colors border-transparent focus:border-purple-600 focus:!ring-0 text-gray-900 bg-gray-100"
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked === true)}
              className="bg-gray-200 text-purple-600 data-[state=checked]:bg-purple-600 data-[state=checked]:text-white"
            />
            <Label
              htmlFor="remember"
              className="text-sm font-normal text-gray-900"
            >
              Remember me
            </Label>
          </div>
          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Log in"}
          </Button>
          <div className="text-center text-sm text-gray-900">
            Don't have an account?{" "}
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto text-purple-600"
              onClick={switchToSignup}
            >
              Sign up
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
