import React, { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/axios";

export interface IGlobalSettings {
  id: string;
  site_name: string;
  support_email: string;
  time_zone: string;
  maintenance_mode: boolean;
  min_withdrawal: number;
  admin_campaign_percentage: number;
  default_currency: string;
  auto_approve_withdrawals: boolean;
  manual_review_large_tx: boolean;
  require_2fa_admins: boolean;
  ip_restriction: boolean;
  session_timeout: boolean;
  password_policy: string;
  email_alerts: boolean;
  fraud_alerts: boolean;
  system_alerts: boolean;
  daily_reports: boolean;
  api_rate_limit: number;
  api_timeout: number;
  debug_mode: boolean;
  cache_duration: number;
  max_upload_size: number;
  created_at: string;
  updated_at: string;
}

interface SettingsContextType {
  settings: IGlobalSettings | null;
  setSettings: (
    settings:
      | IGlobalSettings
      | null
      | ((prev: IGlobalSettings | null) => IGlobalSettings | null)
  ) => void;
  isLoading: boolean;
  fetchSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<IGlobalSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/public/system/settings");
      if (res.data && res.data.success) {
        setSettings(res.data?.data?.settings);
      } else {
        setSettings(null);
      }
    } catch {
      setSettings(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider
      value={{ settings, setSettings, isLoading, fetchSettings }}
    >
      {isLoading ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80">
          <div className="flex flex-col items-center">
            <span className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent mb-4"></span>
            <span className="text-lg text-gray-700">Loading...</span>
          </div>
        </div>
      ) : (
        children
      )}
    </SettingsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

export default SettingsContext;
