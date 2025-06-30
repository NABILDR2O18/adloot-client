import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CopyIcon, Save } from "lucide-react";
import { toast } from "react-hot-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import api from "@/lib/axios";

function parseSimpleTrackingUrl(url: string) {
  try {
    const u = new URL(url);
    const base = `${u.origin}${u.pathname}`;
    const paramsArr = Array.from(u.searchParams.entries()).map(
      ([key, value]) => ({
        key,
        value: value.replace(/[{}]/g, ""), // remove curly braces if present
      })
    );
    // Ensure click_id is always present
    if (!paramsArr.some((p) => p.key === "click_id")) {
      paramsArr.unshift({ key: "click_id", value: "click_id" });
    }
    return { base, params: paramsArr };
  } catch {
    // fallback if not a valid URL
    return { base: url, params: [{ key: "click_id", value: "click_id" }] };
  }
}

const DEFAULT_PARAMS = [
  { key: "click_id", value: "click_id" }, // always present
  { label: "{event_token}", value: "event_token" }, // always present
  { key: "country_code", value: "country_code" },
  { key: "device_id", value: "device_id" },
  { key: "user_id", value: "user_id" },
];

const PLACEHOLDER_OPTIONS = [
  { label: "{click_id}", value: "click_id" },
  { label: "{source}", value: "source" },
  { label: "{country_code}", value: "country_code" },
  { label: "{device_id}", value: "device_id" },
  { label: "{user_id}", value: "user_id" },
  { label: "{gaid}", value: "gaid" },
  { label: "{idfa}", value: "idfa" },
  { label: "{status}", value: "status" },
  { label: "{offer_id}", value: "offer_id" },
  { label: "{event_token}", value: "event_token" },
  { label: "{offer_name}", value: "offer_name" },
  { label: "{click_ip}", value: "click_ip" },
];

