/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, Download, Copy, CircleX, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-hot-toast";
import { OfferDetailsModal } from "@/components/dashboard/OfferDetailsModal";
import countries from "@/constants/countries.json";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Campaign } from "./advertiser/CampaignsPage";
import { pageSize } from "@/constants/limit.json";
import api from "@/lib/axios";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { calculateCampaignDistribution } from "@/utils/calculateCampaignDistribution";

export default function AllOffersPage() {
  const navigate = useNavigate();
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || "";
  const country = searchParams.get("country") || "";
  const device = searchParams.get("device") || "";
  const search = searchParams.get("search") || "";
  const currentPage = Number(searchParams.get("page")) || 1;
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOffer, setSelectedOffer] = useState<Campaign | null>(null);
  // Filter states
  const [searchTerm, setSearchTerm] = useState(search || "");
  const [offers, setOffers] = useState<Campaign[]>([]);

  // Export to CSV function
  const exportToCSV = () => {
    // Create CSV header
    let csvContent = "Offer ID,Offer,Countries,Categories,Devices,Payout,CR\n";

    // Add data rows
    offers?.forEach((offer) => {
      const countries = offer?.countries || [];
      const devices = offer?.devices || [];
      const row = [
        offer.id,
        offer.campaign_name,
        countries.join(", "),
        offer.category,
        devices.join(", "),
        `$${offer?.campaign_payout || 0}`,
        "0.00%", // CR is not available in the current data structure
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

  // Format countries for display in table
  const formatCountries = (countries: string[]) => {
    if (!countries || countries.length === 0) return "Global";
    if (countries.length <= 2) return countries.join(", ");
    return `${countries.slice(0, 2).join(", ")}, ...`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const params = {
        category,
        device,
        country,
        search,
        page: currentPage,
        limit: pageSize,
      };
      const response = await api.get("/publisher/offers", { params });
      setOffers(response?.data?.data?.offers);
      setTotalPages(response.data.data.pagination.totalPages);
    } catch (error: any) {
      console.error("Error fetching offers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, category, device, country, search]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages)
      navigate(
        `/publisher/dashboard/available-offers?category=${category}&country=${country}&device=${device}&page=${page}`
      );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <section>
      <Button
        onClick={exportToCSV}
        className="ml-auto flex items-center gap-2 mb-4"
      >
        <Download size={16} />
        Export to CSV
      </Button>
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="w-full sm:w-72 flex items-center gap-2">
              <Input
                placeholder="Search Offers"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
              <Button
                size="icon"
                onClick={() => {
                  navigate(
                    `/publisher/dashboard/available-offers?search=${searchTerm}`
                  );
                }}
                className="min-w-[40px]"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>

            <div className="w-full sm:w-auto flex flex-wrap gap-4">
              <Select
                value={country ?? ""}
                onValueChange={(e) => {
                  navigate(
                    `/publisher/dashboard/available-offers?category=${category}&country=${e}&device=${device}&page=${currentPage}`
                  );
                }}
              >
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Countries: All" />
                </SelectTrigger>
                <SelectContent>
                  {countries?.map((country) => (
                    <SelectItem key={country?.value} value={country?.value}>
                      {country?.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={category ?? ""}
                onValueChange={(e) => {
                  navigate(
                    `/publisher/dashboard/available-offers?category=${e}&country=${country}&device=${device}&page=${currentPage}`
                  );
                }}
              >
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Categories: All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="games">Games</SelectItem>
                  <SelectItem value="utilities">Utilities</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={device ?? ""}
                onValueChange={(e) => {
                  navigate(
                    `/publisher/dashboard/available-offers?category=${category}&country=${country}&device=${e}&page=${currentPage}`
                  );
                }}
              >
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Devices: All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mobile">Mobile</SelectItem>
                  <SelectItem value="tablet">Tablet</SelectItem>
                  <SelectItem value="desktop">Desktop</SelectItem>
                </SelectContent>
              </Select>
              {(category || country || device || search) && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    navigate("/publisher/dashboard/available-offers");
                    if (search) setSearchTerm("");
                  }}
                >
                  <CircleX className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24 cursor-pointer">
                    Offer ID
                  </TableHead>
                  <TableHead className="cursor-pointer">Offer</TableHead>
                  <TableHead className="cursor-pointer">Countries</TableHead>
                  <TableHead className="cursor-pointer">Categories</TableHead>
                  <TableHead className="cursor-pointer">Devices</TableHead>
                  <TableHead className="cursor-pointer">Payout</TableHead>
                  <TableHead className="text-right">View</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {offers?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-10 text-gray-500"
                    >
                      No offers found matching your search criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  offers?.map((offer) => (
                    <TableRow key={offer.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">
                            {offer.id}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => copyToClipboard(offer.id.toString())}
                          >
                            <Copy size={14} />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {offer?.primary_image && (
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                              <img
                                src={offer?.primary_image}
                                alt={offer?.campaign_name}
                                className="w-full h-full object-cover"
                                loading="lazy"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = "/placeholder-offer.png";
                                }}
                              />
                            </div>
                          )}
                          <span>{offer?.campaign_name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {formatCountries(offer?.countries || [])}
                      </TableCell>
                      <TableCell className="capitalize">
                        <Badge variant="secondary">{offer?.category}</Badge>
                      </TableCell>
                      <TableCell className="capitalize">
                        {Array.isArray(offer?.devices) &&
                        offer.devices.length > 0
                          ? offer.devices.join(", ")
                          : "All Devices"}
                      </TableCell>
                      <TableCell>
                        $
                        {
                          calculateCampaignDistribution(
                            Number(offer?.campaign_payout),
                            Number(offer?.admin_percentage),
                            0
                          )?.publisherCut
                        }
                        <span className="uppercase">({offer.payout_type})</span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-500 dark:text-blue-400 flex items-center gap-1 ml-auto"
                          onClick={() => {
                            setSelectedOffer(offer);
                            setShowPreviewDialog(true);
                          }}
                        >
                          <Eye size={16} />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          {offers?.length > 0 && (
            <Pagination className="mt-4 justify-end">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    className="text-xs"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage - 1);
                    }}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }).map((_, idx) => (
                  <PaginationItem key={idx}>
                    <PaginationLink
                      size="sm"
                      isActive={currentPage === idx + 1}
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(idx + 1);
                      }}
                    >
                      {idx + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                {totalPages > 3 && currentPage < totalPages - 1 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationNext
                    className="text-xs"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage + 1);
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardContent>
      </Card>

      {/* Offer details modal */}
      <OfferDetailsModal
        isOpen={showPreviewDialog}
        onClose={() => setShowPreviewDialog(false)}
        offer={selectedOffer}
      />
    </section>
  );
}
