
import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

interface PlatformUser {
  id: string;
  role: 'publisher' | 'advertiser';
  name: string;
  company_name: string | null;
  email: string;
  website: string | null;
  phone_number: string | null;
  status: 'active' | 'suspended';
  earnings: number;
  total_apps: number;
  joining_date: string;
  created_at: string;
  updated_at: string;
}

interface EditPublisherModalProps {
  isOpen: boolean;
  onClose: () => void;
  publisher: PlatformUser;
  onSave: (updatedPublisher: Partial<PlatformUser>) => Promise<void>;
  isLoading: boolean;
}

export function EditPublisherModal({ 
  isOpen, 
  onClose, 
  publisher, 
  onSave, 
  isLoading 
}: EditPublisherModalProps) {
  const [formData, setFormData] = useState({
    name: publisher.name,
    email: publisher.email,
    phone_number: publisher.phone_number || '',
    website: publisher.website || '',
    company_name: publisher.company_name || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare data for submission - only include fields that have changed
    const updatedFields: Partial<PlatformUser> = {};
    
    if (formData.name !== publisher.name) updatedFields.name = formData.name;
    if (formData.email !== publisher.email) updatedFields.email = formData.email;
    if (formData.phone_number !== publisher.phone_number) updatedFields.phone_number = formData.phone_number || null;
    if (formData.website !== publisher.website) updatedFields.website = formData.website || null;
    if (formData.company_name !== publisher.company_name) updatedFields.company_name = formData.company_name || null;
    
    // Only save if there are changes
    if (Object.keys(updatedFields).length > 0) {
      await onSave(updatedFields);
    } else {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Publisher Details</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label htmlFor="company_name">Company Name</Label>
                <Input
                  id="company_name"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  placeholder="Company Name (Optional)"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone_number">Phone Number</Label>
                  <Input
                    id="phone_number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    placeholder="Phone Number (Optional)"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="Website URL (Optional)"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
