
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, Download, List } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-hot-toast";
import { OfferDetailsModal } from "@/components/dashboard/OfferDetailsModal";

// Sample offers data
const sampleOffers = [
  {
    id: "76-1",
    name: "Gamehag",
    icon: "/lovable-uploads/7ceb0481-c470-4ce4-ba03-c7ef44674cb6.png",
    countries: ["US", "CA", "GB", "DE", "FR"],
    categoriesCount: 2,
    devices: "All Devices",
    payout: 2315.70,
    cr: 0.00
  },
  {
    id: "67-1666338",
    name: "Call of Dragons",
    icon: "/lovable-uploads/7ceb0481-c470-4ce4-ba03-c7ef44674cb6.png",
    countries: ["US"],
    categoriesCount: 5,
    devices: "Android",
    payout: 2043.55,
    cr: 0.00
  },
  {
    id: "67-1666339",
    name: "Call of Dragons",
    icon: "/lovable-uploads/7ceb0481-c470-4ce4-ba03-c7ef44674cb6.png",
    countries: ["US"],
    categoriesCount: 5,
    devices: "iPhone, iPad",
    payout: 2043.55,
    cr: 0.00
  },
  {
    id: "67-1666376",
    name: "Call of Dragons",
    icon: "/lovable-uploads/7ceb0481-c470-4ce4-ba03-c7ef44674cb6.png",
    countries: ["DE", "GB"],
    categoriesCount: 5,
    devices: "iPhone, iPad",
    payout: 1839.77,
    cr: 0.00
  },
  {
    id: "67-1666625",
    name: "Rise of Kingdoms: Lost Crusade",
    icon: "/lovable-uploads/7ceb0481-c470-4ce4-ba03-c7ef44674cb6.png",
    countries: ["AU", "DE", "GB"],
    categoriesCount: 4,
    devices: "Android",
    payout: 1355.76,
    cr: 0.00
  },
  {
    id: "67-1666396",
    name: "Call of Dragons",
    icon: "/lovable-uploads/7ceb0481-c470-4ce4-ba03-c7ef44674cb6.png",
    countries: ["CA", "AF", "AL", "AS", "AD"],
    categoriesCount: 5,
    devices: "Android",
    payout: 1268.40,
    cr: 0.00
  },
  {
    id: "67-1666397",
    name: "Call of Dragons",
    icon: "/lovable-uploads/7ceb0481-c470-4ce4-ba03-c7ef44674cb6.png",
    countries: ["CA", "AF", "AL", "AS", "AD"],
    categoriesCount: 5,
    devices: "iPhone, iPad",
    payout: 1268.40,
    cr: 0.00
  },
];

// Available filter options
const countryOptions = ["All", "US", "CA", "GB", "DE", "FR", "AU", "AF", "AL", "AS", "AD"];
const categoryOptions = ["All", "Action", "Adventure", "Strategy", "Puzzle", "RPG", "Casual"];
const deviceOptions = ["All", "Android", "iPhone", "iPad"];

