import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-hot-toast";
import { Promotion } from "@/pages/dashboard/AppSettings";

interface PromotionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (promotion: Promotion) => void;
  promotion?: Promotion;
  currencyNamePlural: string;
}

export default function PromotionModal({
  open,
  onOpenChange,
  onSave,
  promotion,
  currencyNamePlural,
}: PromotionModalProps) {
  const isEditing = !!promotion;

  const [formData, setFormData] = useState<Promotion>({
    id: "",
    status: "active",
    multiplier: "1.5",
    name: "",
    start: new Date().toISOString(),
    end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
  });

  useEffect(() => {
    if (promotion) {
      setFormData(promotion);
    } else {
      // Reset form data for new promotion
      setFormData({
        id: `promo-${Date.now()}`,
        status: "active",
        multiplier: "1.5",
        name: `New Promotion - ${currencyNamePlural}`,
        start: new Date().toISOString(),
        end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }
  }, [promotion, currencyNamePlural, open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
    // toast.success(isEditing ? "Promotion updated" : "New promotion created");
  };

  // Format date string for input fields
  const formatDateForInput = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD format
    } catch (error) {
      return "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="!max-h-max !overflow-hidden">
          <DialogTitle>
            {isEditing ? "Edit Promotion" : "Create New Promotion"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Promotion Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                onValueChange={(value) => handleSelectChange(value, "status")}
                value={formData.status}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="complete">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="multiplier">Multiplier</Label>
              <Input
                id="multiplier"
                name="multiplier"
                value={formData.multiplier}
                onChange={handleInputChange}
                placeholder="1.5"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start">Start Date</Label>
              <Input
                id="start"
                name="start"
                type="date"
                value={formatDateForInput(formData.start)}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  setFormData({
                    ...formData,
                    start: date.toISOString(),
                  });
                }}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end">End Date</Label>
              <Input
                id="end"
                name="end"
                type="date"
                value={formatDateForInput(formData.end)}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  setFormData({
                    ...formData,
                    end: date.toISOString(),
                  });
                }}
                required
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">
              {isEditing ? "Update" : "Create"} Promotion
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
