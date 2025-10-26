'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle, XCircle, ArrowLeft } from "lucide-react";

interface Creator {
  id: string;
  user: {
    id: string;
    username: string;
    email: string;
    phone?: string;
    country?: string;
    created_at: string;
  };
  display_name?: string;
  bio?: string;
}

export default function ApproveCreatorsPage() {
  const router = useRouter();
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCreators();
  }, []);

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

  const handleApprove = async (creatorId: string) => {
    try {
      const response = await fetch('/api/admin/creators/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creatorId, action: 'approve' }),
      });

      if (response.ok) {
        setCreators(creators.filter(c => c.id !== creatorId));
      } else {
        alert('Failed to approve creator');
      }
    } catch (error) {
      console.error('Error approving creator:', error);
      alert('Failed to approve creator');
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
        setCreators(creators.filter(c => c.id !== creatorId));
      } else {
        alert('Failed to reject creator');
      }
    } catch (error) {
      console.error('Error rejecting creator:', error);
      alert('Failed to reject creator');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Approve Creators</h1>
        <Button variant="outline" onClick={() => router.push('/admin/users')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Users
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Creator Approvals</CardTitle>
        </CardHeader>
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
                          {creator.display_name && (
                            <p className="text-sm text-muted-foreground">{creator.display_name}</p>
                          )}
                        </div>
                      </td>
                      <td className="p-4">{creator.user.email}</td>
                      <td className="p-4">{new Date(creator.user.created_at).toLocaleDateString()}</td>
                      <td className="p-4">
                        <p className="text-sm line-clamp-2">{creator.bio || 'No bio provided'}</p>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600"
                            onClick={() => handleApprove(creator.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600"
                            onClick={() => handleReject(creator.id)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
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
  )
}