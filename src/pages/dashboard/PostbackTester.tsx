
import { useState } from "react";
import { Send, Info, Download, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TestPostbackModal } from "@/components/dashboard/TestPostbackModal";

// Sample history data
const initialHistory = [
  {
    id: "1",
    date: "12/06/2024 12:21:00",
    appName: "HEAVEN GAMERS",
    userId: "1",
    payout: "$1.00",
    ip: "196.119.128.123",
    status: "Credited",
    postbackStatus: "Sent"
  },
  {
    id: "2",
    date: "11/06/2024 09:15:22",
    appName: "Crypto Miner Pro",
    userId: "45",
    payout: "$2.50",
    ip: "182.168.24.87",
    status: "Credited",
    postbackStatus: "Sent"
  },
  {
    id: "3",
    date: "10/06/2024 17:33:41",
    appName: "Puzzle Master",
    userId: "12",
    payout: "$0.75",
    ip: "104.45.188.92",
    status: "Pending",
    postbackStatus: "Pending"
  },
  {
    id: "4",
    date: "09/06/2024 14:05:10",
    appName: "Finance Tracker",
    userId: "28",
    payout: "$1.25",
    ip: "210.87.55.163",
    status: "Credited",
    postbackStatus: "Failed"
  }
];

// Sample app options
const appOptions = [
  { value: "HEAVEN GAMERS", label: "HEAVEN GAMERS" },
  { value: "Crypto Miner Pro", label: "Crypto Miner Pro" },
  { value: "Puzzle Master", label: "Puzzle Master" },
  { value: "Finance Tracker", label: "Finance Tracker" },
  { value: "Social Network", label: "Social Network" },
];

export default function PostbackTester() {
  const [appName, setAppName] = useState("HEAVEN GAMERS");
  const [userId, setUserId] = useState("");
  const [payout, setPayout] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState(initialHistory);
  const [optionalParams, setOptionalParams] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTestPostback = () => {
    if (!appName || !userId || !payout) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% chance of success
      
      const newEntry = {
        id: (history.length + 1).toString(),
        date: new Date().toLocaleString(),
        appName,
        userId,
        payout: `$${Number(payout).toFixed(2)}`,
        ip: "192.168.1." + Math.floor(Math.random() * 255),
        status: "Credited",
        postbackStatus: success ? "Sent" : "Failed"
      };
      
      setHistory([newEntry, ...history]);
      
      if (success) {
        toast.success("Postback test sent successfully!");
      } else {
        toast.error("Postback test failed. Please try again.");
      }
      
      setLoading(false);
      setUserId("");
      setPayout("");
      setOptionalParams("");
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Sent":
        return "bg-green-500";
      case "Failed":
        return "bg-red-500";
      case "Pending":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleExportCSV = () => {
    // Create CSV content
    const headers = ["Date", "App Name", "User ID", "Payout", "IP", "Status", "Postback Status"];
    let csvContent = headers.join(",") + "\n";
    
    history.forEach(entry => {
      const row = [
        entry.date,
        entry.appName,
        entry.userId,
        entry.payout,
        entry.ip,
        entry.status,
        entry.postbackStatus
      ];
      csvContent += row.join(",") + "\n";
    });
    
    // Create a blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'postback_history.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("CSV file exported successfully");
  };

  const filteredHistory = searchTerm 
    ? history.filter(entry => 
        entry.appName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.ip.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : history;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Test Postback</h1>
          <p className="text-muted-foreground">Test your postback integration with our system</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Send className="mr-2" size={16} />
          New Test Postback
        </Button>
      </div>

      <TestPostbackModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        appName={appName}
      />

      <Card>
        <CardHeader className="pb-3 border-b">
          <div className="flex justify-between items-center">
            <CardTitle>Postback History</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by app, user or IP..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button 
                variant="outline" 
                onClick={handleExportCSV} 
                className="flex items-center gap-2 border-purple-200 text-purple-700 hover:bg-purple-50"
              >
                <Download size={16} />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <Table>
            <TableHeader className="bg-purple-50">
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>App Name</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Payout</TableHead>
                <TableHead>IP</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Postback Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{entry.date}</TableCell>
                  <TableCell>{entry.appName}</TableCell>
                  <TableCell>{entry.userId}</TableCell>
                  <TableCell>{entry.payout}</TableCell>
                  <TableCell>
                    <span className="flex items-center">
                      {entry.ip}
                      <Badge className="bg-red-500 ml-2 h-2 w-2 p-0"></Badge>
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-purple-600 text-white">
                      {entry.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(entry.postbackStatus)} text-white`}>
                      {entry.postbackStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" title="Retry postback">
                        <Send size={16} className="text-purple-600" />
                      </Button>
                      <Button variant="ghost" size="icon" title="View details">
                        <Info size={16} className="text-purple-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="flex justify-between mt-4 text-sm text-muted-foreground">
            <div>Showing 1 to {filteredHistory.length} of {filteredHistory.length} entries</div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" className="bg-purple-600 text-white">
                1
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
