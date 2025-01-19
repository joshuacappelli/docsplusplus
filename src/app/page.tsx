"use client";

import { useRouter } from "next/navigation";
import { Header1 } from "@/components/ui/header";

export default function Home() {
  const router = useRouter();
  
  const handleSignup = () => {
    try {
      router.push("auth/signup");
      // For debugging
      console.log("Navigating to signup...");
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };



  return (
    
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Header1 />
      <main className="flex flex-col gap-16 row-start-2 items-center max-w-4xl mx-auto">
        <div className="text-center space-y-6">
          <h1 className="text-5xl sm:text-6xl font-bold">
            Documentation made <span className="text-primary">simple</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Build beautiful, searchable documentation for your projects in minutes. 
            Let Docs++ handle the heavy lifting while you focus on writing great content.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <button
              onClick={handleSignup}
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-sageGreen gap-2 hover:bg-forestGreen text-sm sm:text-base h-12 px-8"
            >
              Get Started
            </button>

            <a
              className="rounded-full border border-solid border-input bg-background transition-colors flex items-center justify-center hover:bg-accent hover:text-accent-foreground text-sm sm:text-base h-12 px-8"
              href="/demo"
            >
              Read the Docs
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full">
          <div className="flex flex-col gap-2 p-6 rounded-lg border border-darkForestGreen bg-white">
            <h3 className="text-lg font-semibold">Easy Setup</h3>
            <p className="text-muted-foreground">
              Get your documentation up and running in minutes with our intuitive setup process.
            </p>
          </div>
          <div className="flex flex-col gap-2 p-6 rounded-lg border border-darkForestGreen bg-white">
            <h3 className="text-lg font-semibold">Smart Summary</h3>
            <p className="text-muted-foreground">
              Powerful summarization functionality helps users make their documentation more concise and readable.
            </p>
          </div>
          <div className="flex flex-col gap-2 p-6 rounded-lg border border-darkForestGreen bg-white">
            <h3 className="text-lg font-semibold">Simple Design</h3>
            <p className="text-muted-foreground">
              Simple, easy to use interface that allows users to create beautiful markdown documentation in minutes.
            </p>
          </div>
        </div>
      </main>

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center text-sm text-muted-foreground">
        
        <a href="mailto:joshua@cappelliconnect.com" className="hover:text-foreground">
          Contact Me
        </a>
      </footer>
    </div>
  );
}
