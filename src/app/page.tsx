
import { Hero } from "@/components/sections/Hero";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Certificates } from "@/components/sections/Certificates";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Experience />
      <Projects />
      <Certificates />
      <Contact />
      
      <footer className="py-8 text-center text-sm text-muted-foreground border-t bg-background/50 backdrop-blur-sm">
        <p suppressHydrationWarning>© {new Date().getFullYear()} Muhammad Nabil Athaillah. All rights reserved.</p>
      </footer>
    </>
  );
}
