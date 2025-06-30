import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Image, Loader2, X } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

const APP_CATEGORIES = [
  "Games",
  "Health & Fitness",
  "Education",
  "Finance",
  "Social",
  "Productivity",
  "Entertainment",
  "Utilities",
  "Shopping",
  "Travel",
  "Food & Drink",
  "Lifestyle",
  "Business",
  "News",
  "Sports",
  "Music",
  "Photo & Video",
  "Books",
  "Medical",
  "Navigation",
  "Weather",
  "Reference",
  "Other",
];

const PLATFORMS = ["Desktop / Mobile Web", "Mobile App", "Desktop App"];

export default function CreateAppPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [logo, setLogo] = useState<File | null>(null);
  const [currencyIcon, setCurrencyIcon] = useState<File | null>(null);
  const logoRef = useRef<HTMLInputElement>(null);
  const currencyIconRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    platform: "",
    category: "",
    appStoreUrl: "",
    playStoreUrl: "",
    websiteUrl: "",
    version: "",
    bundleId: "",
    packageName: "",
    privacyPolicyUrl: "",
    termsUrl: "",
    supportEmail: "",
    supportUrl: "",
    currencyNameSingular: "",
    currencyNamePlural: "",
    currencyValue: "1.00",
    splitPercentage: "50",
    currencyRounding: "no-decimals",
    primaryColor: "#000000",
    secondaryColor: "#FFFFFF",
    mobileText: "",
    showRoutersTab: false,
    showSurveysTab: false,
  });

  return (
    <div className="container max-w-4xl py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Create New App</h1>
        <Button variant="outline" onClick={() => navigate("/dashboard/apps")}>
          Cancel
        </Button>
      </div>

      <form className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Enter the basic details about your app
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">App Name</Label>
                <Input
                  id="name"
                  placeholder="Enter app name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter app description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="platform">Platform</Label>
                  <Select
                    value={formData.platform}
                    onValueChange={(value) =>
                      setFormData({ ...formData, platform: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {PLATFORMS.map((platform) => (
                        <SelectItem key={platform} value={platform}>
                          {platform}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {APP_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>App Assets</CardTitle>
            <CardDescription>
              Upload your app logo and currency icon
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Logo Upload */}
              <div className="space-y-4">
                <Label>App Logo</Label>
                <div className="border rounded-lg p-4 space-y-4">
                  <div className="aspect-square w-full relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                    {logo ? (
                      <>
                        <img
                          src={URL.createObjectURL(logo)}
                          alt="App logo"
                          className="w-full h-full object-contain"
                        />
                        <div className="absolute top-2 right-2">
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => setLogo(null)}
                            className="h-8 w-8"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <Image className="h-10 w-10 mx-auto text-gray-400" />
                          <p className="text-sm text-muted-foreground mt-2">
                            No logo selected
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-center">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => logoRef.current?.click()}
                    >
                      {logo ? "Change Logo" : "Upload Logo"}
                    </Button>
                    <input
                      ref={logoRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setLogo(e.target.files[0]);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Currency Icon Upload */}
              <div className="space-y-4">
                <Label>Currency Icon</Label>
                <div className="border rounded-lg p-4 space-y-4">
                  <div className="aspect-square w-full relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                    {currencyIcon ? (
                      <>
                        <img
                          src={URL.createObjectURL(currencyIcon)}
                          alt="Currency icon"
                          className="w-full h-full object-contain"
                        />
                        <div className="absolute top-2 right-2">
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => setCurrencyIcon(null)}
                            className="h-8 w-8"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <Image className="h-10 w-10 mx-auto text-gray-400" />
                          <p className="text-sm text-muted-foreground mt-2">
                            No currency icon selected
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-center">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => currencyIconRef.current?.click()}
                    >
                      {currencyIcon ? "Change Icon" : "Upload Icon"}
                    </Button>
                    <input
                      ref={currencyIconRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setCurrencyIcon(e.target.files[0]);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>App Details</CardTitle>
            <CardDescription>
              Enter additional details about your app
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="version">Version</Label>
                  <Input
                    id="version"
                    placeholder="e.g., 1.0.0"
                    value={formData.version}
                    onChange={(e) =>
                      setFormData({ ...formData, version: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bundleId">Bundle ID</Label>
                  <Input
                    id="bundleId"
                    placeholder="e.g., com.example.app"
                    value={formData.bundleId}
                    onChange={(e) =>
                      setFormData({ ...formData, bundleId: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="appStoreUrl">App Store URL</Label>
                  <Input
                    id="appStoreUrl"
                    type="url"
                    placeholder="Enter App Store URL"
                    value={formData.appStoreUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, appStoreUrl: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="playStoreUrl">Play Store URL</Label>
                  <Input
                    id="playStoreUrl"
                    type="url"
                    placeholder="Enter Play Store URL"
                    value={formData.playStoreUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, playStoreUrl: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="websiteUrl">Website URL</Label>
                <Input
                  id="websiteUrl"
                  type="url"
                  placeholder="Enter website URL"
                  value={formData.websiteUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, websiteUrl: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="privacyPolicyUrl">Privacy Policy URL</Label>
                  <Input
                    id="privacyPolicyUrl"
                    type="url"
                    placeholder="Enter privacy policy URL"
                    value={formData.privacyPolicyUrl}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        privacyPolicyUrl: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="termsUrl">Terms URL</Label>
                  <Input
                    id="termsUrl"
                    type="url"
                    placeholder="Enter terms URL"
                    value={formData.termsUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, termsUrl: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    placeholder="Enter support email"
                    value={formData.supportEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, supportEmail: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supportUrl">Support URL</Label>
                  <Input
                    id="supportUrl"
                    type="url"
                    placeholder="Enter support URL"
                    value={formData.supportUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, supportUrl: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Currency Settings</CardTitle>
            <CardDescription>
              Configure your app's virtual currency
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="currencyNameSingular">
                    Currency Name (Singular)
                  </Label>
                  <Input
                    id="currencyNameSingular"
                    placeholder="e.g., Coin"
                    value={formData.currencyNameSingular}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        currencyNameSingular: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currencyNamePlural">
                    Currency Name (Plural)
                  </Label>
                  <Input
                    id="currencyNamePlural"
                    placeholder="e.g., Coins"
                    value={formData.currencyNamePlural}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        currencyNamePlural: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="currencyValue">Currency Value ($)</Label>
                  <Input
                    id="currencyValue"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Enter currency value"
                    value={formData.currencyValue}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        currencyValue: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="splitPercentage">Split Percentage (%)</Label>
                  <Input
                    id="splitPercentage"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Enter split percentage"
                    value={formData.splitPercentage}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        splitPercentage: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currencyRounding">Currency Rounding</Label>
                <Select
                  value={formData.currencyRounding}
                  onValueChange={(value) =>
                    setFormData({ ...formData, currencyRounding: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select rounding option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-decimals">No Decimals</SelectItem>
                    <SelectItem value="one-decimal">One Decimal</SelectItem>
                    <SelectItem value="two-decimals">Two Decimals</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Design Settings</CardTitle>
            <CardDescription>Customize your app's appearance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={formData.primaryColor}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          primaryColor: e.target.value,
                        })
                      }
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      type="text"
                      value={formData.primaryColor}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          primaryColor: e.target.value,
                        })
                      }
                      className="flex-1"
                      placeholder="#000000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={formData.secondaryColor}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          secondaryColor: e.target.value,
                        })
                      }
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      type="text"
                      value={formData.secondaryColor}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          secondaryColor: e.target.value,
                        })
                      }
                      className="flex-1"
                      placeholder="#FFFFFF"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobileText">Mobile Text</Label>
                <Input
                  id="mobileText"
                  placeholder="Enter mobile text"
                  value={formData.mobileText}
                  onChange={(e) =>
                    setFormData({ ...formData, mobileText: e.target.value })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Integration Settings</CardTitle>
            <CardDescription>Configure integration options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showRoutersTab"
                checked={formData.showRoutersTab}
                onChange={(e) =>
                  setFormData({ ...formData, showRoutersTab: e.target.checked })
                }
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="showRoutersTab">Show Routers Tab</Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showSurveysTab"
                checked={formData.showSurveysTab}
                onChange={(e) =>
                  setFormData({ ...formData, showSurveysTab: e.target.checked })
                }
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="showSurveysTab">Show Surveys Tab</Label>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/dashboard/apps")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create App"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
