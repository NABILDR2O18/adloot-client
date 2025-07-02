import React from "react";
import api from "@/lib/axios";
import { useParams, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Card, CardContent } from "@/components/ui/card";

const OfferWallPreviewRedirect = () => {
  const [searchParams] = useSearchParams();
  const { id: offerId } = useParams();
  const apiKey = searchParams.get("placementId") || "";
  const userId = searchParams.get("user") || "";
  const country = searchParams.get("country") || "";
  const origin = searchParams.get("origin") || "";
  const ip = searchParams.get("ip") || "";
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!offerId || !apiKey || !userId || !country || !origin) return;
    const postTracking = async () => {
      try {
        const response = await api.post(
          "/public/wall/offers/tracking/advertiser",
          {
            offerId,
            apiKey,
            userId,
            country,
            origin,
            ip,
          }
        );
        if (response.status === 200) {
          toast.success(response?.data?.message || "Success");
          const previewUrl = response?.data?.data?.previewUrl;
          if (previewUrl) {
            window.location.href = previewUrl;
          }
        }
      } catch (error) {
        toast.error("Something went wrong, try again later!");
        setError(
          error?.response?.data?.message ||
            "Something went wrong, try again later!"
        );
      }
    };

    postTracking();
  }, [apiKey, country, offerId, origin, userId, ip]);

  return (
    <div className="flex justify-center items-center h-64">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center py-8">
          {error ? (
            <p className="text-red-600 text-center">{error}</p>
          ) : (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OfferWallPreviewRedirect;
