/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  Copy,
  Edit,
  Trash,
  Plus,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import PromotionModal from "@/components/dashboard/PromotionModal";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import api from "@/lib/axios";
import { useUser } from "@/contexts/UserContext";
import { IApp } from "./MyAppsPage";

export interface Promotion {
  id: string;
  status: "active" | "complete";
  multiplier: string;
  name: string;
  start: string;
  end: string;
}

export default function AppSettings() {
  const { user } = useUser();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const [activeTab, setActiveTab] = useState("general");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    platform: "",
    websiteUrl: "",
    apiKey: "",
    currencyNameSingular: "",
    currencyNamePlural: "",
    currencyValue: "1000",
    splitPercentage: "50",
    currencyRounding: "no-decimals",
    postbackUrl: "",
    postbackSecret: "",
    maxRetries: "3",
    primaryColor: "#9b87f5",
    secondaryColor: "#7E69AB",
    mobileText: "",
    logo: null,
    currencyIcon: null,
    logo_url: "",
    currency_icon_url: "",
  });
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [calculatedReward, setCalculatedReward] = useState("0");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currencyIconRef = useRef<HTMLInputElement>(null);

  // New state for promotion modal
  const [promotionModalOpen, setPromotionModalOpen] = useState(false);
  const [currentPromotion, setCurrentPromotion] = useState<any>(null);

  // Add new state for validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Add new state for confirmation dialog
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // If currency value or split percentage changes, recalculate the reward
    if (name === "currencyValue" || name === "splitPercentage") {
      calculateCurrencyReward(
        name === "currencyValue" ? value : formData.currencyValue,
        name === "splitPercentage" ? value : formData.splitPercentage
      );
    }
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const calculateCurrencyReward = (
    currencyValue: string,
    splitPercentage: string
  ) => {
    const value = parseFloat(currencyValue) || 0;
    const percentage = parseFloat(splitPercentage) || 0;

    // Formula: currencyValue * (splitPercentage / 100) = reward for $1 USD
    const calculatedValue = value * (percentage / 100);

    // Apply rounding based on the selected rounding option
    let roundedValue = calculatedValue;
    if (formData.currencyRounding === "no-decimals") {
      roundedValue = Math.round(calculatedValue);
    } else if (formData.currencyRounding === "one-decimal") {
      roundedValue = Math.round(calculatedValue * 10) / 10;
    } else if (formData.currencyRounding === "two-decimals") {
      roundedValue = Math.round(calculatedValue * 100) / 100;
    }

    setCalculatedReward(roundedValue.toString());
  };

  // Add validation functions for each tab
  const validateGeneralTab = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "App name is required";
    if (!formData.platform) newErrors.platform = "Platform is required";
    if (!formData.websiteUrl) newErrors.websiteUrl = "Website URL is required";
    if (!formData.mobileText)
      newErrors.mobileText = "Mobile Offerwall Top Text is required";
    if (!formData.description)
      newErrors.description = "Description is required";

    return newErrors;
  };

  const validateCurrencyTab = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.currencyNameSingular)
      newErrors.currencyNameSingular = "Currency Name (Singular) is required";
    if (!formData.currencyNamePlural)
      newErrors.currencyNamePlural = "Currency Name (Plural) is required";
    if (!formData.currencyValue)
      newErrors.currencyValue = "Currency Value is required";
    if (!formData.splitPercentage)
      newErrors.splitPercentage = "Split Percentage is required";
    if (!formData.currencyRounding)
      newErrors.currencyRounding = "Currency Rounding is required";

    return newErrors;
  };

  const validatePostbackTab = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.postbackUrl)
      newErrors.postbackUrl = "Postback URL is required";
    if (!formData.maxRetries)
      newErrors.maxRetries = "Maximum Postback Retries is required";

    return newErrors;
  };

  const validateDesignTab = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.primaryColor)
      newErrors.primaryColor = "Primary Color is required";
    if (!formData.secondaryColor)
      newErrors.secondaryColor = "Secondary Color is required";

    return newErrors;
  };

  const validateCurrentTab = () => {
    switch (activeTab) {
      case "general":
        return validateGeneralTab();
      case "currency":
        return validateCurrencyTab();
      case "postback":
        return validatePostbackTab();
      case "design":
        return validateDesignTab();
      default:
        return {};
    }
  };

  const getNextTab = (currentTab: string) => {
    const tabOrder = [
      "general",
      "currency",
      "postback",
      "design",
      "api",
      "promotions",
    ];
    const currentIndex = tabOrder.indexOf(currentTab);
    return tabOrder[currentIndex + 1];
  };

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateCurrentTab();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      const nextTab = getNextTab(activeTab);
      if (nextTab) {
        setActiveTab(nextTab);
      } else {
        // If we're on the last tab, handle the form submission
        await handleSubmit(e);
      }
    }
  };

  // Add the getTabForField function before handleSubmit
  const getTabForField = (field: string): string => {
    const tabMapping: Record<string, string> = {
      name: "general",
      platform: "general",
      category: "general",
      currencyNameSingular: "currency",
      currencyNamePlural: "currency",
      currencyValue: "currency",
      postbackUrl: "postback",
      postbackSecret: "postback",
      maxRetries: "postback",
      primaryColor: "design",
      secondaryColor: "design",
      mobileText: "design",
    };
    return tabMapping[field] || "general";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    // Validate form
    const validationErrors: Record<string, string> = {};
    if (!formData.platform) validationErrors.platform = "Platform is required";
    if (!formData.currencyNameSingular)
      validationErrors.currencyNameSingular =
        "Currency name (singular) is required";
    if (!formData.currencyNamePlural)
      validationErrors.currencyNamePlural =
        "Currency name (plural) is required";
    if (!formData.currencyValue)
      validationErrors.currencyValue = "Currency value is required";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstErrorField = Object.keys(validationErrors)[0];
      setActiveTab(getTabForField(firstErrorField));
      return;
    }
    setLoading(true);
    const data = new FormData();
    data.append("name", formData?.name || "");
    data.append("platform", formData?.platform || "");
    data.append("website_url", formData?.websiteUrl || "");
    data.append("top_text", formData?.mobileText || "");
    data.append("description", formData?.description || "");
    data.append("currency_name_singular", formData?.currencyNameSingular || "");
    data.append("currency_name_plural", formData?.currencyNamePlural || "");
    data.append("conversion_rate", formData?.currencyValue || "");
    data.append("split_to_user", formData?.splitPercentage || "");
    data.append("currency_reward_rounding", formData?.currencyRounding || "");
    data.append("postback_url", formData?.postbackUrl || "");
    data.append("postback_secret", formData?.postbackSecret || "");
    data.append("postback_retries", formData?.maxRetries || "");
    data.append("design_primary_color", formData?.primaryColor || "");
    data.append("design_secondary_color", formData?.secondaryColor || "");
    data.append("api_key", formData?.apiKey || "");
    data.append("promotion", JSON.stringify(promotions));
    if (formData?.logo instanceof File) {
      data.append("logo", formData?.logo);
    }
    if (formData?.currencyIcon instanceof File) {
      data.append("currency_logo", formData?.currencyIcon);
    }

    if (user?.role === "admin" && userId) {
      data.append("userId", userId);
    }

    try {
      const response = id
        ? await api.put(`/${user?.role}/app/${id}`, data, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
        : await api.post(`/${user?.role}/app`, data, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
      if (response.status === 201 || response.status === 200) {
        navigate(-1);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error creating app, try again later!"
      );
    } finally {
      setLoading(false);
    }
  };

  // Update the currency icon input change handler
  const handleCurrencyIconChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        currencyIcon: e.target.files[0],
      });
    }
  };

  // Update the logo input change handler
  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        logo: e.target.files[0],
      });
    }
  };

  const resetPostbackSecret = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let newSecret = "";
    for (let i = 0; i < 64; i++) {
      newSecret += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    setFormData({
      ...formData,
      postbackSecret: newSecret,
    });
    toast.success("Postback secret reset successfully");
  };

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success(message);
      })
      .catch(() => {
        toast.error("Failed to copy to clipboard");
      });
  };

  const addPromotion = () => {
    setCurrentPromotion(null);
    setPromotionModalOpen(true);
  };

  const editPromotion = (promotion: any, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any default behavior
    e.stopPropagation(); // Stop event propagation
    setCurrentPromotion(promotion);
    setPromotionModalOpen(true);
  };

  const deletePromotion = async (promotionId: string | number) => {
    setPromotions((prev) => prev.filter((p) => p.id !== promotionId));
  };

  // Update the handleRegenerateApiKey function
  const handleRegenerateApiKey = async () => {
    const newApiKey = crypto.randomUUID();
    setFormData((prev) => ({
      ...prev,
      apiKey: newApiKey,
    }));
  };

  // Add a helper function to format dates properly
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return ""; // Invalid date
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "";
    }
  };

  const handleButtonClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (activeTab === "promotions") {
      await handleSubmit(e);
    } else {
      await handleNext(e);
    }
  };

  const fetchApp = async () => {
    try {
      const response = await api.get(`/${user?.role}/apps/${id}`);
      const app: IApp = response?.data?.data?.app;
      setFormData({
        name: app?.name,
        description: app?.description,
        platform: app?.platform,
        websiteUrl: app?.website_url,
        apiKey: app?.api_key,
        currencyNameSingular: app?.currency_name_singular,
        currencyNamePlural: app?.currency_name_plural,
        currencyValue: app?.conversion_rate,
        splitPercentage: app?.split_to_user,
        currencyRounding: app?.currency_reward_rounding,
        postbackUrl: app?.postback_url,
        postbackSecret: app?.postback_secret,
        maxRetries: app?.postback_retries?.toString(),
        primaryColor: app?.design_primary_color,
        secondaryColor: app?.design_secondary_color,
        mobileText: app?.top_text,
        logo: null,
        currencyIcon: null,
        logo_url: app?.logo,
        currency_icon_url: app?.currency_logo,
      });
      setPromotions(app?.promotion);
    } catch (error: any) {
      console.error("Error fetching campaigns:", error);
    }
  };

  useEffect(() => {
    if (!id) {
      return;
    }
    fetchApp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSavePromotion = (newPromotion: Promotion) => {
    setPromotions((prevPromos) => {
      // If new promotion is active, set all others to "complete"
      let updatedPromos = prevPromos.map((promo) =>
        newPromotion.status === "active"
          ? { ...promo, status: "complete" as const }
          : promo
      );

      // If editing, replace; if new, add
      const exists = updatedPromos.find((p) => p.id === newPromotion.id);
      if (exists) {
        updatedPromos = updatedPromos.map((p) =>
          p.id === newPromotion.id ? newPromotion : p
        );
      } else {
        updatedPromos = [...updatedPromos, newPromotion];
      }

      return updatedPromos;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">
            {isEditMode ? formData.name || "Edit App" : "Create New App"}
          </h1>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
        defaultValue="general"
      >
        <TabsList className="mb-6 w-full flex overflow-x-auto">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="currency">Currency</TabsTrigger>
          <TabsTrigger value="postback">Postback</TabsTrigger>
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="promotions">Promotions</TabsTrigger>
        </TabsList>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (activeTab === "promotions") {
              handleSubmit(e);
            } else {
              handleNext(e);
            }
          }}
          className="space-y-6"
        >
          <TabsContent value="general">
            <Card className="border-border bg-background dark:bg-background">
              <CardHeader>
                <CardTitle className="text-xl">General</CardTitle>
                <CardDescription>
                  Tell us about your app or placement.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {user?.role === "admin" && !id && (
                    <div className="grid gap-2">
                      <Label htmlFor="userId">User Id (Optional)</Label>
                      <Input
                        id="userId"
                        name="userId"
                        placeholder="Enter user id"
                        value={userId}
                        onChange={(e) => setUserId(e.target?.value)}
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      App Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter app name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && (
                      <Alert variant="destructive" className="mt-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{errors.name}</AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="platform" className="text-sm font-medium">
                      Platform <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        handleSelectChange(value, "platform")
                      }
                      value={formData.platform}
                    >
                      <SelectTrigger
                        id="platform"
                        className={errors.platform ? "border-red-500" : ""}
                      >
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={"both"}>Desktop/Mobile</SelectItem>
                        <SelectItem value={"desktop"}>Desktop</SelectItem>
                        <SelectItem value={"mobile"}>Mobile</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.platform && (
                      <Alert variant="destructive" className="mt-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{errors.platform}</AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="websiteUrl" className="text-sm font-medium">
                      Website URL <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="websiteUrl"
                      name="websiteUrl"
                      placeholder="https://example.com/"
                      value={formData.websiteUrl}
                      onChange={handleInputChange}
                      required
                      className={errors.websiteUrl ? "border-red-500" : ""}
                    />
                    {errors.websiteUrl && (
                      <Alert variant="destructive" className="mt-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{errors.websiteUrl}</AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobileText" className="text-sm font-medium">
                      Mobile Offerwall Top Text
                    </Label>
                    <Input
                      id="mobileText"
                      name="mobileText"
                      placeholder="Earn Points"
                      value={formData.mobileText}
                      onChange={handleInputChange}
                      className={errors.mobileText ? "border-red-500" : ""}
                    />
                    {errors.mobileText && (
                      <Alert variant="destructive" className="mt-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{errors.mobileText}</AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="description"
                      className="text-sm font-medium"
                    >
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="App description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className={errors.description ? "border-red-500" : ""}
                    />
                    {errors.description && (
                      <Alert variant="destructive" className="mt-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          {errors.description}
                        </AlertDescription>
                      </Alert>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Describe your application.
                    </p>
                  </div>

                  {isEditMode && (
                    <>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Integration Link
                        </Label>
                        <div className="flex items-center relative">
                          <Input
                            value={`${
                              import.meta.env.VITE_BASE_URL
                            }/wall?placementID=${
                              formData.apiKey
                            }&sid={USER_ID}`}
                            readOnly
                            className="pr-10 font-mono text-sm"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0"
                            onClick={() =>
                              copyToClipboard(
                                `${
                                  import.meta.env.VITE_BASE_URL
                                }/wall?placementID=${
                                  formData.apiKey
                                }&sid={USER_ID}`,
                                "Integration link copied to clipboard"
                              )
                            }
                          >
                            <Copy size={16} />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {`Replace {USER_ID} with the user Id on your system who is visiting the offerwall.`}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Integration iFrame
                        </Label>
                        <div className="flex items-center relative">
                          <Input
                            value={`<iframe title="Adloot Offer Wall" allow="clipboard-write" src="${
                              import.meta.env.VITE_BASE_URL
                            }/wall?placementID=${
                              formData.apiKey
                            }&sid={USER_ID}" />`}
                            readOnly
                            className="pr-10 font-mono text-sm"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0"
                            onClick={() =>
                              copyToClipboard(
                                `<iframe title="Adloot Offer Wall" allow="clipboard-write" src="${
                                  import.meta.env.VITE_BASE_URL
                                }/wall?placementID=${
                                  formData.apiKey
                                }&sid={USER_ID}" />`,
                                "iFrame code copied to clipboard"
                              )
                            }
                          >
                            <Copy size={16} />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {`Replace {USER_ID} with the user Id on your system who is visiting the offerwall.`}
                        </p>
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="logo" className="text-sm font-medium">
                      Upload your Logo (Optional)
                    </Label>
                    <div className="mt-1 flex flex-col gap-4">
                      {/* Show existing logo if available */}
                      {isEditMode &&
                        formData.logo_url &&
                        !(formData.logo instanceof File) && (
                          <div className="flex items-center gap-4">
                            <img
                              src={formData.logo_url}
                              alt="Current logo"
                              className="w-16 h-16 object-contain rounded border border-border"
                            />
                            <span className="text-sm text-muted-foreground">
                              Current logo
                            </span>
                          </div>
                        )}
                      <div className="flex items-center">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          {isEditMode ? "Change logo" : "Choose file"}
                        </Button>
                        <span className="ml-3 text-sm text-muted-foreground">
                          {formData.logo instanceof File
                            ? formData.logo.name
                            : "No file chosen"}
                        </span>
                        <input
                          ref={fileInputRef}
                          type="file"
                          id="logo"
                          accept="image/*"
                          className="hidden"
                          onChange={handleLogoChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="currency">
            <Card className="border-border bg-background dark:bg-background">
              <CardHeader>
                <CardTitle className="text-xl">Currency</CardTitle>
                <CardDescription>
                  Let us know which virtual currency you would like to reward
                  your users with. You can upload your currency icon under the
                  Design tab.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="currencyNameSingular"
                      className="text-sm font-medium"
                    >
                      Currency Name (Singular) - (Max: 10 Characters){" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="currencyNameSingular"
                      name="currencyNameSingular"
                      placeholder="Point"
                      value={formData.currencyNameSingular}
                      onChange={handleInputChange}
                      required
                      maxLength={10}
                      className={
                        errors.currencyNameSingular ? "border-red-500" : ""
                      }
                    />
                    {errors.currencyNameSingular && (
                      <Alert variant="destructive" className="mt-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          {errors.currencyNameSingular}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="currencyNamePlural"
                      className="text-sm font-medium"
                    >
                      Currency Name (Plural) - (Max: 10 Characters){" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="currencyNamePlural"
                      name="currencyNamePlural"
                      placeholder="Points"
                      value={formData.currencyNamePlural}
                      onChange={handleInputChange}
                      required
                      maxLength={10}
                      className={
                        errors.currencyNamePlural ? "border-red-500" : ""
                      }
                    />
                    {errors.currencyNamePlural && (
                      <Alert variant="destructive" className="mt-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          {errors.currencyNamePlural}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="currencyValue"
                      className="text-sm font-medium"
                    >
                      Pre-split Currency Conversion Rate{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex items-center">
                      <Input
                        id="currencyValue"
                        name="currencyValue"
                        placeholder="1000"
                        value={formData.currencyValue}
                        onChange={handleInputChange}
                        required
                        type="number"
                        className={`flex-1 ${
                          errors.currencyValue ? "border-red-500" : ""
                        }`}
                      />
                      <span className="px-3">$</span>
                    </div>
                    {errors.currencyValue && (
                      <Alert variant="destructive" className="mt-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          {errors.currencyValue}
                        </AlertDescription>
                      </Alert>
                    )}
                    <p className="text-sm text-muted-foreground">
                      The amount of your currency that equals $1.00 USD, prior
                      to revenue being split between you (in USD) and the user
                      (in your placement's currency).
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="splitPercentage"
                      className="text-sm font-medium"
                    >
                      Currency Split to User (%){" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex items-center">
                      <Input
                        id="splitPercentage"
                        name="splitPercentage"
                        placeholder="40"
                        value={formData.splitPercentage}
                        onChange={handleInputChange}
                        required
                        type="number"
                        className={`flex-1 ${
                          errors.splitPercentage ? "border-red-500" : ""
                        }`}
                      />
                      <span className="px-3">%</span>
                    </div>
                    {errors.splitPercentage && (
                      <Alert variant="destructive" className="mt-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          {errors.splitPercentage}
                        </AlertDescription>
                      </Alert>
                    )}
                    <p className="text-sm text-muted-foreground">
                      This is the percentage of revenue that should be given to
                      users in the form of your placement's currency. The
                      remaining percentage is your cut.
                    </p>
                  </div>

                  <div className="bg-secondary/30 p-5 rounded-lg space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="text-lg font-medium">
                        <span className="text-green-500">
                          {formData.currencyValue || "1000"}{" "}
                          {formData.currencyNamePlural || "Currency"}
                        </span>
                      </div>
                      <div className="text-xl font-medium">=</div>
                      <div className="text-lg font-medium">
                        <div className="flex flex-col items-end">
                          <span className="text-sm text-muted-foreground">
                            An offer worth $1.00 USD credits users:
                          </span>
                          <span className="text-purple-500 font-bold">
                            {calculatedReward}{" "}
                            {formData.currencyNamePlural || "Currency"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="currencyRounding"
                      className="text-sm font-medium"
                    >
                      Currency Reward Rounding{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        handleSelectChange(value, "currencyRounding")
                      }
                      value={formData.currencyRounding}
                    >
                      <SelectTrigger
                        id="currencyRounding"
                        className={
                          errors.currencyRounding ? "border-red-500" : ""
                        }
                      >
                        <SelectValue placeholder="Default - Round decimal points up to two places" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no-decimals">No decimals</SelectItem>
                        <SelectItem value="one-decimal">
                          1 decimal place
                        </SelectItem>
                        <SelectItem value="two-decimals">
                          2 decimal places
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.currencyRounding && (
                      <Alert variant="destructive" className="mt-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          {errors.currencyRounding}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="postback">
            <Card className="border-border bg-background dark:bg-background">
              <CardHeader>
                <CardTitle className="text-xl">Postback Settings</CardTitle>
                <CardDescription>
                  Add a postback URL that contains the parameters below, as
                  needed, to receive notifications on your server every time
                  this placement receives a conversion. This is necessary for
                  you to be able to provide your users with rewards.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="postbackUrl"
                      className="text-sm font-medium"
                    >
                      Postback URL <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="postbackUrl"
                      name="postbackUrl"
                      placeholder="https://example.com/api/postback/Adloot?userId={userId}&currencyReward={currencyReward}"
                      value={formData.postbackUrl}
                      onChange={handleInputChange}
                      required
                      className={`font-mono text-sm ${
                        errors.postbackUrl ? "border-red-500" : ""
                      }`}
                    />
                    {errors.postbackUrl && (
                      <Alert variant="destructive" className="mt-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          {errors.postbackUrl}
                        </AlertDescription>
                      </Alert>
                    )}
                    <p className="text-sm text-muted-foreground">
                      We expect a response body from your server of "1" for a
                      successful postback and "0" for a failed postback. If you
                      do not implement this rule, our system thinks there was an
                      issue sending the postback and might retry.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="postbackSecret"
                      className="text-sm font-medium"
                    >
                      Postback Secret
                    </Label>
                    <div className="flex relative">
                      <Input
                        id="postbackSecret"
                        name="postbackSecret"
                        value={formData.postbackSecret}
                        readOnly
                        className="pr-16 font-mono text-sm overflow-x-auto"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0"
                        onClick={() =>
                          copyToClipboard(
                            formData.postbackSecret,
                            "Postback secret copied to clipboard"
                          )
                        }
                      >
                        <Copy size={16} />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Used during the hashing process to verify a postback is
                      actually coming from our system. Please do not share this
                      value.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      className="text-sm"
                      onClick={resetPostbackSecret}
                    >
                      If you believe your postback secret has been compromised,
                      you can reset it by clicking here.
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxRetries" className="text-sm font-medium">
                      Maximum Postback Retries
                    </Label>
                    <Input
                      id="maxRetries"
                      name="maxRetries"
                      placeholder="3"
                      value={formData.maxRetries}
                      onChange={handleInputChange}
                      type="number"
                      min="0"
                      max="5"
                      className={errors.maxRetries ? "border-red-500" : ""}
                    />
                    {errors.maxRetries && (
                      <Alert variant="destructive" className="mt-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{errors.maxRetries}</AlertDescription>
                      </Alert>
                    )}
                    <p className="text-sm text-muted-foreground">
                      If a postback request fails, we will continue to send
                      identical postback requests up until this amount. (min of
                      0, max of {formData.maxRetries})
                    </p>
                  </div>

                  <div className="space-y-3 mt-6">
                    <h3 className="font-medium">
                      By default, no parameters are appended to your Postback
                      URL when it is called. Instead, you can use any of the
                      following parameter macros to sub data into your Postback
                      URL as needed:
                    </h3>
                    <h3 className="font-medium">Required:</h3>
                    <ul className="space-y-2 list-disc ml-6">
                      <li>
                        <strong>{"{user_id}"}</strong> (String) - Unique ID of
                        the user to be credited (used to identify the user in
                        your system).
                      </li>
                      <li>
                        <strong>{"{reward}"}</strong> (Float) - The amount of
                        virtual currency or points to reward the user (e.g.,
                        0.50).
                      </li>
                      <li>
                        <strong>{"{transaction_id}"}</strong> (String) - Unique
                        identifier for the transaction (to prevent duplicate
                        rewards).
                      </li>
                      <li>
                        <strong>{"{offer_id}"}</strong> (String) - Identifier of
                        the offer completed by the user.
                      </li>
                      <li>
                        <strong>{"{status}"}</strong> (String) - Status of the
                        conversion. Typically "approved" or "completed".
                      </li>
                    </ul>

                    <h3 className="font-medium">Optional:</h3>
                    <ul className="space-y-2 list-disc ml-6">
                      <li>
                        <strong>{"{ip}"}</strong> (String) - IP address of the
                        user when the offer was completed.
                      </li>
                      <li>
                        <strong>{"{device}"}</strong> (String) - Device type
                        (e.g., mobile, desktop).
                      </li>
                      <li>
                        <strong>{"{payout}"}</strong> (Float) - The advertiser
                        payout for the completed offer (for analytics/profit
                        margin).
                      </li>
                      <li>
                        <strong>{"{country}"}</strong> (String) - Country code
                        (e.g., US, IN, FR) where the offer was completed.
                      </li>
                      <li>
                        <strong>{"{event_time}"}</strong> (String) - ISO8601
                        timestamp when the event occurred (e.g.,
                        2025-05-28T14:30:00Z).
                      </li>
                      <li>
                        <strong>{"{currency}"}</strong> (String) - Currency code
                        for payout (e.g., USD).
                      </li>
                      <li>
                        <strong>{"{offer_name}"}</strong> (String) - Name or
                        title of the offer completed.
                      </li>
                    </ul>
                    <p>
                      <strong>Sample:</strong>{" "}
                      https://yourdomain.com/postback?user_id=12345&reward=0.75&transaction_id=abc123&offer_id=offer789&status=approved&sub1=campaign123&payout=1.00&country=US
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="design">
            <Card className="border-border bg-background dark:bg-background">
              <CardHeader>
                <CardTitle className="text-xl">Design</CardTitle>
                <CardDescription>
                  Customize the look and feel of your offerwall.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="primaryColor"
                      className="text-sm font-medium"
                    >
                      Primary Color
                    </Label>
                    <div className="flex items-center space-x-4">
                      <div
                        className="w-10 h-10 rounded border border-border"
                        style={{ backgroundColor: formData.primaryColor }}
                      />
                      <Input
                        id="primaryColor"
                        name="primaryColor"
                        type="text"
                        value={formData.primaryColor}
                        onChange={handleInputChange}
                        className={`flex-1 ${
                          errors.primaryColor ? "border-red-500" : ""
                        }`}
                      />
                    </div>
                    {errors.primaryColor && (
                      <Alert variant="destructive" className="mt-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          {errors.primaryColor}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="secondaryColor"
                      className="text-sm font-medium"
                    >
                      Secondary Color
                    </Label>
                    <div className="flex items-center space-x-4">
                      <div
                        className="w-10 h-10 rounded border border-border"
                        style={{ backgroundColor: formData.secondaryColor }}
                      />
                      <Input
                        id="secondaryColor"
                        name="secondaryColor"
                        type="text"
                        value={formData.secondaryColor}
                        onChange={handleInputChange}
                        className={`flex-1 ${
                          errors.secondaryColor ? "border-red-500" : ""
                        }`}
                      />
                    </div>
                    {errors.secondaryColor && (
                      <Alert variant="destructive" className="mt-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          {errors.secondaryColor}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Currency Icon</Label>
                    <div className="border-2 border-dashed rounded-lg p-12 text-center border-border">
                      <div className="flex flex-col items-center justify-center gap-4">
                        {/* Show existing currency icon if available */}
                        {isEditMode &&
                          formData.currency_icon_url &&
                          !(formData.currencyIcon instanceof File) && (
                            <div className="flex flex-col items-center gap-2">
                              <img
                                src={formData.currency_icon_url}
                                alt="Current currency icon"
                                className="w-16 h-16 object-contain rounded border border-border"
                              />
                              <span className="text-sm text-muted-foreground">
                                Current currency icon
                              </span>
                            </div>
                          )}
                        <p className="text-lg text-muted-foreground">
                          {isEditMode
                            ? "Upload new currency icon"
                            : "Upload your currency icon"}
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          className="mt-4"
                          onClick={() => currencyIconRef.current?.click()}
                        >
                          {isEditMode ? "Change icon" : "Choose file"}
                        </Button>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {formData.currencyIcon instanceof File
                            ? formData.currencyIcon.name
                            : "No file chosen"}
                        </p>
                      </div>
                      <input
                        ref={currencyIconRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleCurrencyIconChange}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api">
            <Card className="border-border bg-background dark:bg-background">
              <CardHeader>
                <CardTitle className="text-xl">Adloot Offers API V2</CardTitle>
                <CardDescription>
                  Programmatically pull our offer list and display them on your
                  website, app, or game.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">API Base URL</Label>
                    <div className="p-2 bg-muted rounded font-mono text-sm">
                      POST https://api.adloot.com/api/v2/offers/get
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">API Key</Label>
                    <div className="flex relative">
                      <Input
                        value={formData.apiKey}
                        readOnly
                        className="pr-16 font-mono text-sm"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0"
                        onClick={() =>
                          copyToClipboard(
                            formData.apiKey,
                            "Placement ID copied to clipboard"
                          )
                        }
                      >
                        <Copy size={16} />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      This is your unique identifier used for both API access
                      and placement identification.
                    </p>
                  </div>

                  <Button
                    type="button"
                    className="flex items-center gap-2"
                    onClick={handleRegenerateApiKey}
                  >
                    Generate Key
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    {id
                      ? "Regenerating your key will invalidate your current one and affect both API access and placement identification."
                      : "Generate a unique key for your application's API access and placement identification."}
                  </p>

                  <div className="space-y-4 mt-6">
                    <h3 className="text-lg font-medium">Use Cases</h3>
                    <p className="text-muted-foreground">
                      The Adloot Offers API supports a wide variety of use
                      cases, including:
                    </p>

                    <ul className="space-y-2 list-disc ml-6 text-muted-foreground">
                      <li>Building custom offerwalls</li>
                      <li>
                        Integrating offers into your game or app experience
                      </li>
                      <li>Creating your own admin dashboards</li>
                      <li>Filtering and displaying only specific offers</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="promotions">
            <Card className="border-border bg-background dark:bg-background">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Promotions</CardTitle>
                  <CardDescription>
                    Create special promotions for your users
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  onClick={addPromotion}
                  className="flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add Promotion
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {promotions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No promotions yet. Create your first promotion!</p>
                    </div>
                  ) : (
                    promotions?.map((promotion) => (
                      <div
                        key={promotion.id}
                        className="border rounded-md p-4 space-y-3 border-border bg-card"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{promotion?.name}</h3>
                            <Badge
                              variant={
                                promotion.status === "active"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {promotion.status === "active"
                                ? "Active"
                                : "Completed"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => editPromotion(promotion, e)}
                            >
                              <Edit size={16} />
                            </Button>
                            {/* <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                deletePromotion(promotion.id);
                              }}
                            >
                              <Trash size={16} />
                            </Button> */}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Start Date:</p>
                            <p>{formatDate(promotion.start)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">End Date:</p>
                            <p>{formatDate(promotion.end)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <p className="text-sm text-muted-foreground">
                            Earning multiplier:
                          </p>
                          <Badge
                            variant="outline"
                            className="bg-purple-500/10 text-purple-500 border-purple-500/20"
                          >
                            {promotion.multiplier}x
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <div className="flex justify-end pt-4">
            <Button
              onClick={handleButtonClick}
              className="flex items-center gap-2"
              size="lg"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {activeTab === "promotions"
                ? isEditMode
                  ? "Update App"
                  : "Create App"
                : "Next"}
            </Button>
          </div>
        </form>
      </Tabs>

      <PromotionModal
        open={promotionModalOpen}
        onOpenChange={setPromotionModalOpen}
        promotion={currentPromotion}
        currencyNamePlural={formData.currencyNamePlural || "Points"}
        onSave={handleSavePromotion}
      />

      {/* Add the confirmation dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm App Changes</AlertDialogTitle>
            <AlertDialogDescription>
              Your changes will put the app in a pending state until approved by
              an admin. During this time, your app will stop working with its
              current settings.
              <br />
              <br />
              Do you want to proceed with these changes?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setShowConfirmDialog(false);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction>Submit Changes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