export default function TrackingSetupPage() {
  const [simpleTrackingUrl, setSimpleTrackingUrl] = useState("");
  const [params, setParams] = useState(DEFAULT_PARAMS);
  const [addLoading, setAddLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [trackingBase, setTrackingBase] = useState("http://www.yourdomain.com");

  const getTrackingUrl = async () => {
    setLoading(true);
    try {
      const response = await api.get("/advertiser/tracking");
      if (response.status === 200) {
        setSimpleTrackingUrl(response?.data?.data?.trackingSetup?.tracking_url);
        const { base, params } = parseSimpleTrackingUrl(
          response?.data?.data?.trackingSetup?.tracking_url
        );
        setTrackingBase(base);
        setParams(params);
      }
    } catch (error) {
      console.error("Failed to get tracking url:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTrackingUrl();
  }, []);

  const handleCopyTrackingLink = () => {
    navigator.clipboard.writeText(trackingBase);
    toast.success("Tracking link copied to clipboard!");
  };

  // Add a new param (except click_id)
  const handleAddParam = () => {
    setParams((prev) => [
      ...prev,
      { key: "", value: PLACEHOLDER_OPTIONS[1].value },
    ]);
  };

  // Remove param by index (except click_id)
  const handleRemoveParam = (idx: number) => {
    if (params[idx].key === "click_id") return; // don't remove click_id
    setParams((prev) => prev.filter((_, i) => i !== idx));
  };

  // Update param key or value
  const handleParamChange = (
    idx: number,
    field: "key" | "value",
    val: string
  ) => {
    setParams((prev) =>
      prev.map((p, i) =>
        i === idx
          ? {
              ...p,
              [field]: val,
            }
          : p
      )
    );
  };

  // Build preview URL
  const previewUrl =
    trackingBase +
    "?" +
    params
      .filter((p) => p.key)
      .map((p) => `${encodeURIComponent(p.key)}={${p.value}}`)
      .join("&");

  // Add this function inside your TrackingSetupPage component

  const handleSaveTrackingUrl = async () => {
    // Build the final tracking URL from base and params
    const finalTrackingUrl =
      trackingBase +
      "?" +
      params
        .filter((p) => p.key)
        .map((p) => `${encodeURIComponent(p.key)}={${p.value}}`)
        .join("&");
    setAddLoading(true);
    try {
      // Replace with your actual API endpoint and payload as needed
      const res = await api.post("/advertiser/tracking", {
        tracking_url: finalTrackingUrl,
        params,
        tracking_base: trackingBase,
      });
      if (res.status === 200) {
        setSimpleTrackingUrl(res?.data?.data?.trackingSetup?.tracking_url);
      }
      toast.success("Tracking URL saved successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to save tracking URL.");
    } finally {
      setAddLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Global Tracking Setup</CardTitle>
          <CardDescription>
            Configure your tracking parameters to accurately track user
            interactions with your campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-2">Adloot Placeholders</h3>
              <p className="text-gray-600 mb-4">
                Below is the list of all supported placeholders, their data type
                and description.
              </p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="bg-purple-50">Parameters</TableHead>
                    <TableHead className="bg-purple-50">Type</TableHead>
                    <TableHead className="bg-purple-50">Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="font-mono bg-purple-50 text-purple-700 border-purple-200"
                      >
                        {"{click_id}"}
                      </Badge>
                    </TableCell>
                    <TableCell>String</TableCell>
                    <TableCell>
                      The click id identifier. Does not necessarily mean unique.
                      No character limit.
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="font-mono bg-purple-50 text-purple-700 border-purple-200"
                      >
                        {"{source}"}
                      </Badge>
                    </TableCell>
                    <TableCell>Numeric</TableCell>
                    <TableCell>
                      ID of the app or website that the traffic came from.
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="font-mono bg-purple-50 text-purple-700 border-purple-200"
                      >
                        {"{offer_id}"}
                      </Badge>
                    </TableCell>
                    <TableCell>Numeric</TableCell>
                    <TableCell>
                      Adloot offer ID associated with your approved offer. Not
                      the ID you see in your offers list.
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="font-mono bg-purple-50 text-purple-700 border-purple-200"
                      >
                        {"{gaid}"}
                      </Badge>
                    </TableCell>
                    <TableCell>String</TableCell>
                    <TableCell>
                      Google advertiser ID (GAID). If present, will be passed on
                      this placeholder.
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="font-mono bg-purple-50 text-purple-700 border-purple-200"
                      >
                        {"{idfa}"}
                      </Badge>
                    </TableCell>
                    <TableCell>String</TableCell>
                    <TableCell>
                      The Identifier for Advertisers (IDFA), a device identifier
                      assigned by Apple to a user's device. If present, will be
                      passed on this placeholder.
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="font-mono bg-purple-50 text-purple-700 border-purple-200"
                      >
                        {"{device_id}"}
                      </Badge>
                    </TableCell>
                    <TableCell>String</TableCell>
                    <TableCell>
                      An alias to {"{gaid}"} or {"{idfa}"}. If either is
                      present, will be passed on this placeholder.
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="font-mono bg-purple-50 text-purple-700 border-purple-200"
                      >
                        {"{status}"}
                      </Badge>
                    </TableCell>
                    <TableCell>String</TableCell>
                    <TableCell>
                      Offer status whether active, paused, stopped, etc
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="font-mono bg-purple-50 text-purple-700 border-purple-200"
                      >
                        {"{offer_name}"}
                      </Badge>
                    </TableCell>
                    <TableCell>String</TableCell>
                    <TableCell>The offer name</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="font-mono bg-purple-50 text-purple-700 border-purple-200"
                      >
                        {"{event_token}"}
                      </Badge>
                    </TableCell>
                    <TableCell>String</TableCell>
                    <TableCell>
                      The current event token which user is completing
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="font-mono bg-purple-50 text-purple-700 border-purple-200"
                      >
                        {"{user_id}"}
                      </Badge>
                    </TableCell>
                    <TableCell>String</TableCell>
                    <TableCell>The publisher user's id</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="font-mono bg-purple-50 text-purple-700 border-purple-200"
                      >
                        {"{country_code}"}
                      </Badge>
                    </TableCell>
                    <TableCell>String</TableCell>
                    <TableCell>
                      The user country code during the click.
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="font-mono bg-purple-50 text-purple-700 border-purple-200"
                      >
                        {"{click_ip}"}
                      </Badge>
                    </TableCell>
                    <TableCell>String</TableCell>
                    <TableCell>The IP used during the click.</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Placeholder Settings</CardTitle>
          <CardDescription>
            This tool is used to match your placeholders with our supported
            placeholders.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            When adding an offer and providing the tracking link with your own
            placeholders, our system will look into this settings and will
            automatically transform your tracking link with the supported
            placeholders to ensure we supply you with the correct values.
            <br />
            <br /> We provide preview of the final tracking URL before you save
            the offer so you will still have the chance to edit it to your
            tracking preference. In other words, the final tracking URL will
            still depend on your final edit and thus, overwriting this settings.
          </p>

          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md mb-6">
            <div className="flex items-center gap-2">
              <span className="font-medium text-yellow-800 uppercase text-sm">
                Important
              </span>
              <Badge
                variant="outline"
                className="font-mono bg-yellow-100 text-yellow-800 border-yellow-300"
              >
                {"{click_id}"}
              </Badge>
              <p className="text-yellow-700">
                is necessary for postback tracking and is therefore required to
                be attached to one of your placeholders.
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md mb-6">
            <div className="flex items-center gap-2">
              <span className="font-medium text-yellow-800 uppercase text-sm">
                Important
              </span>
              <Badge
                variant="outline"
                className="font-mono bg-yellow-100 text-yellow-800 border-yellow-300"
              >
                {"{event_token}"}
              </Badge>
              <p className="text-yellow-700">
                is necessary for postback tracking (For type CPI and CPE) and is
                therefore required to be attached to one of your placeholders
                (For type CPI and CPE).
              </p>
            </div>
          </div>

          <Tabs defaultValue="simple-tracking">
            <TabsList>
              <TabsTrigger value="simple-tracking">Simple Tracking</TabsTrigger>
              <TabsTrigger value="advance-tracking">
                Advance Tracking
              </TabsTrigger>
            </TabsList>
            <TabsContent value="simple-tracking">
              <Card>
                <CardHeader>
                  <CardTitle>Simple Tracking</CardTitle>
                  <CardDescription>
                    To start, please enter your tracking link in the box below.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div className="flex gap-2 mb-4">
                    <Input
                      className="flex-1"
                      placeholder="http://www.yourdomain.com?click_id={click_id}&user_id={user_id}"
                      value={simpleTrackingUrl}
                      onChange={(e) => {
                        setSimpleTrackingUrl(e.target.value);
                        const { base, params } = parseSimpleTrackingUrl(
                          e.target.value
                        );
                        setTrackingBase(base);
                        setParams(params);
                      }}
                    />
                    <Button variant="outline" onClick={handleCopyTrackingLink}>
                      <CopyIcon size={16} className="mr-2" />
                      Copy URL
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button disabled={addLoading} onClick={handleSaveTrackingUrl}>
                    <Save className="h-4 w-4" />{" "}
                    {addLoading ? "Saving..." : "Save Tracking URL"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="advance-tracking">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Tracking</CardTitle>
                  <CardDescription>
                    To start, please enter your tracking base url in the box
                    below.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <Input
                    value={trackingBase}
                    onChange={(e) => setTrackingBase(e.target.value)}
                    className="flex-1"
                    placeholder="http://www.yourdomain.com"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h5 className="text-sm font-semibold text-start mb-2">
                        YOUR PLACEHOLDERS
                      </h5>
                      <div className="space-y-3">
                        {params.map((param, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <Input
                              value={param.key}
                              onChange={(e) =>
                                handleParamChange(idx, "key", e.target.value)
                              }
                              placeholder="Param name"
                              disabled={
                                param.key === "click_id" ||
                                param.key === "event_token"
                              }
                            />
                            {param.key !== "click_id" &&
                              param.key !== "event_token" && (
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleRemoveParam(idx)}
                                  title="Remove"
                                >
                                  ×
                                </Button>
                              )}
                          </div>
                        ))}
                      </div>
                      <Button
                        className="mt-4"
                        variant="outline"
                        onClick={handleAddParam}
                      >
                        + Add Parameter
                      </Button>
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold text-start mb-2">
                        OUR PLACEHOLDERS
                      </h5>
                      <div className="space-y-3">
                        {params.map((param, idx) => (
                          <Select
                            key={idx}
                            value={param.value}
                            onValueChange={(val) =>
                              handleParamChange(idx, "value", val)
                            }
                            disabled={
                              param.key === "click_id" ||
                              param.key === "event_token"
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select placeholder" />
                            </SelectTrigger>
                            <SelectContent>
                              {PLACEHOLDER_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex items-end flex-col gap-4">
                  <div className="w-full">
                    <p className="text-sm text-gray-600 mb-3">
                      Your final tracking URL would look like:
                    </p>
                    <code className="text-sm text-purple-600 break-all bg-purple-50 p-3 block rounded-md">
                      {previewUrl}
                    </code>
                  </div>
                  <Button disabled={addLoading} onClick={handleSaveTrackingUrl}>
                    <Save className="h-4 w-4" />{" "}
                    {addLoading ? "Saving..." : "Save Tracking URL"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
