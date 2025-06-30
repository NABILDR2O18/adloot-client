import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Menu, X, ChevronDown, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useAuthModal } from "@/contexts/AuthModalContext";
import AuthWrapper from "./auth/AuthWrapper";
import Logo from "./Logo";
import { useUser } from "@/contexts/UserContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { openLogin, openSignup, setUserType } = useAuthModal();
  const { user, setUser, logout } = useUser();

  useEffect(() => {
    console.log("developmentInfo", {
      mode: import.meta.env.MODE,
      VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    });
  }, []);

  return (
    <>
      <AuthWrapper />
      <nav className="fixed w-full bg-white/80 backdrop-blur-sm z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <Logo size="md" />
            </div>

            <div className="hidden md:flex items-center space-x-1">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-gray-700 hover:text-purple-600 transition-colors bg-white dark:bg-transparent dark:hover:bg-transparent">
                      Solutions
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid grid-cols-2 gap-4 p-6 w-[400px] bg-white">
                        {[
                          {
                            name: "Offerwall",
                            desc: "Increase user engagement",
                            path: "/solutions/offerwall",
                          },
                          {
                            name: "SDK",
                            desc: "Easy app integration",
                            path: "/solutions/sdk",
                          },
                          {
                            name: "API",
                            desc: "Powerful customization",
                            path: "/solutions/api",
                          },
                          {
                            name: "Smart Targeting",
                            desc: "Precision marketing",
                            path: "/solutions/targeting",
                          },
                        ].map((item) => (
                          <Link
                            key={item.name}
                            to={item.path}
                            className="p-3 hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            <div className="font-medium text-gray-900">
                              {item.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.desc}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <Link
                      to="/faq"
                      className="text-gray-700 hover:text-purple-600 transition-colors px-3 py-2"
                    >
                      FAQ
                    </Link>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <Link
                      to="/docs"
                      className="text-gray-700 hover:text-purple-600 transition-colors px-3 py-2"
                    >
                      Documentation
                    </Link>
                  </NavigationMenuItem>

                  {user && (
                    <NavigationMenuItem>
                      <Link
                        to={
                          user?.role === "admin"
                            ? "/admin/dashboard"
                            : user?.role === "publisher"
                            ? "/publisher/dashboard"
                            : "/advertiser/dashboard"
                        }
                        className="text-gray-700 hover:text-purple-600 transition-colors px-3 py-2"
                      >
                        Dashboard
                      </Link>
                    </NavigationMenuItem>
                  )}
                </NavigationMenuList>
              </NavigationMenu>

              {user ? (
                <Button
                  variant="outline"
                  className="border-purple-600 text-purple-600 hover:bg-purple-50 bg-white hover:text-purple-600"
                  onClick={logout}
                >
                  Logout
                </Button>
              ) : (
                <div className="ml-4 flex items-center space-x-4">
                  <Button
                    variant="outline"
                    className="border-purple-600 text-purple-600 hover:bg-purple-50 bg-white hover:text-purple-600"
                    onClick={openLogin}
                  >
                    Log In
                  </Button>
                  <Button
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={openSignup}
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-700"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-b">
              <div className="block px-3 py-2">
                <button className="flex items-center text-gray-700 hover:text-purple-600 w-full justify-between">
                  Solutions
                  <ChevronDown size={16} />
                </button>
                <div className="pl-4 mt-2 space-y-2">
                  <Link
                    to="/solutions/offerwall"
                    className="block py-1 text-gray-600 hover:text-purple-600"
                  >
                    Offerwall
                  </Link>
                  <Link
                    to="/solutions/sdk"
                    className="block py-1 text-gray-600 hover:text-purple-600"
                  >
                    SDK
                  </Link>
                  <Link
                    to="/solutions/api"
                    className="block py-1 text-gray-600 hover:text-purple-600"
                  >
                    API
                  </Link>
                  <Link
                    to="/solutions/targeting"
                    className="block py-1 text-gray-600 hover:text-purple-600"
                  >
                    Smart Targeting
                  </Link>
                </div>
              </div>

              <Link
                to="/faq"
                className="block px-3 py-2 text-gray-700 hover:text-purple-600"
              >
                FAQ
              </Link>
              <Link
                to="/docs"
                className="block px-3 py-2 text-gray-700 hover:text-purple-600"
              >
                Documentation
              </Link>
              {user && (
                <Link
                  to={
                    user?.role === "admin"
                      ? "/admin/dashboard"
                      : user?.role === "publisher"
                      ? "/publisher/dashboard"
                      : "/advertiser/dashboard"
                  }
                  className="block px-3 py-2 text-gray-700 hover:text-purple-600"
                >
                  Dashboard
                </Link>
              )}

              {!user && (
                <div className="pt-4 space-y-2">
                  <Button
                    variant="outline"
                    className="w-full border-purple-600 text-purple-600 hover:bg-purple-50"
                    onClick={openLogin}
                  >
                    Log In
                  </Button>
                  <Button
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    onClick={openSignup}
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
