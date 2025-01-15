"use client";

import { HeaderWrapper } from "@/components/ui/header-wrapper";
import { Header2 } from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Dots_v1 } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { FileText } from "lucide-react";
import { Dropdown } from "@/components/ui/dropdown-with-the-same-width-as-trigger";

export default function DashboardPage() {
  const [docs, setDocs] = useState<Array<{ id: number; title: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDocuments() {
      try {
        const response = await fetch("/api/dashboard", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
  
        const result = await response.json();
  
        // Ensure `data` exists and is an array
        if (result.success && Array.isArray(result.data)) {
          setDocs(result.data); // Set the `data` array to `docs`
        } else {
          throw new Error("Invalid API response structure");
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  
    fetchDocuments();
  }, []);
  

  if (isLoading) {
    return (
        <div className="min-h-screen flex justify-center items-center">
            <div className="flex flex-col justify-center items-center">
                <Dots_v1 />
                
            </div>
        </div>
    );
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header2 />
      <div className="absolute top-16 left-0 right-0">
        <HeaderWrapper />
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-white/50 backdrop-blur-sm p-4 shadow-sm">
          <div className="space-y-4">
            <Button 
              className="w-full"
              onClick={() => (window.location.href = "/dashboard/new")}
            >
              Create New Doc +
            </Button>

            <nav className="space-y-2">
              <div className="text-sm text-muted-foreground font-medium">Your Documents</div>
              <div className="space-y-1">
                {docs?.map((doc) => (
                  <a
                    key={doc.id}
                    href={`/dashboard/${doc.id}`}
                    className="block px-2 py-1 hover:bg-gray-100/50 rounded-md transition-colors"
                  >
                    {doc.title}
                  </a>
                ))}
              </div>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-semibold text-gray-900">Welcome to Your Dashboard</h1>
          {/* Add additional content here */}
          <div className="flex items-center justify-center mt-12">
            {docs && docs.length > 0 ? (
              <EmptyState
                title="Choose a document"
                description="Select a document from the sidebar to start working on it, or create a new one."
                icons={[FileText]}
                
                
              />
            ) : (
              <EmptyState
                title="No documents found"
                description="You don't have any documents yet. Create a new one to get started."
                icons={[FileText]}
                action={{
                  label: "Create New Doc",
                  onClick: () => (window.location.href = "/dashboard/new"),
                }}
              />
            )}
          </div>
          <div className="mt-6 p-6 bg-white rounded-lg shadow-sm border">
    <h2 className="text-xl font-medium text-gray-900 mb-3">Getting Started with Docs++</h2>
    <p className="text-gray-600 mb-4">
      Create beautiful documentation in minutes with our intuitive drag-and-drop interface. 
      Docs++ lets you:
    </p>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
      <li>Build custom markdown documentation with ease</li>
      <li>Drag and drop pre-built text blocks for quick composition</li>
      <li>Customize your documentation layout and styling</li>
    </ul>
    <p className="text-gray-600">
      Get started by creating your first document using the "Create New Doc +" button in the sidebar.
    </p>
  </div>
        </main>
      </div>
    </div>
  );
}
