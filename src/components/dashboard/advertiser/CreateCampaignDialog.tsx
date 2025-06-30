
import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
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
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { X, Check, Calendar, ChevronRight, ChevronLeft, Image, Smartphone, Monitor, Globe, Target } from "lucide-react";
import { toast } from "react-hot-toast";

interface CreateCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing?: boolean;
  editingCampaign?: any;
}

type Step = 'details' | 'targeting' | 'payment' | 'creative';

export function CreateCampaignDialog({ 
  open, 
  onOpenChange,
  isEditing = false,
  editingCampaign = null 
}: CreateCampaignDialogProps) {
  const [currentStep, setCurrentStep] = useState<Step>('details');

  console.log('editingCampaign', editingCampaign);

  const steps: { id: Step; title: string; icon: React.ReactNode }[] = [
    { id: 'details', title: 'Campaign Details', icon: <Calendar className="h-5 w-5" /> },
    { id: 'targeting', title: 'Targeting', icon: <Target className="h-5 w-5" /> },
    { id: 'payment', title: 'Payment Options', icon: <Smartphone className="h-5 w-5" /> },
    { id: 'creative', title: 'Creative', icon: <Image className="h-5 w-5" /> },
  ];

  useEffect(() => {
    if (open) {
      setCurrentStep('details');
    }
  }, [open]);

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  
  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id);
    }
  };

  const handlePrev = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id);
    }
  };

  const handleFinish = () => {
    // Handle form submission
    if (isEditing) {
      toast.success("Campaign updated successfully!");
    } else {
      toast.success("Campaign created successfully!");
    }
    console.log("Campaign created");
    onOpenChange(false);
    setCurrentStep('details');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl">
            {isEditing ? "Edit Campaign" : "Create New Campaign"}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Update your advertising campaign settings" 
              : "Follow the steps to set up your advertising campaign"
            }
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {/* Step indicator */}
          <div className="relative mb-8">
            <div className="absolute top-1/2 h-0.5 w-full bg-gray-200 dark:bg-gray-700 -translate-y-1/2"></div>
            <div className="relative flex justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center">
                  <div 
                    className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 
                    ${currentStepIndex === index 
                      ? 'bg-primary text-primary-foreground border-primary' 
                      : currentStepIndex > index 
                        ? 'bg-green-500 text-white border-green-500' 
                        : 'bg-background text-muted-foreground border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    {currentStepIndex > index ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <span className="mt-2 text-xs text-center hidden md:block">
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <Tabs value={currentStep} onValueChange={(value) => setCurrentStep(value as Step)}>
              <TabsContent value="details">
                <CampaignDetailsStep campaign={editingCampaign} isEditing={isEditing} />
              </TabsContent>
              
              <TabsContent value="targeting">
                <CampaignTargetingStep campaign={editingCampaign} isEditing={isEditing} />
              </TabsContent>
              
              <TabsContent value="payment">
                <CampaignPaymentStep campaign={editingCampaign} isEditing={isEditing} />
              </TabsContent>
              
              <TabsContent value="creative">
                <CampaignCreativeStep campaign={editingCampaign} isEditing={isEditing} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            {currentStepIndex === steps.length - 1 ? (
              <Button onClick={handleFinish}>
                {isEditing ? "Update Campaign" : "Submit Campaign"}
                <Check className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CampaignDetailsStep({ campaign = null, isEditing = false }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Campaign Details</h3>
      
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="campaign-name">Campaign Name</Label>
          <Input 
            id="campaign-name" 
            placeholder="Enter campaign name"
            defaultValue={campaign?.name || ""}
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="advertiser-id">Advertiser Offer ID</Label>
          <Input 
            id="advertiser-id" 
            placeholder="Enter your advertiser ID"
            defaultValue={campaign?.id ? `ADV-${campaign.id}` : ""}
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="preview-url">Preview URL</Label>
          <Input 
            id="preview-url" 
            placeholder="https://yourdomain.com"
            defaultValue={isEditing ? "https://example.com/app" : ""}
          />
          <p className="text-sm text-muted-foreground">The exact store URL of your app or website</p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="status">Current Status</Label>
          <Select defaultValue={campaign?.status?.toLowerCase() || "live"}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Live</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="vertical">Vertical</Label>
          <Select defaultValue={campaign?.type === "Mobile" ? "games" : "utilities"}>
            <SelectTrigger>
              <SelectValue placeholder="Select vertical" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="games">Games</SelectItem>
              <SelectItem value="utilities">Utilities</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="entertainment">Entertainment</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="tracking">Tracking URL</Label>
          <Input 
            id="tracking" 
            placeholder="https://track.yourdomain.com/click?id={OFFER_ID}&user={USER_ID}"
            defaultValue={isEditing ? "https://track.example.com/click?id={OFFER_ID}&user={USER_ID}" : ""}
          />
          <p className="text-sm text-muted-foreground">
            You may enter the tracking URL with or without the macros/tracking parameters.
          </p>
        </div>
      </div>
    </div>
  );
}

function CampaignTargetingStep({ campaign = null, isEditing = false }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Targeting Options</h3>
      
      <div className="space-y-6">
        <div className="space-y-3">
          <h4 className="font-medium">Select Platform</h4>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="platform-android" 
                defaultChecked={isEditing && campaign?.type === "Mobile"}
              />
              <Label htmlFor="platform-android" className="flex items-center gap-2">
                <span className="font-medium">Android</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="platform-ios"
                defaultChecked={isEditing && campaign?.type === "Mobile"}
              />
              <Label htmlFor="platform-ios" className="flex items-center gap-2">
                <span className="font-medium">iOS</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="platform-desktop"
                defaultChecked={isEditing && campaign?.type === "Desktop"}
              />
              <Label htmlFor="platform-desktop" className="flex items-center gap-2">
                <span className="font-medium">Desktop</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="platform-web"
                defaultChecked={isEditing && campaign?.type === "All Devices"}
              />
              <Label htmlFor="platform-web" className="flex items-center gap-2">
                <span className="font-medium">Web</span>
              </Label>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium">Devices</h4>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="device-mobile" 
                defaultChecked={isEditing ? campaign?.type === "Mobile" || campaign?.type === "All Devices" : true}
              />
              <Label htmlFor="device-mobile" className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                <span>Mobile Phone</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="device-tablet" 
                defaultChecked={isEditing ? campaign?.type === "All Devices" : true}
              />
              <Label htmlFor="device-tablet" className="flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                <span>Tablet</span>
              </Label>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">For Android platform, both Mobile Phone and Tablet is automatically supported.</p>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium">Location Targeting</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroup defaultValue="specific" className="flex flex-col gap-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all-countries" />
                  <Label htmlFor="all-countries">All Countries</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="specific" id="specific-countries" />
                  <Label htmlFor="specific-countries">Select specific countries to target</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="pt-2">
              <Select defaultValue="us">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="au">Australia</SelectItem>
                  <SelectItem value="de">Germany</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CampaignPaymentStep({ campaign = null, isEditing = false }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Payment Options</h3>
      
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="payout-type">Payout Type</Label>
          <Select defaultValue="cpi">
            <SelectTrigger>
              <SelectValue placeholder="Select payout type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cpi">CPI (Cost Per Install)</SelectItem>
              <SelectItem value="cpa">CPA (Cost Per Action)</SelectItem>
              <SelectItem value="cpc">CPC (Cost Per Click)</SelectItem>
              <SelectItem value="cpm">CPM (Cost Per Mille)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-12 gap-2 items-center">
          <Label htmlFor="payout" className="col-span-12 mb-1">Payout</Label>
          <div className="col-span-1 text-center text-lg">$</div>
          <Input 
            id="payout" 
            placeholder="0.00" 
            className="col-span-11"
            defaultValue={isEditing ? campaign?.cpc?.replace('$', '') || "0.00" : ""}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Daily Conversion Cap</Label>
            <Input placeholder="Enter limit" />
          </div>
          <div className="space-y-2">
            <Label>Monthly Conversion Cap</Label>
            <Input placeholder="Enter limit" />
          </div>
          <div className="space-y-2">
            <Label>Overall Conversion Cap</Label>
            <Input placeholder="Enter limit" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Daily Click Cap</Label>
            <Input 
              placeholder="Enter limit"
              defaultValue={isEditing ? campaign?.clicks || "" : ""}
            />
          </div>
          <div className="space-y-2">
            <Label>Monthly Click Cap</Label>
            <Input placeholder="Enter limit" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Daily Revenue Cap</Label>
            <Input placeholder="Enter limit" />
          </div>
          <div className="space-y-2">
            <Label>Monthly Revenue Cap</Label>
            <Input placeholder="Enter limit" />
          </div>
          <div className="space-y-2">
            <Label>Overall Revenue Cap</Label>
            <Input 
              placeholder="Enter limit"
              defaultValue={isEditing ? campaign?.spent?.replace('$', '') || "" : ""}
            />
          </div>
        </div>

        <div className="pt-4 space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="expiry-date" />
            <Label htmlFor="expiry-date">Add Expiration Date</Label>
          </div>
          <p className="text-sm text-muted-foreground">Set an expiry date for this campaign. Expired campaigns status will be changed to "On Review".</p>
        </div>
      </div>
    </div>
  );
}

function CampaignCreativeStep({ campaign = null, isEditing = false }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Campaign Creative</h3>
      
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="campaign-image">Campaign Images</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-2 border-dashed rounded-md p-6 text-center">
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="w-full h-40 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                  <Image className="h-10 w-10 text-gray-400" />
                </div>
                <Button variant="outline" size="sm">
                  {isEditing ? "Update Main Image" : "Change Main Image"}
                </Button>
                <p className="text-xs text-muted-foreground">Recommended size: 512x512px</p>
              </div>
            </div>
            <div className="border-2 border-dashed rounded-md p-6 text-center">
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="w-full h-40 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                  <Image className="h-10 w-10 text-gray-400" />
                </div>
                <Button variant="outline" size="sm">
                  Add Secondary Image
                </Button>
                <p className="text-xs text-muted-foreground">Optional - Recommended size: 512x512px</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description" 
            placeholder="Enter campaign description" 
            className="min-h-[100px]"
            defaultValue={isEditing ? campaign?.name || "" : ""}
          />
          <p className="text-xs text-muted-foreground">You are allowed a maximum of 150 characters.</p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="call-to-action">Call to Action</Label>
          <Textarea 
            id="call-to-action" 
            placeholder="Briefly explain what the user has to do..." 
            className="min-h-[80px]"
          />
          <p className="text-xs text-muted-foreground">You are allowed a maximum of 100 characters.</p>
        </div>

        <div className="pt-2 space-y-2">
          <h4 className="font-medium">Campaign Notifications</h4>
          <div className="flex items-center space-x-2">
            <Checkbox id="notifications" defaultChecked={isEditing} />
            <Label htmlFor="notifications">
              Notify me for approval status and the status of the changes I made to this campaign
            </Label>
          </div>
          <p className="text-xs text-muted-foreground pl-6">You will receive an email when there are changes in the status of your campaign, or status of the proposed changes to the campaign (Rejected, or Approved).</p>
        </div>

        <div className="pt-2 space-y-2">
          <h4 className="font-medium">Campaign Notes</h4>
          <Textarea 
            placeholder="Add any additional notes about this campaign here..."
            className="min-h-[80px]"
          />
          <p className="text-xs text-muted-foreground">You can add your notes pertaining to this campaign here (does not require a review).</p>
        </div>
      </div>
    </div>
  );
}
