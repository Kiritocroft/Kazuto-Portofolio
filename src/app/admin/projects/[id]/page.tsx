"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ProjectForm, { Project } from "@/components/admin/ProjectForm";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      if (!db) return;
      
      try {
        const docRef = doc(db, "projects", params.id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProject({ id: docSnap.id, ...docSnap.data() } as Project);
        } else {
          toast.error("Project not found");
          router.push("/admin/projects");
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        toast.error("Failed to fetch project details");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Project</h1>
        <p className="text-muted-foreground">
          Update your project details.
        </p>
      </div>
      <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
        <ProjectForm initialData={project} isEditing />
      </div>
    </div>
  );
}
