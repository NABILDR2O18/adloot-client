import { X, AlertTriangle, ImageIcon, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import toast from "react-hot-toast";
import {
  getOfferPointsAndPayout,
  IBitlabOffer,
  IPInfoResponse,
  PromotionConfig,
} from "@/pages/Offerwall";
import api from "@/lib/axios";
import { calculateCampaignDistribution } from "@/utils/calculateCampaignDistribution";

interface OfferPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer?: IBitlabOffer | null; // We'll use static data for now
  app?: PromotionConfig;
  apiKey: string;
  userId: string;
  location: IPInfoResponse;
  promo: number;
  ip: string;
}

export function BitlabOfferPreview({
  isOpen,
  onClose,
  offer,
  app,
  apiKey,
  userId,
  location,
  promo,
  ip,
}: OfferPreviewModalProps) {
  const [email, setEmail] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [eventIds, setEventIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSendLink = async () => {
    // Simple email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      const response = await api.post("/public/wall/offers/link", {
        offerId: offer?.id,
        email,
        apiKey,
        userId,
        redirectUrl,
        ip: location?.ip,
        isBitlab: true,
        bitlabOfferName: offer?.name,
      });
      if (response.status === 200) {
        toast.success(
          "The offer link has been sent, check out your mail (or spam) box."
        );
        setEmailError("");
        setAcceptedTerms(false);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong, try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getEvents = async () => {
      try {
        const response = await api.post("/public/wall/offers/events", {
          ip,
          offerId: offer?.id,
        });
        if (response.status === 200) {
          setEventIds(response?.data?.data?.events);
        }
      } catch (error) {
        console.error("Unable to fetch events", error);
      }
    };
    getEvents();
  }, [ip, offer?.id]);

  const output = getOfferPointsAndPayout(offer?.events);
  const userShare =
    calculateCampaignDistribution(
      Number(output?.payout),
      Number(0),
      Number(app?.split_to_user),
      promo
    )?.userShare * Number(app?.conversion_rate);

  const firstNotCompletedEvent = offer?.events.find(
    (event) => !eventIds.includes(event.id)
  );

  const redirectUrl = `${import.meta.env.VITE_BASE_URL}/wall/${
    offer?.id
  }?placementId=${apiKey}&user=${userId}&country=${location?.country?.toLowerCase()}&origin=offerwall&ip=${
    location?.ip
  }&platform=bitlab&event=${firstNotCompletedEvent?.id}`;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-w-full md:w-[90%] w-full p-0 overflow-hidden border-none bg-white"
        hideClose={true}
      >
        <div
          className="w-full p-4 relative"
          style={{ backgroundColor: app.design_primary_color }}
        >
          <div className="flex items-end gap-4 justify-between">
            <aside className="flex justify-center items-center gap-4 max-w-[80%]">
              <div className="min-w-10 h-10 md:min-w-12 md:h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                {offer?.icon ? (
                  <img
                    src={offer?.icon}
                    alt={offer?.name}
                    className="w-full h-full rounded-md overflow-hidden object-cover"
                  />
                ) : (
                  <ImageIcon size={20} />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-white capitalize">
                  {offer?.name}
                </h2>
                <p className="text-white">{offer?.description}</p>
              </div>
            </aside>
            <div className="flex items-center gap-3">
              {offer?.device_targeting?.platforms?.map((device) => {
                return (
                  <Badge
                    variant="secondary"
                    className="px-1.5 py-0 text-[10px] md:text-xs bg-gray-100 text-gray-700 capitalize"
                    key={device?.name}
                  >
                    {device?.name === "smartphone"
                      ? "🤖 Android"
                      : `⌘ ${device?.name}`}
                  </Badge>
                );
              })}
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute right-3 top-3 text-white hover:opacity-70 transition-opacity"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <section className="md:grid grid-cols-2 gap-6 p-4">
          <div className="space-y-4 order-2 md:order-1">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Reward Steps:</h4>
              <div className="space-y-3">
                {offer?.events?.map((offerEvent, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg border border-gray-200 ${
                      eventIds?.includes(offerEvent?.id)
                        ? "bg-gray-50"
                        : "bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-sm font-medium text-gray-700">
                        {index + 1}
                      </div>
                      {eventIds?.includes(offerEvent?.id) && (
                        <Check className="text-green-500" />
                      )}
                      <span className="text-gray-700">{offerEvent.name}</span>
                    </div>
                    <div className="font-medium text-gray-900">
                      +
                      {`${(
                        calculateCampaignDistribution(
                          Number(offerEvent?.payout),
                          Number(0),
                          Number(app?.split_to_user),
                          promo
                        )?.userShare * Number(app?.conversion_rate)
                      )?.toFixed(Number(app?.currency_reward_rounding))} ${
                        app?.currency_name_plural
                      }`}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex gap-2 text-yellow-700">
                <AlertTriangle size={20} />
                <div className="text-sm">
                  <p className="font-medium">Before you start:</p>
                  <ul className="list-disc list-inside mt-1 text-yellow-600">
                    <li>Complete all requirements to receive rewards</li>
                    <li>Rewards may take up to 24 hours to be credited</li>
                    <li>Each offer can only be completed once</li>
                    <li>Use the same device throughout the offer</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <Button
                disabled={!firstNotCompletedEvent}
                onClick={() => {
                  if (redirectUrl) {
                    window.open(redirectUrl, "_blank");
                  }
                }}
                className="w-full mb-2"
              >
                Start {`(${firstNotCompletedEvent?.name})`}
              </Button>

              <div className="text-sm text-gray-500">Total Reward</div>
              <div className="text-2xl font-bold text-gray-900">
                {`${userShare?.toFixed(
                  Number(app?.currency_reward_rounding)
                )} ${app?.currency_name_plural}`}
              </div>
            </div>
          </div>

          <div className="space-y-6 order-1 md:order-2 md:block hidden">
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex flex-col lg:flex-row items-center">
                <QRCodeCanvas
                  value={redirectUrl || ""}
                  size={150}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="H"
                  className="mb-3"
                />
                <div className="lg:ml-4">
                  <h4 className="font-semibold text-gray-700">QR code</h4>
                  <p className="text-gray-700">
                    Scan the generated image code with your mobile device
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6">
              {showEmailForm ? (
                <div className="space-y-2">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full"
                  />
                  {emailError && (
                    <p className="text-red-500 text-sm">{emailError}</p>
                  )}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={acceptedTerms}
                      onCheckedChange={(checked) =>
                        setAcceptedTerms(checked as boolean)
                      }
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600">
                      By providing your email address and checking this box, you
                      agree that the info will be used by Adloot in order to
                      provide you an improved service.
                    </label>
                  </div>
                  <Button
                    className="w-full py-4 text-lg"
                    style={{ backgroundColor: app?.design_primary_color }}
                    disabled={!email || !acceptedTerms || loading}
                    onClick={handleSendLink}
                  >
                    {loading ? "Sending" : "Send link"}
                  </Button>
                </div>
              ) : (
                <Button
                  disabled={!firstNotCompletedEvent}
                  className="w-full py-6 text-lg"
                  style={{ backgroundColor: app?.design_primary_color }}
                  onClick={() => setShowEmailForm(true)}
                >
                  E-mail link to your phone
                </Button>
              )}
            </div>
          </div>
        </section>
      </DialogContent>
    </Dialog>
  );
}
