'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Edit, Eye, Globe, Monitor, Smartphone, Tablet, Save, Plus, Upload, X } from "lucide-react";
import { toast } from "sonner";

interface FrontendContent {
  id: string;
  section: string;
  key: string;
  content: any;
  is_active: boolean;
  sort_order: number;
}

export default function AdminFrontendPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [contents, setContents] = useState<FrontendContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('hero');
  const [editingContent, setEditingContent] = useState<FrontendContent | null>(null);
  const [editForm, setEditForm] = useState({ content: '', is_active: true });
  const [uploadingImages, setUploadingImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/login');
      return;
    }

    if ((session.user as any)?.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }

    fetchContents();
  }, [session, status, router]);

  const fetchContents = async () => {
    try {
      const response = await fetch('/api/admin/frontend');
      if (response.ok) {
        const data = await response.json();
        setContents(data.contents || []);
      }
    } catch (error) {
      console.error('Error fetching frontend content:', error);
      toast.error('Failed to fetch content');
    } finally {
      setLoading(false);
    }
  };

  const getSectionContents = (section: string) => {
    return contents.filter(content => content.section === section).sort((a, b) => a.sort_order - b.sort_order);
  };

  const handleEdit = (content: FrontendContent) => {
    setEditingContent(content);
    setEditForm({
      content: typeof content.content === 'string' ? content.content : JSON.stringify(content.content, null, 2),
      is_active: content.is_active
    });
  };

  const renderContentPreview = (content: any) => {
    if (typeof content === 'string') {
      return <p className="line-clamp-3">{content}</p>;
    }

    if (Array.isArray(content)) {
      if (content.length === 0) {
        return <p className="text-muted-foreground italic">Empty array</p>;
      }

      // Show first few items as preview
      const previewItems = content.slice(0, 3);
      return (
        <div className="space-y-1">
          {previewItems.map((item, index) => (
            <div key={index} className="text-xs">
              {typeof item === 'object' ? (
                <span className="font-medium">
                  {item.name || item.title || item.label || `Item ${index + 1}`}
                </span>
              ) : (
                <span>{String(item)}</span>
              )}
            </div>
          ))}
          {content.length > 3 && (
            <p className="text-xs text-muted-foreground">... and {content.length - 3} more</p>
          )}
        </div>
      );
    }

    if (typeof content === 'object' && content !== null) {
      const keys = Object.keys(content);
      if (keys.length === 0) {
        return <p className="text-muted-foreground italic">Empty object</p>;
      }

      return (
        <div className="space-y-1">
          {keys.slice(0, 3).map((key) => (
            <div key={key} className="text-xs">
              <span className="font-medium capitalize">{key.replace(/_/g, ' ')}:</span>{' '}
              <span className="text-muted-foreground">
                {typeof content[key] === 'object'
                  ? '[Object]'
                  : String(content[key]).slice(0, 50)}
              </span>
            </div>
          ))}
          {keys.length > 3 && (
            <p className="text-xs text-muted-foreground">... and {keys.length - 3} more fields</p>
          )}
        </div>
      );
    }

    return <p className="text-muted-foreground italic">Unsupported content type</p>;
  };

  const renderContentForm = (content: FrontendContent) => {
    // Use the current edit form content if available, otherwise use original content
    let contentValue;
    try {
      contentValue = editForm.content ? JSON.parse(editForm.content) : content.content;
    } catch {
      contentValue = content.content;
    }

    // Handle different content types
    if (content.key === 'creators' && Array.isArray(contentValue)) {
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Creators List</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const newCreators = [...contentValue, { name: '', image: '', hint: '' }];
                setEditForm(prev => ({ ...prev, content: JSON.stringify(newCreators, null, 2) }));
              }}
              disabled={!Array.isArray(contentValue)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Creator
            </Button>
          </div>
          <div className="space-y-3">
            {contentValue.map((creator: any, index: number) => (
              <div key={index} className="border p-4 rounded-lg bg-muted/50">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium">{creator.name || `Creator ${index + 1}`}</h4>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      const newCreators = contentValue.filter((_, i) => i !== index);
                      setEditForm(prev => ({ ...prev, content: JSON.stringify(newCreators, null, 2) }));
                    }}
                    disabled={!Array.isArray(contentValue) || contentValue.length <= 1}
                  >
                    Remove
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm">Creator Name</Label>
                    <Input
                      placeholder="Creator Name"
                      value={creator.name || ''}
                      onChange={(e) => {
                        const newCreators = [...contentValue];
                        newCreators[index] = { ...newCreators[index], name: e.target.value };
                        setEditForm(prev => ({ ...prev, content: JSON.stringify(newCreators, null, 2) }));
                      }}
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Creator Image</Label>
                    <div className="space-y-2">
                      {creator.image ? (
                        <div className="flex items-center gap-2">
                          <img
                            src={creator.image}
                            alt="Creator"
                            className="w-16 h-16 object-cover rounded border"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newCreators = [...contentValue];
                              newCreators[index] = { ...newCreators[index], image: '' };
                              setEditForm(prev => ({ ...prev, content: JSON.stringify(newCreators, null, 2) }));
                            }}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleImageUpload(file, 'creator', (url) => {
                                  const newCreators = [...contentValue];
                                  newCreators[index] = { ...newCreators[index], image: url };
                                  setEditForm(prev => ({ ...prev, content: JSON.stringify(newCreators, null, 2) }));
                                });
                              }
                            }}
                          />
                          <Button type="button" variant="outline" className="w-full">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Creator Image
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm">Creator Hint</Label>
                    <Input
                      placeholder="Creator Hint"
                      value={creator.hint || ''}
                      onChange={(e) => {
                        const newCreators = [...contentValue];
                        newCreators[index] = { ...newCreators[index], hint: e.target.value };
                        setEditForm(prev => ({ ...prev, content: JSON.stringify(newCreators, null, 2) }));
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (content.key === 'features_list' && Array.isArray(contentValue)) {
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Features List</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const newFeatures = [...contentValue, { title: '', description: '', icon: '' }];
                setEditForm(prev => ({ ...prev, content: JSON.stringify(newFeatures, null, 2) }));
              }}
              disabled={!Array.isArray(contentValue)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Feature
            </Button>
          </div>
          <div className="space-y-3">
            {contentValue.map((feature: any, index: number) => (
              <div key={index} className="border p-4 rounded-lg bg-muted/50">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium">{feature.title || `Feature ${index + 1}`}</h4>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      const newFeatures = contentValue.filter((_, i) => i !== index);
                      setEditForm(prev => ({ ...prev, content: JSON.stringify(newFeatures, null, 2) }));
                    }}
                    disabled={!Array.isArray(contentValue) || contentValue.length <= 1}
                  >
                    Remove
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm">Feature Title</Label>
                    <Input
                      placeholder="Feature Title"
                      value={feature.title || ''}
                      onChange={(e) => {
                        const newFeatures = [...contentValue];
                        newFeatures[index] = { ...newFeatures[index], title: e.target.value };
                        setEditForm(prev => ({ ...prev, content: JSON.stringify(newFeatures, null, 2) }));
                      }}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-sm">Feature Description</Label>
                    <Textarea
                      placeholder="Feature Description"
                      value={feature.description || ''}
                      onChange={(e) => {
                        const newFeatures = [...contentValue];
                        newFeatures[index] = { ...newFeatures[index], description: e.target.value };
                        setEditForm(prev => ({ ...prev, content: JSON.stringify(newFeatures, null, 2) }));
                      }}
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Feature Icon</Label>
                    <Input
                      placeholder="Feature Icon"
                      value={feature.icon || ''}
                      onChange={(e) => {
                        const newFeatures = [...contentValue];
                        newFeatures[index] = { ...newFeatures[index], icon: e.target.value };
                        setEditForm(prev => ({ ...prev, content: JSON.stringify(newFeatures, null, 2) }));
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (content.key === 'steps' && Array.isArray(contentValue)) {
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Steps</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const newSteps = [...contentValue, { step: '', title: '', description: '' }];
                setEditForm(prev => ({ ...prev, content: JSON.stringify(newSteps, null, 2) }));
              }}
              disabled={!Array.isArray(contentValue)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Step
            </Button>
          </div>
          <div className="space-y-3">
            {contentValue.map((step: any, index: number) => (
              <div key={index} className="border p-4 rounded-lg bg-muted/50">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium">{step.title || `Step ${index + 1}`}</h4>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      const newSteps = contentValue.filter((_, i) => i !== index);
                      setEditForm(prev => ({ ...prev, content: JSON.stringify(newSteps, null, 2) }));
                    }}
                    disabled={!Array.isArray(contentValue) || contentValue.length <= 1}
                  >
                    Remove
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm">Step Number</Label>
                    <Input
                      placeholder="Step Number"
                      value={step.step || ''}
                      onChange={(e) => {
                        const newSteps = [...contentValue];
                        newSteps[index] = { ...newSteps[index], step: e.target.value };
                        setEditForm(prev => ({ ...prev, content: JSON.stringify(newSteps, null, 2) }));
                      }}
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Step Title</Label>
                    <Input
                      placeholder="Step Title"
                      value={step.title || ''}
                      onChange={(e) => {
                        const newSteps = [...contentValue];
                        newSteps[index] = { ...newSteps[index], title: e.target.value };
                        setEditForm(prev => ({ ...prev, content: JSON.stringify(newSteps, null, 2) }));
                      }}
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Step Description</Label>
                    <Textarea
                      placeholder="Step Description"
                      value={step.description || ''}
                      onChange={(e) => {
                        const newSteps = [...contentValue];
                        newSteps[index] = { ...newSteps[index], description: e.target.value };
                        setEditForm(prev => ({ ...prev, content: JSON.stringify(newSteps, null, 2) }));
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (content.key === 'testimonials' && Array.isArray(contentValue)) {
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Testimonials</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const newTestimonials = [...contentValue, { name: '', role: '', content: '', avatar: '' }];
                setEditForm(prev => ({ ...prev, content: JSON.stringify(newTestimonials, null, 2) }));
              }}
              disabled={!Array.isArray(contentValue)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Testimonial
            </Button>
          </div>
          <div className="space-y-3">
            {contentValue.map((testimonial: any, index: number) => (
              <div key={index} className="border p-4 rounded-lg bg-muted/50">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium">{testimonial.name || `Testimonial ${index + 1}`}</h4>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      const newTestimonials = contentValue.filter((_, i) => i !== index);
                      setEditForm(prev => ({ ...prev, content: JSON.stringify(newTestimonials, null, 2) }));
                    }}
                    disabled={!Array.isArray(contentValue) || contentValue.length <= 1}
                  >
                    Remove
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">Testimonial Name</Label>
                    <Input
                      placeholder="Testimonial Name"
                      value={testimonial.name || ''}
                      onChange={(e) => {
                        const newTestimonials = [...contentValue];
                        newTestimonials[index] = { ...newTestimonials[index], name: e.target.value };
                        setEditForm(prev => ({ ...prev, content: JSON.stringify(newTestimonials, null, 2) }));
                      }}
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Testimonial Role</Label>
                    <Input
                      placeholder="Testimonial Role"
                      value={testimonial.role || ''}
                      onChange={(e) => {
                        const newTestimonials = [...contentValue];
                        newTestimonials[index] = { ...newTestimonials[index], role: e.target.value };
                        setEditForm(prev => ({ ...prev, content: JSON.stringify(newTestimonials, null, 2) }));
                      }}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-sm">Testimonial Content</Label>
                    <Textarea
                      placeholder="Testimonial Content"
                      value={testimonial.content || ''}
                      onChange={(e) => {
                        const newTestimonials = [...contentValue];
                        newTestimonials[index] = { ...newTestimonials[index], content: e.target.value };
                        setEditForm(prev => ({ ...prev, content: JSON.stringify(newTestimonials, null, 2) }));
                      }}
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Testimonial Avatar</Label>
                    <div className="space-y-2">
                      {testimonial.avatar ? (
                        <div className="flex items-center gap-2">
                          <img
                            src={testimonial.avatar}
                            alt="Avatar"
                            className="w-12 h-12 object-cover rounded-full border"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newTestimonials = [...contentValue];
                              newTestimonials[index] = { ...newTestimonials[index], avatar: '' };
                              setEditForm(prev => ({ ...prev, content: JSON.stringify(newTestimonials, null, 2) }));
                            }}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleImageUpload(file, 'testimonial', (url) => {
                                  const newTestimonials = [...contentValue];
                                  newTestimonials[index] = { ...newTestimonials[index], avatar: url };
                                  setEditForm(prev => ({ ...prev, content: JSON.stringify(newTestimonials, null, 2) }));
                                });
                              }
                            }}
                          />
                          <Button type="button" variant="outline" className="w-full">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Avatar
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (content.key === 'stats' && Array.isArray(contentValue)) {
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Stats</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const newStats = [...contentValue, { number: '', label: '' }];
                setEditForm(prev => ({ ...prev, content: JSON.stringify(newStats, null, 2) }));
              }}
              disabled={!Array.isArray(contentValue)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Stat
            </Button>
          </div>
          <div className="space-y-3">
            {contentValue.map((stat: any, index: number) => (
              <div key={index} className="border p-4 rounded-lg bg-muted/50">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium">{stat.label || `Stat ${index + 1}`}</h4>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      const newStats = contentValue.filter((_, i) => i !== index);
                      setEditForm(prev => ({ ...prev, content: JSON.stringify(newStats, null, 2) }));
                    }}
                    disabled={!Array.isArray(contentValue) || contentValue.length <= 1}
                  >
                    Remove
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">Stat Number</Label>
                    <Input
                      placeholder="Stat Number"
                      value={stat.number || ''}
                      onChange={(e) => {
                        const newStats = [...contentValue];
                        newStats[index] = { ...newStats[index], number: e.target.value };
                        setEditForm(prev => ({ ...prev, content: JSON.stringify(newStats, null, 2) }));
                      }}
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Stat Label</Label>
                    <Input
                      placeholder="Stat Label"
                      value={stat.label || ''}
                      onChange={(e) => {
                        const newStats = [...contentValue];
                        newStats[index] = { ...newStats[index], label: e.target.value };
                        setEditForm(prev => ({ ...prev, content: JSON.stringify(newStats, null, 2) }));
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (content.key === 'nav_links' && Array.isArray(contentValue)) {
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Navigation Links</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const newLinks = [...contentValue, { label: '', href: '' }];
                setEditForm(prev => ({ ...prev, content: JSON.stringify(newLinks, null, 2) }));
              }}
              disabled={!Array.isArray(contentValue)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Link
            </Button>
          </div>
          <div className="space-y-3">
            {contentValue.map((link: any, index: number) => (
              <div key={index} className="border p-4 rounded-lg bg-muted/50">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium">{link.label || `Link ${index + 1}`}</h4>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      const newLinks = contentValue.filter((_, i) => i !== index);
                      setEditForm(prev => ({ ...prev, content: JSON.stringify(newLinks, null, 2) }));
                    }}
                    disabled={!Array.isArray(contentValue) || contentValue.length <= 1}
                  >
                    Remove
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">Link Label</Label>
                    <Input
                      placeholder="Link Label"
                      value={link.label || ''}
                      onChange={(e) => {
                        const newLinks = [...contentValue];
                        newLinks[index] = { ...newLinks[index], label: e.target.value };
                        setEditForm(prev => ({ ...prev, content: JSON.stringify(newLinks, null, 2) }));
                      }}
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Link Href</Label>
                    <Input
                      placeholder="Link Href"
                      value={link.href || ''}
                      onChange={(e) => {
                        const newLinks = [...contentValue];
                        newLinks[index] = { ...newLinks[index], href: e.target.value };
                        setEditForm(prev => ({ ...prev, content: JSON.stringify(newLinks, null, 2) }));
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (content.key === 'product_links' && Array.isArray(contentValue)) {
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Product Links</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const newLinks = [...contentValue, { label: '', href: '' }];
                setEditForm(prev => ({ ...prev, content: JSON.stringify(newLinks, null, 2) }));
              }}
              disabled={!Array.isArray(contentValue)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Link
            </Button>
          </div>
          <div className="space-y-3">
            {contentValue.map((link: any, index: number) => (
              <div key={index} className="border p-4 rounded-lg bg-muted/50">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium">{link.label || `Link ${index + 1}`}</h4>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      const newLinks = contentValue.filter((_, i) => i !== index);
                      setEditForm(prev => ({ ...prev, content: JSON.stringify(newLinks, null, 2) }));
                    }}
                    disabled={!Array.isArray(contentValue) || contentValue.length <= 1}
                  >
                    Remove
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">Link Label</Label>
                    <Input
                      placeholder="Link Label"
                      value={link.label || ''}
                      onChange={(e) => {
                        const newLinks = [...contentValue];
                        newLinks[index] = { ...newLinks[index], label: e.target.value };
                        setEditForm(prev => ({ ...prev, content: JSON.stringify(newLinks, null, 2) }));
                      }}
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Link Href</Label>
                    <Input
                      placeholder="Link Href"
                      value={link.href || ''}
                      onChange={(e) => {
                        const newLinks = [...contentValue];
                        newLinks[index] = { ...newLinks[index], href: e.target.value };
                        setEditForm(prev => ({ ...prev, content: JSON.stringify(newLinks, null, 2) }));
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (content.key === 'company_links' && Array.isArray(contentValue)) {
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Company Links</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const newLinks = [...contentValue, { label: '', href: '' }];
                setEditForm(prev => ({ ...prev, content: JSON.stringify(newLinks, null, 2) }));
              }}
              disabled={!Array.isArray(contentValue)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Link
            </Button>
          </div>
          <div className="space-y-3">
            {contentValue.map((link: any, index: number) => (
              <div key={index} className="border p-4 rounded-lg bg-muted/50">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium">{link.label || `Link ${index + 1}`}</h4>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      const newLinks = contentValue.filter((_, i) => i !== index);
                      setEditForm(prev => ({ ...prev, content: JSON.stringify(newLinks, null, 2) }));
                    }}
                    disabled={!Array.isArray(contentValue) || contentValue.length <= 1}
                  >
                    Remove
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">Link Label</Label>
                    <Input
                      placeholder="Link Label"
                      value={link.label || ''}
                      onChange={(e) => {
                        const newLinks = [...contentValue];
                        newLinks[index] = { ...newLinks[index], label: e.target.value };
                        setEditForm(prev => ({ ...prev, content: JSON.stringify(newLinks, null, 2) }));
                      }}
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Link Href</Label>
                    <Input
                      placeholder="Link Href"
                      value={link.href || ''}
                      onChange={(e) => {
                        const newLinks = [...contentValue];
                        newLinks[index] = { ...newLinks[index], href: e.target.value };
                        setEditForm(prev => ({ ...prev, content: JSON.stringify(newLinks, null, 2) }));
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (content.key === 'legal_links' && Array.isArray(contentValue)) {
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Legal Links</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const newLinks = [...contentValue, { label: '', href: '' }];
                setEditForm(prev => ({ ...prev, content: JSON.stringify(newLinks, null, 2) }));
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Link
            </Button>
          </div>
          <div className="space-y-3">
            {contentValue.map((link: any, index: number) => (
              <div key={index} className="border p-4 rounded-lg bg-muted/50">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium">{link.label || `Link ${index + 1}`}</h4>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      const newLinks = contentValue.filter((_, i) => i !== index);
                      setEditForm(prev => ({ ...prev, content: JSON.stringify(newLinks, null, 2) }));
                    }}
                  >
                    Remove
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">Link Label</Label>
                    <Input
                      placeholder="Link Label"
                      value={link.label || ''}
                      onChange={(e) => {
                        const newLinks = [...contentValue];
                        newLinks[index] = { ...newLinks[index], label: e.target.value };
                        setEditForm(prev => ({ ...prev, content: JSON.stringify(newLinks, null, 2) }));
                      }}
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Link Href</Label>
                    <Input
                      placeholder="Link Href"
                      value={link.href || ''}
                      onChange={(e) => {
                        const newLinks = [...contentValue];
                        newLinks[index] = { ...newLinks[index], href: e.target.value };
                        setEditForm(prev => ({ ...prev, content: JSON.stringify(newLinks, null, 2) }));
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Generic array handling
    if (Array.isArray(contentValue)) {
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Array Items</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const newArray = [...contentValue, {}];
                setEditForm(prev => ({ ...prev, content: JSON.stringify(newArray, null, 2) }));
              }}
              disabled={!Array.isArray(contentValue)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
          <div className="space-y-3">
            {contentValue.map((item: any, index: number) => (
              <div key={index} className="border p-4 rounded-lg bg-muted/50">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium">Item {index + 1}</h4>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      const newArray = contentValue.filter((_, i) => i !== index);
                      setEditForm(prev => ({ ...prev, content: JSON.stringify(newArray, null, 2) }));
                    }}
                    disabled={!Array.isArray(contentValue) || contentValue.length <= 1}
                  >
                    Remove
                  </Button>
                </div>
                {typeof item === 'object' && item !== null ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.keys(item).map((key) => (
                      <div key={key}>
                        <Label className="text-sm capitalize">{key.replace(/_/g, ' ')}</Label>
                        {key.toLowerCase().includes('image') || key.toLowerCase().includes('avatar') || key.toLowerCase().includes('logo') || key.toLowerCase().includes('icon') ? (
                          <div className="space-y-2">
                            {item[key] ? (
                              <div className="flex items-center gap-2">
                                <img
                                  src={item[key]}
                                  alt={key}
                                  className={`object-cover rounded border ${key.toLowerCase().includes('avatar') ? 'w-12 h-12 rounded-full' : 'w-16 h-16'}`}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const newArray = [...contentValue];
                                    newArray[index] = { ...newArray[index], [key]: '' };
                                    setEditForm(prev => ({ ...prev, content: JSON.stringify(newArray, null, 2) }));
                                  }}
                                >
                                  <X className="h-4 w-4 mr-2" />
                                  Remove
                                </Button>
                              </div>
                            ) : (
                              <div className="relative">
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      handleImageUpload(file, key, (url) => {
                                        const newArray = [...contentValue];
                                        newArray[index] = { ...newArray[index], [key]: url };
                                        setEditForm(prev => ({ ...prev, content: JSON.stringify(newArray, null, 2) }));
                                      });
                                    }
                                  }}
                                />
                                <Button type="button" variant="outline" className="w-full">
                                  <Upload className="h-4 w-4 mr-2" />
                                  Upload {key.replace(/_/g, ' ')}
                                </Button>
                              </div>
                            )}
                          </div>
                        ) : typeof item[key] === 'string' && item[key].length > 100 ? (
                          <Textarea
                            placeholder={`Enter ${key.replace(/_/g, ' ')}`}
                            value={item[key] || ''}
                            onChange={(e) => {
                              const newArray = [...contentValue];
                              newArray[index] = { ...newArray[index], [key]: e.target.value };
                              setEditForm(prev => ({ ...prev, content: JSON.stringify(newArray, null, 2) }));
                            }}
                          />
                        ) : (
                          <Input
                            placeholder={`Enter ${key.replace(/_/g, ' ')}`}
                            value={item[key] || ''}
                            onChange={(e) => {
                              const newArray = [...contentValue];
                              newArray[index] = { ...newArray[index], [key]: e.target.value };
                              setEditForm(prev => ({ ...prev, content: JSON.stringify(newArray, null, 2) }));
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <Input
                    placeholder={`Item ${index + 1}`}
                    value={item || ''}
                    onChange={(e) => {
                      const newArray = [...contentValue];
                      newArray[index] = e.target.value;
                      setEditForm(prev => ({ ...prev, content: JSON.stringify(newArray, null, 2) }));
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Generic object handling
    if (typeof contentValue === 'object' && contentValue !== null) {
      return (
        <div className="space-y-4">
          <Label>Object Fields</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(contentValue).map((key) => (
              <div key={key}>
                <Label className="text-sm capitalize">{key.replace(/_/g, ' ')}</Label>
                {key.toLowerCase().includes('image') || key.toLowerCase().includes('avatar') || key.toLowerCase().includes('logo') || key.toLowerCase().includes('icon') ? (
                  <div className="space-y-2">
                    {contentValue[key] ? (
                      <div className="flex items-center gap-2">
                        <img
                          src={contentValue[key]}
                          alt={key}
                          className={`object-cover rounded border ${key.toLowerCase().includes('avatar') ? 'w-12 h-12 rounded-full' : 'w-16 h-16'}`}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newObject = { ...contentValue, [key]: '' };
                            setEditForm(prev => ({ ...prev, content: JSON.stringify(newObject, null, 2) }));
                          }}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleImageUpload(file, key, (url) => {
                                const newObject = { ...contentValue, [key]: url };
                                setEditForm(prev => ({ ...prev, content: JSON.stringify(newObject, null, 2) }));
                              });
                            }
                          }}
                        />
                        <Button type="button" variant="outline" className="w-full">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload {key.replace(/_/g, ' ')}
                        </Button>
                      </div>
                    )}
                  </div>
                ) : typeof contentValue[key] === 'string' && contentValue[key].length > 100 ? (
                  <Textarea
                    placeholder={`Enter ${key.replace(/_/g, ' ')}`}
                    value={contentValue[key] || ''}
                    onChange={(e) => {
                      const newObject = { ...contentValue, [key]: e.target.value };
                      setEditForm(prev => ({ ...prev, content: JSON.stringify(newObject, null, 2) }));
                    }}
                  />
                ) : (
                  <Input
                    placeholder={`Enter ${key.replace(/_/g, ' ')}`}
                    value={contentValue[key] || ''}
                    onChange={(e) => {
                      const newObject = { ...contentValue, [key]: e.target.value };
                      setEditForm(prev => ({ ...prev, content: JSON.stringify(newObject, null, 2) }));
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Default to textarea for simple strings
    return (
      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={editForm.content}
          onChange={(e) => setEditForm(prev => ({ ...prev, content: e.target.value }))}
          rows={4}
        />
      </div>
    );
  };

  const handleImageUpload = async (file: File, type: string, callback: (url: string) => void) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const uploadId = `${type}_${Date.now()}`;
    setUploadingImages(prev => new Set(prev).add(uploadId));

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        callback(data.url);
        toast.success('Image uploaded successfully');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(uploadId);
        return newSet;
      });
    }
  };

  const handleSave = async () => {
    if (!editingContent) return;

    try {
      let contentToSave = editForm.content;

      // Try to parse as JSON for complex content
      try {
        const parsed = JSON.parse(editForm.content);
        contentToSave = parsed;
      } catch {
        // If it's not valid JSON, keep as string
      }

      const response = await fetch('/api/admin/frontend', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingContent.id,
          section: editingContent.section,
          key: editingContent.key,
          content: contentToSave,
          is_active: editForm.is_active,
          sort_order: editingContent.sort_order
        })
      });

      if (response.ok) {
        toast.success('Content updated successfully');
        setEditingContent(null);
        fetchContents();
      } else {
        toast.error('Failed to update content');
      }
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Failed to save content');
    }
  };

  const sections = [
    { id: 'hero', label: 'Hero Section', icon: Monitor },
    { id: 'features', label: 'Features', icon: Globe },
    { id: 'how_it_works', label: 'How It Works', icon: Smartphone },
    { id: 'social_proof', label: 'Social Proof', icon: Tablet },
    { id: 'cta', label: 'Call to Action', icon: Eye },
    { id: 'footer', label: 'Footer', icon: Edit },
    { id: 'header', label: 'Header/Navigation', icon: Monitor },
  ];

  if (status === 'loading' || loading) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Frontend Content Management</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Frontend Content Management</h1>
          <p className="text-muted-foreground">
            Manage and customize your website's frontend content
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.open('/', '_blank')}>
            <Eye className="h-4 w-4 mr-2" />
            Preview Site
          </Button>
        </div>
      </div>

      <Tabs value={activeSection} onValueChange={setActiveSection} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          {sections.map((section) => {
            const Icon = section.icon;
            const sectionContents = getSectionContents(section.id);
            return (
              <TabsTrigger key={section.id} value={section.id} className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{section.label}</span>
                <Badge variant="secondary" className="ml-1 text-xs">
                  {sectionContents.length}
                </Badge>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {sections.map((section) => (
          <TabsContent key={section.id} value={section.id} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <section.icon className="h-5 w-5" />
                  {section.label} Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getSectionContents(section.id).length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <section.icon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No content found for this section</p>
                      <Button className="mt-4">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Content
                      </Button>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {getSectionContents(section.id).map((content) => (
                        <Card key={content.id} className="border-l-4 border-l-primary">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-semibold capitalize">{content.key.replace(/_/g, ' ')}</h4>
                                  <Badge variant={content.is_active ? "default" : "secondary"}>
                                    {content.is_active ? "Active" : "Inactive"}
                                  </Badge>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {renderContentPreview(content.content)}
                                </div>
                              </div>
                              <div className="flex gap-2 ml-4">
                                <Button variant="outline" size="sm" onClick={() => handleEdit(content)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={!!editingContent} onOpenChange={() => setEditingContent(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Content - {editingContent?.key.replace(/_/g, ' ')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {editingContent && renderContentForm(editingContent)}
            <div className="border-t pt-4">
              <div className="flex items-center space-x-2 mb-4">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={editForm.is_active}
                  onChange={(e) => setEditForm(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingContent(null)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}