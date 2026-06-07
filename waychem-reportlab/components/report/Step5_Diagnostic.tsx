'use client'
import { useEffect } from 'react'
import { useReportStore } from '@/stores/reportStore'
import { Button } from '@/components/ui/button'
import { getParameterLabel, getParameterRange } from '@/lib/diagnosticEngine'
import { SystemType, WaterType, RiskLevel } from '@/types'
import { Loader2 } from 'lucide-react'

const riskColors: Record<RiskLevel, string> = {
  bajo: 'bg-way-verde text-white',
  medio: 'bg-yellow-400 text-gray-900',
  alto: 'bg-orange-500 text-white',
  critico: 'bg-red-600 text-white',
}

export function Step5_Diagnostic() {
  const { report, parameters, diagnosis, setDiagnosis, isGeneratingDiagnosis, setGeneratingDiagnosis, nextStep, prevStep } = useReportStore()

  const system = report.system?.type as SystemType
  const waterType = report.water_type as WaterType

  useEffect(() => {
    if (!diagnosis) generateDiagnosis()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function generateDiagnosis() {
    setGeneratingDiagnosis(true)
    try {
      const outOfRange = parameters
        .filter((p) => p.status !== 'normal' && p.status !== 'sin_dato')
        .map((p) => {
          const range = getParameterRange(p.parameter_key, system, waterType)
          return {
            label: getParameterLabel(p.parameter_key, system, waterType),
            valor: p.verified_value,
            unit: p.unit,
            min: range?.min,
            max: range?.max,
            estado: p.status,
          }
        })

      const normalCount = parameters.filter((p) => p.status === 'normal').length
      const res = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system,
          waterType,
          clientName: report.client?.name || '',
          outOfRange,
          normalCount,
          totalCount: parameters.length,
        }),
      })
      const data = await res.json()
      setDiagnosis({
        resultado_text: data.resultado,
        consecuencia_text: data.consecuencia,
        recomendacion_text: data.recomendacion,
        risk_level: data.riesgo_general,
        generated_by_ai: true,
      })
    } catch {
      setDiagnosis({
        resultado_text: 'No se pudo generar el diagnóstico automáticamente. Por favor ingrese las observaciones manualmente.',
        consecuencia_text: 'Revise los parámetros manualmente con el equipo técnico.',
        recomendacion_text: 'Consulte con el supervisor de turno.',
        risk_level: 'medio',
        generated_by_ai: false,
      })
    } finally {
      setGeneratingDiagnosis(false)
    }
  }

  if (isGeneratingDiagnosis) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <Loader2 className="h-10 w-10 text-way-petroleo animate-spin" />
        <p className="text-gray-600">Generando diagnóstico con IA...</p>
        <p className="text-xs text-gray-400">Esto puede tomar unos segundos</p>
      </div>
    )
  }

  if (!diagnosis) return null

  const secciones = [
    { key: 'resultado_text' as const, label: '📊 Resultado' },
    { key: 'consecuencia_text' as const, label: '⚠️ Consecuencia' },
    { key: 'recomendacion_text' as const, label: '✅ Recomendación' },
  ]

  return (
    <div className="space-y-4">
      {diagnosis.risk_level && (
        <div className={`flex items-center justify-between p-4 rounded-xl ${riskColors[diagnosis.risk_level]}`}>
          <span className="font-bold font-display text-lg">Nivel de riesgo</span>
          <span className="font-bold text-xl uppercase">{diagnosis.risk_level}</span>
        </div>
      )}

      {secciones.map(({ key, label }) => (
        <div key={key} className="border border-way-gris rounded-xl overflow-hidden">
          <div className="p-4 bg-gray-50 flex items-center justify-between">
            <span className="font-medium text-sm">{label}</span>
            <button
              onClick={() => {
                const text = prompt('Editar texto:', diagnosis[key] || '')
                if (text !== null) setDiagnosis({ [key]: text })
              }}
              className="text-way-petroleo text-xs hover:underline"
            >
              Editar
            </button>
          </div>
          <div className="p-4">
            <p className="text-sm text-gray-700 leading-relaxed">{diagnosis[key]}</p>
          </div>
        </div>
      ))}

      <div className="flex gap-3">
        <Button variant="outline" onClick={prevStep} className="flex-1">← Atrás</Button>
        <Button onClick={nextStep} className="flex-1">Vista previa →</Button>
      </div>
    </div>
  )
}
