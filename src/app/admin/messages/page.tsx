"use client";

import { ChatWidget } from "@/components/chat/ChatWidget";

export default function MessagesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground">Real-time community chat</p>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <ChatWidget embedded={true} />
      </div>
    </div>
  );
}
