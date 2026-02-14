"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ExperienceForm, { Experience } from "@/components/admin/ExperienceForm";
import { Loader2 } from "lucide-react";

export default function EditExperiencePage() {
  const params = useParams();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperience = async () => {
      // Since we can't fetch single item by ID easily without an API that supports it (Prisma does),
      // we can reuse the /api/experience logic or filter client side if list is small.
      // But we should probably have GET /api/experience/[id] implemented.
      // I implemented /api/experience/[id] DELETE and PUT, but need to check if GET is there.
      // Wait, I only implemented PUT and DELETE in /api/experience/[id]/route.ts
      // I should add GET there.
      
      // Let's assume I will add GET to /api/experience/[id]/route.ts
      try {
        const res = await fetch(`/api/experience/${params.id}`); // This will fail if GET is not implemented
        if (res.ok) {
           const data = await res.json();
           setExperience(data);
        } else {
           // Fallback: fetch all and find
           const allRes = await fetch('/api/experience');
           const allData = await allRes.json();
           const found = allData.find((e: Experience) => e.id === params.id);
           if (found) setExperience(found);
        }
      } catch (error) {
        console.error("Error fetching experience:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
        fetchExperience();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!experience) {
    return <div>Experience not found</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Experience</h1>
        <p className="text-muted-foreground">
          Update experience details.
        </p>
      </div>

      <ExperienceForm initialData={experience} isEditing />
    </div>
  );
}
