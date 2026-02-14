"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Hammer, Loader2 } from "lucide-react";

export function MaintenanceCheck() {
  const pathname = usePathname();
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) return;

    // Use onSnapshot for real-time updates
    const docRef = doc(db, "settings", "general");
    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        setIsMaintenance(doc.data().maintenanceMode || false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Allow access to admin routes and login even in maintenance mode
  const isAllowedPath = pathname?.startsWith("/admin") || pathname === "/login";

  if (loading) return null;

  if (isMaintenance && !isAllowedPath) {
    return (
      <div className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center p-4 text-center">
        <div className="rounded-full bg-primary/10 p-6 mb-6">
          <Hammer className="h-12 w-12 text-primary animate-bounce" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">Under Maintenance</h1>
        <p className="text-muted-foreground text-lg max-w-md">
          We're currently making some improvements to our site. Please check back later!
        </p>
      </div>
    );
  }

  return null;
}
