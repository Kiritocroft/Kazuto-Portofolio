"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, FolderKanban, Award, Eye, Loader2, MessageSquare, Briefcase } from "lucide-react";
import { collection, getCountFromServer, doc, getDoc, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ActivityItem {
  id: string;
  type: 'project' | 'certificate' | 'experience' | 'message';
  title: string;
  subtitle: string;
  date: Date;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    certificates: 0,
    visitors: 0,
    activeUsers: 0,
    experiences: 0,
  });
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // 1. Fetch Stats from API (Prisma)
      let statsData: any = {};
      try {
        const statsRes = await fetch('/api/stats');
        if (statsRes.ok) {
          statsData = await statsRes.json();
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
      
      // 2. Fetch Recent Activity from API (Prisma)
      let activityData: any = {};
      try {
        const activityRes = await fetch('/api/activity');
        if (activityRes.ok) {
          activityData = await activityRes.json();
        }
      } catch (error) {
        console.error("Error fetching activity:", error);
      }

      try {
        // 3. Fetch Firestore Data (Visitors, Messages)
        let visitorsCount = 0;
        let recentMessages: ActivityItem[] = [];

        if (db) {
          // Visitors
          const analyticsRef = doc(db, "analytics", "general");
          const analyticsSnap = await getDoc(analyticsRef);
          visitorsCount = analyticsSnap.exists() ? analyticsSnap.data().visitors : 0;

          // Messages
          const messagesQ = query(collection(db, "messages"), orderBy("createdAt", "desc"), limit(5));
          const messagesSnap = await getDocs(messagesQ);
          recentMessages = messagesSnap.docs.map(doc => {
             const data = doc.data();
             return {
               id: doc.id,
               type: 'message',
               title: data.displayName || "Anonymous",
               subtitle: data.text || "No content",
               date: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
             };
          });
        }

        // Process Prisma Activities
        const prismaActivities: ActivityItem[] = [
          ...(activityData.projects || []).map((p: any) => ({
            id: p.id,
            type: 'project',
            title: p.title,
            subtitle: p.category || "Project",
            date: new Date(p.createdAt),
          })),
          ...(activityData.certificates || []).map((c: any) => ({
            id: c.id,
            type: 'certificate',
            title: c.title,
            subtitle: c.issuer || "Certificate",
            date: new Date(c.createdAt),
          })),
          ...(activityData.experiences || []).map((e: any) => ({
            id: e.id,
            type: 'experience',
            title: e.title,
            subtitle: e.company || "Experience",
            date: new Date(e.createdAt),
          })),
        ];

        // Merge and Sort
        const allActivities = [...prismaActivities, ...recentMessages]
          .sort((a, b) => b.date.getTime() - a.date.getTime())
          .slice(0, 5);

        setStats({
          projects: statsData.projects || 0,
          certificates: statsData.certificates || 0,
          visitors: visitorsCount,
          activeUsers: 1, // Static for now
          experiences: 0, // Need to add count to stats API if needed
        });
        setActivities(allActivities);

      } catch (error) {
        console.error("Error processing dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'project': return <FolderKanban className="h-4 w-4 text-blue-500" />;
      case 'certificate': return <Award className="h-4 w-4 text-yellow-500" />;
      case 'experience': return <Briefcase className="h-4 w-4 text-purple-500" />;
      case 'message': return <MessageSquare className="h-4 w-4 text-green-500" />;
      default: return <Loader2 className="h-4 w-4" />;
    }
  };

  const getActivityText = (type: string) => {
     switch (type) {
      case 'project': return "New project added";
      case 'certificate': return "New certificate added";
      case 'experience': return "New experience added";
      case 'message': return "New message received";
      default: return "Activity";
    }
  };

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
            <CardDescription>
              Latest updates across your portfolio.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activities.length === 0 ? (
               <div className="flex items-center justify-center h-40 text-muted-foreground">
                No recent activity to show.
              </div>
            ) : (
              <div className="space-y-8">
                {activities.map((activity) => (
                  <div key={`${activity.type}-${activity.id}`} className="flex items-center">
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-muted border border-border">
                        {getActivityIcon(activity.type)}
                    </div>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {getActivityText(activity.type)}: {activity.subtitle}
                      </p>
                    </div>
                    <div className="ml-auto font-medium text-xs text-muted-foreground">
                      {new Date(activity.date).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Manage your content efficiently.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
             <Button variant="outline" className="w-full justify-start" asChild>
               <Link href="/admin/projects/new">
                 <FolderKanban className="mr-2 h-4 w-4" />
                 Add New Project
               </Link>
             </Button>
             <Button variant="outline" className="w-full justify-start" asChild>
               <Link href="/admin/certificates/new">
                 <Award className="mr-2 h-4 w-4" />
                 Add New Certificate
               </Link>
             </Button>
             <Button variant="outline" className="w-full justify-start" asChild>
               <Link href="/admin/experience/new">
                 <Briefcase className="mr-2 h-4 w-4" />
                 Add New Experience
               </Link>
             </Button>
             <Button variant="outline" className="w-full justify-start" asChild>
               <Link href="/admin/settings">
                 <Eye className="mr-2 h-4 w-4" />
                 Update Profile Settings
               </Link>
             </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
