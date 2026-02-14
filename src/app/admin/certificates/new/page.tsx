"use client";

import CertificateForm from "@/components/admin/CertificateForm";

export default function NewCertificatePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Certificate</h1>
        <p className="text-muted-foreground">
          Add a new certification to your portfolio.
        </p>
      </div>

      <CertificateForm />
    </div>
  );
}
