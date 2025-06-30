import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

interface Offer {
  id: number;
  name: string;
  advertiser_id: string;
  status: "pending" | "active" | "paused" | "rejected";
  vertical: string;
  payout_type: string;
  payout_amount: number;
  daily_cap: number;
  monthly_cap: number;
  created_at: string;
  preview_url: string;
}

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [verticalFilter, setVerticalFilter] = useState<string>("all");

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);

      // Replace this with your API call or use mockData
      // Example: const response = await fetch("/api/offers");
      // const data = await response.json();
      // setOffers(data);

      setOffers([]); // Using mock data for now
    } catch (error) {
      console.error("Error fetching offers:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "paused":
        return "bg-gray-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const filteredOffers = offers.filter((offer) => {
    const matchesSearch = offer.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || offer.status === statusFilter;
    const matchesVertical =
      verticalFilter === "all" || offer.vertical === verticalFilter;
    return matchesSearch && matchesStatus && matchesVertical;
  });

  const handleStatusChange = async (offerId: number, newStatus: string) => {
    try {
      // Replace this with your API call to update status
      // await fetch(`/api/offers/${offerId}/status`, {
      //   method: "PATCH",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ status: newStatus }),
      // });

      // Update local state
      setOffers(
        offers.map((offer) =>
          offer.id === offerId
            ? { ...offer, status: newStatus as Offer["status"] }
            : offer
        )
      );
    } catch (error) {
      console.error("Error updating offer status:", error);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Manage Offers</CardTitle>
          <CardDescription>
            View and manage all campaign offers from advertisers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search offers..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={verticalFilter} onValueChange={setVerticalFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by vertical" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Verticals</SelectItem>
                  <SelectItem value="games">Games</SelectItem>
                  <SelectItem value="utilities">Utilities</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Vertical</TableHead>
                  <TableHead>Payout</TableHead>
                  <TableHead>Daily Cap</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      Loading offers...
                    </TableCell>
                  </TableRow>
                ) : filteredOffers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      No offers found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOffers.map((offer) => (
                    <TableRow key={offer.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{offer.name}</div>
                          <div className="text-sm text-muted-foreground">
                            ID: {offer.id}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{offer.vertical}</Badge>
                      </TableCell>
                      <TableCell>
                        ${offer.payout_amount} ({offer.payout_type})
                      </TableCell>
                      <TableCell>{offer.daily_cap}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(offer.status)}>
                          {offer.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={offer.status}
                          onValueChange={(value) =>
                            handleStatusChange(offer.id, value)
                          }
                        >
                          <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Change status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Set Pending</SelectItem>
                            <SelectItem value="active">Set Active</SelectItem>
                            <SelectItem value="paused">Set Paused</SelectItem>
                            <SelectItem value="rejected">
                              Set Rejected
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
