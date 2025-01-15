"use client";

import { HeaderWrapper } from '@/components/ui/header-wrapper'
import { Header2 } from '@/components/ui/header'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function DashboardPage() {
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
              variant="default"
            >
              <Link href="/dashboard/new">
                Create New Doc +
              </Link>
            </Button>
            
            <nav className="space-y-2">
              <div className="text-sm text-muted-foreground font-medium">Your Documents</div>
              <div className="space-y-1">
                <a href="#" className="block px-2 py-1 hover:bg-gray-100/50 rounded-md transition-colors">Document 1</a>
                <a href="#" className="block px-2 py-1 hover:bg-gray-100/50 rounded-md transition-colors">Document 2</a>
                <a href="#" className="block px-2 py-1 hover:bg-gray-100/50 rounded-md transition-colors">Document 3</a>
              </div>
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-semibold text-gray-900">Welcome to Your Dashboard</h1>
          {/* Add your main dashboard content here */}
        </main>
      </div>
    </div>
  )
}