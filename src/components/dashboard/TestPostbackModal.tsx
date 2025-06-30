/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check } from "lucide-react";
import { IApp } from "@/pages/dashboard/MyAppsPage";
import toast from "react-hot-toast";
import axios from "axios";
import api from "@/lib/axios";

export interface TestPostbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  app: IApp;
}

const REQUIRED_PARAMS = [
  "user_id",
  "reward",
  "transaction_id",
  "offer_id",
  "status",
];

const OPTIONAL_PARAMS = [
  "ip",
  "device",
  "payout",
  "country",
  "event_time",
  "currency",
  "offer_name",
];

function extractParamsFromUrl(url: string | undefined) {
  if (!url) return [];
  const matches = url.match(/{(.*?)}/g);
  if (!matches) return [];
  return matches.map((m) => m.replace(/[{}]/g, ""));
}

export function TestPostbackModal({
  isOpen,
  onClose,
  app,
}: TestPostbackModalProps) {
  const [copied, setCopied] = useState(false);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Extract params from postback_url
  const params = useMemo(
    () => extractParamsFromUrl(app?.postback_url),
    [app?.postback_url]
  );

  const requiredParams = params.filter((p) => REQUIRED_PARAMS.includes(p));
  const optionalParams = params.filter(
    (p) => OPTIONAL_PARAMS.includes(p) && !requiredParams.includes(p)
  );

  const handleCopy = (postbackUrl: string) => {
    navigator.clipboard.writeText(postbackUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInputChange = (param: string, value: string) => {
    setInputs((prev) => ({ ...prev, [param]: value }));
  };

  const buildTestUrl = () => {
    let url = app?.postback_url || "";
    params.forEach((param) => {
      url = url.replace(`{${param}}`, encodeURIComponent(inputs[param] || ""));
    });
    return url;
  };

  const handleTest = async () => {
    for (const param of requiredParams) {
      if (!inputs[param]) {
        toast.error(`Please enter ${param}`);
        return;
      }
    }
    const testUrl = buildTestUrl();
    setLoading(true);
    try {
      const res = await api.post(`/publisher/test-postback`, {
        postback_url: testUrl,
      });
      if (res.status === 200) {
        toast.success("Postback URL tested successfully!");
      }
    } catch (err: any) {
      toast.error(
        `Failed: ${err?.response?.status || ""} ${
          err?.response?.statusText || err.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="!max-h-max !overflow-hidden">
          <DialogTitle>Test Postback URL</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="postback-url">Postback URL</Label>
            <div className="flex items-center space-x-2">
              <Input readOnly id="postback-url" value={app?.postback_url} />
              <Button
                size="icon"
                variant="outline"
                className="flex-shrink-0"
                onClick={() => handleCopy(app?.postback_url)}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          {params.length > 0 && (
            <div className="space-y-3">
              <div>
                <Label>Required Parameters</Label>
                {requiredParams.map((param) => (
                  <div key={param} className="mt-2">
                    <Input
                      placeholder={param}
                      value={inputs[param] || ""}
                      onChange={(e) => handleInputChange(param, e.target.value)}
                      required
                      type={param === "reward" ? "number" : "text"}
                    />
                  </div>
                ))}
              </div>
              {optionalParams.length > 0 && (
                <div>
                  <Label>Optional Parameters</Label>
                  {optionalParams.map((param) => (
                    <div key={param} className="mt-2">
                      <Input
                        placeholder={param}
                        value={inputs[param] || ""}
                        onChange={(e) =>
                          handleInputChange(param, e.target.value)
                        }
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleTest} disabled={loading}>
            {loading ? "Testing..." : "Test Postback"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
