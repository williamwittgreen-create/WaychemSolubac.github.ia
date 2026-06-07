'use client'
import { useReportStore } from '@/stores/reportStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { SystemType, WaterType } from '@/types'

const SYSTEMS: { type: SystemType; label: string; emoji: string }[] = [
  { type: 'caldera', label: 'Caldera', emoji: '🔥' },
  { type: 'torre', label: 'Torre de Enfriamiento', emoji: '🌡️' },
  { type: 'chiller', label: 'Chiller', emoji: '❄️' },
]

const WATER_TYPES: Record<SystemType, { value: WaterType; label: string }[]> = {
  caldera: [
    { value: 'agua_caldera', label: 'Agua de caldera' },
    { value: 'agua_alimentacion', label: 'Agua de alimentación' },
    { value: 'retorno', label: 'Agua de retorno' },
  ],
  torre: [
    { value: 'agua_equipo', label: 'Agua del equipo' },
    { value: 'pretratada', label: 'Agua pretratada' },
  ],
  chiller: [
    { value: 'agua_equipo', label: 'Agua del equipo' },
  ],
}

export function Step2_System() {
  const { report, updateReport, nextStep, prevStep } = useReportStore()

  const selectedSystem = report.system?.type as SystemType | undefined
  const waterOptions = selectedSystem ? WATER_TYPES[selectedSystem] : []

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Tipo de sistema</label>
        <div className="grid grid-cols-3 gap-3">
          {SYSTEMS.map(({ type, label, emoji }) => (
            <Card
              key={type}
              className={`cursor-pointer transition-all text-center ${selectedSystem === type ? 'ring-2 ring-way-petroleo bg-way-petroleo/5' : 'hover:shadow-md'}`}
              onClick={() => updateReport({ system: { type, id: type, client_id: report.client_id || '', name: label, location: '', active: true } })}
            >
              <CardContent className="p-4">
                <div className="text-3xl mb-2">{emoji}</div>
                <p className="text-xs font-medium">{label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {selectedSystem && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Tipo de agua / muestra</label>
          <div className="space-y-2">
            {waterOptions.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => updateReport({ water_type: value })}
                className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors ${report.water_type === value ? 'border-way-petroleo bg-way-petroleo/5 text-way-petroleo font-medium' : 'border-way-gris hover:border-gray-300'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Fecha</label>
          <Input type="date" value={report.date || ''} onChange={(e) => updateReport({ date: e.target.value })} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Hora</label>
          <Input type="time" value={report.time || ''} onChange={(e) => updateReport({ time: e.target.value })} />
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={prevStep} className="flex-1">← Atrás</Button>
        <Button onClick={nextStep} disabled={!selectedSystem || !report.water_type} className="flex-1">Continuar →</Button>
      </div>
    </div>
  )
}
