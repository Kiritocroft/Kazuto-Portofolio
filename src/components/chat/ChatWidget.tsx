"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { 
  MessageCircle, 
  X, 
  Send, 
  Loader2, 
  LogOut,
  Minimize2,
  Sparkles,
  Trash2,
  Pin,
  PinOff
} from "lucide-react";
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  deleteDoc,
  updateDoc,
  doc,
  type Timestamp,
  limit
} from "firebase/firestore";
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  type User
} from "firebase/auth";
import { auth, db, googleProvider } from "@/lib/firebase";
import { isAdminEmail } from "@/lib/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  uid: string;
  displayName: string;
  photoURL: string;
  createdAt: Timestamp | null;
  isAdmin?: boolean;
  isPinned?: boolean;
}

export function ChatWidget({ embedded = false }: { embedded?: boolean }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(embedded);
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Safe check for Firebase initialization
  const isFirebaseInitialized = !!auth && !!db && !!googleProvider;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (embedded) setIsOpen(true);
  }, [embedded]);


  useEffect(() => {
    if (!isFirebaseInitialized || !auth) return;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, [isFirebaseInitialized]);

  useEffect(() => {
    if ((!isOpen && !embedded) || !isFirebaseInitialized || !db) return;

    const q = query(
      collection(db, "messages"), 
      orderBy("createdAt", "asc"),
      limit(100)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = [];
      snapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() } as Message);
      });
      // Sort: Pinned first, then by date
      msgs.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        // If both pinned or both not pinned, maintain original order (createdAt asc)
        return 0;
      });
      setMessages(msgs);
      setTimeout(() => {
        if (!embedded) {
          scrollRef.current?.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    });

    return () => unsubscribe();
  }, [isOpen, embedded, isFirebaseInitialized]);

  // Don't render floating widget on admin pages
  if (!embedded && pathname?.startsWith("/admin")) {
    return null;
  }

  const handleLogin = async () => {
    if (!auth || !googleProvider) return;
    try {
      setIsLoading(true);
      await signInWithPopup(auth, googleProvider);
      toast.success("Signed in successfully");
    } catch (error) {
      console.error("Error signing in:", error);
      toast.error("Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      toast.success("Signed out");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !db) return;

    try {
      await addDoc(collection(db, "messages"), {
        text: newMessage,
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
        isAdmin: isAdminEmail(user.email),
        isPinned: false,
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!db) return;
    try {
      await deleteDoc(doc(db, "messages", messageId));
      toast.success("Message deleted");
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Failed to delete message");
    }
  };

  const handleTogglePin = async (messageId: string, currentStatus?: boolean) => {
    if (!db) return;
    try {
      await updateDoc(doc(db, "messages", messageId), {
        isPinned: !currentStatus
      });
      toast.success(currentStatus ? "Message unpinned" : "Message pinned");
    } catch (error) {
      console.error("Error toggling pin:", error);
      toast.error("Failed to update message");
    }
  };

  const formatTime = (timestamp: Timestamp | null) => {
    if (!timestamp) return "";
    return timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!mounted || !isFirebaseInitialized) {
    return null;
  }

  const chatContent = (
    <>
      <CardHeader className="p-4 border-b flex flex-row items-center justify-between space-y-0 bg-primary/5 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full opacity-75 blur animate-pulse"></div>
            <div className="relative bg-background rounded-full p-1">
              <MessageCircle className="h-4 w-4 text-primary" />
            </div>
          </div>
          <div>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              Live Chat
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
            </CardTitle>
            <p className="text-[10px] text-muted-foreground">Ask me anything!</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {user && (
            <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive transition-colors" onClick={handleLogout} title="Sign out">
              <LogOut className="h-3.5 w-3.5" />
            </Button>
          )}
          {!embedded && (
            <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-muted transition-colors" onClick={() => setIsOpen(false)}>
              <Minimize2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </CardHeader>

      <div className="flex-1 overflow-hidden relative bg-background/50 backdrop-blur-sm">
        {!user ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4 bg-background/50 backdrop-blur-sm z-10">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-primary/10 p-4 rounded-full"
            >
              <Sparkles className="h-8 w-8 text-primary" />
            </motion.div>
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Join the conversation</h3>
              <p className="text-xs text-muted-foreground max-w-[200px] mx-auto">
                Sign in with Google to chat with me and other visitors.
              </p>
            </div>
            <Button onClick={handleLogin} disabled={isLoading} className="w-full max-w-xs shadow-md hover:shadow-lg transition-all" variant="default">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="currentColor"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="currentColor"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="currentColor"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="currentColor"
                  />
                </svg>
              )}
              Sign in with Google
            </Button>
          </div>
        ) : null}
        
        <ScrollArea className="h-full p-4">
          <div className="space-y-4 pb-4">
            {messages.length === 0 ? (
              <div className="text-center text-xs text-muted-foreground py-10 flex flex-col items-center gap-2">
                <MessageCircle className="h-8 w-8 opacity-20" />
                No messages yet. Say hello! 👋
              </div>
            ) : (
              messages.map((msg, index) => {
                const isMe = msg.uid === user?.uid;
                const isAdmin = msg.isAdmin;
                const isPinned = msg.isPinned;
                const isAdminUser = isAdminEmail(user?.email);
                
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    key={msg.id}
                    className={`flex gap-2 items-end ${
                      isMe ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <Avatar className={cn("h-6 w-6 border-2 shadow-sm", isAdmin ? "border-amber-500/50" : "border-border")}>
                      <AvatarImage src={msg.photoURL} alt={msg.displayName} />
                      <AvatarFallback className="text-[10px]">{msg.displayName?.[0]}</AvatarFallback>
                    </Avatar>
                    <div
                      className={`flex flex-col max-w-[80%] ${
                        isMe ? "items-end" : "items-start"
                      }`}
                    >
                      <div className="flex items-center gap-1 mb-1 px-1">
                        {isPinned && (
                          <Pin className="h-3 w-3 text-amber-500 fill-amber-500 rotate-45" />
                        )}
                        {!isMe && (
                          <span className="text-[10px] font-medium opacity-70">
                            {msg.displayName}
                          </span>
                        )}
                        {isAdmin && (
                          <Badge variant="outline" className="text-[8px] h-3.5 px-1.5 py-0 border-amber-500/50 text-amber-600 bg-amber-500/10 gap-0.5">
                             Admin
                          </Badge>
                        )}
                      </div>
                      
                      <div
                        className={cn(
                          "rounded-2xl px-3 py-2 text-sm shadow-sm relative group transition-all duration-200",
                          isMe 
                            ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-br-sm" 
                            : cn(
                                "bg-muted border border-border/50 rounded-bl-sm",
                                isAdmin && "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800",
                                isPinned && "border-amber-500/50 shadow-amber-500/10"
                              )
                        )}
                      >
                        <p className="leading-relaxed break-words text-xs md:text-sm">{msg.text}</p>
                        <span className={cn(
                          "text-[9px] absolute -bottom-4 min-w-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                          isMe ? "right-0 text-right" : "left-0 text-left"
                        )}>
                          {formatTime(msg.createdAt)}
                        </span>
                        
                        {/* Admin Actions */}
                        {isAdminUser && (
                          <div className="absolute -top-2 -right-8 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button
                              onClick={() => handleTogglePin(msg.id, msg.isPinned)}
                              className={cn(
                                "p-1 rounded-full shadow-sm hover:scale-110 transition-transform",
                                isPinned ? "bg-amber-100 text-amber-600" : "bg-muted text-muted-foreground"
                              )}
                              title={isPinned ? "Unpin message" : "Pin message"}
                            >
                              {isPinned ? <PinOff className="h-3 w-3" /> : <Pin className="h-3 w-3" />}
                            </button>
                            <button
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="p-1 bg-destructive text-destructive-foreground rounded-full shadow-sm hover:scale-110 transition-transform"
                              title="Delete message"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>
      </div>

      {user && (
        <CardFooter className="p-3 border-t bg-muted/20 backdrop-blur-sm">
          <form
            onSubmit={handleSendMessage}
            className="flex w-full items-center gap-2"
          >
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 bg-background/50 border-muted-foreground/20 text-sm h-9 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
            />
            <Button 
              type="submit" 
              size="icon" 
              className={cn(
                "h-9 w-9 transition-all duration-200", 
                newMessage.trim() ? "bg-primary shadow-md hover:scale-105" : "bg-muted text-muted-foreground hover:bg-muted"
              )} 
              disabled={!newMessage.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardFooter>
      )}
    </>
  );

  if (embedded) {
    return (
      <Card className="w-full h-[600px] flex flex-col shadow-xl border-border/50 overflow-hidden bg-background/80 backdrop-blur-md">
        {chatContent}
      </Card>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="rounded-full h-14 w-14 shadow-xl bg-gradient-to-r from-primary to-purple-600 text-primary-foreground border-2 border-white/20"
            >
              <MessageCircle className="h-7 w-7" />
              <span className="sr-only">Open Chat</span>
              
              {/* Notification dot (optional logic could go here) */}
              <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-green-500 border-2 border-background animate-pulse"></span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 w-[350px] sm:w-[380px] h-[500px] sm:h-[600px] shadow-2xl z-[101]"
          >
            <Card className="w-full h-full flex flex-col border-border/50 overflow-hidden bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80">
              {chatContent}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
