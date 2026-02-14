"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";

export interface Certificate {
  id?: string;
  title: string;
  issuer: string;
  date: string;
  link: string;
  image: string;
}

interface CertificateFormProps {
  initialData?: Certificate;
  isEditing?: boolean;
}

export default function CertificateForm({ initialData, isEditing = false }: CertificateFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(initialData?.image || "");
  const [formData, setFormData] = useState<Certificate>({
    title: initialData?.title || "",
    issuer: initialData?.issuer || "",
    date: initialData?.date || "",
    link: initialData?.link || "",
    image: initialData?.image || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Check file size (limit to ~4MB for MongoDB BSON limit safety)
      if (file.size > 4 * 1024 * 1024) {
        toast.error("Image size too large. Please use an image under 4MB.");
        return;
      }

      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    setFormData(prev => ({ ...prev, image: "" }));
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.image;
      
      if (imageFile) {
        imageUrl = await convertToBase64(imageFile);
      }

      const updatedFormData = { ...formData, image: imageUrl };

      if (isEditing && initialData?.id) {
        const res = await fetch(`/api/certificates/${initialData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedFormData),
        });
        if (!res.ok) throw new Error('Failed to update certificate');
        toast.success("Certificate updated successfully");
      } else {
        const res = await fetch('/api/certificates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedFormData),
        });
        if (!res.ok) throw new Error('Failed to create certificate');
        toast.success("Certificate created successfully");
      }
      router.push("/admin/certificates");
      router.refresh();
    } catch (error) {
      console.error("Error saving certificate:", error);
      toast.error("Failed to save certificate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Certificate Title</Label>
          <Input
            id="title"
            name="title"
            placeholder="e.g. AWS Certified Cloud Practitioner"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="issuer">Issuer / Organization</Label>
          <Input
            id="issuer"
            name="issuer"
            placeholder="e.g. Amazon Web Services"
            value={formData.issuer}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="date">Date Issued</Label>
          <Input
            id="date"
            name="date"
            placeholder="e.g. Dec 2023"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="link">Credential URL</Label>
          <Input
            id="link"
            name="link"
            placeholder="https://..."
            value={formData.link}
            onChange={handleChange}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="image">Certificate Image</Label>
          <div className="flex flex-col gap-4">
            <div className="flex gap-2 items-center">
               <Input
                id="image"
                name="image"
                placeholder="Image URL or Upload File"
                value={formData.image}
                onChange={handleChange}
                disabled={!!imageFile}
              />
              <div className="relative">
                <Input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleImageFileChange}
                  accept="image/*"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => document.getElementById("file-upload")?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>
            
            {imagePreview && (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden border max-w-sm">
                <Image 
                  src={imagePreview} 
                  alt="Preview" 
                  fill 
                  className="object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground">Provide a URL or upload the certificate image/logo.</p>
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? "Update Certificate" : "Create Certificate"}
        </Button>
      </div>
    </form>
  );
}
