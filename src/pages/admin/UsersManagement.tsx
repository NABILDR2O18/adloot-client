import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Shield,
  UserCheck,
  UserX,
  Settings
} from "lucide-react";
import { toast } from "sonner";
import { platformUsers as mockPlatformUsers } from "@/lib/mockData";

interface PlatformUser {
  id: string;
  role: 'publisher' | 'advertiser';
  name: string;
  company_name: string | null;
  email: string;
  website: string | null;
  phone_number: string | null;
  status: 'pending' | 'active' | 'suspended';
  earnings: number;
  total_apps: number;
  joining_date: string;
  created_at: string;
  updated_at: string;
}

export default function UsersManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const gettingUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Using our mock data, filter for pending users
      const pendingUsers = mockPlatformUsers.filter(user => user.status === 'pending');
      
      if (pendingUsers.length === 0) {
        setError('No pending approvals found');
      } else {
        console.log('Found users pending approval:', pendingUsers.length);
      }

      setUsers(pendingUsers as PlatformUser[]);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    gettingUsers();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      case "suspended":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Suspended
          </span>
        );
      default:
        return null;
    }
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      "advertiser": { bg: "bg-purple-100", text: "text-purple-800" },
      "publisher": { bg: "bg-green-100", text: "text-green-800" },
    };

    const style = colors[role] || { bg: "bg-gray-100", text: "text-gray-800" };

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${style.bg} ${style.text}`}>
        <Shield className="w-3 h-3 mr-1" />
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  const handleUpdateUserStatus = async (userId: string, newStatus: 'active' | 'suspended') => {
    try {
      setIsUpdating(userId);
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ));

      toast.success(`User ${newStatus === 'active' ? 'activated' : 'suspended'} successfully`);
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    } finally {
      setIsUpdating(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-lg font-medium">User Management</h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search users..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="flex items-center gap-1">
            <Filter size={16} />
            <span>Filters</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-0">
          <CardTitle>Platform Users</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
              <p>{error}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users
                  .filter(user => 
                    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.id.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.id.slice(0, 5)}...</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{user.phone_number || '-'}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" disabled={isUpdating === user.id}>
                              {isUpdating === user.id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900" />
                              ) : (
                                <MoreHorizontal size={16} />
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {user.status !== 'active' && (
                              <DropdownMenuItem
                                onClick={() => handleUpdateUserStatus(user.id, 'active')}
                                className="text-green-600"
                              >
                                <UserCheck className="mr-2 h-4 w-4" />
                                Activate User
                              </DropdownMenuItem>
                            )}
                            {user.status !== 'suspended' && (
                              <DropdownMenuItem
                                onClick={() => handleUpdateUserStatus(user.id, 'suspended')}
                                className="text-red-600"
                              >
                                <UserX className="mr-2 h-4 w-4" />
                                Suspend User
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>
                              <Settings className="mr-2 h-4 w-4" />
                              Manage Settings
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
