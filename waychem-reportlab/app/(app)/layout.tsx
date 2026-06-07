import { BottomNav } from '@/components/shared/BottomNav'
import { Sidebar } from '@/components/shared/Sidebar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="hidden md:flex">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
      <div className="md:hidden">
        <main className="pb-24 p-4">{children}</main>
        <BottomNav />
      </div>
    </div>
  )
}
