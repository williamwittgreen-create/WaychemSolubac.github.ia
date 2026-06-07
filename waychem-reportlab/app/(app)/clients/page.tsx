import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Users } from 'lucide-react'

const clients = [
  { id: '1', name: 'Industrias Chiriquí', company: 'Industrias Chiriquí S.A.', systems: 2, lastReport: '2026-06-05', hasAlert: true },
  { id: '2', name: 'Hotel Bambito', company: 'Hotel Bambito & Resort', systems: 1, lastReport: '2026-06-03', hasAlert: false },
  { id: '3', name: 'Finca La Esperanza', company: 'Agro La Esperanza S.A.', systems: 1, lastReport: '2026-05-28', hasAlert: false },
]

export default function ClientsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-display text-way-petroleo">Clientes</h1>
        <Link href="/clients/new" className="bg-way-verde text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-way-verde/90 transition-colors">
          + Nuevo
        </Link>
      </div>
      <Input placeholder="Buscar cliente..." />
      <div className="space-y-3">
        {clients.map((c) => (
          <Link key={c.id} href={`/clients/${c.id}`}>
            <Card className="hover:shadow-md transition-all cursor-pointer">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-way-gris rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{c.name}</p>
                    <p className="text-sm text-gray-500">{c.company}</p>
                    <p className="text-xs text-gray-400">{c.systems} sistema(s) · Último: {c.lastReport}</p>
                  </div>
                </div>
                {c.hasAlert && <Badge variant="destructive">⚠️ Alerta</Badge>}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
