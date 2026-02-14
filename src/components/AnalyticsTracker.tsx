"use client";

import { useEffect } from "react";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { usePathname } from "next/navigation";

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const trackVisit = async () => {
      if (!db) return;
      
      // Don't track admin pages
      if (pathname?.startsWith("/admin")) return;
      
      // Use sessionStorage to count unique sessions per tab
      const visitedKey = "portfolio_session_visit";
      const hasVisited = sessionStorage.getItem(visitedKey);

      if (!hasVisited) {
        try {
          const analyticsRef = doc(db, "analytics", "general");
          const docSnap = await getDoc(analyticsRef);

          if (docSnap.exists()) {
            await updateDoc(analyticsRef, {
              visitors: increment(1),
              lastVisit: new Date().toISOString()
            });
          } else {
            await setDoc(analyticsRef, {
              visitors: 1,
              lastVisit: new Date().toISOString()
            });
          }
          sessionStorage.setItem(visitedKey, "true");
        } catch (error) {
          console.error("Error tracking visit:", error);
        }
      }
    };

    trackVisit();
  }, [pathname]);

  return null;
}
