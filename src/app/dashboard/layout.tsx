import { Header2 } from "@/components/ui/header";
import { HeaderWrapper } from "@/components/ui/header-wrapper";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 font-sans antialiased">
      <Header2 />
      {/* Add a subtle grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,transparent,black)] pointer-events-none" />
      <HeaderWrapper />

      {children}
    </div>
  )
}
