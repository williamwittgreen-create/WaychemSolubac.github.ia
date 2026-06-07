'use client'
import { useState } from 'react'
import { useReportStore } from '@/stores/reportStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Client } from '@/types'

const MOCK_CLIENTS: Client[] = [
  { id: '1', name: 'Industrias Chiriquí', company: 'Industrias Chiriquí S.A.', contact_name: 'Juan Pérez', email: 'juan@ichiriqui.com', phone: '6700-0001', address: 'David, Chiriquí', created_by: '', created_at: '' },
  { id: '2', name: 'Hotel Bambito', company: 'Hotel Bambito & Resort', contact_name: 'Ana López', email: 'ana@bambito.com', phone: '6700-0002', address: 'Cerro Punta, Chiriquí', created_by: '', created_at: '' },
  { id: '3', name: 'Finca La Esperanza', company: 'Agro La Esperanza S.A.', contact_name: 'Carlos Mora', email: 'carlos@esperanza.com', phone: '6700-0003', address: 'Volcán, Chiriquí', created_by: '', created_at: '' },
]

export function Step1_Client() {
  const { updateReport, nextStep } = useReportStore()
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Client | null>(null)

  const filtered = MOCK_CLIENTS.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.company.toLowerCase().includes(search.toLowerCase())
  )

  function handleSelect(client: Client) {
    setSelected(client)
    updateReport({ client_id: client.id, client })
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder="Buscar cliente por nombre o empresa..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        autoFocus
      />

      <div className="space-y-2">
        {filtered.map((client) => (
          <Card
            key={client.id}
            className={`cursor-pointer transition-all ${selected?.id === client.id ? 'ring-2 ring-way-petroleo' : 'hover:shadow-md'}`}
            onClick={() => handleSelect(client)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900">{client.name}</p>
                  <p className="text-sm text-gray-500">{client.company}</p>
                  <p className="text-xs text-gray-400">{client.address}</p>
                </div>
                {selected?.id === client.id && (
                  <span className="text-way-verde text-xl">✓</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button onClick={nextStep} disabled={!selected} className="w-full">
        Continuar →
      </Button>
    </div>
  )
}
