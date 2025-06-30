/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import countries from "@/constants/countries.json";
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  Image,
  Smartphone,
  Target,
  Check,
  Plus,
  Minus,
  X,
  ChevronLeft,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { Calendar as UiCalendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import api from "@/lib/axios";
import { Campaign } from "./CampaignsPage";
import { useUser } from "@/contexts/UserContext";
import verticals from "@/constants/verticals.json";

export default function CreateCampaignPage() {
  const { user } = useUser();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<
    "details" | "targeting" | "payment" | "creative" | "events"
  >("details");
  const [campaignType, setCampaignType] = useState<"single" | "multi">(
    "single"
  );
  const [events, setEvents] = useState([
    {
      id: 1,
      name: "App Install",
      payout: "1.00",
      token: generateUniqueToken(),
    },
  ]);
  const [hasExpiry, setHasExpiry] = useState(false);
  const [notifications, setHasNotifications] = useState(true);
  const [expiryDate, setExpiryDate] = useState<Date | undefined>();
  const [userId, setUserId] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: boolean;
  }>({});
  const [payoutType, setPayoutType] = useState<"cpi" | "cpa" | "cpe">("cpi");
  const [formValues, setFormValues] = useState({
    name: "",
    previewUrl: "",
    trackingUrl: "",
    category: "",
    description: "",
    callToAction: "",
    notes: "",
    payout: "0",
    dailyCap: "0",
    monthlyCap: "0",
    totalCap: "0",
    dailyClickCap: "0",
    monthlyClickCap: "0",
    totalClickCap: "0",
    dailyRevenueCap: "0",
    monthlyRevenueCap: "0",
    totalRevenueCap: "0",
  });

  const [mainImage, setMainImage] = useState<File | null>(null);
  const [secondaryImage, setSecondaryImage] = useState<File | null>(null);
  const [existingMainImageUrl, setExistingMainImageUrl] = useState<
    string | null
  >(null);
  const [existingSecondaryImageUrl, setExistingSecondaryImageUrl] = useState<
    string | null
  >(null);
  const mainImageRef = useRef<HTMLInputElement>(null);
  const secondaryImageRef = useRef<HTMLInputElement>(null);
  const [targetingType, setTargetingType] = useState<"all" | "specific">(
    "specific"
  );
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);

  const steps = [
    {
      id: "details",
      title: "Campaign Details",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      id: "targeting",
      title: "Targeting",
      icon: <Target className="h-5 w-5" />,
    },
    {
      id: "payment",
      title: "Payment Options",
      icon: <Smartphone className="h-5 w-5" />,
    },
    ...(payoutType === "cpe"
      ? [{ id: "events", title: "Events", icon: <Check className="h-5 w-5" /> }]
      : []),
    { id: "creative", title: "Creative", icon: <Image className="h-5 w-5" /> },
  ];

  const currentStepIndex = steps.findIndex((step) => step.id === currentStep);

  const handleNext = () => {
    if (validateStep()) {
      const nextIndex = currentStepIndex + 1;
      if (nextIndex < steps.length) {
        setCurrentStep(
          steps[nextIndex].id as
            | "details"
            | "targeting"
            | "payment"
            | "creative"
            | "events"
        );
      }
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  const handlePrev = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(
        steps[prevIndex].id as
          | "details"
          | "targeting"
          | "payment"
          | "events"
          | "creative"
      );
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (payoutType === "cpi" && name === "payout") {
      // setEvents([
      //   {
      //     id: 1,
      //     name: "App Install",
      //     payout: value,
      //     token: generateUniqueToken(),
      //   },
      // ]);
    }
  };

  function generateUniqueToken() {
    return `tkn_${Math.random()
      .toString(36)
      .substring(2, 10)}_${Date.now().toString(36)}`;
  }

  const addEvent = () => {
    const newEvent = {
      id: events.length + 1,
      name: "",
      payout: "0.00",
      token: generateUniqueToken(),
    };
    setEvents([...events, newEvent]);
  };

  const removeEvent = (id: number) => {
    if (events.length <= 1) {
      toast.error("You need at least one event");
      return;
    }
    setEvents(events.filter((event) => event.id !== id));
  };

  const updateEventField = (id: number, field: string, value: string) => {
    setEvents(
      events?.map((event) =>
        event.id === id ? { ...event, [field]: value } : event
      )
    );
  };

  const validateStep = () => {
    const errors: { [key: string]: boolean } = {};

    switch (currentStep) {
      case "details":
        errors.campaignName = !formValues.name;
        errors.previewUrl = !formValues.previewUrl;
        errors.trackingUrl = !formValues.trackingUrl;
        break;
      case "targeting":
        errors.platforms = selectedPlatforms.length === 0;
        errors.devices = selectedDevices.length === 0;
        errors.countries =
          targetingType === "specific" && selectedCountries.length === 0;
        break;
      case "payment":
        errors.payout = !formValues.payout;
        errors.expiryDate = hasExpiry && !expiryDate;
        break;
      case "events":
        if (payoutType === "cpa" || payoutType === "cpe") {
          errors.eventName = events.some((event) => !event.name);
          errors.eventPayout = events.some(
            (event) => !event.payout || parseFloat(event.payout) <= 0
          );
        }
        break;
      case "creative":
        errors.description = !formValues.description;
        errors.callToAction = !formValues.callToAction;
        break;
    }

    setValidationErrors(errors);
    return (
      Object.keys(errors).length === 0 ||
      Object.values(errors).every((error) => !error)
    );
  };

  const onSubmit = async () => {
    if (formValues?.description === "" || formValues?.callToAction === "") {
      const errors: { [key: string]: boolean } = {};
      errors.description = !formValues.description;
      errors.callToAction = !formValues.callToAction;
      setValidationErrors(errors);
      return;
    }

    if (payoutType === "cpe") {
      const totalEventPayout = events?.reduce(
        (sum, event) => sum + Number(event.payout || 0),
        0
      );
      if (totalEventPayout !== Number(formValues.payout)) {
        toast.error(
          "Sum of all event payouts must equal the total payout, please adjust them to proceed."
        );
        return;
      }
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("campaign_name", formValues?.name || "");
    formData.append("preview_url", formValues?.previewUrl || "");
    formData.append("category", formValues?.category || "");
    formData.append("tracking_url", formValues?.trackingUrl || "");

    formData.append("platforms", JSON.stringify(selectedPlatforms));
    formData.append("devices", JSON.stringify(selectedDevices));

    formData.append("country_target_type", targetingType);
    formData.append("countries", JSON.stringify(selectedCountries));

    formData.append("payout_type", payoutType);
    formData.append("campaign_type", campaignType);

    // Append events only if CPI or CPE
    if (["cpe", "cpi"].includes(payoutType)) {
      formData.append("events_or_action", JSON.stringify(events));
    }
    formData.append("campaign_payout", formValues.payout || "");
    formData.append("daily_conversion_cap", formValues?.dailyCap || "");
    formData.append("monthly_conversion_cap", formValues?.monthlyCap || "");
    formData.append("overall_conversion_cap", formValues?.totalCap || "");

    formData.append("daily_click_cap", formValues?.dailyClickCap || "");
    formData.append("monthly_click_cap", formValues?.monthlyClickCap || "");
    formData.append("overall_click_cap", formValues?.totalClickCap || "");

    formData.append("daily_revenue_cap", formValues?.dailyRevenueCap || "");
    formData.append("monthly_revenue_cap", formValues?.monthlyRevenueCap || "");
    formData.append("overall_revenue_cap", formValues?.totalRevenueCap || "");

    formData.append("has_expiry", String(hasExpiry));
    if (hasExpiry) {
      formData.append("expiry_date", expiryDate?.toString() || "");
    }

    formData.append("description", formValues?.description || "");
    formData.append("call_to_action", formValues?.callToAction || "");
    formData.append("notifications", String(notifications));
    formData.append("notes", formValues?.notes || "");

    // Replace with actual image File objects if needed
    if (mainImage instanceof File) {
      formData.append("primary_image", mainImage);
    }
    if (secondaryImage instanceof File) {
      formData.append("secondary_image", secondaryImage);
    }

    if (user?.role === "admin" && userId) {
      formData.append("userId", userId);
    }

    try {
      const response = id
        ? await api.put(`/${user?.role}/campaign/${id}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
        : await api.post(`/${user?.role}/campaign`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

      if (response.status === 201 || response.status === 200) {
        navigate(-1);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Error creating campaign, try again later!"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchCampaign = async () => {
    try {
      const response = await api.get(`/${user?.role}/campaigns/${id}`);
      const campaign: Campaign = response?.data?.data?.campaign;
      setFormValues({
        name: campaign?.campaign_name,
        previewUrl: campaign?.preview_url,
        trackingUrl: campaign?.tracking_url,
        category: campaign?.category,
        description: campaign?.description,
        callToAction: campaign?.call_to_action,
        notes: campaign?.notes,
        payout: campaign?.campaign_payout,
        dailyCap: campaign?.daily_conversion_cap,
        monthlyCap: campaign?.monthly_conversion_cap,
        totalCap: campaign?.overall_conversion_cap,
        dailyClickCap: campaign?.daily_click_cap,
        monthlyClickCap: campaign?.monthly_click_cap,
        totalClickCap: campaign?.overall_click_cap,
        dailyRevenueCap: campaign?.daily_revenue_cap,
        monthlyRevenueCap: campaign?.monthly_revenue_cap,
        totalRevenueCap: campaign?.overall_revenue_cap,
      });
      setCampaignType(campaign?.campaign_type);
      setHasExpiry(campaign?.has_expiry);
      setHasNotifications(campaign?.notifications);
      setTargetingType(campaign?.country_target_type);
      setSelectedCountries(campaign?.countries);
      setSelectedPlatforms(campaign?.platforms);
      setSelectedDevices(campaign?.devices);
      setPayoutType(campaign?.payout_type);
      setEvents(
        campaign?.events_or_action || [
          {
            id: 1,
            name: "App Install",
            payout: "1.00",
            token: generateUniqueToken(),
          },
        ]
      );
      setExistingMainImageUrl(campaign?.primary_image);
      setExistingSecondaryImageUrl(campaign?.secondary_image);
      setExpiryDate(new Date(campaign?.expiry_date));
    } catch (error: any) {
      console.error("Error fetching campaigns:", error);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchCampaign();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <section>
      <Button
        variant="outline"
        className="flex items-center gap-1 mb-4"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Campaigns</span>
      </Button>

      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Set Up Your Campaign</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Progress bar */}
            <div className="relative mb-8">
              <div className="absolute top-1/2 h-0.5 w-full bg-gray-200 dark:bg-gray-700 -translate-y-3" />
              <div className="relative flex justify-between">
                {steps?.map((step, index) => (
                  <div key={step.id} className="flex flex-col items-center">
                    <div
                      className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 cursor-pointer
                        ${
                          currentStepIndex === index
                            ? "bg-primary text-primary-foreground border-primary"
                            : currentStepIndex > index
                            ? "bg-green-500 text-white border-green-500"
                            : "bg-background text-muted-foreground border-gray-300 dark:border-gray-600"
                        }`}
                      onClick={() =>
                        setCurrentStep(
                          step.id as
                            | "details"
                            | "targeting"
                            | "payment"
                            | "creative"
                            | "events"
                        )
                      }
                    >
                      {currentStepIndex > index ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                    <span className="mt-2 text-xs text-center hidden md:block">
                      {step.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step content */}
            <div className="mt-8">
              {currentStep === "details" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Campaign Details</h3>
                  <div className="grid gap-4">
                    {user?.role === "admin" && !id && (
                      <div className="grid gap-2">
                        <Label htmlFor="userId">User Id</Label>
                        <Input
                          required
                          id="userId"
                          name="userId"
                          placeholder="Enter user id"
                          value={userId}
                          onChange={(e) => setUserId(e.target?.value)}
                        />
                      </div>
                    )}

                    <div className="grid gap-2">
                      <Label htmlFor="campaign-name">Campaign Name</Label>
                      <Input
                        id="campaign-name"
                        name="name"
                        placeholder="Enter campaign name"
                        value={formValues.name}
                        onChange={handleInputChange}
                        className={cn(
                          validationErrors.campaignName && "border-red-500"
                        )}
                      />
                      {validationErrors.campaignName && (
                        <p className="text-sm text-red-500">
                          Campaign name is required
                        </p>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="preview-url">Preview URL</Label>
                      <Input
                        id="preview-url"
                        name="previewUrl"
                        placeholder="https://yourdomain.com"
                        value={formValues.previewUrl}
                        onChange={handleInputChange}
                        className={cn(
                          validationErrors.previewUrl && "border-red-500"
                        )}
                      />
                      {validationErrors.previewUrl && (
                        <p className="text-sm text-red-500">
                          Preview URL is required
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        The exact store URL of your app or website
                      </p>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="category">Vertical</Label>
                      <Select
                        value={formValues.category || ""}
                        onValueChange={(value) =>
                          setFormValues((prev) => ({
                            ...prev,
                            category: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select vertical" />
                        </SelectTrigger>
                        <SelectContent>
                          {verticals.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label
                        htmlFor="tracking"
                        className="flex items-center gap-1"
                      >
                        Tracking URL
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="tracking"
                        name="trackingUrl"
                        placeholder="https://track.yourdomain.com/click?id={OFFER_ID}&user={USER_ID}"
                        value={formValues.trackingUrl}
                        onChange={handleInputChange}
                        className={cn(
                          validationErrors.trackingUrl && "border-red-500"
                        )}
                      />
                      {validationErrors.trackingUrl && (
                        <p className="text-sm text-red-500">
                          Tracking URL is required
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        You may enter the tracking URL with or without the
                        macros/tracking parameters. Our system will
                        automatically append those required macros/parameters
                        based on your tracking settings.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === "targeting" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Targeting Options</h3>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <h4 className="font-medium flex items-center gap-1">
                        Select Platform
                        <span className="text-red-500">*</span>
                      </h4>
                      {validationErrors.platforms && (
                        <p className="text-sm text-red-500">
                          Please select at least one platform
                        </p>
                      )}
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="platform-android"
                            checked={selectedPlatforms.includes("android")}
                            onCheckedChange={(checked) => {
                              setSelectedPlatforms((prev) =>
                                checked
                                  ? [...prev, "android"]
                                  : prev.filter((p) => p !== "android")
                              );
                            }}
                            className={cn(
                              validationErrors.platforms && "border-red-500"
                            )}
                          />
                          <Label
                            htmlFor="platform-android"
                            className="flex items-center gap-2"
                          >
                            <span className="font-medium">Android</span>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="platform-ios"
                            checked={selectedPlatforms.includes("ios")}
                            onCheckedChange={(checked) => {
                              setSelectedPlatforms((prev) =>
                                checked
                                  ? [...prev, "ios"]
                                  : prev.filter((p) => p !== "ios")
                              );
                            }}
                            className={cn(
                              validationErrors.platforms && "border-red-500"
                            )}
                          />
                          <Label
                            htmlFor="platform-ios"
                            className="flex items-center gap-2"
                          >
                            <span className="font-medium">iOS</span>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="platform-web"
                            checked={selectedPlatforms.includes("web")}
                            onCheckedChange={(checked) => {
                              setSelectedPlatforms((prev) =>
                                checked
                                  ? [...prev, "web"]
                                  : prev.filter((p) => p !== "web")
                              );
                            }}
                            className={cn(
                              validationErrors.platforms && "border-red-500"
                            )}
                          />
                          <Label
                            htmlFor="platform-web"
                            className="flex items-center gap-2"
                          >
                            <span className="font-medium">Web</span>
                          </Label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium flex items-center gap-1">
                        Select Devices
                        <span className="text-red-500">*</span>
                      </h4>
                      {validationErrors.devices && (
                        <p className="text-sm text-red-500">
                          Please select at least one device
                        </p>
                      )}
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="device-mobile"
                            checked={selectedDevices.includes("mobile")}
                            onCheckedChange={(checked) => {
                              setSelectedDevices((prev) =>
                                checked
                                  ? [...prev, "mobile"]
                                  : prev.filter((d) => d !== "mobile")
                              );
                            }}
                            className={cn(
                              validationErrors.devices && "border-red-500"
                            )}
                          />
                          <Label
                            htmlFor="device-mobile"
                            className="flex items-center gap-2"
                          >
                            <span className="font-medium">Mobile</span>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="device-tablet"
                            checked={selectedDevices.includes("tablet")}
                            onCheckedChange={(checked) => {
                              setSelectedDevices((prev) =>
                                checked
                                  ? [...prev, "tablet"]
                                  : prev.filter((d) => d !== "tablet")
                              );
                            }}
                            className={cn(
                              validationErrors.devices && "border-red-500"
                            )}
                          />
                          <Label
                            htmlFor="device-tablet"
                            className="flex items-center gap-2"
                          >
                            <span className="font-medium">Tablet</span>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="device-desktop"
                            checked={selectedDevices.includes("desktop")}
                            onCheckedChange={(checked) => {
                              setSelectedDevices((prev) =>
                                checked
                                  ? [...prev, "desktop"]
                                  : prev.filter((d) => d !== "desktop")
                              );
                            }}
                            className={cn(
                              validationErrors.devices && "border-red-500"
                            )}
                          />
                          <Label
                            htmlFor="device-desktop"
                            className="flex items-center gap-2"
                          >
                            <span className="font-medium">Desktop</span>
                          </Label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium">Location Targeting</h4>
                      <div className="space-y-2">
                        <RadioGroup
                          value={targetingType}
                          onValueChange={(value: "all" | "specific") => {
                            setTargetingType(value);
                            if (value === "all") {
                              setSelectedCountries([]);
                            }
                          }}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="all" id="all-countries" />
                            <Label htmlFor="all-countries">All Countries</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="specific"
                              id="specific-countries"
                            />
                            <Label htmlFor="specific-countries">
                              Select specific countries to target
                            </Label>
                          </div>
                        </RadioGroup>

                        {targetingType === "specific" && (
                          <div className="pt-4 space-y-4">
                            {validationErrors.countries && (
                              <p className="text-sm text-red-500">
                                Please select at least one country when using
                                specific targeting
                              </p>
                            )}
                            <div className="flex flex-wrap gap-2">
                              {selectedCountries?.map((country) => (
                                <Badge
                                  key={country}
                                  variant="secondary"
                                  className="flex items-center gap-1"
                                >
                                  {
                                    countries.find((c) => c.value === country)
                                      ?.label
                                  }
                                  <X
                                    className="h-3 w-3 cursor-pointer"
                                    onClick={() =>
                                      setSelectedCountries((prev) =>
                                        prev.filter((c) => c !== country)
                                      )
                                    }
                                  />
                                </Badge>
                              ))}
                            </div>
                            <Select
                              value=""
                              onValueChange={(value) => {
                                if (!selectedCountries.includes(value)) {
                                  setSelectedCountries((prev) => [
                                    ...prev,
                                    value,
                                  ]);
                                }
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select countries to add..." />
                              </SelectTrigger>
                              <SelectContent>
                                {countries
                                  .filter(
                                    (country) =>
                                      !selectedCountries.includes(country.value)
                                  )
                                  ?.map((country) => (
                                    <SelectItem
                                      key={country.value}
                                      value={country.value}
                                    >
                                      {country.label}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === "payment" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Payment Options</h3>

                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="payout-type">Payout Type</Label>
                      <Select
                        disabled={!!id}
                        value={payoutType}
                        onValueChange={(value) => {
                          setPayoutType(value as "cpi" | "cpa" | "cpe");
                          if (value === "cpi")
                            setEvents([
                              {
                                id: 1,
                                name: "App Install",
                                payout: formValues.payout || "1.00",
                                token: generateUniqueToken(),
                              },
                            ]);
                          if (value === "cpa") setEvents([]);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select payout type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cpi">
                            CPI (Cost Per Install)
                          </SelectItem>
                          <SelectItem value="cpa">
                            CPA (Cost Per Action)
                          </SelectItem>
                          <SelectItem value="cpe">
                            CPE (Cost Per Event)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {payoutType === "cpe" && (
                      <div className="grid gap-2">
                        <Label htmlFor="campaign-type">Campaign Type</Label>
                        <RadioGroup
                          disabled={!!id}
                          defaultValue={campaignType}
                          onValueChange={(value) =>
                            setCampaignType(value as "single" | "multi")
                          }
                          className="flex flex-col space-y-3 pt-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="single" id="single-event" />
                            <Label
                              htmlFor="single-event"
                              className="cursor-pointer"
                            >
                              Single Event (e.g. App Install Only)
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="multi" id="multi-event" />
                            <Label
                              htmlFor="multi-event"
                              className="cursor-pointer"
                            >
                              Multi Event (e.g. Install + Engagement)
                            </Label>
                          </div>
                        </RadioGroup>
                        <p className="text-sm text-muted-foreground">
                          {campaignType === "single"
                            ? `Single event campaigns pay out on one action.`
                            : `Multi event campaigns allow payments for multiple user actions.`}
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-12 gap-2 items-center">
                      <Label htmlFor="payout" className="col-span-12 mb-1">
                        Payout
                      </Label>
                      <div className="col-span-1 text-center text-lg">$</div>
                      <Input
                        disabled={!!id}
                        id="payout"
                        placeholder="0.00"
                        type="number"
                        className={cn(
                          "col-span-11",
                          validationErrors.payout && "border-red-500"
                        )}
                        value={formValues.payout}
                        name="payout"
                        onChange={handleInputChange}
                      />
                      {validationErrors.payout && (
                        <p className="text-sm text-red-500 col-span-12">
                          Payout is required
                        </p>
                      )}
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label>Daily Conversion Cap</Label>
                        <Input
                          placeholder="Enter limit"
                          value={formValues.dailyCap}
                          name="dailyCap"
                          onChange={handleInputChange}
                          type="number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Monthly Conversion Cap</Label>
                        <Input
                          placeholder="Enter limit"
                          value={formValues.monthlyCap}
                          name="monthlyCap"
                          onChange={handleInputChange}
                          type="number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Overall Conversion Cap</Label>
                        <Input
                          placeholder="Enter limit"
                          value={formValues.totalCap}
                          name="totalCap"
                          onChange={handleInputChange}
                          type="number"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label>Daily Click Cap</Label>
                        <Input
                          placeholder="Enter limit"
                          value={formValues.dailyClickCap}
                          name="dailyClickCap"
                          onChange={handleInputChange}
                          type="number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Monthly Click Cap</Label>
                        <Input
                          placeholder="Enter limit"
                          value={formValues.monthlyClickCap}
                          name="monthlyClickCap"
                          type="number"
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    {/* <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label>Daily Revenue Cap</Label>
                        <Input
                          placeholder="Enter limit"
                          value={formValues.dailyRevenueCap}
                          name="dailyRevenueCap"
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Monthly Revenue Cap</Label>
                        <Input
                          placeholder="Enter limit"
                          value={formValues.monthlyRevenueCap}
                          name="monthlyRevenueCap"
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Overall Revenue Cap</Label>
                        <Input
                          placeholder="Enter limit"
                          value={formValues.totalRevenueCap}
                          name="totalRevenueCap"
                          onChange={handleInputChange}
                        />
                      </div>
                    </div> */}

                    <div className="pt-4 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="expiry-date"
                          checked={hasExpiry}
                          onCheckedChange={(checked) => {
                            setHasExpiry(checked as boolean);
                            if (!checked) setExpiryDate(undefined);
                          }}
                        />
                        <Label htmlFor="expiry-date">Add Expiration Date</Label>
                      </div>

                      {hasExpiry && (
                        <div className="pt-2">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !expiryDate && "text-muted-foreground",
                                  validationErrors.expiryDate &&
                                    "border-red-500"
                                )}
                              >
                                <Calendar className="mr-2 h-4 w-4" />
                                {expiryDate
                                  ? format(expiryDate, "PPP")
                                  : "Pick a date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <UiCalendar
                                mode="single"
                                selected={expiryDate}
                                onSelect={setExpiryDate}
                                initialFocus
                                disabled={(date) => date < new Date()}
                              />
                            </PopoverContent>
                          </Popover>
                          {validationErrors.expiryDate && (
                            <p className="text-sm text-red-500 mt-1">
                              Please select an expiration date
                            </p>
                          )}
                        </div>
                      )}

                      <p className="text-sm text-muted-foreground">
                        Set an expiry date for this campaign. Expired campaigns
                        status will be changed to "On Review".
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === "events" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Campaign Events</h3>

                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {campaignType === "single"
                        ? "Configure the single event for this campaign."
                        : "Configure multiple events for this campaign. Each event has its own payout and tracking token."}
                    </p>

                    {events?.map((event, index) => (
                      <div
                        key={event.id}
                        className="border rounded-md p-4 space-y-4 relative"
                      >
                        {campaignType === "multi" && (
                          <div className="absolute right-4 top-4">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeEvent(event.id)}
                              disabled={events.length <= 1}
                            >
                              <Minus className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        )}

                        <h4 className="font-medium">
                          {campaignType === "single"
                            ? "Event Details"
                            : `Event ${index + 1}`}
                        </h4>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor={`event-name-${event.id}`}>
                              Event Name
                            </Label>
                            <Input
                              id={`event-name-${event.id}`}
                              placeholder="e.g. App Install, Complete Tutorial"
                              value={event.name}
                              onChange={(e) =>
                                updateEventField(
                                  event.id,
                                  "name",
                                  e.target.value
                                )
                              }
                              disabled={
                                campaignType === "single" && index === 0
                              }
                              className={cn(
                                validationErrors.eventName &&
                                  !event.name &&
                                  "border-red-500"
                              )}
                            />
                            {validationErrors.eventName && !event.name && (
                              <p className="text-sm text-red-500">
                                Event name is required
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`event-payout-${event.id}`}>
                              Event Payout ($)
                            </Label>
                            <Input
                              disabled={!!id}
                              id={`event-payout-${event.id}`}
                              placeholder="0.00"
                              value={event.payout}
                              onChange={(e) =>
                                updateEventField(
                                  event.id,
                                  "payout",
                                  e.target.value
                                )
                              }
                              className={cn(
                                validationErrors.eventPayout &&
                                  (!event.payout ||
                                    parseFloat(event.payout) <= 0) &&
                                  "border-red-500"
                              )}
                            />
                            {validationErrors.eventPayout &&
                              (!event.payout ||
                                parseFloat(event.payout) <= 0) && (
                                <p className="text-sm text-red-500">
                                  Valid payout amount is required
                                </p>
                              )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`event-token-${event.id}`}>
                            Tracking Token
                          </Label>
                          <div className="flex gap-2">
                            <Input
                              id={`event-token-${event.id}`}
                              value={event.token}
                              readOnly
                              className="font-mono text-sm"
                            />
                            <Button
                              variant="outline"
                              onClick={() => {
                                navigator.clipboard.writeText(event.token);
                                toast.success("Token copied to clipboard");
                              }}
                            >
                              Copy
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            This unique token will be used to track conversions
                            for this specific event.
                          </p>
                        </div>
                      </div>
                    ))}

                    {campaignType === "multi" && (
                      <Button
                        variant="outline"
                        className="w-full mt-2"
                        onClick={addEvent}
                      >
                        <Plus className="mr-2 h-4 w-4" /> Add Another Event
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {currentStep === "creative" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Campaign Creative</h3>

                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Main Image */}
                        <div className="border rounded-lg p-4 space-y-4">
                          <div className="font-medium text-sm">Main Image</div>
                          <div className="aspect-square w-full relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                            {mainImage ? (
                              <>
                                <img
                                  src={URL.createObjectURL(mainImage)}
                                  alt="Main campaign image"
                                  className="w-full h-full object-contain"
                                />
                                <div className="absolute top-2 right-2 flex gap-2">
                                  <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => setMainImage(null)}
                                    className="h-8 w-8 bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </>
                            ) : existingMainImageUrl ? (
                              <>
                                <img
                                  src={existingMainImageUrl}
                                  alt="Existing main campaign image"
                                  className="w-full h-full object-contain"
                                />
                                <div className="absolute top-2 right-2 flex gap-2">
                                  <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={() =>
                                      setExistingMainImageUrl(null)
                                    }
                                    className="h-8 w-8 bg-red-600 dark:bg-gray-800/80 dark:hover:bg-gray-800"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </>
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                  <Image className="h-10 w-10 mx-auto text-gray-400" />
                                  <p className="text-sm text-muted-foreground mt-2">
                                    No image selected
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2 justify-center">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => mainImageRef.current?.click()}
                            >
                              {mainImage ? "Change Image" : "Upload Image"}
                            </Button>
                          </div>
                          <input
                            ref={mainImageRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setMainImage(e.target.files[0]);
                              }
                            }}
                          />
                        </div>

                        {/* Secondary Image */}
                        <div className="border rounded-lg p-4 space-y-4">
                          <div className="font-medium text-sm">
                            Secondary Image
                          </div>
                          <div className="aspect-square w-full relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                            {secondaryImage ? (
                              <>
                                <img
                                  src={URL.createObjectURL(secondaryImage)}
                                  alt="Secondary campaign image"
                                  className="w-full h-full object-contain"
                                />
                                <div className="absolute top-2 right-2 flex gap-2">
                                  <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => setSecondaryImage(null)}
                                    className="h-8 w-8 bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </>
                            ) : existingSecondaryImageUrl ? (
                              <>
                                <img
                                  src={existingSecondaryImageUrl}
                                  alt="Existing secondary campaign image"
                                  className="w-full h-full object-contain"
                                />
                                <div className="absolute top-2 right-2 flex gap-2">
                                  <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={() =>
                                      setExistingSecondaryImageUrl(null)
                                    }
                                    className="h-8 w-8 bg-red-600 dark:bg-gray-800/80 dark:hover:bg-gray-800"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </>
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                  <Image className="h-10 w-10 mx-auto text-gray-400" />
                                  <p className="text-sm text-muted-foreground mt-2">
                                    No image selected
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2 justify-center">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => secondaryImageRef.current?.click()}
                            >
                              {secondaryImage ? "Change Image" : "Upload Image"}
                            </Button>
                          </div>
                          <input
                            ref={secondaryImageRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setSecondaryImage(e.target.files[0]);
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="description">
                        Description <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Enter campaign description"
                        className={cn(
                          "min-h-[100px]",
                          validationErrors.description && "border-red-500"
                        )}
                        value={formValues.description}
                        onChange={handleInputChange}
                      />
                      <p className="text-xs text-muted-foreground">
                        You are allowed a maximum of 150 characters.
                      </p>
                      {validationErrors.description && (
                        <p className="text-sm text-red-500">
                          Description is required
                        </p>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="call-to-action">
                        Call to Action <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="call-to-action"
                        name="callToAction"
                        placeholder="Briefly explain what the user has to do..."
                        className={cn(
                          "min-h-[80px]",
                          validationErrors.callToAction && "border-red-500"
                        )}
                        value={formValues.callToAction}
                        onChange={handleInputChange}
                      />
                      <p className="text-xs text-muted-foreground">
                        You are allowed a maximum of 100 characters.
                      </p>
                      {validationErrors.callToAction && (
                        <p className="text-sm text-red-500">
                          Call to Action is required
                        </p>
                      )}
                    </div>

                    <div className="pt-2 space-y-2">
                      <h4 className="font-medium">Campaign Notifications</h4>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          defaultChecked={true}
                          id="notifications"
                          checked={notifications}
                          onCheckedChange={(checked) => {
                            setHasNotifications(checked as boolean);
                          }}
                        />
                        <Label htmlFor="notifications">
                          Notify me for approval status and the status of the
                          changes I made to this campaign
                        </Label>
                      </div>
                      <p className="text-xs text-muted-foreground pl-6">
                        You will receive an email when there are changes in the
                        status of your campaign, or status of the proposed
                        changes to the campaign (Rejected, or Approved).
                      </p>
                    </div>

                    <div className="pt-2 space-y-2">
                      <h4 className="font-medium">Campaign Notes</h4>
                      <Textarea
                        id="notes"
                        name="notes"
                        placeholder="Add any additional notes about this campaign here..."
                        className="min-h-[80px]"
                        value={formValues.notes}
                        onChange={handleInputChange}
                      />
                      <p className="text-xs text-muted-foreground">
                        You can add your notes pertaining to this campaign here
                        (does not require a review).
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentStepIndex === 0}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              {currentStepIndex === steps.length - 1 ? (
                <Button
                  disabled={loading}
                  onClick={() => {
                    if (validateStep()) {
                      onSubmit();
                    } else {
                      toast.error("Please fill in all required fields");
                    }
                  }}
                >
                  {id ? "Update Campaign" : "Create Campaign"}
                  <Check className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button disabled={loading} onClick={handleNext}>
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
