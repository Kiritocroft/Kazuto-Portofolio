"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { doc, getDoc, setDoc } from "firebase/firestore";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import { Loader2, Save, Upload, X, FileText, ImageIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

interface SiteSettings {
  maintenanceMode: boolean;
  
  // Personal Info
  name: string;
  role: string; // Replaces heroTitle
  about: string; // Replaces heroDescription
  email: string; // Replaces contactEmail
  avatar: string;
  resume: string;
  
  // Social
  github: string;
  linkedin: string;
  instagram: string;

  // Skills
  skills: string[];
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>({
    maintenanceMode: false,
    name: "",
    role: "",
    about: "",
    email: "",
    avatar: "",
    resume: "",
    github: "",
    linkedin: "",
    instagram: "",
    skills: [],
  });

  const [skillsInput, setSkillsInput] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      if (!db) return;
      try {
        const docRef = doc(db, "settings", "general");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          // Map legacy fields if they exist
          setSettings({
            maintenanceMode: data.maintenanceMode || false,
            name: data.name || "",
            role: data.role || data.heroTitle || "",
            about: data.about || data.heroDescription || "",
            email: data.email || data.contactEmail || "",
            avatar: data.avatar || "",
            resume: data.resume || "",
            github: data.github || "",
            linkedin: data.linkedin || "",
            instagram: data.instagram || "",
            skills: data.skills || [],
          });
          setSkillsInput((data.skills || []).join(", "));
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

  const handleSkillsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSkillsInput(e.target.value);
    const skillsArray = e.target.value.split(",").map(s => s.trim()).filter(s => s !== "");
    setSettings(prev => ({ ...prev, skills: skillsArray }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'resume') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Remove Firebase Storage check
    // if (!storage) { ... }

    try {
      setSaving(true);
      
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      const data = await res.json();
      const downloadURL = data.url;
      
      setSettings(prev => ({ ...prev, [type]: downloadURL }));
      toast.success(`${type === 'avatar' ? 'Avatar' : 'Resume'} uploaded successfully`);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload file");
    } finally {
      setSaving(false);
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    setSettings((prev) => ({ ...prev, maintenanceMode: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    if (!db) return;

    try {
      // Save with both new and legacy keys for backward compatibility if needed, 
      // but strictly we should move to new keys.
      // I will save new keys and keep legacy keys synced for now to avoid breaking Hero if I don't update it immediately.
      const dataToSave = {
        ...settings,
        // Sync legacy keys
        heroTitle: settings.role,
        heroDescription: settings.about,
        contactEmail: settings.email,
      };

      await setDoc(doc(db, "settings", "general"), dataToSave);
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
          Manage your profile, skills, and site configuration.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="social">Social & Skills</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Site Configuration</CardTitle>
                <CardDescription>
                  General settings for your portfolio.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal details displayed on the Hero section.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Display Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={settings.name}
                    onChange={handleChange}
                    placeholder="e.g. Kazuto"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="role">Role / Title</Label>
                  <Input
                    id="role"
                    name="role"
                    value={settings.role}
                    onChange={handleChange}
                    placeholder="e.g. Software Engineer"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="about">About / Bio</Label>
                  <Textarea
                    id="about"
                    name="about"
                    value={settings.about}
                    onChange={handleChange}
                    placeholder="Short bio..."
                    rows={4}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Contact Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={settings.email}
                    onChange={handleChange}
                    placeholder="e.g. contact@example.com"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="avatar">Avatar</Label>
                   <p className="text-sm text-muted-foreground">
                    To change your avatar, please replace the file <code>public/pp.jpg</code> manually in your project folder.
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="resume">Resume / CV</Label>
                  <div className="space-y-2">
                    {settings.resume && (
                      <div className="flex items-center gap-2 rounded-md border p-2 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        <span className="flex-1 truncate max-w-[200px]">
                          {decodeURIComponent(settings.resume.split('/').pop()?.split('?')[0] || "Resume")}
                        </span>
                         <a 
                            href={settings.resume} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline text-xs"
                          >
                            View
                          </a>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 ml-auto"
                          onClick={() => setSettings(prev => ({ ...prev, resume: "" }))}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <Input
                      id="resume"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileChange(e, "resume")}
                      disabled={saving}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Social Links & Skills</CardTitle>
                <CardDescription>
                  Manage your social media presence and technical skills.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Social Links</h3>
                  <div className="grid gap-2">
                    <Label htmlFor="github">GitHub URL</Label>
                    <Input
                      id="github"
                      name="github"
                      value={settings.github}
                      onChange={handleChange}
                      placeholder="https://github.com/..."
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="linkedin">LinkedIn URL</Label>
                    <Input
                      id="linkedin"
                      name="linkedin"
                      value={settings.linkedin}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="instagram">Instagram URL</Label>
                    <Input
                      id="instagram"
                      name="instagram"
                      value={settings.instagram}
                      onChange={handleChange}
                      placeholder="https://instagram.com/..."
                    />
                  </div>
                </div>

                {/* Skills Section Removed as requested */}
                {/* <div className="space-y-4">
                  <h3 className="text-lg font-medium">Skills (Icons)</h3>
                   ...
                </div> */}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
           <Button type="submit" disabled={saving} size="lg">
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" /> Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
