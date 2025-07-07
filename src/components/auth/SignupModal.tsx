/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import toast from "react-hot-toast";
import SuccessModal from "./SuccessModal";
import api from "@/lib/axios";

export default function SignupModal() {
  const { isSignupOpen, closeSignup, openLogin, userType, setUserType } =
    useAuthModal();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    cPassword: "",
    companyName: "",
    website: "",
    phoneNumber: "",
  });
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const clearForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      cPassword: "",
      companyName: "",
      website: "",
      phoneNumber: "",
    });
    setAcceptTerms(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!acceptTerms) {
      toast.error("You must accept the terms and conditions to continue.");
      return;
    }

    if (formData.password !== formData.cPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        full_name: formData.name,
        email: formData.email,
        password: formData.password,
        cPassword: formData.cPassword,
        website: formData.website,
        phone: formData.phoneNumber,
        role: userType === "advertiser" ? "advertiser" : "publisher",
        ...(userType === "advertiser" && {
          company_name: formData.companyName,
        }),
      };

      const response = await api.post("/auth/register", payload);

      if (response.status === 201) {
        clearForm();
        setShowSuccess(true);
        closeSignup();
      } else {
        toast.error(response.data?.message || "Registration failed.");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    closeSignup();
  };

  const switchToLogin = () => {
    closeSignup();
    openLogin();
  };

  return (
    <Dialog open={isSignupOpen} onOpenChange={closeSignup}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-gray-900">
            Create your account
          </DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue={userType}
          className="w-full"
          onValueChange={(value) =>
            setUserType(value as "publisher" | "advertiser")
          }
        >
          <TabsList className="grid w-full grid-cols-2 mb-4 bg-gray-100 rounded-lg">
            <TabsTrigger value="publisher" className="rounded-lg">
              Publisher
            </TabsTrigger>
            <TabsTrigger value="advertiser" className="rounded-lg">
              Advertiser
            </TabsTrigger>
          </TabsList>

          <TabsContent value="publisher" className="mt-0">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-900">
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="transition-colors border-transparent focus:border-purple-600 focus:!ring-0 text-gray-900 bg-gray-100"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-900">
                  Work Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@company.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="transition-colors border-transparent focus:border-purple-600 focus:!ring-0 text-gray-900 bg-gray-100"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website" className="text-gray-900">
                  Website or App URL
                </Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  placeholder="https://yourwebsite.com"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="transition-colors border-transparent focus:border-purple-600 focus:!ring-0 text-gray-900 bg-gray-100"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-gray-900">
                  Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="transition-colors border-transparent focus:border-purple-600 focus:!ring-0 text-gray-900 bg-gray-100"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-900">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="transition-colors border-transparent focus:border-purple-600 focus:!ring-0 text-gray-900 bg-gray-100"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cPassword" className="text-gray-900">
                  Confirm Password
                </Label>
                <Input
                  id="cPassword"
                  name="cPassword"
                  type="password"
                  placeholder="Confirm Password"
                  value={formData.cPassword}
                  onChange={handleInputChange}
                  className="transition-colors border-transparent focus:border-purple-600 focus:!ring-0 text-gray-900 bg-gray-100"
                  required
                />
              </div>
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) =>
                    setAcceptTerms(checked === true)
                  }
                  className="bg-gray-200 text-purple-600 data-[state=checked]:bg-purple-600 data-[state=checked]:text-white"
                />
                <Label
                  htmlFor="terms"
                  className="text-sm font-normal leading-tight text-gray-900"
                >
                  I accept the{" "}
                  <Link
                    to="/terms"
                    className="text-purple-600 hover:underline"
                    onClick={closeSignup}
                  >
                    Terms and Conditions
                  </Link>{" "}
                  and Privacy Policy
                </Label>
              </div>
              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Sign up as Publisher"}
              </Button>
              <div className="text-center text-sm text-gray-900">
                Already have an account?{" "}
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto text-purple-600"
                  onClick={switchToLogin}
                >
                  Log in
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="advertiser" className="mt-0">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName" className="text-gray-900">
                  Company Name
                </Label>
                <Input
                  id="companyName"
                  name="companyName"
                  placeholder="Acme Inc."
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="transition-colors border-transparent focus:border-purple-600 focus:!ring-0 text-gray-900 bg-gray-100"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-adv" className="text-gray-900">
                  Work Email
                </Label>
                <Input
                  id="email-adv"
                  name="email"
                  type="email"
                  placeholder="you@company.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="transition-colors border-transparent focus:border-purple-600 focus:!ring-0 text-gray-900 bg-gray-100"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website-adv" className="text-gray-900">
                  Company Website
                </Label>
                <Input
                  id="website-adv"
                  name="website"
                  type="url"
                  placeholder="https://company.com"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="transition-colors border-transparent focus:border-purple-600 focus:!ring-0 text-gray-900 bg-gray-100"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber-adv" className="text-gray-900">
                  Phone Number
                </Label>
                <Input
                  id="phoneNumber-adv"
                  name="phoneNumber"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="transition-colors border-transparent focus:border-purple-600 focus:!ring-0 text-gray-900 bg-gray-100"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-adv" className="text-gray-900">
                  Password
                </Label>
                <Input
                  id="password-adv"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="transition-colors border-transparent focus:border-purple-600 focus:!ring-0 text-gray-900 bg-gray-100"
                  required
                  placeholder="Password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cPassword-adv" className="text-gray-900">
                  Confirm Password
                </Label>
                <Input
                  id="cPassword-adv"
                  name="cPassword"
                  type="password"
                  placeholder="Confirm Password"
                  value={formData.cPassword}
                  onChange={handleInputChange}
                  className="transition-colors border-transparent focus:border-purple-600 focus:!ring-0 text-gray-900 bg-gray-100"
                  required
                />
              </div>
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms-adv"
                  checked={acceptTerms}
                  onCheckedChange={(checked) =>
                    setAcceptTerms(checked === true)
                  }
                  className="bg-gray-200 text-purple-600 data-[state=checked]:bg-purple-600 data-[state=checked]:text-white"
                />
                <Label
                  htmlFor="terms-adv"
                  className="text-sm font-normal leading-tight text-gray-900"
                >
                  I accept the{" "}
                  <Link
                    to="/terms"
                    className="text-purple-600 hover:underline"
                    onClick={closeSignup}
                  >
                    Terms and Conditions
                  </Link>{" "}
                  and Privacy Policy
                </Label>
              </div>
              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Sign up as Advertiser"}
              </Button>
              <div className="text-center text-sm text-gray-900">
                Already have an account?{" "}
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto text-purple-600"
                  onClick={switchToLogin}
                >
                  Log in
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
      {showSuccess && (
        <SuccessModal
          isOpen={showSuccess}
          onClose={handleSuccessClose}
          title="Welcome to AdLoot!"
          description={`Your ${userType} account has been created successfully. Please check your email for verification instructions.`}
        />
      )}
    </Dialog>
  );
}
