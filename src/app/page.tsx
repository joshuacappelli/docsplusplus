import Image from "next/image";
import { Header1 } from "@/components/ui/header";

export default function Home() {
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
            <a
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-primary text-primary-foreground gap-2 hover:bg-primary/90 text-sm sm:text-base h-12 px-8"
              href="/signup"
            >
              Get Started Free
            </a>
            <a
              className="rounded-full border border-solid border-input bg-background transition-colors flex items-center justify-center hover:bg-accent hover:text-accent-foreground text-sm sm:text-base h-12 px-8"
              href="/demo"
            >
              View Demo
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full">
          <div className="flex flex-col gap-2 p-6 rounded-lg border border-input">
            <h3 className="text-lg font-semibold">Easy Setup</h3>
            <p className="text-muted-foreground">
              Get your documentation site up and running in minutes with our intuitive setup process.
            </p>
          </div>
          <div className="flex flex-col gap-2 p-6 rounded-lg border border-input">
            <h3 className="text-lg font-semibold">Smart Search</h3>
            <p className="text-muted-foreground">
              Powerful search functionality helps users find exactly what they need, fast.
            </p>
          </div>
          <div className="flex flex-col gap-2 p-6 rounded-lg border border-input">
            <h3 className="text-lg font-semibold">Beautiful Design</h3>
            <p className="text-muted-foreground">
              Modern, responsive design that looks great on any device or screen size.
            </p>
          </div>
        </div>
      </main>

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center text-sm text-muted-foreground">
        <a href="/privacy" className="hover:text-foreground">
          Privacy Policy
        </a>
        <a href="/terms" className="hover:text-foreground">
          Terms of Service
        </a>
        <a href="/contact" className="hover:text-foreground">
          Contact Us
        </a>
      </footer>
    </div>
  );
}
