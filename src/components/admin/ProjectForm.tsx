"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { doc, setDoc, addDoc, collection, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Project {
  id?: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
  github: string;
  featured: boolean;
  category: string;
}

interface ProjectFormProps {
  initialData?: Project;
  isEditing?: boolean;
}

export default function ProjectForm({ initialData, isEditing = false }: ProjectFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Project>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    image: initialData?.image || "",
    tags: initialData?.tags || [],
    link: initialData?.link || "",
    github: initialData?.github || "",
    featured: initialData?.featured || false,
    category: initialData?.category || "Web App",
  });

  const [tagsInput, setTagsInput] = useState(initialData?.tags.join(", ") || "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagsInput(e.target.value);
    const tagsArray = e.target.value.split(",").map((tag) => tag.trim()).filter((tag) => tag !== "");
    setFormData((prev) => ({ ...prev, tags: tagsArray }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, featured: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!db) {
      toast.error("Firebase is not initialized");
      setLoading(false);
      return;
    }

    try {
      if (isEditing && initialData?.id) {
        await updateDoc(doc(db, "projects", initialData.id), {
            ...formData,
            updatedAt: new Date().toISOString(),
        });
        toast.success("Project updated successfully");
      } else {
        await addDoc(collection(db, "projects"), {
          ...formData,
          createdAt: new Date().toISOString(),
        });
        toast.success("Project created successfully");
      }
      router.push("/admin/projects");
      router.refresh();
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error("Failed to save project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            placeholder="Project Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Project Description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={5}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="image">Image URL</Label>
          <Input
            id="image"
            name="image"
            placeholder="https://example.com/image.jpg"
            value={formData.image}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="link">Live URL</Label>
            <Input
              id="link"
              name="link"
              placeholder="https://project-demo.com"
              value={formData.link}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="github">GitHub URL</Label>
            <Input
              id="github"
              name="github"
              placeholder="https://github.com/username/repo"
              value={formData.github}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <Input
            id="tags"
            name="tags"
            placeholder="React, Next.js, TypeScript, Tailwind"
            value={tagsInput}
            onChange={handleTagsChange}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label>Category</Label>
            <Select value={formData.category} onValueChange={handleSelectChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Web App">Web App</SelectItem>
                <SelectItem value="Mobile App">Mobile App</SelectItem>
                <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
                <SelectItem value="Game Dev">Game Dev</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Featured Project</Label>
              <div className="text-sm text-muted-foreground">
                Display this project on the home page
              </div>
            </div>
            <Switch
              checked={formData.featured}
              onCheckedChange={handleSwitchChange}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? "Update Project" : "Create Project"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
