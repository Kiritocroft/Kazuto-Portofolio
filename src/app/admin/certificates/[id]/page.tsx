"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import CertificateForm, { Certificate } from "@/components/admin/CertificateForm";
import { Loader2 } from "lucide-react";

export default function EditCertificatePage() {
  const params = useParams();
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificate = async () => {
      if (!db || !params.id) return;
      
      try {
        const docRef = doc(db, "certificates", params.id as string);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setCertificate({ id: docSnap.id, ...docSnap.data() } as Certificate);
        }
      } catch (error) {
        console.error("Error fetching certificate:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!certificate) {
    return <div>Certificate not found</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Certificate</h1>
        <p className="text-muted-foreground">
          Update certificate details.
        </p>
      </div>

      <CertificateForm initialData={certificate} isEditing />
    </div>
  );
}