export default function OffersListPage() {
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDevice, setSelectedDevice] = useState("All");
  
  // State for sorted data
  const [sortedOffers, setSortedOffers] = useState(sampleOffers);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>(null);
  
  // State for offer details modal
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  
  // Filter function
  const filteredOffers = sortedOffers.filter(offer => {
    const matchesSearch = offer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         offer.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCountry = selectedCountry === "All" || 
                          offer.countries.includes(selectedCountry);
    
    const matchesDevice = selectedDevice === "All" || 
                         offer.devices.toLowerCase().includes(selectedDevice.toLowerCase());
    
    // For category, we're just checking the count since we don't have actual categories in the data
    const matchesCategory = selectedCategory === "All";
    
    return matchesSearch && matchesCountry && matchesDevice && matchesCategory;
  });
  
  // Sorting function
  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
    
    const sortedData = [...sampleOffers].sort((a: any, b: any) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    
    setSortedOffers(sortedData);
  };
  
  // Export to CSV function
  const exportToCSV = () => {
    // Create CSV header
    let csvContent = "Offer ID,Offer,Countries,Categories,Devices,Payout,CR\n";
    
    // Add data rows
    filteredOffers.forEach(offer => {
      const row = [
        offer.id,
        offer.name,
        offer.countries.join(", "),
        `${offer.categoriesCount} Categories`,
        offer.devices,
        `$${offer.payout.toFixed(2)}`,
        `${offer.cr.toFixed(2)}%`
      ];
      
      csvContent += row.join(",") + "\n";
    });
    
    // Create a download link
    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "adloot_offers_export.csv");
    document.body.appendChild(link);
    
    // Trigger download and notify user
    link.click();
    document.body.removeChild(link);
    toast.success("CSV file exported successfully");
  };
  
  // Reset filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCountry("All");
    setSelectedCategory("All");
    setSelectedDevice("All");
  };

  // Format countries for display in table
  const formatCountries = (countries: string[]) => {
    if (countries.length <= 2) return countries.join(", ");
    return `${countries.slice(0, 2).join(", ")}, ...`;
  };
  
  // Handle opening of offer details modal
  const handleViewOfferDetails = (offer: any) => {
    setSelectedOffer(offer);
    setIsDetailsModalOpen(true);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Available Offers</h1>
      <p className="text-muted-foreground mb-6">Browse and integrate available offers into your applications</p>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="w-full sm:w-72">
              <Input
                placeholder="Search Offers"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="w-full sm:w-auto flex-1 flex flex-wrap gap-4">
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Countries: All" />
                </SelectTrigger>
                <SelectContent>
                  {countryOptions.map(country => (
                    <SelectItem key={country} value={country}>
                      {country === "All" ? "Countries: All" : country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Categories: All" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === "All" ? "Categories: All" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedDevice} onValueChange={setSelectedDevice}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Devices: All" />
                </SelectTrigger>
                <SelectContent>
                  {deviceOptions.map(device => (
                    <SelectItem key={device} value={device}>
                      {device === "All" ? "Devices: All" : device}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline" 
                onClick={clearFilters}
                className="whitespace-nowrap"
              >
                Clear Filters
              </Button>
            </div>
            
            <Button 
              onClick={exportToCSV} 
              className="ml-auto flex items-center gap-2"
            >
              <Download size={16} />
              Export to CSV
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="w-24 cursor-pointer" 
                    onClick={() => requestSort('id')}
                  >
                    Offer ID
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer" 
                    onClick={() => requestSort('name')}
                  >
                    Offer
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer" 
                    onClick={() => requestSort('countries')}
                  >
                    Countries
                  </TableHead>
                  <TableHead>Categories</TableHead>
                  <TableHead 
                    className="cursor-pointer" 
                    onClick={() => requestSort('devices')}
                  >
                    Devices
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer" 
                    onClick={() => requestSort('payout')}
                  >
                    Payout
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer" 
                    onClick={() => requestSort('cr')}
                  >
                    CR
                  </TableHead>
                  <TableHead className="text-right">View</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOffers.length > 0 ? (
                  filteredOffers.map((offer) => (
                    <TableRow key={offer.id}>
                      <TableCell className="font-medium">{offer.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <img 
                            src={offer.icon} 
                            alt={offer.name} 
                            className="w-8 h-8 rounded"
                          />
                          <span>{offer.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{formatCountries(offer.countries)}</TableCell>
                      <TableCell>{offer.categoriesCount} Categories</TableCell>
                      <TableCell>{offer.devices}</TableCell>
                      <TableCell>${offer.payout.toFixed(2)}</TableCell>
                      <TableCell>{offer.cr.toFixed(2)}%</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-blue-500 flex items-center gap-1"
                          onClick={() => handleViewOfferDetails(offer)}
                        >
                          <Eye size={16} />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10 text-gray-500">
                      No offers found matching your search criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Offer details modal */}
      <OfferDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        offer={selectedOffer}
      />
    </div>
  );
}
