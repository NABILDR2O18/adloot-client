/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Save,
  RefreshCw,
  Settings,
  Globe,
  DollarSign,
  Shield,
  Bell,
} from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import api from "@/lib/axios";
import toast from "react-hot-toast";

export default function SystemSettings() {
  const { settings, setSettings } = useSettings();
  const [form, setForm] = useState(settings);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({
      ...prev!,
      [field]: value,
    }));
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      const res = await api.put("/admin/system/settings", form);
      if (res.status === 200) {
        toast.success("Settings updated!");
        setSettings(res?.data?.data?.settings);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-lg font-medium">System Configuration</h2>
        <Button
          onClick={handleSaveSettings}
          className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1"
          disabled={loading}
        >
          {loading ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          <span>Save All Changes</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-purple-500" />
              <CardTitle>General Settings</CardTitle>
            </div>
            <CardDescription>Configure system-wide settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Platform Name</Label>
              <Input
                id="siteName"
                value={form.site_name}
                onChange={(e) => handleChange("site_name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input
                id="supportEmail"
                value={form.support_email}
                onChange={(e) => handleChange("support_email", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeZone">Default Time Zone</Label>
              <select
                id="timeZone"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                value={form.time_zone}
                onChange={(e) => handleChange("time_zone", e.target.value)}
              >
                <option value="UTC">UTC (Coordinated Universal Time)</option>
                <option value="GMT">GMT (Greenwich Mean Time)</option>
                <option value="EST">EST (Eastern Standard Time)</option>
                <option value="PST">PST (Pacific Standard Time)</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Put system in maintenance mode
                </p>
              </div>
              <Switch
                id="maintenanceMode"
                checked={form.maintenance_mode}
                onCheckedChange={(v) => handleChange("maintenance_mode", v)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Payment Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-purple-500" />
              <CardTitle>Payment Settings</CardTitle>
            </div>
            <CardDescription>
              Configure payment options and thresholds
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="campaignPercentage">Campaign percentage</Label>
              <Input
                id="campaignPercentage"
                type="number"
                value={form.admin_campaign_percentage}
                onChange={(e) =>
                  handleChange(
                    "admin_campaign_percentage",
                    Number(e.target.value)
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minWithdrawal">Minimum Withdrawal Amount</Label>
              <Input
                id="minWithdrawal"
                type="number"
                value={form.min_withdrawal}
                onChange={(e) =>
                  handleChange("min_withdrawal", Number(e.target.value))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Default Currency</Label>
              <select
                id="currency"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                value={form.default_currency}
                onChange={(e) =>
                  handleChange("default_currency", e.target.value)
                }
              >
                <option value="USD">USD (US Dollar)</option>
                <option value="EUR">EUR (Euro)</option>
                <option value="GBP">GBP (British Pound)</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="autoApprove">Auto-approve Withdrawals</Label>
                <p className="text-sm text-muted-foreground">
                  For trusted publishers only
                </p>
              </div>
              <Switch
                id="autoApprove"
                checked={form.auto_approve_withdrawals}
                onCheckedChange={(v) =>
                  handleChange("auto_approve_withdrawals", v)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="manualReview">
                  Manual Review for Large Transactions
                </Label>
                <p className="text-sm text-muted-foreground">
                  For transactions over $1000
                </p>
              </div>
              <Switch
                id="manualReview"
                checked={form.manual_review_large_tx}
                onCheckedChange={(v) =>
                  handleChange("manual_review_large_tx", v)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-500" />
              <CardTitle>Security Settings</CardTitle>
            </div>
            <CardDescription>Configure system security options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="twoFactor">Require 2FA for Admins</Label>
                <p className="text-sm text-muted-foreground">
                  Enhanced security for admin accounts
                </p>
              </div>
              <Switch
                id="twoFactor"
                checked={form.require_2fa_admins}
                onCheckedChange={(v) => handleChange("require_2fa_admins", v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="ipRestriction">IP Restriction</Label>
                <p className="text-sm text-muted-foreground">
                  Limit admin access to specific IPs
                </p>
              </div>
              <Switch
                id="ipRestriction"
                checked={form.ip_restriction}
                onCheckedChange={(v) => handleChange("ip_restriction", v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sessionTimeout">
                  Auto Logout After Inactivity
                </Label>
                <p className="text-sm text-muted-foreground">
                  Logout after 30 minutes of inactivity
                </p>
              </div>
              <Switch
                id="sessionTimeout"
                checked={form.session_timeout}
                onCheckedChange={(v) => handleChange("session_timeout", v)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passwordPolicy">Password Policy</Label>
              <select
                id="passwordPolicy"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                value={form.password_policy}
                onChange={(e) =>
                  handleChange("password_policy", e.target.value)
                }
              >
                <option value="basic">Basic (8+ characters)</option>
                <option value="standard">
                  Standard (8+ chars, uppercase, numbers)
                </option>
                <option value="strong">
                  Strong (12+ chars, uppercase, numbers, symbols)
                </option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-purple-500" />
              <CardTitle>Notification Settings</CardTitle>
            </div>
            <CardDescription>Configure system notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailAlerts">Email Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Send email notifications for system events
                </p>
              </div>
              <Switch
                id="emailAlerts"
                checked={form.email_alerts}
                onCheckedChange={(v) => handleChange("email_alerts", v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="fraudAlerts">Fraud Detection Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Notify admins of suspicious activities
                </p>
              </div>
              <Switch
                id="fraudAlerts"
                checked={form.fraud_alerts}
                onCheckedChange={(v) => handleChange("fraud_alerts", v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="systemAlerts">System Performance Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Notify when system performance drops
                </p>
              </div>
              <Switch
                id="systemAlerts"
                checked={form.system_alerts}
                onCheckedChange={(v) => handleChange("system_alerts", v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="dailyReports">Daily Summary Reports</Label>
                <p className="text-sm text-muted-foreground">
                  Send daily activity summaries
                </p>
              </div>
              <Switch
                id="dailyReports"
                checked={form.daily_reports}
                onCheckedChange={(v) => handleChange("daily_reports", v)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Settings */}
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-purple-500" />
              <CardTitle>Advanced Settings</CardTitle>
            </div>
            <CardDescription>
              Configure advanced system parameters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apiRateLimit">
                    API Rate Limit (requests/minute)
                  </Label>
                  <Input
                    id="apiRateLimit"
                    type="number"
                    value={form.api_rate_limit}
                    onChange={(e) =>
                      handleChange("api_rate_limit", Number(e.target.value))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apiTimeout">API Timeout (seconds)</Label>
                  <Input
                    id="apiTimeout"
                    type="number"
                    value={form.api_timeout}
                    onChange={(e) =>
                      handleChange("api_timeout", Number(e.target.value))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="debugMode">Debug Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable detailed logging
                    </p>
                  </div>
                  <Switch
                    id="debugMode"
                    checked={form.debug_mode}
                    onCheckedChange={(v) => handleChange("debug_mode", v)}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cacheDuration">
                    Cache Duration (minutes)
                  </Label>
                  <Input
                    id="cacheDuration"
                    type="number"
                    value={form.cache_duration}
                    onChange={(e) =>
                      handleChange("cache_duration", Number(e.target.value))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxUploadSize">Max Upload Size (MB)</Label>
                  <Input
                    id="maxUploadSize"
                    type="number"
                    value={form.max_upload_size}
                    onChange={(e) =>
                      handleChange("max_upload_size", Number(e.target.value))
                    }
                  />
                </div>
                {/* If you have auto_backup in your backend, add here */}
                {/* <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoBackup">Automatic Daily Backup</Label>
                    <p className="text-sm text-muted-foreground">
                      Create system backups daily
                    </p>
                  </div>
                  <Switch
                    id="autoBackup"
                    checked={form.auto_backup}
                    onCheckedChange={(v) => handleChange("auto_backup", v)}
                  />
                </div> */}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
