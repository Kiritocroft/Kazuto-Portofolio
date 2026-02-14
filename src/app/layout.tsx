
import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Navbar } from "@/components/layout/Navbar";
import ParticlesBackground from "@/components/blocks/ParticlesBackground";
import { portfolioData } from "@/data/portfolio";
import { Toaster } from "@/components/ui/sonner";
import AnalyticsTracker from "@/components/AnalyticsTracker";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });

export const metadata: Metadata = {
  title: "Kazuto Portfolio",
  description: "Personal Portfolio of Muhammad Nabil Athaillah",
  icons: {
    icon: portfolioData.personal.logo,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jakarta.variable} font-sans antialiased min-h-screen bg-background text-foreground overflow-x-hidden`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="fixed inset-0 z-[-1] pointer-events-none">
             <ParticlesBackground 
               color="#6366f1" 
               particleCount={100} 
               connectionDistance={150} 
             />
          </div>
          
          <Navbar />
          <main className="flex flex-col">
            {children}
          </main>
          <AnalyticsTracker />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
