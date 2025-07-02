import Logo from "@/components/Logo";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CircleX,
  Home,
  ImageIcon,
  Infinity as InfinityIcon,
  List,
  Monitor,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams } from "react-router-dom";
import api from "@/lib/axios";
import axios from "axios";
import { Campaign } from "./dashboard/advertiser/CampaignsPage";
import { OfferPreviewModal } from "@/components/OfferPreviewModal";
import { Button } from "@/components/ui/button";
import { calculateCampaignDistribution } from "@/utils/calculateCampaignDistribution";
import verticals from "@/constants/verticals.json";
import { Promotion } from "./dashboard/AppSettings";
import { PromotionBanner } from "./PromotionBanner";
import { getPromotionBonusMultiplier } from "@/utils/getPromotionBonus";
import { LootablyOfferPreview } from "@/components/LootablyOfferPreview";

export type IPInfoResponse = {
  ip: string | null;
  city: string | null;
  region: string | null;
  country: string | null;
  loc: string | null; // format: "latitude,longitude"
  org: string | null;
  postal: string | null;
  timezone: string | null;
  readme: string | null;
};

export interface PromotionConfig {
  id: string;
  user_id: string;
  name: string;
  platform: "web" | "app" | "both" | string;
  website_url: string;
  top_text: string;
  description: string;
  logo: string | null;
  currency_name_singular: string;
  currency_name_plural: string;
  conversion_rate: string;
  split_to_user: string;
  currency_reward_rounding: "no-decimals" | "round" | string;
  postback_url: string;
  postback_secret: string;
  postback_retries: number;
  design_primary_color: string;
  design_secondary_color: string;
  currency_logo: string;
  api_key: string;
  promotion: Promotion[];
  status: "active" | "inactive" | string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export type ILootablyOffer = {
  type: "singlestep" | "multistep" | string;
  name: string;
  description: string;
  image: string;
  countries: string[];
  offerID: string;
  categories: string[];
  devices: string[];
  link: string;
  conversionRate: number;
  extraCreatives: { type: string; url: string }[]; // Replace `any` with a specific creative type if needed
  paymentModel: string;
  statistics: {
    uniqueUserCompletionsThisMonth: number;
    epc: number;
  };
  probableTrackingTelemetry: boolean;

  // Single step specific
  revenue?: string;
  currencyReward?: string;
  multipleConversionsAllowed?: boolean;

  // Multi step specific
  goals?: {
    goalID: string;
    description: string;
    revenue: number;
    currencyReward: number;
    isOptional: boolean;
  }[];
  previewURL?: string;
  bundlePackageID?: string;
  appStoreCategories?: string[];
  appStoreDescription?: string;
};

export default function Offerwall() {
  const [searchParams] = useSearchParams();
  const [currentTab, setCurrentTab] = useState("home");
  const placementID = searchParams.get("placementID") || "";
  const sid = searchParams.get("sid") || "";
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<IPInfoResponse | null>(null);
  const [offers, setOffers] = useState<Campaign[]>([]);
  const [lootablyOffers, setLootablyOffers] = useState<ILootablyOffer[]>([]);
  const [clickedLootablyOffers, setClickedLootablyOffers] = useState<
    ILootablyOffer[]
  >([]);
  const [rewardedLootablyOffers, setRewardedLootablyOffers] = useState<
    ILootablyOffer[]
  >([]);
  const [device, setDevice] = useState<string>("");
  const [payout, setPayout] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [app, setApp] = useState<PromotionConfig | null>(null);
  const [showOfferPreviewModal, setShowOfferPreviewModal] =
    useState<boolean>(false);
  const [selectedOffer, setSelectedOffer] = useState<Campaign | null>(null);
  const [showLootablyOfferPreviewModal, setLootablyShowOfferPreviewModal] =
    useState<boolean>(false);
  const [selectedLootablyOffer, setLootablySelectedOffer] =
    useState<ILootablyOffer | null>(null);

  useEffect(() => {
    const fetchGeoIpLocation = async () => {
      try {
        const res = await axios.get("https://ipinfo.io/json");
        if (res.status === 200) {
          localStorage?.setItem("loc", JSON.stringify(res?.data));
          setLocation(res?.data);
        }
      } catch {
        console.log("Unable to fetch location via ip lookup");
      }
    };
    const loc = JSON.parse(localStorage.getItem("loc"));
    if (!loc) fetchGeoIpLocation();
    else setLocation(loc);
  }, []);

  useEffect(() => {
    const validate = async () => {
      try {
        const response = await api.post("/public/wall/validate", {
          apiKey: placementID,
          userId: sid,
        }); // your endpoint here
        if (response.status === 200) {
          setIsValid(true);
          setApp(response?.data?.data?.app);
        }
      } catch (error) {
        console.error("Validation failed:", error);
      } finally {
        setLoading(false);
      }
    };
    validate();
  }, [placementID, sid]);

  useEffect(() => {
    if (!location || !isValid || !placementID || !sid) return;

    const getActiveOffersList = async () => {
      setLoading(true);
      try {
        const response = await api.post("/public/wall/offers", {
          apiKey: placementID,
          userId: sid,
          country: location?.country?.toLowerCase(),
          category,
          device,
          sort: payout,
          isLootably: true,
          ip: location?.ip,
        }); // your endpoint here
        if (response.status === 200) {
          setOffers(response?.data?.data?.offers);
          setLootablyOffers(response?.data?.data?.lootablyData?.offers);
        }
      } catch (error) {
        console.error("Validation failed:", error);
      } finally {
        setLoading(false);
      }
    };

    const getClickedActiveOffersList = async () => {
      setLoading(true);
      try {
        const response = await api.post("/public/wall/offers/clicked", {
          apiKey: placementID,
          userId: sid,
          ip: location?.ip,
        }); // your endpoint here
        if (response.status === 200) {
          setOffers(response?.data?.data?.offers);
          const clickedOfferIds = new Set(
            response?.data?.data?.lootablyOffersId?.map((o) => o.offer_id)
          );
          const clickedOnly = lootablyOffers?.filter((offer) =>
            clickedOfferIds.has(offer.offerID)
          );
          setClickedLootablyOffers(clickedOnly);
        }
      } catch (error) {
        console.error("Validation failed:", error);
      } finally {
        setLoading(false);
      }
    };

    const getRewardedActiveOffersList = async () => {
      setLoading(true);
      try {
        const response = await api.post("/public/wall/offers/rewarded", {
          apiKey: placementID,
          userId: sid,
          ip: location?.ip,
        }); // your endpoint here
        if (response.status === 200) {
          setOffers(response?.data?.data?.offers);
          const offerIds = new Set(
            response?.data?.data?.lootablyRewardedOffersId?.map(
              (o) => o.offer_id
            )
          );
          const rewardedOffers = lootablyOffers?.filter((offer) =>
            offerIds.has(offer.offerID)
          );
          setRewardedLootablyOffers(rewardedOffers);
        }
      } catch (error) {
        console.error("Validation failed:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentTab === "home") getActiveOffersList();
    if (currentTab === "myoffers") getClickedActiveOffersList();
    if (currentTab === "rewarded") getRewardedActiveOffersList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    location,
    isValid,
    placementID,
    sid,
    device,
    category,
    currentTab,
    payout,
  ]);

  // useEffect(() => {
  //   const ua = navigator.userAgent.toLowerCase();
  //   if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/.test(ua)) {
  //     setDevice("mobile");
  //   } else if (
  //     /ipad|tablet|kindle|playbook|silk/.test(ua) ||
  //     (navigator.userAgent.includes("Macintosh") && "ontouchend" in document)
  //   ) {
  //     setDevice("tablet");
  //   } else {
  //     setDevice("desktop");
  //   }
  // }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!placementID) {
    return (
      <section className="min-h-screen bg-gray-50 flex justify-center items-center">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p>Missing or invalid API KEY</p>
          </CardContent>
        </Card>
      </section>
    );
  }

  if (!sid) {
    return (
      <section className="min-h-screen bg-gray-50 flex justify-center items-center">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p>{`Missing USER_ID: (The user one publisher's system) Replace {USER_ID} with the user who is visiting the offerwall.`}</p>
          </CardContent>
        </Card>
      </section>
    );
  }

  if (!isValid) {
    return (
      <section className="min-h-screen bg-gray-50 flex justify-center items-center">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <p>Invalid credentials</p>
            <strong className="mt-2">Note:</strong>
            <p>Only active app can be use to embed link or iframe</p>
          </CardContent>
        </Card>
      </section>
    );
  }

  const startOfferByClick = async (
    offerId: number | string,
    isLootably?: boolean
  ) => {
    try {
      await api.post("/public/wall/offers/click", {
        apiKey: placementID,
        userId: sid,
        offerId,
        country: location?.country,
        isLootably: isLootably === true,
        ip: location?.ip,
      }); // your endpoint here
    } catch (error) {
      console.error("Unable to start offer", error);
    }
  };

  const promo = getPromotionBonusMultiplier(app?.promotion);

  return (
    <section className="min-h-screen bg-gray-50">
      <PromotionBanner promotion={app?.promotion} />

      <div
        className="text-gray-900 h-[60px] px-4 flex items-center justify-between"
        style={{
          backgroundColor: app?.design_primary_color || "#9B87F5",
        }}
      >
        <Logo />
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="bg-gray-100 text-gray-700 border-gray-200 capitalize"
          >
            {app?.currency_name_singular}
          </Badge>
        </div>
      </div>

      <Tabs
        defaultValue="home"
        value={currentTab}
        onValueChange={setCurrentTab}
        className="w-full flex flex-col overflow-hidden flex-1"
      >
        <div className="border-b border-gray-200">
          <div className="pl-4 overflow-x-auto">
            <TabsList className="h-14 w-auto bg-transparent gap-2">
              <TabsTrigger
                value="home"
                className={`rounded-none px-4 transition-all ${
                  currentTab === "home"
                    ? `border-b-2 border-purple-600 text-purple-600 font-medium`
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Home
                    size={18}
                    className={currentTab === "home" ? `text-purple-600` : ""}
                  />
                  <span>Home</span>
                </div>
              </TabsTrigger>

              <TabsTrigger
                value="myoffers"
                className={`rounded-none px-4 transition-all ${
                  currentTab === "myoffers"
                    ? `border-b-2 border-purple-600 text-purple-600 font-medium`
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <List
                    size={18}
                    className={
                      currentTab === "myoffers" ? `text-purple-600` : ""
                    }
                  />
                  <span>My Offers</span>
                </div>
              </TabsTrigger>

              <TabsTrigger
                value="rewarded"
                className={`rounded-none px-4 transition-all ${
                  currentTab === "rewarded"
                    ? `border-b-2 border-purple-600 text-purple-600 font-medium`
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Monitor
                    size={18}
                    className={
                      currentTab === "rewarded" ? `text-purple-600` : ""
                    }
                  />
                  <span>Rewarded</span>
                </div>
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        {/* Content */}
        <TabsContent
          value="home"
          className="p-4 overflow-auto flex-1 min-h-[500px]"
        >
          <h1 className="font-semibold mb-4">New Offers</h1>
          <div className="flex flex-col md:flex-row justify-end gap-3 mb-4 md:mb-6">
            <div className="w-full md:w-40">
              <Select
                value={payout}
                onValueChange={(e) => {
                  setPayout(e);
                }}
              >
                <SelectTrigger className="flex items-center gap-2 bg-white border-gray-200">
                  <SelectValue placeholder="Filter by payout" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low_to_high">Low to high</SelectItem>
                  <SelectItem value="high_to_low">High to low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-40">
              <Select
                value={device}
                onValueChange={(e) => {
                  setDevice(e);
                }}
              >
                <SelectTrigger className="flex items-center gap-2 bg-white border-gray-200">
                  <SelectValue placeholder="Filter by device" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mobile">Mobile</SelectItem>
                  <SelectItem value="tablet">Tablet</SelectItem>
                  <SelectItem value="desktop">Desktop</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-40">
              <Select
                value={category}
                onValueChange={(value) => setCategory(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by vertical" />
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
            {(device || category) && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  setDevice("");
                  setCategory("");
                }}
              >
                <CircleX className="w-4 h-4" />
              </Button>
            )}
          </div>
          {offers?.length > 0 || lootablyOffers?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              {offers?.map((offer) => (
                <Card
                  key={offer?.id}
                  className="overflow-hidden border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-3 md:p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                        {offer?.primary_image || offer?.secondary_image ? (
                          <img
                            src={offer?.primary_image || offer?.secondary_image}
                            alt={offer?.campaign_name}
                            className="w-full h-full rounded-md overflow-hidden object-cover"
                          />
                        ) : (
                          <ImageIcon size={20} />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm md:text-base text-gray-900 capitalize">
                          {offer?.campaign_name}
                        </h4>
                        <div className="flex items-center gap-1 md:gap-2 text-xs text-gray-500 flex-wrap mt-1">
                          {offer?.devices?.map((device) => {
                            return (
                              <Badge
                                variant="secondary"
                                className="px-1.5 py-0 text-[10px] md:text-xs bg-gray-100 text-gray-700 capitalize"
                                key={device}
                              >
                                {device === "android"
                                  ? "🤖 Android"
                                  : `⌘ ${device}`}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter
                    onClick={() => {
                      startOfferByClick(offer?.id);
                      setSelectedOffer(offer);
                      setShowOfferPreviewModal(true);
                    }}
                    className="text-white p-1.5 md:p-2 flex justify-center"
                    style={{
                      backgroundColor: app?.design_secondary_color,
                    }}
                  >
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-sm md:text-base">
                        +
                        {calculateCampaignDistribution(
                          Number(offer?.campaign_payout),
                          Number(offer?.admin_percentage),
                          Number(app?.split_to_user),
                          promo
                        )?.userShare * Number(app?.conversion_rate)}
                      </span>
                      <img
                        src={app?.currency_logo}
                        alt={app?.currency_name_plural}
                        className="object-contain overflow-hidden w-[20px] h-[20px]"
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 18V6"></path>
                        <path d="M5 12l7-6 7 6"></path>
                      </svg>
                    </div>
                  </CardFooter>
                </Card>
              ))}
              {lootablyOffers?.map((offer) => (
                <Card
                  key={offer?.offerID}
                  className="overflow-hidden border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-3 md:p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                        {offer?.image ? (
                          <img
                            src={offer?.image}
                            alt={offer?.name}
                            className="w-full h-full rounded-md overflow-hidden object-cover"
                          />
                        ) : (
                          <ImageIcon size={20} />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm md:text-base text-gray-900 capitalize">
                          {offer?.name}
                        </h4>
                        <div className="flex items-center gap-1 md:gap-2 text-xs text-gray-500 flex-wrap mt-1">
                          {offer?.devices?.map((device) => {
                            return (
                              <Badge
                                variant="secondary"
                                className="px-1.5 py-0 text-[10px] md:text-xs bg-gray-100 text-gray-700 capitalize"
                                key={device}
                              >
                                {device === "android"
                                  ? "🤖 Android"
                                  : `⌘ ${device}`}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter
                    onClick={() => {
                      startOfferByClick(offer?.offerID, true);
                      setLootablySelectedOffer(offer);
                      setLootablyShowOfferPreviewModal(true);
                    }}
                    className="text-white p-1.5 md:p-2 flex justify-center"
                    style={{
                      backgroundColor: app?.design_secondary_color,
                    }}
                  >
                    <div className="flex items-center gap-1 font-semibold">
                      +
                      {offer?.type === "singlestep" ? (
                        offer?.currencyReward === "variable" ? (
                          <InfinityIcon />
                        ) : (
                          offer?.currencyReward
                        )
                      ) : (
                        offer?.goals.reduce(
                          (total, goal) => total + goal.currencyReward,
                          0
                        )
                      )}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 18V6"></path>
                        <path d="M5 12l7-6 7 6"></path>
                      </svg>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="flex flex-col gap-2 pt-6 md:max-w-96 mx-auto mt-8 shadow-xl bg-muted/40 animate-fade-in">
              <CardContent className="flex justify-center flex-col items-center">
                <span className="text-gray-500 text-5xl">💬</span>
                <p className="italic text-sm md:text-base text-center mt-4">
                  No new offers available right now. Please check back later —
                  we’re always updating with fresh ways to earn!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent
          value="myoffers"
          className="p-4 overflow-auto flex-1 min-h-[500px]"
        >
          <h1 className="font-semibold mb-4">My Offers</h1>

          {offers?.length > 0 || lootablyOffers?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              {offers?.map((offer) => (
                <Card
                  key={offer?.id}
                  className="overflow-hidden border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-3 md:p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                        {offer?.primary_image || offer?.secondary_image ? (
                          <img
                            src={offer?.primary_image || offer?.secondary_image}
                            alt={offer?.campaign_name}
                            className="w-full h-full rounded-md overflow-hidden object-cover"
                          />
                        ) : (
                          <ImageIcon size={20} />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm md:text-base text-gray-900 capitalize">
                          {offer?.campaign_name}
                        </h4>
                        <div className="flex items-center gap-1 md:gap-2 text-xs text-gray-500 flex-wrap mt-1">
                          <Badge
                            variant="secondary"
                            className="px-1.5 py-0 text-[10px] md:text-xs bg-gray-100 text-gray-700 capitalize"
                            key={device}
                          >
                            Started
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter
                    onClick={() => {
                      setSelectedOffer(offer);
                      setShowOfferPreviewModal(true);
                    }}
                    className="text-white p-1.5 md:p-2 flex justify-center"
                    style={{
                      backgroundColor: app?.design_secondary_color,
                    }}
                  >
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-sm md:text-base">
                        +
                        {calculateCampaignDistribution(
                          Number(offer?.campaign_payout),
                          Number(offer?.admin_percentage),
                          Number(app?.split_to_user),
                          promo
                        )?.userShare * Number(app?.conversion_rate)}
                      </span>
                      <img
                        src={app?.currency_logo}
                        alt={app?.currency_name_plural}
                        className="object-contain overflow-hidden w-[20px] h-[20px]"
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 18V6"></path>
                        <path d="M5 12l7-6 7 6"></path>
                      </svg>
                    </div>
                  </CardFooter>
                </Card>
              ))}
              {clickedLootablyOffers?.map((offer) => (
                <Card
                  key={offer?.offerID}
                  className="overflow-hidden border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-3 md:p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                        {offer?.image ? (
                          <img
                            src={offer?.image}
                            alt={offer?.name}
                            className="w-full h-full rounded-md overflow-hidden object-cover"
                          />
                        ) : (
                          <ImageIcon size={20} />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm md:text-base text-gray-900 capitalize">
                          {offer?.name}
                        </h4>
                        <div className="flex items-center gap-1 md:gap-2 text-xs text-gray-500 flex-wrap mt-1">
                          {offer?.devices?.map((device) => {
                            return (
                              <Badge
                                variant="secondary"
                                className="px-1.5 py-0 text-[10px] md:text-xs bg-gray-100 text-gray-700 capitalize"
                                key={device}
                              >
                                Started
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter
                    onClick={() => {
                      startOfferByClick(offer?.offerID, true);
                      setLootablySelectedOffer(offer);
                      setLootablyShowOfferPreviewModal(true);
                    }}
                    className="text-white p-1.5 md:p-2 flex justify-center"
                    style={{
                      backgroundColor: app?.design_secondary_color,
                    }}
                  >
                    <div className="flex items-center gap-1 font-semibold">
                      +
                      {offer?.type === "singlestep" ? (
                        offer?.currencyReward === "variable" ? (
                          <InfinityIcon />
                        ) : (
                          offer?.currencyReward
                        )
                      ) : (
                        offer?.goals.reduce(
                          (total, goal) => total + goal.currencyReward,
                          0
                        )
                      )}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 18V6"></path>
                        <path d="M5 12l7-6 7 6"></path>
                      </svg>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="flex flex-col gap-2 pt-6 md:max-w-96 mx-auto mt-8 shadow-xl bg-muted/40 animate-fade-in">
              <CardContent className="flex justify-center flex-col items-center">
                <span className="text-gray-500 text-5xl">💬</span>
                <p className="italic text-sm md:text-base text-center mt-4">
                  You haven’t started any offers yet or none are currently
                  pending. Start an offer from the homepage to see it appear
                  here!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent
          value="rewarded"
          className="p-4 overflow-auto flex-1 min-h-[500px]"
        >
          <h1 className="font-semibold mb-4">Rewarded Offers</h1>

          {offers?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              {offers?.map((offer) => (
                <Card
                  key={offer?.id}
                  className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-3 md:p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                        {offer?.primary_image || offer?.secondary_image ? (
                          <img
                            src={offer?.primary_image || offer?.secondary_image}
                            alt={offer?.campaign_name}
                            className="w-full h-full rounded-md overflow-hidden object-cover"
                          />
                        ) : (
                          <ImageIcon size={20} />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm md:text-base text-gray-900 capitalize">
                          {offer?.campaign_name}
                        </h4>
                        <div className="flex items-center gap-1 md:gap-2 text-xs text-gray-500 flex-wrap mt-1">
                          <Badge
                            variant="secondary"
                            className="px-1.5 py-0 text-[10px] md:text-xs bg-green-100 text-gray-700 capitalize"
                            key={device}
                          >
                            Completed
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter
                    className="text-white p-1.5 md:p-2 flex justify-center pointer-events-none"
                    style={{
                      backgroundColor: app?.design_secondary_color,
                    }}
                  >
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-sm md:text-base">
                        +
                        {calculateCampaignDistribution(
                          Number(offer?.campaign_payout),
                          Number(offer?.admin_percentage),
                          Number(app?.split_to_user),
                          promo
                        )?.userShare * Number(app?.conversion_rate)}
                      </span>
                      <img
                        src={app?.currency_logo}
                        alt={app?.currency_name_plural}
                        className="object-contain overflow-hidden w-[20px] h-[20px]"
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 18V6"></path>
                        <path d="M5 12l7-6 7 6"></path>
                      </svg>
                    </div>
                  </CardFooter>
                </Card>
              ))}
              {rewardedLootablyOffers?.map((offer) => (
                <Card
                  key={offer?.offerID}
                  className="overflow-hidden border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-3 md:p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                        {offer?.image ? (
                          <img
                            src={offer?.image}
                            alt={offer?.name}
                            className="w-full h-full rounded-md overflow-hidden object-cover"
                          />
                        ) : (
                          <ImageIcon size={20} />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm md:text-base text-gray-900 capitalize">
                          {offer?.name}
                        </h4>
                        <div className="flex items-center gap-1 md:gap-2 text-xs text-gray-500 flex-wrap mt-1">
                          {offer?.devices?.map((device) => {
                            return (
                              <Badge
                                variant="secondary"
                                className="px-1.5 py-0 text-[10px] md:text-xs bg-gray-100 text-gray-700 capitalize"
                                key={device}
                              >
                                Completed
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter
                    className="text-white p-1.5 md:p-2 flex justify-center pointer-events-none"
                    style={{
                      backgroundColor: app?.design_secondary_color,
                    }}
                  >
                    <div className="flex items-center gap-1 font-semibold">
                      +
                      {offer?.type === "singlestep" ? (
                        offer?.currencyReward === "variable" ? (
                          <InfinityIcon />
                        ) : (
                          offer?.currencyReward
                        )
                      ) : (
                        offer?.goals.reduce(
                          (total, goal) => total + goal.currencyReward,
                          0
                        )
                      )}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 18V6"></path>
                        <path d="M5 12l7-6 7 6"></path>
                      </svg>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="flex flex-col gap-2 pt-6 md:max-w-96 mx-auto mt-8 shadow-xl bg-muted/40 animate-fade-in">
              <CardContent className="flex justify-center flex-col items-center">
                <span className="text-gray-500 text-5xl">💬</span>
                <p className="italic text-sm md:text-base text-center mt-4">
                  No rewards have been unlocked yet. Complete offers to earn
                  points and see your rewards here!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <OfferPreviewModal
        isOpen={showOfferPreviewModal}
        onClose={() => {
          setShowOfferPreviewModal(false);
          setSelectedOffer(null);
        }}
        offer={selectedOffer}
        app={app}
        apiKey={placementID}
        userId={sid}
        location={location}
        promo={promo}
      />

      <LootablyOfferPreview
        isOpen={showLootablyOfferPreviewModal}
        onClose={() => {
          setLootablyShowOfferPreviewModal(false);
          setLootablySelectedOffer(null);
        }}
        offer={selectedLootablyOffer}
        app={app}
        apiKey={placementID}
        userId={sid}
      />
    </section>
  );
}
