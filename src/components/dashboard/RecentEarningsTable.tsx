import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export type RecentEarning = {
  id: number;
  created_at: string;
  campaign: {
    id: number;
    name: string;
    payout: string;
    admin_percentage: string;
    category: string;
  };
  click: {
    ip_address: string;
    country: string;
    device_type: string;
    created_at: string;
  };
  publisher_cut: string;
  publisher_user_cut: string;
};

export function RecentEarningsTable({
  earnings,
}: {
  earnings: RecentEarning[];
}) {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transaction ID</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Offer Name</TableHead>
            <TableHead>Country</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {earnings.map((earning) => {
            const dateObj = earning.created_at
              ? new Date(earning.created_at)
              : undefined;
            return (
              <TableRow key={earning.id}>
                <TableCell className="font-medium">{earning.id}</TableCell>
                <TableCell>
                  {dateObj
                    ? `${format(dateObj, "MMM dd, yyyy")} at ${format(
                        dateObj,
                        "HH:mm"
                      )}`
                    : "-"}
                </TableCell>
                <TableCell>{earning.campaign?.name}</TableCell>
                <TableCell>{earning.click?.country}</TableCell>
                <TableCell className="text-right font-medium">
                  $
                  {earning.campaign?.payout
                    ? Number(earning.campaign.payout).toFixed(2)
                    : "0.00"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200"
                  >
                    completed
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
