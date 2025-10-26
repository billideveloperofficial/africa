'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Star, ArrowLeft } from "lucide-react";

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
  featured?: boolean;
}

export default function FeaturedCreatorsPage() {
  const router = useRouter();
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCreators();
  }, []);

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

  const handleFeature = async (creatorId: string, action: 'add' | 'remove') => {
    try {
      const response = await fetch('/api/admin/creators/featured', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creatorId, action }),
      });

      if (response.ok) {
        setCreators(creators.map(c =>
          c.id === creatorId ? { ...c, featured: action === 'add' } : c
        ));
      } else {
        alert('Failed to update featured status');
      }
    } catch (error) {
      console.error('Error updating featured status:', error);
      alert('Failed to update featured status');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Featured Creators</h1>
        <Button variant="outline" onClick={() => router.push('/admin/users')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Users
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Featured Creators</CardTitle>
        </CardHeader>
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
                          {creator.display_name && (
                            <p className="text-sm text-muted-foreground">{creator.display_name}</p>
                          )}
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
  )
}