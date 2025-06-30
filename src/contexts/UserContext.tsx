import React, { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/axios";
import { destroyCookie, parseCookies } from "nookies";

export type UserRole = "admin" | "publisher" | "advertiser";
export type UserStatus = "active" | "suspended" | "unverified" | "pending";

export interface IUser {
  id: string;
  full_name: string;
  email: string;
  company_name: string;
  role: UserRole;
  status: UserStatus;
  website_or_app: string | null;
  phone: string | null;
  country: string;
  address: string;
  city: string;
  state_province: string;
  bio: string | null;
  available_balance: number;
  pending_balance: number;
  chargeback_balance: number;
  lifetime_earnings: number;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

interface UserContextType {
  user: IUser | null;
  setUser: (
    user: IUser | null | ((prev: IUser | null) => IUser | null)
  ) => void;
  isLoading: boolean;
  logout: () => Promise<void>; // new logout function
  fetchUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const cookies = parseCookies();
  const token = cookies.session;

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/shared/account");
      if (res.data && res.data.success) {
        setUser({
          ...res.data.data.user,
        });
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user details on mount
  useEffect(() => {
    if (!token) return;
    fetchUser();
  }, [token]);

  // Logout function
  const logout = async () => {
    try {
      await api.post(`/${user?.role}/logout`);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      destroyCookie(null, "session", {
        path: "/",
      });
      window.location.reload();
    }
  };

  return (
    <UserContext.Provider
      value={{ user, setUser, isLoading, logout, fetchUser }}
    >
      {isLoading ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80">
          <div className="flex flex-col items-center">
            <span className="animate-spin rounded-full h-10 w-10 border-4 border-purple-500 border-t-transparent mb-4"></span>
            <span className="text-lg text-gray-700">Loading...</span>
          </div>
        </div>
      ) : (
        children
      )}
    </UserContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export default UserContext;
