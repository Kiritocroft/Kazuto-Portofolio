"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

interface SiteSettings {
  maintenanceMode: boolean;
  heroTitle: string;
  heroDescription: string;
  contactEmail: string;
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>({
    maintenanceMode: false,
    heroTitle: "",
    heroDescription: "",
    contactEmail: "",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      if (!db) return;
      try {
        const docRef = doc(db, "settings", "general");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSettings(docSnap.data() as SiteSettings);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setSettings((prev) => ({ ...prev, maintenanceMode: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    if (!db) return;

    try {
      await setDoc(doc(db, "settings", "general"), settings);
      toast.success("Settings saved successfully");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your website configuration.
        </p>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Maintenance Mode</Label>
              <div className="text-sm text-muted-foreground">
                Disable access to the public site
              </div>
            </div>
            <Switch
              checked={settings.maintenanceMode}
              onCheckedChange={handleSwitchChange}
            />
          </div>

          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="heroTitle">Hero Title</Label>
              <Input
                id="heroTitle"
                name="heroTitle"
                value={settings.heroTitle}
                onChange={handleChange}
                placeholder="e.g. Creative Developer"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="heroDescription">Hero Description</Label>
              <Textarea
                id="heroDescription"
                name="heroDescription"
                value={settings.heroDescription}
                onChange={handleChange}
                placeholder="Short bio for the hero section"
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                value={settings.contactEmail}
                onChange={handleChange}
                placeholder="contact@example.com"
              />
            </div>
          </div>

          <Button type="submit" disabled={saving}>
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
}
