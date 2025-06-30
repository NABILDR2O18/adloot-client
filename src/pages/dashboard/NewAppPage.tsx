
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { toast } from "react-hot-toast";
import { ArrowLeft } from "lucide-react";

// Sample app data for editing
const sampleApps = [
  {
    id: "app-001",
    name: "Crypto Miner Pro",
    url: "https://cryptominerpro.com",
    status: "active",
    earnings: "$1,245.50",
    dateAdded: "2025-02-15",
    currencyNameSingular: "Coin",
    currencyNamePlural: "Coins",
    currencyValue: "100",
    rounding: "no-decimals",
    postbackUrl: "https://cryptominerpro.com/postback",
    showRoutersTab: true,
    showSurveysTab: false
  },
  {
    id: "app-002",
    name: "Puzzle Master",
    url: "https://puzzlemaster.game",
    status: "pending",
    earnings: "$0.00",
    dateAdded: "2025-03-28",
    currencyNameSingular: "Gem",
    currencyNamePlural: "Gems",
    currencyValue: "10",
    rounding: "one-decimal",
    postbackUrl: "https://puzzlemaster.game/postback",
    showRoutersTab: false,
    showSurveysTab: true
  }
];

export default function NewAppPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  
  const [showRoutersTab, setShowRoutersTab] = useState(false);
  const [showSurveysTab, setShowSurveysTab] = useState(false);
  const [formData, setFormData] = useState({
    appName: "",
    appUrl: "",
    currencyNameSingular: "",
    currencyNamePlural: "",
    currencyValue: "",
    rounding: "no-decimals",
    postbackUrl: ""
  });

  // Load app data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const appData = sampleApps.find(app => app.id === id);
      if (appData) {
        setFormData({
          appName: appData.name,
          appUrl: appData.url,
          currencyNameSingular: appData.currencyNameSingular,
          currencyNamePlural: appData.currencyNamePlural,
          currencyValue: appData.currencyValue,
          rounding: appData.rounding,
          postbackUrl: appData.postbackUrl
        });
        setShowRoutersTab(appData.showRoutersTab);
        setShowSurveysTab(appData.showSurveysTab);
      }
    }
  }, [id, isEditMode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validation logic would go here
    if (isEditMode) {
      toast.success("App updated successfully!");
    } else {
      toast.success("App created successfully!");
    }
    navigate("/dashboard/offers");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/offers')}>
          <ArrowLeft size={18} />
        </Button>
        <h1 className="text-2xl font-bold">{isEditMode ? "Edit App" : "Add New App"}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Basic Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="appName" className="text-sm font-medium">
                  App Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="appName"
                  name="appName"
                  placeholder="App name"
                  value={formData.appName}
                  onChange={handleInputChange}
                  required
                />
                <p className="text-sm text-muted-foreground">Your App/Game/Site name.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="appUrl" className="text-sm font-medium">
                  App URL <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="appUrl"
                  name="appUrl"
                  placeholder="App URL"
                  value={formData.appUrl}
                  onChange={handleInputChange}
                  required
                />
                <p className="text-sm text-muted-foreground">Your website domain or AppStore link of your app.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currencyNameSingular" className="text-sm font-medium">
                  Currency Name Singular <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="currencyNameSingular"
                  name="currencyNameSingular"
                  placeholder="Currency name (points/tokens/cents...)"
                  value={formData.currencyNameSingular}
                  onChange={handleInputChange}
                  required
                />
                <p className="text-sm text-muted-foreground">Name of your currency.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currencyNamePlural" className="text-sm font-medium">
                  Currency Name Plural <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="currencyNamePlural"
                  name="currencyNamePlural"
                  placeholder="Currency name (points/tokens/cents...)"
                  value={formData.currencyNamePlural}
                  onChange={handleInputChange}
                  required
                />
                <p className="text-sm text-muted-foreground">Name of your currency as a plural.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currencyValue" className="text-sm font-medium">
                  Currency Value <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="currencyValue"
                  name="currencyValue"
                  placeholder="Currency value"
                  value={formData.currencyValue}
                  onChange={handleInputChange}
                  required
                  type="number"
                />
                <p className="text-sm text-muted-foreground">How many of your game/app currency units will a user earn for $1.00?</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rounding" className="text-sm font-medium">
                  Rounding <span className="text-red-500">*</span>
                </Label>
                <Select 
                  onValueChange={(value) => handleSelectChange(value, "rounding")}
                  value={formData.rounding}
                >
                  <SelectTrigger id="rounding">
                    <SelectValue placeholder="No decimals" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-decimals">No decimals</SelectItem>
                    <SelectItem value="one-decimal">1 decimal place</SelectItem>
                    <SelectItem value="two-decimals">2 decimal places</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">How many decimals your currency has.</p>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="show-routers" 
                    checked={showRoutersTab}
                    onCheckedChange={(checked) => setShowRoutersTab(checked as boolean)} 
                  />
                  <Label htmlFor="show-routers">Show Routers tab</Label>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="show-surveys" 
                    checked={showSurveysTab}
                    onCheckedChange={(checked) => setShowSurveysTab(checked as boolean)} 
                  />
                  <Label htmlFor="show-surveys">Show Surveys tab</Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Postback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="postbackUrl" className="text-sm font-medium">
                Postback URL <span className="text-red-500">*</span>
              </Label>
              <Input
                id="postbackUrl"
                name="postbackUrl"
                placeholder="Postback URL"
                value={formData.postbackUrl}
                onChange={handleInputChange}
                required
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit">{isEditMode ? "Update App" : "Create App"}</Button>
        </div>
      </form>
    </div>
  );
}
