'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Edit, Eye, Plus, Save, Trash2, FileText, Globe, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { RichTextEditor } from "@/components/rich-text-editor";

interface Page {
  id: string;
  slug: string;
  title: string;
  content: string;
  meta_title?: string;
  meta_description?: string;
  featured_image?: string;
  is_active: boolean;
  updated_at: string;
}

export default function AdminPagesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    content: '',
    meta_title: '',
    meta_description: '',
    featured_image: '',
    is_active: true
  });
  const [uploadingImage, setUploadingImage] = useState(false);

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

    fetchPages();
  }, [session, status, router]);

  const fetchPages = async () => {
    try {
      const response = await fetch('/api/admin/pages');
      if (response.ok) {
        const data = await response.json();
        setPages(data.pages || []);
      }
    } catch (error) {
      console.error('Error fetching pages:', error);
      toast.error('Failed to fetch pages');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      slug: '',
      title: '',
      content: '',
      meta_title: '',
      meta_description: '',
      featured_image: '',
      is_active: true
    });
  };

  const handleCreate = () => {
    resetForm();
    setEditingPage(null);
    setIsCreateDialogOpen(true);
  };

  const handleEdit = (page: Page) => {
    setEditingPage(page);
    setFormData({
      slug: page.slug,
      title: page.title,
      content: page.content,
      meta_title: page.meta_title || '',
      meta_description: page.meta_description || '',
      featured_image: page.featured_image || '',
      is_active: page.is_active
    });
    setIsCreateDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.slug) {
      toast.error('Title and slug are required');
      return;
    }

    setSaving(true);
    try {
      const url = editingPage
        ? `/api/admin/pages/${editingPage.id}`
        : '/api/admin/pages';
      const method = editingPage ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        if (editingPage) {
          setPages(pages.map(p => p.id === editingPage.id ? data.page : p));
          toast.success('Page updated successfully!');
        } else {
          setPages([...pages, data.page]);
          toast.success('Page created successfully!');
        }
        setIsCreateDialogOpen(false);
        resetForm();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to save page');
      }
    } catch (error) {
      console.error('Error saving page:', error);
      toast.error('Failed to save page');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (pageId: string) => {
    try {
      const response = await fetch(`/api/admin/pages/${pageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPages(pages.filter(p => p.id !== pageId));
        toast.success('Page deleted successfully!');
      } else {
        toast.error('Failed to delete page');
      }
    } catch (error) {
      console.error('Error deleting page:', error);
      toast.error('Failed to delete page');
    }
  };

  const handlePreview = (slug: string) => {
    window.open(`/${slug}`, '_blank');
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'page');

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({ ...prev, featured_image: data.url }));
        toast.success('Image uploaded successfully!');
      } else {
        toast.error('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, featured_image: '' }));
  };

  if (status === 'loading' || loading) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Pages Management</h1>
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
          <h1 className="text-3xl font-bold tracking-tight">Pages Management</h1>
          <p className="text-muted-foreground">
            Create and manage your website's static pages
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Page
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pages.length === 0 ? (
          <Card className="md:col-span-2 lg:col-span-3">
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No pages created yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first page to get started with content management.
              </p>
              <Button onClick={handleCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Page
              </Button>
            </CardContent>
          </Card>
        ) : (
          pages.map((page) => (
            <Card key={page.id} className="border-l-4 border-l-primary">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{page.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">/{page.slug}</p>
                  </div>
                  <Badge variant={page.is_active ? "default" : "secondary"}>
                    {page.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {page.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handlePreview(page.slug)}>
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(page)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Page</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{page.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(page.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPage ? 'Edit Page' : 'Create New Page'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="slug">Page Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="about-us"
                />
                <p className="text-xs text-muted-foreground">
                  URL will be: /{formData.slug}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Page Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="About Us"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Page Content *</Label>
              <RichTextEditor
                content={formData.content}
                onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                placeholder="Start writing your page content here..."
              />
              <p className="text-xs text-muted-foreground">
                Use the toolbar above to format your content. The rich text editor provides professional formatting options for headers, text styles, lists, links, and more.
              </p>
            </div>

            {/* Featured Image */}
            <div className="space-y-2">
              <Label>Featured Image</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                  disabled={uploadingImage}
                  className="hidden"
                  id="featured_image"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('featured_image')?.click()}
                  disabled={uploadingImage}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {uploadingImage ? 'Uploading...' : 'Upload Image'}
                </Button>
                {formData.featured_image && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {formData.featured_image && (
                <div className="flex items-center gap-2">
                  <img
                    src={formData.featured_image}
                    alt="Featured image preview"
                    className="w-20 h-20 object-cover rounded border"
                  />
                  <span className="text-sm text-muted-foreground">Featured image</span>
                </div>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="meta_title">Meta Title</Label>
                <Input
                  id="meta_title"
                  value={formData.meta_title}
                  onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                  placeholder={`${formData.title} - Content Africa`}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta_description">Meta Description</Label>
                <Textarea
                  id="meta_description"
                  value={formData.meta_description}
                  onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                  placeholder="Brief description for search engines"
                  rows={2}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                className="rounded"
              />
              <Label htmlFor="is_active">Page is active and visible to visitors</Label>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Page'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}