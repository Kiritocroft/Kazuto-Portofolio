import ProjectForm from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Project</h1>
        <p className="text-muted-foreground">
          Create a new project to showcase in your portfolio.
        </p>
      </div>
      <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
        <ProjectForm />
      </div>
    </div>
  );
}
