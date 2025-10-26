'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Users, Video, Briefcase, TrendingUp, Activity, Shield, Settings, MessageSquare, FileText, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface AdminStats {
  totalUsers: number;
  totalCreators: number;
  totalBrands: number;
  totalTransactions: number;
  totalRevenue: number;
  platformFee: number;
}

interface User {
  id: string;
  email: string;
  username: string;
  role: string;
  phone?: string;
  country?: string;
  created_at: string;
  last_login?: string;
  creator?: {
    display_name?: string;
    bio?: string;
  };
  brand?: {
    company_name?: string;
    company_website?: string;
  };
}

interface Brief {
  id: string;
  title: string;
  description: string;
  budget?: number;
  status: string;
  created_at: string;
  brand: {
    user: {
      username: string;
      email: string;
    };
  };
  offers: any[];
}

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'users-create' | 'users-approve' | 'users-featured' | 'briefs' | 'analytics' | 'payments' | 'messages' | 'reports' | 'settings'>('overview');

  useEffect(() => {
    // Check authentication and role
    if (status === 'loading') return;

    if (!session) {
      console.log('No session, redirecting to login');
      router.push('/login');
      return;
    }

    if ((session.user as any)?.role !== 'ADMIN') {
      console.log('Not admin role, redirecting to dashboard');
      router.push('/dashboard');
      return;
    }

    fetchData();
  }, [session, status, router]);

  const fetchData = async () => {
    try {
      const [statsResponse, usersResponse, briefsResponse] = await Promise.all([
        fetch('/api/dashboard/overview'),
        fetch('/api/dashboard/users?limit=20'),
        fetch('/api/dashboard/briefs?limit=20')
      ]);

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData.users || []);
      }

      if (briefsResponse.ok) {
        const briefsData = await briefsResponse.json();
        setBriefs(briefsData.briefs || []);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return null;
  }

  const renderOverview = () => (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats?.totalRevenue || 0}</div>
            <p className="text-xs text-muted-foreground">
              Platform fee: ${stats?.platformFee || 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              Creators: {stats?.totalCreators || 0} | Brands: {stats?.totalBrands || 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalTransactions || 0}</div>
            <p className="text-xs text-muted-foreground">
              Completed transactions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Health</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground">
              System operational
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.slice(0, 5).map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{user.username}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Briefs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {briefs.slice(0, 5).map((brief) => (
                <div key={brief.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium truncate">{brief.title}</p>
                    <p className="text-sm text-muted-foreground">{brief.brand.user.username}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    brief.status === 'OPEN' ? 'bg-green-100 text-green-800' :
                    brief.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {brief.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
        <Button onClick={() => setActiveTab('users-create')}>
          <Users className="h-4 w-4 mr-2" />
          Create User
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left p-4">User</th>
                  <th className="text-left p-4">Role</th>
                  <th className="text-left p-4">Country</th>
                  <th className="text-left p-4">Joined</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{user.username}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        {user.creator && (
                          <p className="text-xs text-muted-foreground">{user.creator.display_name}</p>
                        )}
                        {user.brand && (
                          <p className="text-xs text-muted-foreground">{user.brand.company_name}</p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded ${
                        user.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                        user.role === 'CREATOR' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4">{user.country || 'N/A'}</td>
                    <td className="p-4">{new Date(user.created_at).toLocaleDateString()}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        {user.role === 'CREATOR' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setActiveTab('users-approve')}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setActiveTab('users-featured')}
                            >
                              Feature
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderBriefs = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Campaign Briefs</h2>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left p-4">Brief</th>
                  <th className="text-left p-4">Brand</th>
                  <th className="text-left p-4">Budget</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Offers</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {briefs.map((brief) => (
                  <tr key={brief.id} className="border-b">
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{brief.title}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">{brief.description}</p>
                      </div>
                    </td>
                    <td className="p-4">{brief.brand.user.username}</td>
                    <td className="p-4">${brief.budget || 'N/A'}</td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded ${
                        brief.status === 'OPEN' ? 'bg-green-100 text-green-800' :
                        brief.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {brief.status}
                      </span>
                    </td>
                    <td className="p-4">{brief.offers.length}</td>
                    <td className="p-4">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Platform Analytics</CardTitle>
          <CardDescription>Comprehensive platform performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">1,247</div>
              <p className="text-sm text-muted-foreground">Total Searches</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">89</div>
              <p className="text-sm text-muted-foreground">Active Campaigns</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">4.2</div>
              <p className="text-sm text-muted-foreground">Avg Match Score</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPayments = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment Management</CardTitle>
          <CardDescription>Monitor transactions and platform fees</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">$12,450</div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">$3,112</div>
                <p className="text-sm text-muted-foreground">Platform Fees</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-purple-600">$9,338</div>
                <p className="text-sm text-muted-foreground">Creator Payouts</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderMessages = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Message Center</CardTitle>
          <CardDescription>Monitor platform communications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Message monitoring system coming soon</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Reports & Exports</CardTitle>
          <CardDescription>Generate and download platform reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Button variant="outline" className="h-20">
                <FileText className="h-6 w-6 mr-2" />
                User Activity Report
              </Button>
              <Button variant="outline" className="h-20">
                <TrendingUp className="h-6 w-6 mr-2" />
                Revenue Report
              </Button>
              <Button variant="outline" className="h-20">
                <Briefcase className="h-6 w-6 mr-2" />
                Campaign Report
              </Button>
              <Button variant="outline" className="h-20">
                <DollarSign className="h-6 w-6 mr-2" />
                Transaction Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderUserCreate = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Create New User</h2>
        <Button variant="outline" onClick={() => setActiveTab('users')}>
          <Users className="h-4 w-4 mr-2" />
          Back to Users
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Username</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter username"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter email"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter password"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <select className="w-full px-3 py-2 border rounded-md">
                <option value="CREATOR">Creator</option>
                <option value="BRAND">Brand</option>
                <option value="COACH">Coach</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone (Optional)</label>
              <input
                type="tel"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter phone number"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Country (Optional)</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter country"
              />
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <Button>Create User</Button>
            <Button variant="outline">Cancel</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderUserApprove = () => {
    const [creators, setCreators] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchCreators = async () => {
        try {
          const response = await fetch('/api/admin/creators/approve');
          if (response.ok) {
            const data = await response.json();
            setCreators(data.creators || []);
          }
        } catch (error) {
          console.error('Error fetching creators:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchCreators();
    }, []);

    const handleApprove = async (creatorId: string) => {
      try {
        const response = await fetch('/api/admin/creators/approve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ creatorId, action: 'approve' }),
        });

        if (response.ok) {
          // Refresh the list
          setCreators(creators.map(c =>
            c.id === creatorId ? { ...c, approved: true } : c
          ));
        }
      } catch (error) {
        console.error('Error approving creator:', error);
      }
    };

    const handleReject = async (creatorId: string) => {
      const reason = prompt('Enter rejection reason:');
      if (!reason) return;

      try {
        const response = await fetch('/api/admin/creators/approve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ creatorId, action: 'reject', reason }),
        });

        if (response.ok) {
          // Remove from list or mark as rejected
          setCreators(creators.filter(c => c.id !== creatorId));
        }
      } catch (error) {
        console.error('Error rejecting creator:', error);
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Approve Creators</h2>
          <Button variant="outline" onClick={() => setActiveTab('users')}>
            <Users className="h-4 w-4 mr-2" />
            Back to Users
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center">Loading creators...</div>
            ) : creators.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No creators pending approval
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left p-4">Creator</th>
                      <th className="text-left p-4">Email</th>
                      <th className="text-left p-4">Joined</th>
                      <th className="text-left p-4">Bio</th>
                      <th className="text-left p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {creators.map((creator) => (
                      <tr key={creator.id} className="border-b">
                        <td className="p-4">
                          <div>
                            <p className="font-medium">{creator.user.username}</p>
                            <p className="text-sm text-muted-foreground">{creator.display_name}</p>
                          </div>
                        </td>
                        <td className="p-4">{creator.user.email}</td>
                        <td className="p-4">{new Date(creator.user.created_at).toLocaleDateString()}</td>
                        <td className="p-4">
                          <p className="text-sm line-clamp-2">{creator.bio || 'No bio'}</p>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-600"
                              onClick={() => handleApprove(creator.id)}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600"
                              onClick={() => handleReject(creator.id)}
                            >
                              Reject
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderUserFeatured = () => {
    const [creators, setCreators] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchCreators = async () => {
        try {
          const response = await fetch('/api/admin/creators/featured');
          if (response.ok) {
            const data = await response.json();
            setCreators(data.creators || []);
          }
        } catch (error) {
          console.error('Error fetching creators:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchCreators();
    }, []);

    const handleFeature = async (creatorId: string, action: 'add' | 'remove') => {
      try {
        const response = await fetch('/api/admin/creators/featured', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ creatorId, action }),
        });

        if (response.ok) {
          // Update the local state
          setCreators(creators.map(c =>
            c.id === creatorId ? { ...c, featured: action === 'add' } : c
          ));
        }
      } catch (error) {
        console.error('Error updating featured status:', error);
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Featured Creators</h2>
          <Button variant="outline" onClick={() => setActiveTab('users')}>
            <Users className="h-4 w-4 mr-2" />
            Back to Users
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center">Loading creators...</div>
            ) : creators.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No creators available
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left p-4">Creator</th>
                      <th className="text-left p-4">Email</th>
                      <th className="text-left p-4">Followers</th>
                      <th className="text-left p-4">Status</th>
                      <th className="text-left p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {creators.map((creator) => (
                      <tr key={creator.id} className="border-b">
                        <td className="p-4">
                          <div>
                            <p className="font-medium">{creator.user.username}</p>
                            <p className="text-sm text-muted-foreground">{creator.display_name}</p>
                          </div>
                        </td>
                        <td className="p-4">{creator.user.email}</td>
                        <td className="p-4">N/A</td>
                        <td className="p-4">
                          <span className={`text-xs px-2 py-1 rounded ${
                            creator.featured ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {creator.featured ? 'Featured' : 'Not Featured'}
                          </span>
                        </td>
                        <td className="p-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className={creator.featured ? "text-gray-600" : "text-yellow-600"}
                            onClick={() => handleFeature(creator.id, creator.featured ? 'remove' : 'add')}
                          >
                            <Star className="h-4 w-4 mr-1" />
                            {creator.featured ? 'Unfeature' : 'Feature'}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Admin Settings</h2>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Two-Factor Authentication</span>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
            <div className="flex items-center justify-between">
              <span>Session Timeout</span>
              <span className="text-sm text-muted-foreground">24 hours</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Platform Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Platform Fee</span>
              <span className="text-sm text-muted-foreground">4%</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Maintenance Mode</span>
              <Button variant="outline" size="sm">Toggle</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage platform users, campaigns, and system settings
        </p>
      </div>


      {/* Tab Content */}
      <div className="min-h-[600px]">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'users-create' && renderUserCreate()}
        {activeTab === 'users-approve' && renderUserApprove()}
        {activeTab === 'users-featured' && renderUserFeatured()}
        {activeTab === 'briefs' && renderBriefs()}
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'payments' && renderPayments()}
        {activeTab === 'messages' && renderMessages()}
        {activeTab === 'reports' && renderReports()}
        {activeTab === 'settings' && renderSettings()}
      </div>
    </div>
  );
}
