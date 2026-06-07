'use client'
import { useState } from 'react'
import { useReportStore } from '@/stores/reportStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SemaforoTag } from '@/components/shared/SemaforoTag'
import { getParameterLabel } from '@/lib/diagnosticEngine'
import { SystemType, WaterType, RiskLevel } from '@/types'
import { Download, Send } from 'lucide-react'

const riskColors: Record<RiskLevel, string> = {
  bajo: 'bg-way-verde',
  medio: 'bg-yellow-400',
  alto: 'bg-orange-500',
  critico: 'bg-red-600',
}

export function Step6_Preview() {
  const { report, parameters, diagnosis, prevStep, resetReport } = useReportStore()
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const system = report.system?.type as SystemType
  const waterType = report.water_type as WaterType

  async function handleSendEmail() {
    if (!report.client?.email) {
      alert('El cliente no tiene email registrado.')
      return
    }
    setSending(true)
    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: report.client.email,
          clientName: report.client.name,
          contactName: report.client.contact_name,
          date: report.date,
          system: report.system?.name,
          location: report.system?.location || 'N/A',
          riskLevel: diagnosis?.risk_level || 'bajo',
          technicianName: 'Técnico Waychem',
        }),
      })
      setSent(true)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="bg-way-petroleo text-white rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white text-base">Reporte Técnico — Waychem</CardTitle>
              <p className="text-white/70 text-xs mt-1">{report.client?.name} | {report.date}</p>
            </div>
            {diagnosis?.risk_level && (
              <span className={`${riskColors[diagnosis.risk_level]} px-3 py-1 rounded-full text-white text-xs font-bold uppercase`}>
                {diagnosis.risk_level}
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><span className="text-gray-500">Sistema:</span> <span className="font-medium capitalize">{report.system?.type}</span></div>
            <div><span className="text-gray-500">Muestra:</span> <span className="font-medium">{waterType}</span></div>
            <div><span className="text-gray-500">Fecha:</span> <span className="font-medium">{report.date}</span></div>
            <div><span className="text-gray-500">Hora:</span> <span className="font-medium">{report.time}</span></div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-way-gris">
                  <th className="text-left py-1 text-gray-500 font-medium">Parámetro</th>
                  <th className="text-left py-1 text-gray-500 font-medium">Valor</th>
                  <th className="text-left py-1 text-gray-500 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {parameters.map((p) => (
                  <tr key={p.parameter_key} className="border-b border-gray-100">
                    <td className="py-1.5">{getParameterLabel(p.parameter_key, system, waterType)}</td>
                    <td className="py-1.5">{p.verified_value ?? '—'} {p.unit}</td>
                    <td className="py-1.5"><SemaforoTag status={p.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {diagnosis && (
            <div className="space-y-3 pt-2 border-t border-way-gris">
              <div>
                <p className="text-xs font-bold text-gray-700 uppercase mb-1">📊 Resultado</p>
                <p className="text-sm text-gray-600">{diagnosis.resultado_text}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-700 uppercase mb-1">⚠️ Consecuencia</p>
                <p className="text-sm text-gray-600">{diagnosis.consecuencia_text}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-700 uppercase mb-1">✅ Recomendación</p>
                <p className="text-sm text-gray-600">{diagnosis.recomendacion_text}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" onClick={() => window.print()} className="gap-2">
          <Download className="h-4 w-4" /> PDF
        </Button>
        <Button
          onClick={handleSendEmail}
          disabled={sending || sent}
          className="gap-2 bg-way-verde hover:bg-way-verde/90 text-white"
        >
          <Send className="h-4 w-4" />
          {sent ? '¡Enviado!' : sending ? 'Enviando...' : 'Enviar'}
        </Button>
      </div>

      <Button variant="outline" onClick={prevStep} className="w-full">← Atrás</Button>
      <Button onClick={resetReport} className="w-full">Crear nuevo reporte</Button>
    </div>
  )
}
