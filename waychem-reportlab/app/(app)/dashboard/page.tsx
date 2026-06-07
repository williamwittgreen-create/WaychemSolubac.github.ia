import { FileText, AlertTriangle, Users, Send } from 'lucide-react'
import { DashboardMetric } from '@/components/dashboard/DashboardMetric'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

const recentReports = [
  { id: '1', client: 'Industrias Chiriquí', system: 'Caldera', date: '2026-06-05', tech: 'R. González', status: 'sent' },
  { id: '2', client: 'Finca La Esperanza', system: 'Torre', date: '2026-06-04', tech: 'M. Herrera', status: 'validated' },
  { id: '3', client: 'Hotel Bambito', system: 'Chiller', date: '2026-06-03', tech: 'R. González', status: 'draft' },
]

const statusVariant: Record<string, 'verde' | 'default' | 'warning'> = {
  sent: 'verde',
  validated: 'default',
  draft: 'warning',
}

const statusLabel: Record<string, string> = {
  sent: 'Enviado',
  validated: 'Validado',
  draft: 'Borrador',
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-way-petroleo">Dashboard</h1>
        <p className="text-gray-500 text-sm">Resumen de actividad — Junio 2026</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardMetric label="Reportes este mes" value={12} icon={FileText} color="text-way-petroleo" />
        <DashboardMetric label="Alertas críticas" value={3} icon={AlertTriangle} color="text-red-500" />
        <DashboardMetric label="Clientes activos" value={8} icon={Users} color="text-way-verde" />
        <DashboardMetric label="Pendientes de envío" value={2} icon={Send} color="text-yellow-500" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reportes recientes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-way-gris bg-gray-50">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Cliente</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Sistema</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Fecha</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Técnico</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Estado</th>
                </tr>
              </thead>
              <tbody>
                {recentReports.map((r) => (
                  <tr key={r.id} className="border-b border-way-gris/50 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{r.client}</td>
                    <td className="py-3 px-4 text-gray-600">{r.system}</td>
                    <td className="py-3 px-4 text-gray-500">{r.date}</td>
                    <td className="py-3 px-4 text-gray-500">{r.tech}</td>
                    <td className="py-3 px-4">
                      <Badge variant={statusVariant[r.status]}>{statusLabel[r.status]}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Alertas críticas activas</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
              <div>
                <p className="font-medium text-sm text-red-800">Industrias Chiriquí — Caldera</p>
                <p className="text-xs text-red-600">pH: 12.8 (crítico alto) · Conductividad: 5100 µS/cm</p>
              </div>
              <Link href="/reports/1" className="text-xs text-red-600 hover:underline">Ver →</Link>
            </div>
          </div>
        </CardContent>
      </Card>

      <Link
        href="/reports/new"
        className="fixed bottom-24 right-4 md:hidden bg-way-verde text-white rounded-full w-14 h-14 flex items-center justify-center shadow-xl text-2xl z-40"
      >
        +
      </Link>
    </div>
  )
}
