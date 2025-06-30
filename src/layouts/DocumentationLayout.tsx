
import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { FileText, ChevronDown, ChevronUp, LayoutDashboard } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

type SidebarSection = {
  title: string;
  items: {
    name: string;
    path: string;
  }[];
}

const sections: SidebarSection[] = [
  {
    title: "Offerwall",
    items: [
      { name: "HTML (iframe version)", path: "/docs/html-iframe-version" },
      { name: "Offerwall API", path: "/docs/offerwall-api" },
      { name: "Android SDK", path: "/docs/android-sdk" },
      { name: "iOS SDK", path: "/docs/ios-sdk" },
    ]
  },
  {
    title: "API",
    items: [
      { name: "Accessing the API", path: "/docs/api-access" },
      { name: "API Parameters", path: "/docs/api-parameters" },
      { name: "API Response", path: "/docs/api-response" },
    ]
  },
  {
    title: "Postback",
    items: [
      { name: "Reward Apps", path: "/docs/reward-apps" },
      { name: "Global postback", path: "/docs/global-postback" },
    ]
  }
];

export default function DocumentationLayout() {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    "Offerwall": true,
    "API": true,
    "Postback": true
  });
  
  const toggleSection = (section: string) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };
  
  // Extract the current page title from the pathname
  const getCurrentPageTitle = () => {
    const currentPath = location.pathname;
    for (const section of sections) {
      const item = section.items.find(item => item.path === currentPath);
      if (item) return item.name;
    }
    return "Documentation";
  };
  
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border h-screen overflow-y-auto fixed shadow-sm">
        <div className="p-4">
          <Link to="/" className="flex items-center mb-6">
            <FileText className="mr-2 text-purple-600" size={24} />
            <span className="text-xl font-bold text-purple-600">AdLoot.io Docs</span>
          </Link>
          
          {sections.map((section) => (
            <div key={section.title} className="mb-4">
              <button
                className="flex items-center justify-between w-full p-2 text-left font-medium hover:bg-accent hover:text-accent-foreground rounded-md text-foreground"
                onClick={() => toggleSection(section.title)}
              >
                {section.title}
                {expandedSections[section.title] ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>
              
              {expandedSections[section.title] && (
                <div className="ml-2">
                  {section.items.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`block p-2 pl-4 text-sm hover:bg-accent hover:text-accent-foreground rounded-md ${
                        location.pathname === item.path ? "bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-medium" : "text-muted-foreground"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Top Navigation Bar */}
        <header className="bg-card border-b border-border text-foreground p-4 sticky top-0 z-10 shadow-sm">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-lg font-bold text-purple-700 dark:text-purple-400">
                {getCurrentPageTitle()}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link 
                to="/"
                className="flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
              >
                <LayoutDashboard size={16} className="mr-1" />
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </header>
        
        {/* Content Area */}
        <div className="container mx-auto p-6">
          <Card className="p-6 shadow-sm border border-border bg-card">
            <Outlet />
          </Card>
          
          <footer className="flex justify-between mt-10 py-4 text-sm text-muted-foreground">
            <div>2025© AdLoot.io</div>
            <div className="flex gap-4">
              <Link to="/terms" className="hover:text-purple-600 dark:hover:text-purple-400">Terms and conditions</Link>
              <Link to="/disclaimers" className="hover:text-purple-600 dark:hover:text-purple-400">Disclaimers</Link>
              <Link to="/privacy" className="hover:text-purple-600 dark:hover:text-purple-400">Privacy</Link>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
