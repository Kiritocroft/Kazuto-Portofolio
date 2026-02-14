"use client";

import { useEffect } from "react";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function AnalyticsTracker() {
  useEffect(() => {
    const trackVisit = async () => {
      if (!db) return;
      
      // Use sessionStorage to track unique visits per session
      if (sessionStorage.getItem("visited")) return;

      try {
        const analyticsRef = doc(db, "analytics", "general");
        const docSnap = await getDoc(analyticsRef);

        if (docSnap.exists()) {
          await updateDoc(analyticsRef, {
            visitors: increment(1)
          });
        } else {
          await setDoc(analyticsRef, {
            visitors: 1,
            views: 1
          });
        }
        
        sessionStorage.setItem("visited", "true");
      } catch (error) {
        console.error("Error tracking analytics:", error);
      }
    };

    trackVisit();
  }, []);

  return null;
}
