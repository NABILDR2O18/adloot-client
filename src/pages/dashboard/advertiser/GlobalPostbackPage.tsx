import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CopyIcon, Plus, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "@/lib/axios";

export default function GlobalPostbackPage() {
  const [globalPostbackUrl, setGlobalPostbackUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [addIpLoading, setAddIpLoading] = useState(false);
  const navigate = useNavigate();
  const [ipAddresses, setIpAddresses] = useState([]);
  const [newIpAddress, setNewIpAddress] = useState("");

  const getTrackingUrl = async () => {
    setLoading(true);
    try {
      const response = await api.get("/advertiser/tracking");
      if (response.status === 200) {
        setGlobalPostbackUrl(response?.data?.data?.trackingSetup?.postback_url);
        const ips = response?.data?.data?.trackingSetup?.whitelist_ip?.map(
          (ip: string, index: number) => ({
            id: index + 1,
            address: ip,
          })
        );
        setIpAddresses(ips || []);
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

  const handleCopyPostback = () => {
    navigator.clipboard.writeText(globalPostbackUrl);
    toast.success("Postback URL copied to clipboard!");
  };

  const saveWhitelistedIps = async (ips: string[]) => {
    try {
      const res = await api.post("/advertiser/tracking/postback/whitelist", {
        whitelist_ip: ips,
      });
      if (res.status === 200) {
        toast.success("Whitelisted IPs updated successfully!");
      }
    } catch (error) {
      toast.error("Failed to update whitelisted IPs.");
    } finally {
      setAddIpLoading(false);
    }
  };

  const handleAddIp = () => {
    if (!newIpAddress) {
      toast.error("Please enter an IP address");
      return;
    }
    setAddIpLoading(true);
    // Simple IP validation
    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipPattern.test(newIpAddress)) {
      toast.error("Please enter a valid IPv4 address");
      return;
    }
    const newId =
      ipAddresses.length > 0
        ? Math.max(...ipAddresses.map((ip) => ip.id)) + 1
        : 1;
    const updatedIps = [...ipAddresses, { id: newId, address: newIpAddress }];
    setIpAddresses(updatedIps);
    setNewIpAddress("");
    saveWhitelistedIps(updatedIps.map((ip) => ip.address));
  };

  const handleRemoveIp = async (id: number) => {
    const updatedIps = ipAddresses.filter((ip) => ip.id !== id);
    setIpAddresses(updatedIps);
    try {
      const res = await api.post("/advertiser/tracking/postback/whitelist", {
        whitelist_ip: updatedIps.map((ip) => ip.address),
      });
      if (res.status === 200) {
        toast.success("Whitelisted IPs updated successfully!");
      }
    } catch {
      toast.error("Failed to update whitelisted IPs.");
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
          <CardTitle className="text-2xl">Global Postback</CardTitle>
          <CardDescription>
            Configure your global postback settings for tracking campaigns on
            your system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Prerequisite</h3>
              <p className="text-gray-600 mb-4">
                The global postback will automatically be created once you setup
                your tracking placeholders. If you haven't or need to modify,
                please do so by clicking the button below.
              </p>
              <Button
                onClick={() => navigate("/advertiser/dashboard/tracking-setup")}
                variant="default"
                className="bg-yellow-500 hover:bg-yellow-600"
              >
                Edit Tracking Placeholders
              </Button>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-medium mb-2">The Global Postback</h3>
              <p className="text-gray-600 mb-4">
                You need to place our global postback URL to your website's
                postback settings page.
              </p>

              <div className="bg-gray-100 p-4 rounded-md flex items-center justify-between">
                <code className="text-sm text-purple-600 break-all">
                  {globalPostbackUrl}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyPostback}
                >
                  <CopyIcon size={16} className="mr-2" />
                  Copy URL
                </Button>
              </div>

              <div className="mt-6 bg-yellow-50 border border-yellow-200 p-4 rounded-md">
                <p className="font-semibold text-yellow-800">IMPORTANT!</p>
                <p className="font-medium text-yellow-800 mt-2">
                  Adding event to your postback is depend upon the campaign
                  type, below is the list of type we support:
                </p>
                <ul className="list-disc pl-4 text-yellow-800 my-3 text-sm">
                  <li>Cost Per Install (CPI)</li>
                  <li>Cost Per Action (CPA)</li>
                  <li>Cost Per Event (CPE)</li>
                </ul>
                <p className="text-yellow-700 mt-2">
                  If campaign type is CPI or CPE the{" "}
                  <code className="bg-yellow-100 px-1 py-0.5 rounded text-yellow-800">
                    event_token={"{YOUR_EVENT_TOKEN}"}
                  </code>{" "}
                  will be required. With type CPA the event is optional,
                  Advertiser (You) will not receive token and so no event token
                  in post back too. <br />
                  In simple words, The advertiser system should always send
                  event token back if receives in tracking.
                </p>
                <p className="text-yellow-700 mt-2">
                  Please note that we support{" "}
                  <span className="font-medium">
                    multi payable event per offer
                  </span>
                  .
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Whitelisted IP Addresses</CardTitle>
          <CardDescription>
            Below is the list of all allowed IP Addresses for Postback coming
            from your server. IPs not in the whitelist will not be processed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Input
              placeholder="Enter IP Address (e.g. 192.168.1.2)"
              value={newIpAddress}
              onChange={(e) => setNewIpAddress(e.target.value)}
              className="max-w-md"
            />
            <Button
              disabled={addIpLoading}
              variant="default"
              className="bg-purple-600 hover:bg-purple-700"
              onClick={handleAddIp}
            >
              <Plus size={16} /> {addIpLoading ? "Saving" : "Save"}
            </Button>
          </div>
          <div className="text-xs text-gray-500 mb-4">
            Please use either an IPv4 address, or an IP in long format only
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-3/4">IP Address</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ipAddresses.map((ip) => (
                <TableRow key={ip.id}>
                  <TableCell>{ip.address}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveIp(ip.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {ipAddresses.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={2}
                    className="text-center py-4 text-gray-500"
                  >
                    No IP addresses whitelisted
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
