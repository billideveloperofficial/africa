'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { Settings, Save, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";


interface SiteSettings {
    id: string;
    site_name: string;
    site_description?: string;
    favicon_url?: string;
    logo_url?: string;
    copyright: string;
    contact_email: string;
    phone?: string;
    address?: string;
    social_links?: {
      facebook?: string;
      twitter?: string;
      instagram?: string;
      linkedin?: string;
    };
    meta_title?: string;
    meta_description?: string;
    google_analytics_id?: string;
    maintenance_mode: boolean;
    updated_at: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<'favicon' | 'logo' | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);


  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
        toast({
          title: "Success",
          description: "Settings saved successfully!",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to save settings",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (field: string, value: any) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  };

  // Footer functions removed

  const updateSocialLink = (platform: string, value: string) => {
    if (!settings) return;
    const social_links = { ...settings.social_links, [platform]: value };
    setSettings({ ...settings, social_links });
  };

  const handleImageUpload = async (file: File, type: 'favicon' | 'logo') => {
    if (!file) return;

    setUploading(type);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        updateSetting(`${type}_url`, data.url);
        // Force re-render by updating state
        setSettings(prev => prev ? { ...prev, [`${type}_url`]: data.url } : null);
        toast({
          title: "Success",
          description: `${type === 'favicon' ? 'Favicon' : 'Logo'} uploaded successfully!`,
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.error || `Failed to upload ${type}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      toast({
        title: "Error",
        description: `Failed to upload ${type}`,
        variant: "destructive",
      });
    } finally {
      setUploading(null);
    }
  };

  const removeImage = (type: 'favicon' | 'logo') => {
    updateSetting(`${type}_url`, '');
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Site Settings</h1>
        <div className="animate-pulse space-y-6">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Site Settings</h1>
        <Card>
          <CardContent className="p-8 text-center">
            <p>Failed to load settings. Please try refreshing the page.</p>
            <Button onClick={fetchSettings} className="mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Site Settings</h1>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="site_name">Site Name *</Label>
                <Input
                  id="site_name"
                  value={settings.site_name}
                  onChange={(e) => updateSetting('site_name', e.target.value)}
                  placeholder="Content Africa"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_email">Contact Email *</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={settings.contact_email}
                  onChange={(e) => updateSetting('contact_email', e.target.value)}
                  placeholder="hello@contentafrica.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="site_description">Site Description</Label>
              <Textarea
                id="site_description"
                value={settings.site_description || ''}
                onChange={(e) => updateSetting('site_description', e.target.value)}
                placeholder="Brief description of your platform"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Branding */}
        <Card>
          <CardHeader>
            <CardTitle>Branding</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="favicon">Favicon</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="favicon"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, 'favicon');
                    }}
                    disabled={uploading === 'favicon'}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('favicon')?.click()}
                    disabled={uploading === 'favicon'}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {uploading === 'favicon' ? 'Uploading...' : 'Upload Favicon'}
                  </Button>
                  {settings.favicon_url && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeImage('favicon')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {settings.favicon_url && (
                  <div className="flex items-center gap-2">
                    <img
                      key={settings.favicon_url} // Force re-render when URL changes
                      src={settings.favicon_url}
                      alt="Favicon preview"
                      className="w-6 h-6"
                      onError={(e) => {
                        console.error('Favicon preview failed to load:', settings.favicon_url);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <span className="text-sm text-muted-foreground">Current favicon</span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo">Logo</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, 'logo');
                    }}
                    disabled={uploading === 'logo'}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('logo')?.click()}
                    disabled={uploading === 'logo'}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {uploading === 'logo' ? 'Uploading...' : 'Upload Logo'}
                  </Button>
                  {settings.logo_url && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeImage('logo')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {settings.logo_url && (
                  <div className="flex items-center gap-2">
                    <img
                      key={settings.logo_url} // Force re-render when URL changes
                      src={settings.logo_url}
                      alt="Logo preview"
                      className="h-8 w-auto max-w-32"
                      onError={(e) => {
                        console.error('Logo preview failed to load:', settings.logo_url);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <span className="text-sm text-muted-foreground">Current logo</span>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="copyright">Copyright Text *</Label>
              <Input
                id="copyright"
                value={settings.copyright}
                onChange={(e) => updateSetting('copyright', e.target.value)}
                placeholder="© 2024 Content Africa. All rights reserved."
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contact_email">Contact Email</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={settings.contact_email}
                  onChange={(e) => updateSetting('contact_email', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={settings.phone || ''}
                  onChange={(e) => updateSetting('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={settings.address || ''}
                onChange={(e) => updateSetting('address', e.target.value)}
                placeholder="123 Content Street&#10;Creative District&#10;New York, NY 10001&#10;United States"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card>
          <CardHeader>
            <CardTitle>Social Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  value={settings.social_links?.facebook || ''}
                  onChange={(e) => updateSocialLink('facebook', e.target.value)}
                  placeholder="https://facebook.com/yourpage"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  value={settings.social_links?.twitter || ''}
                  onChange={(e) => updateSocialLink('twitter', e.target.value)}
                  placeholder="https://twitter.com/yourhandle"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={settings.social_links?.instagram || ''}
                  onChange={(e) => updateSocialLink('instagram', e.target.value)}
                  placeholder="https://instagram.com/yourhandle"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={settings.social_links?.linkedin || ''}
                  onChange={(e) => updateSocialLink('linkedin', e.target.value)}
                  placeholder="https://linkedin.com/company/yourcompany"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SEO Settings */}
        <Card>
          <CardHeader>
            <CardTitle>SEO Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="meta_title">Meta Title</Label>
              <Input
                id="meta_title"
                value={settings.meta_title || ''}
                onChange={(e) => updateSetting('meta_title', e.target.value)}
                placeholder="Content Africa - Connect Brands with Creators"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meta_description">Meta Description</Label>
              <Textarea
                id="meta_description"
                value={settings.meta_description || ''}
                onChange={(e) => updateSetting('meta_description', e.target.value)}
                placeholder="AI-powered creator marketplace connecting brands with influencers"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="google_analytics_id">Google Analytics ID</Label>
              <Input
                id="google_analytics_id"
                value={settings.google_analytics_id || ''}
                onChange={(e) => updateSetting('google_analytics_id', e.target.value)}
                placeholder="GA-XXXXXXXXXX"
              />
            </div>
          </CardContent>
        </Card>



        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle>System Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="maintenance_mode">Maintenance Mode</Label>
                <div className="text-sm text-muted-foreground">
                  Enable maintenance mode to temporarily disable the site
                </div>
              </div>
              <Switch
                id="maintenance_mode"
                checked={settings.maintenance_mode}
                onCheckedChange={(checked) => updateSetting('maintenance_mode', checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
