"use client";

import ExperienceForm from "@/components/admin/ExperienceForm";

export default function NewExperiencePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Experience</h1>
        <p className="text-muted-foreground">
          Add a new work experience or education entry.
        </p>
      </div>

      <ExperienceForm />
    </div>
  );
}
