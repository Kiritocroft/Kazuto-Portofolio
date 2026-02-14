"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, User, MessageCircle } from "lucide-react";
import { isAdminEmail } from "@/lib/admin";

interface ChatUser {
  uid: string;
  displayName: string;
  photoURL: string;
  lastActive: Date;
  messageCount: number;
  isAdmin: boolean;
  email?: string; // We might not have this from messages
}

function getRelativeTime(date: Date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
}

export default function UsersPage() {
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!db) return;

      try {
        // Since we don't have a dedicated users collection, 
        // we'll derive active users from the messages collection
        const q = query(collection(db, "messages"), orderBy("createdAt", "desc"), limit(200));
        const snapshot = await getDocs(q);
        
        const userMap = new Map<string, ChatUser>();

        snapshot.forEach((doc) => {
          const data = doc.data();
          if (!data.uid) return;

          // createdAt might be a Firestore Timestamp or null
          const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : new Date();

          if (!userMap.has(data.uid)) {
            userMap.set(data.uid, {
              uid: data.uid,
              displayName: data.displayName || "Anonymous",
              photoURL: data.photoURL || "",
              lastActive: createdAt,
              messageCount: 1,
              isAdmin: data.isAdmin || false,
            });
          } else {
            const user = userMap.get(data.uid)!;
            user.messageCount += 1;
            // Update last active if this message is newer (though we ordered by desc, so first hit is newest)
            // Actually, since we iterate desc, the first time we see a uid is the latest message.
          }
        });

        setUsers(Array.from(userMap.values()));
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

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
        <h1 className="text-3xl font-bold tracking-tight">Community Users</h1>
        <p className="text-muted-foreground">
          Active users from the chat community.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <Card key={user.uid} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center gap-4 p-4 bg-muted/20">
              <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                <AvatarImage src={user.photoURL} alt={user.displayName} />
                <AvatarFallback><User className="h-6 w-6" /></AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <CardTitle className="text-base flex items-center gap-2">
                  {user.displayName}
                  {user.isAdmin && (
                    <Badge variant="secondary" className="text-[10px] h-5 px-1.5 bg-amber-500/10 text-amber-600 border-amber-500/20">
                      Admin
                    </Badge>
                  )}
                </CardTitle>
                <span className="text-xs text-muted-foreground">
                  Last active {getRelativeTime(user.lastActive)}
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-muted-foreground">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Messages sent
                </div>
                <span className="font-medium">{user.messageCount}</span>
              </div>
            </CardContent>
          </Card>
        ))}

        {users.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No active users found.
          </div>
        )}
      </div>
    </div>
  );
}
