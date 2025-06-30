
import { createContext, useState, useContext, ReactNode } from "react";

type UserType = "publisher" | "advertiser";

interface AuthModalContextType {
  isLoginOpen: boolean;
  isSignupOpen: boolean;
  userType: UserType;
  openLogin: () => void;
  closeLogin: () => void;
  openSignup: () => void;
  closeSignup: () => void;
  setUserType: (type: UserType) => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (context === undefined) {
    throw new Error("useAuthModal must be used within an AuthModalProvider");
  }
  return context;
}

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [userType, setUserType] = useState<UserType>("publisher");

  const openLogin = () => {
    setIsLoginOpen(true);
    setIsSignupOpen(false);
  };

  const closeLogin = () => {
    setIsLoginOpen(false);
  };

  const openSignup = () => {
    setIsSignupOpen(true);
    setIsLoginOpen(false);
  };

  const closeSignup = () => {
    setIsSignupOpen(false);
  };

  return (
    <AuthModalContext.Provider
      value={{
        isLoginOpen,
        isSignupOpen,
        userType,
        openLogin,
        closeLogin,
        openSignup,
        closeSignup,
        setUserType
      }}
    >
      {children}
    </AuthModalContext.Provider>
  );
}
