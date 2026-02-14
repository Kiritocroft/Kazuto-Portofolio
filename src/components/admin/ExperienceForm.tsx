"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export interface Experience {
  id?: string;
  title: string;
  company: string;
  year: string;
  description: string;
  type: "work" | "education";
}

interface ExperienceFormProps {
  initialData?: Experience;
  isEditing?: boolean;
}

export default function ExperienceForm({ initialData, isEditing = false }: ExperienceFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Experience>({
    title: initialData?.title || "",
    company: initialData?.company || "",
    year: initialData?.year || "",
    description: initialData?.description || "",
    type: initialData?.type || "work",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEditing && initialData?.id 
        ? `/api/experience/${initialData.id}` 
        : '/api/experience';
      
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to save experience');
      }

      toast.success(isEditing ? "Experience updated successfully" : "Experience created successfully");
      router.push("/admin/experience");
      router.refresh();
    } catch (error) {
      console.error("Error saving experience:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save experience");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label>Type</Label>
          <RadioGroup
            defaultValue={formData.type}
            onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as "work" | "education" }))}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="work" id="work" />
              <Label htmlFor="work">Work</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="education" id="education" />
              <Label htmlFor="education">Education</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="title">Job Title</Label>
          <Input
            id="title"
            name="title"
            placeholder="e.g. Senior Frontend Developer"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="company">Company / Organization</Label>
          <Input
            id="company"
            name="company"
            placeholder="e.g. Google Inc."
            value={formData.company}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="year">Period / Year</Label>
          <Input
            id="year"
            name="year"
            placeholder="e.g. 2022 - Present"
            value={formData.year}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Describe your responsibilities and achievements..."
            value={formData.description}
            onChange={handleChange}
            rows={5}
            required
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? "Update Experience" : "Create Experience"}
        </Button>
      </div>
    </form>
  );
}
