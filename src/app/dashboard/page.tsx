"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Dots_v1 } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function DashboardPage() {
  const router = useRouter();
  const [docs, setDocs] = useState<Array<{ id: number; title: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingDoc, setIsCreatingDoc] = useState(false);

  const handleDeleteDoc = async (docId: number) => {
    try {
      await fetch(`/api/dashboard?action=deleteDocument&documentId=${docId}`, {
        method: 'DELETE',
      });
      
      setDocs(docs.filter(doc => doc.id !== docId));
      // OR if you're using Next.js router:
      router.refresh();
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const handleCreateDoc = async () => {
    console.log("Creating doc");
    try {
      const response = await fetch("/api/dashboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "create",
          title: "Untitled Document",
        }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      setIsCreatingDoc(true);
      console.log(result.data);
      console.log(result.data.lastInsertRowid);
      // Pass the document ID in the URL
      router.push(`/dashboard/doc/new?docId=${result.data.lastInsertRowid}`);
    } catch (error) {
      console.error("Error creating document:", error);
    }
  };

  useEffect(() => {
    async function fetchDocuments() {
      try {
        const response = await fetch("/api/dashboard?action=getDocuments", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
        });
  
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
  
        const result = await response.json();
  
        if (result.success && Array.isArray(result.data)) {
          setDocs(result.data);
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
      <div className="absolute top-16 left-0 right-0">
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-white/50 backdrop-blur-sm p-4 shadow-sm">
          <div className="space-y-4">
            <Button 
              className="w-full"
              onClick={handleCreateDoc}
              disabled={isCreatingDoc}
            >
              {isCreatingDoc ? "Creating..." : "Create New Doc +"}
            </Button>

            <nav className="space-y-2">
              <div className="text-sm text-black font-medium">Your Documents</div>
              <div className="space-y-1">
                {docs?.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between">
                    <Link 
                      href={`/dashboard/doc/${doc.id}?docId=${doc.id}`}
                      className="flex-1 px-2 py-1 hover:bg-mutedCharcoal/20 rounded-md transition-colors"
                    >
                      {doc.title}
                    </Link>
                    <Button 
                      onClick={() => handleDeleteDoc(doc.id)}
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-100/50"
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 text-darkForestGreen">
          <h1 className="text-2xl font-semibold text-black">Welcome to Your Dashboard</h1>
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
                  onClick: () => handleCreateDoc(),
                }}
              />
            )}
          </div>
          <div className="mt-6 p-6 bg-white rounded-lg shadow-sm border border-darkForestGreen">
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
