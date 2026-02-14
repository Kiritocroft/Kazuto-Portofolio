"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FolderKanban, Award, Eye, Loader2 } from "lucide-react";
import { collection, getCountFromServer, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    certificates: 0, // Placeholder for now as we don't have certificates collection yet
    visitors: 0,
    activeUsers: 0, // Placeholder
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!db) return;

      try {
        // Fetch Projects Count
        const projectsColl = collection(db, "projects");
        const projectsSnapshot = await getCountFromServer(projectsColl);
        const projectsCount = projectsSnapshot.data().count;

        // Fetch Visitors Count
        const analyticsRef = doc(db, "analytics", "general");
        const analyticsSnap = await getDoc(analyticsRef);
        const visitorsCount = analyticsSnap.exists() ? analyticsSnap.data().visitors : 0;

        setStats({
          projects: projectsCount,
          certificates: 8, // Static for now
          visitors: visitorsCount,
          activeUsers: 1, // Static for now (current admin)
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Projects",
      value: stats.projects,
      icon: FolderKanban,
      description: "Portfolio items",
    },
    {
      title: "Certificates",
      value: stats.certificates,
      icon: Award,
      description: "Verified certifications",
    },
    {
      title: "Total Visitors",
      value: stats.visitors,
      icon: Eye,
      description: "All time views",
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      icon: Users,
      description: "Current admin session",
    },
  ];

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your portfolio performance and content.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-40 text-muted-foreground">
              No recent activity to show.
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
             <div className="flex items-center justify-between p-2 hover:bg-muted rounded-lg cursor-pointer transition-colors">
                <span className="text-sm font-medium">Add New Project</span>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
