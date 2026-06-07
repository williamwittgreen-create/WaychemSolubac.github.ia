import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

const history = [
  { id: '1', client: 'Industrias Chiriquí', system: 'Caldera', date: '2026-06-05', tech: 'R. González', risk: 'alto', status: 'sent' },
  { id: '2', client: 'Hotel Bambito', system: 'Chiller', date: '2026-06-03', tech: 'M. Herrera', risk: 'bajo', status: 'sent' },
  { id: '3', client: 'Finca La Esperanza', system: 'Torre', date: '2026-05-28', tech: 'R. González', risk: 'medio', status: 'validated' },
  { id: '4', client: 'Industrias Chiriquí', system: 'Torre', date: '2026-05-20', tech: 'R. González', risk: 'bajo', status: 'sent' },
]

const riskVariant: Record<string, 'verde' | 'warning' | 'default' | 'destructive'> = {
  bajo: 'verde',
  medio: 'warning',
  alto: 'destructive',
  critico: 'destructive',
}

export default function HistoryPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold font-display text-way-petroleo">Historial de reportes</h1>
      <Input placeholder="Buscar por cliente, sistema o fecha..." />
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-way-gris bg-gray-50">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Cliente</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Sistema</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Fecha</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Técnico</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Riesgo</th>
                </tr>
              </thead>
              <tbody>
                {history.map((r) => (
                  <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                    <td className="py-3 px-4 font-medium">{r.client}</td>
                    <td className="py-3 px-4 text-gray-600">{r.system}</td>
                    <td className="py-3 px-4 text-gray-500">{r.date}</td>
                    <td className="py-3 px-4 text-gray-500">{r.tech}</td>
                    <td className="py-3 px-4">
                      <Badge variant={riskVariant[r.risk]}>{r.risk}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
