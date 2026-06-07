'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Plus, Users, Clock, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/clients', icon: Users, label: 'Clientes' },
  { href: '/reports/new', icon: Plus, label: 'Nuevo', isMain: true },
  { href: '/history', icon: Clock, label: 'Historial' },
  { href: '/settings', icon: Settings, label: 'Config' },
]

export function BottomNav() {
  const pathname = usePathname()
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-way-gris z-50">
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map(({ href, icon: Icon, label, isMain }) =>
          isMain ? (
            <Link key={href} href={href} className="flex flex-col items-center -mt-6">
              <div className="bg-way-verde text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg">
                <Icon className="h-6 w-6" />
              </div>
              <span className="text-xs mt-1 text-way-verde font-medium">{label}</span>
            </Link>
          ) : (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors',
                pathname.startsWith(href) ? 'text-way-petroleo' : 'text-gray-400'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{label}</span>
            </Link>
          )
        )}
      </div>
    </nav>
  )
}
