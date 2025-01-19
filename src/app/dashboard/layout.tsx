import { Header2 } from "@/components/ui/header";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-creamWhite font-sans antialiased">
      <Header2 />
      {children}
    </div>
  );
  
}
