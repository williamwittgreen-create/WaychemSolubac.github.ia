'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Plus, Users, Clock, Settings, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/reports/new', icon: Plus, label: 'Nuevo Reporte', highlight: true },
  { href: '/clients', icon: Users, label: 'Clientes' },
  { href: '/history', icon: Clock, label: 'Historial' },
  { href: '/templates', icon: FileText, label: 'Plantillas' },
  { href: '/settings', icon: Settings, label: 'Configuración' },
]

export function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="w-64 bg-way-petroleo min-h-screen flex flex-col">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-white font-bold font-display text-lg">Waychem ReportLab</h1>
        <p className="text-white/60 text-xs mt-1">Tratamiento de aguas industriales</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ href, icon: Icon, label, highlight }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
              highlight
                ? 'bg-way-verde text-white font-medium'
                : pathname.startsWith(href)
                ? 'bg-white/10 text-white'
                : 'text-white/70 hover:bg-white/5 hover:text-white'
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10">
        <p className="text-white/40 text-xs">servicioswaychem@gmail.com</p>
        <p className="text-white/40 text-xs">6953-8288</p>
      </div>
    </aside>
  )
}
